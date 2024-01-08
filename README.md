# ☕️ ComfyUI Workspace Manager - Comfyspace

A ComfyUI model and custom nodes management extension

If you have questions or suggestions, please
<a href="https://discord.gg/HHvfEurv2Z">
<img src="https://animeartmagazine.com/wp-content/uploads/2022/05/discord-button600.webp" alt="Join Discord" width="120"/>
</a>

[📚Official Wiki Docs](https://github.com/11cafe/comfyui-workspace-manager/wiki)

## Installation

### [Option 1] via ComfyUI Manager (Preferred)

Simply search for “ComfyUI Workspace Manager”, install, and restart ComfyUI.

### [Option 2] via git

Like any other custom node installation, in your ComfyUI root folder

```
cd custom_nodes && git clone https://github.com/11cafe/comfyui-workspace-manager.git
```

and restart your ComfyUI.

It is recommended to do git clone than downloading zip folder, because you can get latest updates by `git pull`!

## Features

## Credits

ComfyUI: https://github.com/comfyanonymous/ComfyUI

## Dev

1. Clone ComfyUI
   `git clone https://github.com/comfyanonymous/ComfyUI`
   follow the install and setup instructions of ComfyUI README
2. Clone Workspace Manager
   in /ComfyUI folder

```
cd custom_nodes && git clone https://github.com/11cafe/comfyui-workspace-manager.git
```

3. npm install
   inside `/ComfyUI/custom_nodes/comfyui-workspace-manager`
   do `cd ui && npm install`
   this will install all node dependencies
4. build and run
   inside `/ComfyUI/custom_nodes/comfyui-workspace-manager/ui`
   `npm run build --watch`
   this command will watch for your file changes and automatically rebuild, you just need to refresh to see your changes in browser everyting you change some code
5. run ComfyUI server
   inside `/ComfyUI`
   do `python main.py` or `python3 main.py` depending on your version
