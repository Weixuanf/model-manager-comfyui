import {
  Button,
  HStack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Link,
  Stack,
  Tooltip,
  IconButton,
  Heading,
  Checkbox,
  Spinner,
  Card,
  Flex,
  CardBody,
  Select,
  Input,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  IconDownload,
  IconPin,
  IconPinFilled,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { formatTimestamp, isImageFormat } from "../utils";
import { useDialog } from "../components/AlertDialogProvider";
import { CivitiModel, CivitiModelFileVersion } from "../types";
import { InstallModelsApiInput, installModelsApi } from "../api/modelsApi";
import ModelCard from "./ModelCard";
import InstallProgress from "./InstallProgress";
import InstallModelSearchBar from "./InstallModelSearchBar";
const IMAGE_SIZE = 200;
type MODEL_TYPE =
  | "Checkpoint"
  | "TextualInversion"
  | "Hypernetwork"
  | "AestheticGradient"
  | "LORA"
  | "Controlnet"
  | "Poses";
type CivitModelQueryParams = {
  types?: string;
  query?: string;
  limit?: string;
};
const ALL_MODEL_TYPES: MODEL_TYPE[] = [
  "Checkpoint",
  "TextualInversion",
  "Hypernetwork",
  "AestheticGradient",
  "LORA",
  "Controlnet",
  "Poses",
];

export default function GalleryModal({ onclose }: { onclose: () => void }) {
  const [selectedID, setSelectedID] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [models, setModels] = useState<CivitiModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [modelType, setModelType] = useState<MODEL_TYPE>("Checkpoint");
  const { showDialog } = useDialog();
  const [searchQuery, setSearchQuery] = useState("");
  const loadData = useCallback(async () => {
    setLoading(true);
    const params: CivitModelQueryParams = {
      limit: "30",
      types: "Checkpoint",
    };
    if (searchQuery !== "") {
      params.query = searchQuery;
    }
    if (modelType != null) {
      params.types = modelType;
    }
    const queryString = new URLSearchParams(params).toString();
    const fullURL = `https://civitai.com/api/v1/models?${queryString}`;

    const data = await fetch(fullURL);
    const json = await data.json();
    console.log("json", json);
    setModels(json.items);
    setLoading(false);
  }, [searchQuery, modelType]);
  const onClickInstallModel = (file: CivitiModelFileVersion) => {
    console.log("file", file);
    if (file.downloadUrl == null || file.name == null) {
      console.error("file.downloadUrl or file.name is null");
      return;
    }
    installModelsApi({
      filename: file.name,
      name: file.name,
      save_path: "checkpoints",
      url: file.downloadUrl,
    });
  };
  useEffect(() => {
    console.log("searchQuery", searchQuery);
    loadData();
  }, [searchQuery, modelType]);

  const isAllSelected =
    models.length > 0 && selectedID.length === models.length;

  return (
    <Modal isOpen={true} onClose={onclose} blockScrollOnMount={true}>
      <ModalOverlay />
      <ModalContent width={"90%"} maxWidth={"90vw"} height={"90vh"}>
        <ModalHeader>
          <HStack gap={2} mb={2} alignItems={"center"}>
            <Heading size={"md"} mr={2}>
              Models
            </Heading>
            <InstallModelSearchBar setSearchQuery={setSearchQuery} />
          </HStack>
          <InstallProgress />
          <HStack gap={2} mb={2} wrap={"wrap"}>
            {ALL_MODEL_TYPES.map((type) => {
              return (
                <Button
                  size={"sm"}
                  py={1}
                  isActive={modelType === type}
                  onClick={() => {
                    setModelType(type);
                  }}
                >
                  {type}
                </Button>
              );
            })}
          </HStack>
          {isSelecting && (
            <HStack gap={3}>
              <Checkbox isChecked={isAllSelected}>All</Checkbox>
              <Text fontSize={16}>{selectedID.length} Selected</Text>
              <IconButton
                size={"sm"}
                icon={<IconX size={19} />}
                onClick={() => setIsSelecting(false)}
                aria-label="cancel"
              />
            </HStack>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY={"auto"}>
          {loading && (
            <Spinner
              thickness="4px"
              emptyColor="gray.200"
              color="pink.500"
              size="lg"
            />
          )}
          <HStack wrap={"wrap"}>
            {models?.map((model) => {
              return (
                <ModelCard
                  model={model}
                  key={model.id}
                  onClickInstallModel={onClickInstallModel}
                />
              );
            })}
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
