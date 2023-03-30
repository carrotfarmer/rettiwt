import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { Box, Button, Center, Text } from "@chakra-ui/react";

import { Feed } from "../components/Feed";
import { Navbar } from "../components/nav/Navbar";
import { Metadata } from "../components/Metadata";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Metadata
        title="rettiwt"
        description="ultra mid twitter. but at least elon's not here for now."
      />
      <main>
        <Navbar />
        <Box>
          {sessionData ? (
            <Feed />
          ) : (
            <Box pt="50">
              <Center>
                <Text>Yo! Sign in with GitHub to continue:</Text>
              </Center>
              <Center pt="3">
                <Button colorScheme="twitter" onClick={() => signIn()}>
                  sign in
                </Button>
              </Center>
            </Box>
          )}
        </Box>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (_) => {
  const metaTags = {
    "og:title": "rettiwtt",
    "og:description": "ultra mid twitter. but at least elon's not here for now.",
    "og:url": `https://rettiwtt.vercel.app/`,
  };

  return {
    props: {
      metaTags,
    },
  };
};

export default Home;
