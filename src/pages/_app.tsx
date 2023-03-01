import { ThemeProvider, DefaultTheme } from "styled-components";
import {
  Button,
  ChakraProvider,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Wrapper } from "../../components/lib/Wrapper";
import Link from "next/link";
import { api } from "~/utils/api";

const theme: DefaultTheme = {
  colors: {
    primary: "#111",
    secondary: "#0070f3",
  },
};

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <SessionProvider session={pageProps.session}>
          <Wrapper>
            <Flex justifyContent="space-between">
              <Link href="/">
                <Heading
                  cursor="pointer"
                  mb="5"
                  size="lg"
                  border="1px solid black"
                  p="5"
                  borderRadius="5"
                >
                  Treningsutfordring
                </Heading>
              </Link>
              <Flex justifyContent="flex-end">
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Meny
                  </MenuButton>
                  <MenuList>
                    <Link href="/settings" passHref>
                      <MenuItem>Innstillinger</MenuItem>
                    </Link>
                  </MenuList>
                </Menu>
              </Flex>
            </Flex>
            <Component {...pageProps} />
          </Wrapper>
        </SessionProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}

export default api.withTRPC(MyApp);
