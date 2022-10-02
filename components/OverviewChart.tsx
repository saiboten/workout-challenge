import { Heading } from "@chakra-ui/react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryTooltip,
  VictoryStack,
} from "victory";

interface MonthData {
  x: number;
  y: number;
}

export const OverviewChart = ({
  data,
  daysInMonth,
}: {
  data: MonthData[][];
  daysInMonth: number[];
}) => {
  return (
    <>
      <Heading size="lg">Månedens treningspoeng</Heading>
      <VictoryChart
        domainPadding={20}
        colorScale={["tomato", "orange", "gold"]}
      >
        <VictoryAxis
          tickValues={daysInMonth}
          style={{
            axisLabel: { fontSize: 20, padding: 30 },
            ticks: { stroke: "grey", size: 5 },
            tickLabels: { fontSize: 10, padding: 0 },
          }}
        />
        <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />
        {data.map((oneUserData, index) => {
          console.log(oneUserData);
          return (
            <VictoryBar
              alignment={index % 2 == 0 ? "end" : "start"}
              key={index}
              data={oneUserData}
              style={{ data: { fill: index % 2 == 0 ? "#c43a31" : "blue" } }}
              labels={({ datum }) => `y: ${datum.y}`}
              labelComponent={
                <VictoryTooltip flyoutHeight={20} style={{ fontSize: 10 }} />
              }
            />
          );
        })}
      </VictoryChart>
    </>
  );
};
