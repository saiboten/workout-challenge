import { Text } from "@chakra-ui/react";
import { api } from "~/utils/api";
import { Loader } from "./lib/Loader";

export const Sum = () => {
  const { data, isLoading } = api.workout.totalscore.useQuery();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Text>
      Sum totalt alle måneder: <strong>{data ?? 0} poeng</strong>
    </Text>
  );
};
