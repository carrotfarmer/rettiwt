import { signOut } from "next-auth/react";
import React from "react";

import { Box, Button, Center } from "@chakra-ui/react";

import Feed from "./Feed";
import { trpc } from "../utils/trpc";

export const Home = () => {
  const { mutate: createTweet } = trpc.tweet.createTweet.useMutation();
  const { mutate: likeTweet } = trpc.tweet.likeTweet.useMutation();

  return (
    <Box>
      <Box pt="5">
        <Center pt="5">
          <Button colorScheme="twitter" width="sm" onClick={() => signOut()}>
            sign out
          </Button>
        </Center>
        <Center>
          <Button
            colorScheme="twitter"
            width="sm"
            onClick={() => createTweet({ msg: "test" })}
          >
            create tweet
          </Button>
          <Button
            colorScheme="twitter"
            width="sm"
            onClick={() =>
              likeTweet({ tweetId: "cf193624-c424-430c-9b9e-0aa93b577fc7" })
            }
          >
            like tweet
          </Button>
        </Center>
      </Box>
      <Feed />
    </Box>
  );
};
