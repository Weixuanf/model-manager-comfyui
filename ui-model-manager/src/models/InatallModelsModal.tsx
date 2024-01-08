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
import { CivitiModel, CivitiModelGetResp, CivitiTypes } from "../types";
const IMAGE_SIZE = 200;

export default function GalleryModal({ onclose }: { onclose: () => void }) {
  const [selectedID, setSelectedID] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [models, setModels] = useState<CivitiTypes.Model[]>([]);
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
  useEffect(() => {
    loadData();
  }, []);

  const onClickMedia = (model: CivitiModel) => {
    // window.open(`/workspace/view_media?filename=${media.localPath}`);
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
            {loading && (
              <Spinner
                thickness="4px"
                emptyColor="gray.200"
                color="pink.500"
                size="lg"
              />
            )}
            {models?.map((model) => {
              console.log("model", model);
              const modelPhoto = model.modelVersions[0]?.images[0]?.url;
              return (
                <Card
                  width={IMAGE_SIZE}
                  justifyContent={"space-between"}
                  mb={2}
                  gap={1}
                >
                  <Image
                    borderRadius={3}
                    boxSize={IMAGE_SIZE + "px"}
                    objectFit="cover"
                    src={modelPhoto}
                    alt={"model cover image"}
                  />
                  <Stack p={1}>
                    <Tooltip label={model.name}>
                      <Text fontWeight={500} noOfLines={1}>
                        {model.name}
                      </Text>
                    </Tooltip>
                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Button
                        borderRadius={14}
                        noOfLines={1}
                        size={"xs"}
                        colorScheme="teal"
                        maxWidth={"40%"}
                        flexShrink={1}
                        variant={"outline"}
                        px={1}
                      >
                        <Text
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {model.type}
                        </Text>
                      </Button>
                      <Button
                        leftIcon={<IconDownload size={18} />}
                        iconSpacing={1}
                        borderRadius={12}
                        size={"sm"}
                        py={1}
                      >
                        Install
                      </Button>
                    </Flex>
                  </Stack>
                </Card>
              );
            })}
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
