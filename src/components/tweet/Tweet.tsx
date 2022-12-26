import React, { useEffect } from "react";
import { Tweet as ITweet, User } from "@prisma/client";
import { Box, Spinner } from "@chakra-ui/react";
import { trpc } from "../../utils/trpc";

interface TweetProps {
  tweet: ITweet;
}

export const Tweet: React.FC<TweetProps> = ({ tweet }) => {
  const [user, setUser] = React.useState<User | null>(null);

  const { data: userData, isLoading } = trpc.auth.getUser.useQuery({
    id: tweet.authorId,
  });

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (!user && userData) {
    setUser(userData);
  }

  return (
    <Box p="5" shadow="md" borderWidth="1px" width="sm" height="40">
      <Box>{user?.name}</Box>
      <Box>{tweet.message}</Box>
    </Box>
  );
};
