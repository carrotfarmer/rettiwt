import { Box, Button, Center, Spinner, VStack } from "@chakra-ui/react";
import type { Tweet as ITweet } from "@prisma/client";
import { signOut } from "next-auth/react";
import React from "react";
import { trpc } from "../utils/trpc";
import { NewTweet } from "./tweet/NewTweet";
import { Tweet } from "./tweet/Tweet";

export const Feed = () => {
  const [tweets, setTweets] = React.useState<ITweet[]>([]);

  const {
    data: tweetsData,
    isLoading,
    isFetching,
  } = trpc.tweet.getTweets.useQuery();

  if (isFetching && isLoading) {
    return <Spinner />;
  }

  if (tweets.length === 0 && tweetsData) {
    setTweets(tweetsData);
  }

  return (
    <div>
      <Box pt="5">
        <Center pt="5">
          <Button colorScheme="twitter" width="sm" onClick={() => signOut()}>
            sign out
          </Button>
        </Center>
        <Center>
          <NewTweet setTweets={setTweets} />
        </Center>
      </Box>
      <Box>
        <Center>
          <VStack>
            {tweetsData &&
              tweets.map((tweet) => <Tweet tweet={tweet} key={tweet.id} />)}
          </VStack>
        </Center>
      </Box>
    </div>
  );
};
