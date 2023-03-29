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
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import type { Tweet, User } from "@prisma/client";
import React from "react";
import { trpc } from "../../utils/trpc";

interface NewTweetProps {
  setTweets: React.Dispatch<
    React.SetStateAction<
      (Tweet & {
        author: User;
        likedBy: User[];
      })[]
    >
  >;
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

  const alert = useToast();

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
                  isInvalid={message.length > 100}
                />
              </FormControl>
              <Box color="gray.200" pt="2">
                <Text fontSize="xs">Chars: ({message.length}/100)</Text>
              </Box>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="twitter"
                onClick={() => {
                  if (message.length > 100) {
                    alert({
                      title: "touch grass",
                      description: "tweet must be less than 100 characters",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                  } else if (message.length === 0) {
                    alert({
                      title: "bruh what",
                      description: "tweet must be more than 0 characters",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                  } else {
                    addTweet({ msg: message });
                    setMessage("");
                    alert({
                      title: "tweet posted",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                    });
                    onClose();
                  }
                }}
              >
                post tweet
              </Button>
              <Button colorScheme="twitter" variant="ghost" mr={3} onClick={onClose}>
                close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};
