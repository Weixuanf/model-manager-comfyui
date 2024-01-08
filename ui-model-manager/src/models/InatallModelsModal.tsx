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
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { IconPin, IconPinFilled, IconTrash, IconX } from "@tabler/icons-react";
import { formatTimestamp, isImageFormat } from "../utils";
import { useDialog } from "../components/AlertDialogProvider";
const IMAGE_SIZE = 200;
export type Media = {
  id: string;
  workflowID: string;
  createTime: number;
  localPath: string;
  format: string;
};
type CivitiModel = {
  name: string;
};
type CivitiModelGetResp = {
  items: Array<CivitiModel>;
};
export default function GalleryModal({ onclose }: { onclose: () => void }) {
  const [selectedID, setSelectedID] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [models, setModels] = useState<CivitiModel[]>([]);
  const { showDialog } = useDialog();
  const loadData = useCallback(async () => {
    const params = { limit: "3", types: "Checkpoint" };
    const queryString = new URLSearchParams(params).toString();
    const fullURL = `https://civitai.com/api/v1/models?${queryString}`;

    const data = await fetch(
      "https://civitai.com/api/v1/models?limit=3&types=Checkpoint"
    );
    const json: CivitiModelGetResp = await data.json();
    console.log("json", json);
    setModels(json.items);
  }, []);
  useEffect(() => {
    loadData();
  }, []);

  const onClickMedia = (media: Media) => {
    if (isSelecting) {
      if (selectedID.includes(media.id)) {
        setSelectedID(selectedID.filter((id) => id !== media.id));
      } else {
        setSelectedID([...selectedID, media.id]);
      }
      return;
    }
    window.open(`/workspace/view_media?filename=${media.localPath}`);
  };
  const isAllSelected =
    models.length > 0 && selectedID.length === models.length;
  return (
    <Modal isOpen={true} onClose={onclose} blockScrollOnMount={true}>
      <ModalOverlay />
      <ModalContent width={"90%"} maxWidth={"90vw"} height={"90vh"}>
        <ModalHeader>
          <HStack gap={2} mb={2}>
            <Heading size={"md"} mr={2}>
              Models
            </Heading>
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
            {models?.map((model) => {
              console.log("model", model);
              return (
                <Stack
                  width={IMAGE_SIZE}
                  justifyContent={"space-between"}
                  mb={2}
                >
                  {/* <Tooltip label={formatTimestamp(media.createTime, true)}>
                    {mediaPreview}
                  </Tooltip> */}
                  <Tooltip label={model.name}>
                    <Text color={"GrayText"} noOfLines={1}>
                      {model.name}
                    </Text>
                  </Tooltip>
                  <HStack justifyContent={"space-between"} hidden={isSelecting}>
                    <Tooltip label="Set as cover">
                      <IconButton
                        size={"sm"}
                        variant={"ghost"}
                        icon={<IconPin size={19} />}
                        aria-label="set as cover"
                        onClick={() => {}}
                      />
                    </Tooltip>
                    <Button flexGrow={1} size={"sm"}>
                      Load
                    </Button>
                    <Tooltip label="Remove image from gallery">
                      <IconButton
                        size={"sm"}
                        variant={"ghost"}
                        icon={<IconTrash size={19} />}
                        aria-label="remove image from gallery"
                        colorScheme="red"
                        onClick={() => {}}
                      />
                    </Tooltip>
                  </HStack>
                </Stack>
              );
            })}
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
