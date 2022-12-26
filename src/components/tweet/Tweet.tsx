import React from "react";
import type { Tweet as ITweet, User as IUser } from "@prisma/client";
import { Box, HStack, Icon, Text, Avatar } from "@chakra-ui/react";
import { FcLike } from "react-icons/fc";
import { motion } from "framer-motion";
import { trpc } from "../../utils/trpc";

interface TweetProps {
  tweet: ITweet;
  author: IUser;
  setTweets: React.Dispatch<
    React.SetStateAction<
      (ITweet & {
        author: IUser;
      })[]
    >
  >;
}

export const Tweet: React.FC<TweetProps> = ({ tweet, author, setTweets }) => {
  const { mutate: likeTweet } = trpc.tweet.likeTweet.useMutation({
    onSuccess: (data) => {
      setTweets((prev) => {
        const index = prev.findIndex((t) => t.id === data.id);
        prev[index] = data;
        return [...prev];
      });
    },
  });

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
    >
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
        <Box pt="10">
          {/* display like button with like count */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scaleY: 0.9 }}>
            <button
              onClick={() =>
                likeTweet({
                  tweetId: tweet.id,
                })
              }
            >
              <HStack>
                <Icon as={FcLike} color="gray.400" w={6} h={6} />
                <Text color="gray.400">{tweet.likes}</Text>
              </HStack>
            </button>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};
