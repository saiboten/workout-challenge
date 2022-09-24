import { Box } from "@chakra-ui/react";

export const Spacer = ({ space = 5 }: { space?: number }) => {
  return <Box mt={space}></Box>;
};
