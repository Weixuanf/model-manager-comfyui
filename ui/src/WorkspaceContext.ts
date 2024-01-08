import { createContext } from "react";
import { Route } from "./types";

export const WorkspaceContext = createContext<{
  curFlowID: string | null;
  onDuplicateWorkflow?: (flowID: string, newFlowName?: string) => void;
  loadWorkflowID: (id: string) => void;
  saveCurWorkflow: () => void;
  discardUnsavedChanges: () => void;
  isDirty: boolean;
  loadNewWorkflow: (input?: { json: string; name?: string }) => void;
  loadFilePath: (path: string, overwriteCurrent?: boolean) => void;
  setRoute: (route: Route) => void;
}>({
  curFlowID: null,
  loadWorkflowID: () => {},
  saveCurWorkflow: () => {},
  discardUnsavedChanges: () => {},
  isDirty: false,
  loadNewWorkflow: () => {},
  loadFilePath: () => {},
  setRoute: () => {},
});
