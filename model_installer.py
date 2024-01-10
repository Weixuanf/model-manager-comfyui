import subprocess
import os
import re
import sys

def download_url_with_wget(url, save_path):
    print(f"Downloading {url} to {save_path} ...")
    if not is_wget_installed():
        print("wget is not installed. Please install wget or use a different download method.")
        return False

    try:
        # url="https://github.com/Weixuanf/cdn-test/blob/main/workspace-manager-5YgCydJJ.js"
        command = f"wget -c '{url}' -O '{save_path}' --show-progress"
        process = subprocess.Popen(command, shell=True, stderr=subprocess.PIPE)

        while True:
            output = process.stderr.readline()
            if process.poll() is not None and output == b'':
                break
            if output:
                progress = parse_wget_output(output.decode())
                sys.stdout.write(f"\r{progress}")
                sys.stdout.flush()

        process.poll()
    except subprocess.CalledProcessError as e:
        print(f"Download error with wget: {e}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"Unexpected error: {e}", file=sys.stderr)
        return False

    print("\nDownload completed successfully.")
    return True

def is_wget_installed():
    try:
        subprocess.run("wget --version", shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except subprocess.CalledProcessError:
        return False

def parse_wget_output(output):
    """
    Parse wget output to extract and return the download progress.
    """
    match = re.search(r'\d+%|\d+K \d+Kb/s', output)
    return match.group(0) if match else ""
