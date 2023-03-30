import { GetServerSideProps, type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { Box, Button, Center, Text } from "@chakra-ui/react";

import { Feed } from "../components/Feed";
import { Navbar } from "../components/nav/Navbar";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>rettiwt</title>
        <meta name="description" content="ultra-mid twitter" />
        <link rel="icon" href="/favicon-trans.png" />
      </Head>
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
  return {
    props: {
      openGraphData: [
        {
          property: "og:url",
          content: ``,
          key: "ogurl",
        },

        {
          property: "og:title",
          content: "rettiwtt",
          key: "ogtitle",
        },
        {
          property: "og:description",
          content: "ultra mid twitter. but at least elon's not here for now.",
          key: "ogdesc",
        },
        {
          property: "og:type",
          content: "website",
          key: "website",
        },
      ],
    },
  };
};

export default Home;

