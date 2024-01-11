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
      //   headers: { "Content-Type": "application/json" },
      body: JSON.stringify(target),
    });

    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      console.log("done:", done);
      if (done) break;

      const text = new TextDecoder().decode(value);
      console.log("text:", text);
      // Dispatch custom event with the data
      window.dispatchEvent(
        new CustomEvent("model-installation-message", { detail: text })
      );
    }
  } catch (error) {
    console.error("Failed to connect to the server:", error);
  }
};
