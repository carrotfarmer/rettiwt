import React from "react";
import type { Tweet as ITweet, User as IUser } from "@prisma/client";
import { Box, Text } from "@chakra-ui/react";

interface TweetProps {
  tweet: ITweet;
  author: IUser;
}

export const Tweet: React.FC<TweetProps> = ({ tweet, author }) => {
  return (
    <Box p="5" shadow="md" borderWidth="1px" width="sm" height="40">
      <Box>
        <Text>{author.name}</Text>
        <Text>{tweet.message}</Text>
      </Box>
    </Box>
  );
};
