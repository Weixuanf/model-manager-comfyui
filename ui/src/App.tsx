import { useCallback, useEffect, useRef, useState } from "react";
// @ts-ignore
import { app } from "/scripts/app.js";
// @ts-ignore
import { api } from "/scripts/api.js";
import { ComfyExtension, ComfyObjectInfo } from "./comfy-types/comfy";
import { Box } from "@chakra-ui/react";

import { Topbar } from "./topbar/Topbar";
import { Route } from "./types";
import InatallModelsModal from "./models/InatallModelsModal";

export default function App() {
  const [route, setRoute] = useState<Route>("root");
  return (
    <Box
      style={{
        width: "100vh",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
      }}
      zIndex={1000}
      draggable={false}
    >
      <Topbar />

      {route === "models" && (
        <InatallModelsModal onclose={() => setRoute("root")} />
      )}
    </Box>
  );
}
