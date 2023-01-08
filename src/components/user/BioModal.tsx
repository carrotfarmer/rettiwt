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
  useToast,
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

  const alert = useToast();

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
            isInvalid={bio.length > 100}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={() => {
              if (bio.length > 100) {
                alert({
                  title: "Bio too long",
                  description: "Your bio must be less than 100 characters.",
                  status: "error",
                  duration: 5000,
                });
              } else {
                setBio({ bio });
                onClose();

                // reload page
                window.location.reload();
              }
            }}
            colorScheme="twitter"
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
