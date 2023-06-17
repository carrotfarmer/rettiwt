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
  Text,
  useDisclosure,
  useToast,
  Flex,
  FormErrorMessage,
  useMergeRefs,
} from "@chakra-ui/react";
import React from "react";

import type { Tweet, User } from "@prisma/client";
import { trpc } from "../../utils/trpc";

import { motion } from "framer-motion";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AutoResizeTextarea } from "../AutoResizeTextarea";

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

const formSchema = z
  .object({
    tweetContent: z
      .string()
      .min(1, { message: "bruh what - tweet should at least have 1 char" })
      .max(500, { message: "touch grass - tweet should be less than 500 chars" }),
  })
  .required();

type FormData = z.infer<typeof formSchema>;

export const NewTweet: React.FC<NewTweetProps> = ({ setTweets }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tweetContent: "what's happening?"
    }
  });

  const tweetContentState = watch("tweetContent");

  const { mutate: addTweet } = trpc.tweet.createTweet.useMutation({
    onSuccess: (data) => {
      setTweets((prev) => [data, ...prev]);
    },
  });

  const alert = useToast();

  const onSubmit = (data: FormData) => {
    console.log(data);
    addTweet({ msg: data.tweetContent });
    alert({
      title: "tweet posted",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose();
    reset();
  };

  return (
    <>
      <Box>
        <Flex justifyContent="center" alignItems="center">
          <motion.button
            whileTap={{
              scale: 0.95,
            }}
            whileHover={{
              scale: 1.05,
            }}
          >
            <Button
              flex={1}
              px={4}
              fontSize={"sm"}
              rounded={"xl"}
              bg={"blue.500"}
              color={"white"}
              boxShadow={
                "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(69 159 235 / 43%)"
              }
              _hover={{
                bg: "blue.600",
              }}
              _focus={{
                bg: "blue.600",
              }}
              onClick={onOpen}
            >
              new tweet
            </Button>
          </motion.button>
        </Flex>

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
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalBody>
                <FormControl isInvalid={Boolean(errors.tweetContent)}>
                  <AutoResizeTextarea
                    {...register("tweetContent")}
                    ref={useMergeRefs(initialRef, register("tweetContent").ref)}
                    placeholder="what's happening?"
                    minH="32"
                  />

                  <FormErrorMessage>
                    {errors.tweetContent && errors.tweetContent.message?.toString()}
                  </FormErrorMessage>
                </FormControl>
                <Box color="gray.200" pt="2">
                  {tweetContentState.length > 450 && (
                    <Text fontSize="xs">Chars left: ({500 - tweetContentState.length})</Text>
                  )}
                </Box>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="twitter" type="submit" isLoading={isSubmitting}>
                  post tweet
                </Button>
                <Button colorScheme="twitter" variant="ghost" mr={3} onClick={onClose}>
                  close
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};
