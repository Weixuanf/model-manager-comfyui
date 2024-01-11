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
const IMAGE_SIZE = 200;

export default function GalleryModal({ onclose }: { onclose: () => void }) {
  const [selectedID, setSelectedID] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [models, setModels] = useState<CivitiModel[]>([]);
  const [loading, setLoading] = useState(false);
  const { showDialog } = useDialog();
  const loadData = useCallback(async () => {
    setLoading(true);
    const params = { limit: "16", types: "Checkpoint" };
    const queryString = new URLSearchParams(params).toString();
    const fullURL = `https://civitai.com/api/v1/models?${queryString}`;

    const data = await fetch(fullURL);
    const json = await data.json();
    console.log("json", json);
    setModels(json.items);
    setLoading(false);
  }, []);
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
    loadData();
  }, []);

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
            <Input placeholder="Search models in CivitAI" />
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
          <HStack wrap={"wrap"}>
            {loading && (
              <Spinner
                thickness="4px"
                emptyColor="gray.200"
                color="pink.500"
                size="lg"
              />
            )}
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
