import { Heading, Text } from "@chakra-ui/react";
import { api } from "~/utils/api";
import { Loader } from "./lib/Loader";

export const Sum = () => {
  const { data, isLoading } = api.workout.totalscore.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Text mb="5">
      <Heading size="md" mb="2">
        Sum totalt alle måneder
      </Heading>
      <Text>{data ?? 0} poeng</Text>
    </Text>
  );
};
