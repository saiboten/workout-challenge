import { api } from "~/utils/api";
import { Loader } from "./lib/Loader";
import { Progress } from "@chakra-ui/react";
import { Box, Heading, Text } from "@chakra-ui/react";

function getData(percent: number) {
  return [
    { x: 1, y: percent },
    { x: 2, y: 100 - percent },
  ];
}

function format(num: number) {
  return new Intl.NumberFormat("no-NB").format(num);
}

export const Award = () => {
  const { data, isLoading } = api.award.totalScoreAllUsers.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return <Loader />;
  }

  const percent = Math.round((data / 100000) * 100);

  return (
    <Box>
      <Heading mb="2">Award</Heading>
      <Box mb="2" display="flex" justifyContent="center">
        <Text bgColor="blue.100" padding="1px 8px" borderRadius="4px">
          {percent} %
        </Text>
      </Box>
      <Progress mb="2" size="lg" value={percent} />
    </Box>
  );
};
