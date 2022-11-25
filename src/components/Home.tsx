import { signOut } from "next-auth/react";
import React from "react";

import { Box, Button, Center } from "@chakra-ui/react";

import Feed from "./Feed";
import { trpc } from "../utils/trpc";

export const Home = () => {
  const { mutate: createTweet } = trpc.tweet.createTweet.useMutation();

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
        </Center>
      </Box>
      <Feed />
    </Box>
  );
};
