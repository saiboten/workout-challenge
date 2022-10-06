import { Box, Flex, Heading } from "@chakra-ui/react";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup } from "victory";
import { ProfileImage } from "./lib/ProfileImage";
import { Spacer } from "./lib/Spacer";

interface Props {
  totalScores: {
    name: string | null;
    totalScore: number;
  }[];
}

const color = ["chocolate", "darkcyan"];

export const TotalScore = ({ totalScores }: Props) => {
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
