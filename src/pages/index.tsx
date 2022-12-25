import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { Box, Button, Center, Heading } from "@chakra-ui/react";

import { Feed } from "../components/Feed";

const Home: NextPage = () => {
  const { data: sessionData, status } = useSession();

  return (
    <>
      <Head>
        <title>rettiwt</title>
        <meta name="description" content="ultra-mid twitter" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Center>
          <Heading as="h1" size="2xl" pt="5">
            rettiwt
          </Heading>
        </Center>
        <Box>
          {sessionData ? (
            <Feed />
          ) : (
            <Box>
              <Center>
                <Button
                  colorScheme="twitter"
                  width="xl"
                  onClick={() => signIn()}
                >
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

export default Home;

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className={styles.authContainer}>
//       <p className={styles.showcaseText}>
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className={styles.loginButton}
//         onClick={sessionData ? () => signOut() : () => signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
