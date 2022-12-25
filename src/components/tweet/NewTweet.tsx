import {
  Box,
  Button,
  FormControl,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import type { Tweet } from "@prisma/client";
import React from "react";
import { trpc } from "../../utils/trpc";

interface NewTweetProps {
  setTweets: React.Dispatch<React.SetStateAction<Tweet[]>>;
}

export const NewTweet: React.FC<NewTweetProps> = ({ setTweets }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const [message, setMessage] = React.useState("");

  const { mutate: addTweet } = trpc.tweet.createTweet.useMutation({
    onSuccess: (data) => {
      setTweets((prev) => [data, ...prev]);
    },
  });

  return (
    <>
      <Box>
        <Button onClick={onOpen}>new tweet</Button>

        <Modal
          isOpen={isOpen}
          onClose={onClose}
          initialFocusRef={initialRef}
          finalFocusRef={finalRef}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>new tweet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <Textarea
                  ref={initialRef}
                  placeholder="what's happening?"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="twitter"
                onClick={() => {
                  addTweet({ msg: message });
                }}
              >
                post tweet
              </Button>
              <Button
                colorScheme="twitter"
                variant="ghost"
                mr={3}
                onClick={onClose}
              >
                close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};
