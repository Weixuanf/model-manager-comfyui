// @ts-ignore
import { api } from "/scripts/api.js";

export type InstallModelsApiInput = {
  save_path: string;
  url: string;
  filename: string;
  name: string;
};
export const installModelsApi = async (target: InstallModelsApiInput) => {
  try {
    const response = await api.fetchApi("/model_manager/install_model_stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(target),
    });

    const status = await response.json();
    console.log("Model install finished with status", status);
    return true;
  } catch (exception) {
    return false;
  }
};
