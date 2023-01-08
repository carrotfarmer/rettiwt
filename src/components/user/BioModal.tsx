import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { trpc } from "../../utils/trpc";

interface TweetModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const BioModal: React.FC<TweetModalProps> = ({
  isOpen,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onOpen,
  onClose,
}) => {
  const { mutate: setBio } = trpc.auth.setBio.useMutation();

  const [bio, setBioState] = React.useState<string>("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Bio</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="internet no-lifer."
            onChange={(e) => setBioState(e.target.value)}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={() => {
              setBio({ bio });
              onClose();

              // reload page
              window.location.reload();
            }}
          >
            Save
          </Button>
          <Button variant="ghost" colorScheme="twitter" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
