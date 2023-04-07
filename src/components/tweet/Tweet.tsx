import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  HStack,
  Icon,
  Text,
  Avatar,
  useDisclosure,
  useToast,
  Spacer,
  IconButton,
} from "@chakra-ui/react";

import type { Tweet as ITweet, User as IUser } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

import { BsHeart, BsTrash, BsArrowsAngleExpand } from "react-icons/bs";
import { FiShare } from "react-icons/fi";
import { motion } from "framer-motion";

import { TweetModal } from "./TweetModal";

interface TweetProps {
  tweet: ITweet;
  author: IUser;
  likedBy: IUser[];
  setTweets: React.Dispatch<
    React.SetStateAction<
      (ITweet & {
        author: IUser;
        likedBy: IUser[];
      })[]
    >
  >;
  isRenderedOnPage: boolean;
}

export const Tweet: React.FC<TweetProps> = ({
  tweet,
  author,
  likedBy,
  setTweets,
  isRenderedOnPage,
}) => {
  const router = useRouter();
  const toast = useToast();

  const { mutate: likeTweet } = trpc.tweet.likeTweet.useMutation({
    onSuccess: (data) => {
      setTweets((prev) => {
        const index = prev.findIndex((t) => t.id === data.id);
        prev[index] = data;
        return [...prev];
      });
    },
  });

  const { mutate: dislikeTweet } = trpc.tweet.dislikeTweet.useMutation({
    onSuccess: (data) => {
      setTweets((prev) => {
        const index = prev.findIndex((t) => t.id === data.id);
        prev[index] = data;
        return [...prev];
      });
    },
  });

  const { mutate: deleteTweet } = trpc.tweet.deleteTweet.useMutation({
    onSuccess: (data) => {
      setTweets((prev) => {
        return [...prev.filter((t) => t.id !== data.id)];
      });
    },
  });

  const { data: session } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <>
      <Box
        p="5"
        shadow="md"
        borderWidth="1px"
        width="xl"
        height="11.5rem"
        borderRadius="2xl"
        cursor="pointer"
      >
        <Box>
          <TweetModal
            onClose={onClose}
            onOpen={onOpen}
            isOpen={isOpen}
            likedBy={likedBy}
            setTweets={setTweets}
            tweet={tweet}
          />
          <Box>
            <HStack>
              <React.Fragment>
                <Avatar src={author.image as string} size="sm" />
                <Text fontWeight="bold" onClick={() => router.push(`/profile/${tweet.authorId}`)}>
                  {author.name}
                </Text>
              </React.Fragment>
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <Text color="gray.400">{tweet.createdAt.toLocaleDateString("en-US", options)}</Text>
              <Spacer />
              <HStack>
                <IconButton
                  as={FiShare}
                  variant="outline"
                  colorScheme="green"
                  aria-label="get tweet link"
                  p="7px"
                  width="8"
                  height="8"
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      `${window.location.origin}/tweet/${tweet.id}#`
                    );
                    toast({
                      title: "copied tweet link to clipboard",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                    });
                  }}
                />
                {!isRenderedOnPage && (
                  <Box onClick={() => router.push(`/tweet/${tweet.id}`)}>
                    <IconButton
                      as={BsArrowsAngleExpand}
                      aria-label="expand tweet"
                      p="7px"
                      width="8"
                      height="8"
                    />
                  </Box>
                )}
              </HStack>
            </HStack>
            <Box pt="2.5" onClick={onOpen}>
              <Text>{tweet.message}</Text>
            </Box>
          </Box>
        </Box>
        <Box pt="10">
          <HStack spacing="-44">
            <Box boxSize="3xs">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scaleY: 0.95 }}>
                <Box cursor="pointer">
                  {likedBy.find((user) => user.id === session?.user?.id) ? (
                    <HStack onClick={() => dislikeTweet({ tweetId: tweet.id })}>
                      <Icon as={BsHeart} color="red.400" />
                      <Text color="red.400">{likedBy.length}</Text>
                    </HStack>
                  ) : (
                    <HStack onClick={() => likeTweet({ tweetId: tweet.id })}>
                      <Icon as={BsHeart} borderColor="red.400" />
                      <Text>{likedBy.length}</Text>
                    </HStack>
                  )}
                </Box>
              </motion.button>
            </Box>
            <Box boxSize="3xs">
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scaleY: 0.9 }}>
                <Box cursor="pointer">
                  {author.id === session?.user?.id && (
                    <HStack
                      onClick={() => {
                        deleteTweet({ tweetId: tweet.id });
                        toast({
                          status: "success",
                          title: "tweet deleted",
                          duration: 5000,
                          isClosable: true,
                        });
                      }}
                    >
                      <Icon as={BsTrash} color="red.400" />
                      <Text color="red.400">Delete</Text>
                    </HStack>
                  )}
                </Box>
              </motion.div>
            </Box>
          </HStack>
        </Box>
      </Box>
    </>
  );
};
