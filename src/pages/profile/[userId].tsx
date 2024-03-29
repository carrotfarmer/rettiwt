import { Box, Center, Text } from "@chakra-ui/react";
import type { GetServerSideProps, NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Metadata } from "../../components/Metadata";
import { Navbar } from "../../components/nav/Navbar";
import { Profile } from "../../components/user/Profile";
import { getProfileMetadata } from "../../utils/getProfileMetadata";
import { trpc } from "../../utils/trpc";

const UserProfile: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data: session } = useSession();

  const { data: user } = trpc.auth.getUser.useQuery({
    id: userId as string,
  });

  return (
    <div>
      <Head>
        <title>{user?.name} - rettiwt</title>
        <meta name="description" content="ultra-mid twitter" />
        <link rel="icon" href="/favicon-trans.png" />
      </Head>

      <Metadata title={`${user?.name} - rettiwt`} description={`${user?.name} on rettiwtt`} />

      <Navbar />
      {session ? (
        <Profile userId={userId as string} session={session} />
      ) : (
        <Box>
          <Center>
            <Text>You have to sign in to view this page.</Text>
          </Center>
        </Box>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context?.params?.userId as string;

  const { title, description } = await getProfileMetadata(id);

  const metaTags = {
    "og:title": title,
    "og:description": description,
    "og:url": `https://rettiwtt.vercel.app/profile/${id}`,
  };

  return {
    props: {
      metaTags,
    },
  };
};



export default UserProfile;
