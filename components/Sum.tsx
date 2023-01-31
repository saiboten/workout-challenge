import { Heading, Text } from "@chakra-ui/react";
import { trpc } from "../src/utils/trpc";
import { Loader } from "./lib/Loader";

export const Sum = () => {
  const { data, isLoading } = trpc.useQuery(["workout.totalscore"]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Text mb="5">
      <Heading size="md" mb="2">
        Sum totalt alle måneder
      </Heading>
      <Text>{data?.sum ?? 0} poeng</Text>
    </Text>
  );
};
