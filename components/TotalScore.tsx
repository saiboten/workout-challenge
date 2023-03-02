import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { addMonths, format } from "date-fns";
import { useState } from "react";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory";
import { api } from "~/utils/api";
import { Loader } from "./lib/Loader";
import { Spacer } from "./lib/Spacer";

const color = ["chocolate", "darkcyan"];

export const TotalScore = () => {
  const [month, setMonth] = useState(0);
  const { data: totalScores, isLoading } =
    api.workout.totalScoreChart.useQuery(month);

  const monthText = addMonths(new Date(), month);

  if (isLoading) {
    return <Loader />;
  }

  if (!totalScores) {
    throw new Error("No data");
  }

  return (
    <>
      <Heading size="md">Stillingen</Heading>
      <Spacer />
      <Text>{format(monthText, "MMMM yyyy")}</Text>
      <Flex justifyContent="flex-start" maxWidth="320px" marginTop="1rem">
        <Button type="button" onClick={() => setMonth(month - 1)}>
          <ArrowBackIcon boxSize={6} /> Forrige måned
        </Button>
        <Button
          marginLeft="1rem"
          type="button"
          onClick={() => setMonth(month + 1)}
        >
          Neste måned <ArrowForwardIcon boxSize={6} />
        </Button>
      </Flex>
      <VictoryChart>
        <VictoryAxis />
        <VictoryBar
          x={"name"}
          y={"totalScore"}
          barWidth={100}
          labels={({ datum }) => `${datum.totalScore}`}
          data={totalScores.map((el, index) => ({ ...el, fill: color[index] }))}
          domain={{ x: [0, 3] }}
          style={{
            data: {
              fill: ({ datum }) => datum.fill,
            },
          }}
        />
      </VictoryChart>
    </>
  );
};
