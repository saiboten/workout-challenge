import { Heading } from "@chakra-ui/react";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory";
import { api } from "~/utils/api";
import { Loader } from "./lib/Loader";
import { Spacer } from "./lib/Spacer";

const color = ["chocolate", "darkcyan"];

export const TotalScore = ({ month }: { month: number }) => {
  const { data: totalScores, isLoading } =
    api.workout.totalScoreChart.useQuery(month);

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
