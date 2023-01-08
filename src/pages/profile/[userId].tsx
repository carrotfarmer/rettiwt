import { Box, Center, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";
import { Navbar } from "../../components/nav/Navbar";
import { Profile } from "../../components/user/Profile";

const UserProfile: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data: session } = useSession();

  return (
    <div>
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

export default UserProfile;
