from .model_installer import download_url_with_wget
import server
from aiohttp import web
import aiohttp
import requests
import folder_paths
import os
import sys
import threading
import subprocess  # don't remove this
from urllib.parse import urlparse
import subprocess
import os
import json
import urllib.request

WEB_DIRECTORY = "dist"
NODE_CLASS_MAPPINGS = {}
__all__ = ['NODE_CLASS_MAPPINGS']
version = "V1.0.0"

print(f"### Loading: Workspace Manager ({version})")
workspace_path = os.path.join(os.path.dirname(__file__))
comfy_path = os.path.dirname(folder_paths.__file__)

# Function to install dependencies from requirements.txt


def install_dependencies():
    requirements_path = os.path.join(workspace_path, "requirements.txt")
    print('requirements_path', requirements_path)
    # subprocess.run(['pip', 'install', '-r', requirements_path])
    subprocess.run([sys.executable, '-m', 'pip',
                   'install', '-r', requirements_path])
# install_dependencies()


def setup_js():
    import nodes
    if not hasattr(nodes, "EXTENSION_WEB_DIRS"):
        print(f"[WARN] Workspace cannot run. Please upgrade your ComfyUI, it does not support custom nodes UI")

setup_js()

@server.PromptServer.instance.routes.post("/model_manager/install_model")
async def install_model(request):
    json_data = await request.json()

    model_path = get_model_path(json_data)

    res = False

    try:
        if model_path is not None:
            print(f"🖌️Model Manager: Installing model '{json_data['name']}' into '{model_path}' ...")
            res = download_url_with_wget(json_data['url'], model_path)
        else:
            print(f"Model installation error: invalid model type - {json_data['type']}")

        if res:
            return web.json_response({}, content_type='application/json')
    except Exception as e:
        print(f"[ERROR] {e}", file=sys.stderr)
        pass

    return web.Response(status=400)

def download_url_with_agent(url, save_path):
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}

        req = urllib.request.Request(url, headers=headers)
        response = urllib.request.urlopen(req)
        data = response.read()

        if not os.path.exists(os.path.dirname(save_path)):
            os.makedirs(os.path.dirname(save_path))

        with open(save_path, 'wb') as f:
            f.write(data)

    except Exception as e:
        print(f"Download error: {url} / {e}", file=sys.stderr)
        return False

    print("Installation was successful.")
    return True

def get_model_dir(data):
    if data['save_path'] != 'default':
        if '..' in data['save_path'] or data['save_path'].startswith('/'):
            print(f"[WARN] '{data['save_path']}' is not allowed path. So it will be saved into 'models/etc'.")
            base_model = "etc"
        else:
            if data['save_path'].startswith("custom_nodes"):
                base_model = os.path.join(comfy_path, data['save_path'])
            else:
                base_model = os.path.join(folder_paths.models_dir, data['save_path'])
    else:
        model_type = data['type']
        if model_type == "checkpoints":
            base_model = folder_paths.folder_names_and_paths["checkpoints"][0][0]
        elif model_type == "unclip":
            base_model = folder_paths.folder_names_and_paths["checkpoints"][0][0]
        elif model_type == "VAE":
            base_model = folder_paths.folder_names_and_paths["vae"][0][0]
        elif model_type == "lora":
            base_model = folder_paths.folder_names_and_paths["loras"][0][0]
        elif model_type == "T2I-Adapter":
            base_model = folder_paths.folder_names_and_paths["controlnet"][0][0]
        elif model_type == "T2I-Style":
            base_model = folder_paths.folder_names_and_paths["controlnet"][0][0]
        elif model_type == "controlnet":
            base_model = folder_paths.folder_names_and_paths["controlnet"][0][0]
        elif model_type == "clip_vision":
            base_model = folder_paths.folder_names_and_paths["clip_vision"][0][0]
        elif model_type == "gligen":
            base_model = folder_paths.folder_names_and_paths["gligen"][0][0]
        elif model_type == "upscale":
            base_model = folder_paths.folder_names_and_paths["upscale_models"][0][0]
        elif model_type == "embeddings":
            base_model = folder_paths.folder_names_and_paths["embeddings"][0][0]
        else:
            base_model = "etc"

    return base_model


def get_model_path(data):
    base_model = get_model_dir(data)
    return os.path.join(base_model, data['filename'])


@server.PromptServer.instance.routes.post("/workspace/find_nodes")
async def install_nodes(request):
    post_params = await request.json()
    # [{'authorName': 'Fannovel16', 'gitHtmlUrl': 'https://github.com/Fannovel16/comfyui_controlnet_aux', 'totalInstalls': 1, 'description': None, 'id': 'TilePreprocessor'}]
    resp = fetch_server(post_params['nodes'])
    return web.json_response(resp, content_type='application/json')


async def install_node(gitUrl):
    print(f"Installing custom node from git '{gitUrl}'")
    try:
        if gitUrl.endswith("/"):
            gitUrl = gitUrl[:-1]
        repo_name = os.path.splitext(os.path.basename(gitUrl))[0]
        repo_path = os.path.join(comfy_path, 'custom_nodes', repo_name)
        print('repo_path', repo_path)
        try:
            Repo.clone_from(gitUrl+'.git', repo_path)
        except Exception as e:
            print(f"Error cloning repo: {e}")
            return f"Error cloning repo: {e}\n"
        return f"Installed custom node from git '{gitUrl}'\n"
    except Exception as e:
        return f"Error installing custom node from git '{gitUrl}': {e}\n"


@server.PromptServer.instance.routes.post("/workspace/install_nodes")
async def install_nodes(request):
    response = web.StreamResponse()
    response.headers['Content-Type'] = 'text/plain'
    await response.prepare(request)

    post_params = await request.json()
    nodes = post_params['nodes']

    tasks = []
    print(f"Installing custom nodes", nodes)
    custom_node_path = os.path.join(comfy_path, 'custom_nodes')
    for custom_node in nodes:
        gitUrl = custom_node['gitHtmlUrl']
        print(f"Cloning repository: {gitUrl}")
        run_script(["git", "clone", gitUrl+'.git'], custom_node_path)


def handle_stream(stream, prefix):
    for line in stream:
        print(prefix + line, end='')


def run_script(cmd, cwd='.'):
    if len(cmd) > 0 and cmd[0].startswith("#"):
        print(f"[model-manager] Unexpected behavior: `{cmd}`")
        return 0

    process = subprocess.Popen(
        cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, bufsize=1)

    stdout_thread = threading.Thread(
        target=handle_stream, args=(process.stdout, ""))
    stderr_thread = threading.Thread(
        target=handle_stream, args=(process.stderr, "[!]"))

    stdout_thread.start()
    stderr_thread.start()

    stdout_thread.join()
    stderr_thread.join()

    return process.wait()

