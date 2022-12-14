// src/pages/_app.tsx
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { withTRPC } from "@trpc/next";
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
import superjson from "superjson";
import type { AppRouter } from "../server/router";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Wrapper } from "../../components/lib/Wrapper";
import Link from "next/link";

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

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({ url }),
      ],
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },

      // To use SSR properly you need to forward the client's headers to the server
      // headers: () => {
      //   if (ctx?.req) {
      //     const headers = ctx?.req?.headers;
      //     delete headers?.connection;
      //     return {
      //       ...headers,
      //       "x-ssr": "1",
      //     };
      //   }
      //   return {};
      // }
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp);
