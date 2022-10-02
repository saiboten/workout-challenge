import { Box, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { Spacer } from "./lib/Spacer";
import { Wrapper } from "./lib/Wrapper";

export const LoggedOut = () => {
  return (
    <Wrapper>
      <Heading size="lg">Innlogging</Heading>
      <Spacer />
      <Box>Du må logge inn!</Box>
      <Spacer />
      <NextLink href="/api/auth/signin" passHref>
        <Link>Logg inn her da vel!</Link>
      </NextLink>
    </Wrapper>
  );
};
