import { Heading } from "@chakra-ui/react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryTooltip,
  VictoryStack,
  VictoryGroup,
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
        <VictoryGroup colorScale={"qualitative"} offset={20}>
          {data.map((oneUserData, index) => {
            return (
              <VictoryBar
                key={index}
                data={oneUserData}
                labels={({ datum }) => `${datum.y}`}
                labelComponent={
                  <VictoryTooltip flyoutHeight={20} style={{ fontSize: 10 }} />
                }
              />
            );
          })}
        </VictoryGroup>
      </VictoryChart>
    </>
  );
};
