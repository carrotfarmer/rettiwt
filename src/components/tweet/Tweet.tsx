import React from "react";
import type { Tweet as ITweet, User as IUser } from "@prisma/client";
import {
  Box,
  HStack,
  Icon,
  Text,
  Avatar,
  useDisclosure,
} from "@chakra-ui/react";
import { BsHeart } from "react-icons/bs";
import { motion } from "framer-motion";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
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
}

export const Tweet: React.FC<TweetProps> = ({
  tweet,
  author,
  likedBy,
  setTweets,
}) => {
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

  const { data: session } = useSession();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <Box
      p="5"
      shadow="md"
      borderWidth="1px"
      width="xl"
      height="40"
      borderRadius="2xl"
      cursor="pointer"
    >
      <Box onClick={onOpen}>
        <TweetModal
          onClose={onClose}
          onOpen={onOpen}
          isOpen={isOpen}
          likedBy={likedBy}
          setTweets={setTweets}
          tweet={tweet}
        />
        <Box>
          <Text>
            <HStack>
              <Avatar src={author.image as string} size="sm" />
              <Text fontWeight="bold">{author.name}</Text>
              <Text color="gray.400">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                {tweet.createdAt.toLocaleDateString("en-US", options)}
              </Text>
            </HStack>
          </Text>
          <Box pt="2.5">
            <Text>{tweet.message}</Text>
          </Box>
        </Box>
      </Box>
      <Box pt="10">
        <Box boxSize="3xs">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scaleY: 0.9 }}>
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
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};
