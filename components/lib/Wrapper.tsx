import { Container } from "@chakra-ui/react";
import React from "react";

export const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container mt="10" maxW="container.sm">
      {children}
    </Container>
  );
};
