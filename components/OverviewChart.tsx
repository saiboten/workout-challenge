import { Heading } from "@chakra-ui/react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryTooltip,
  VictoryStack,
  VictoryGroup,
  VictoryLegend,
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
      <VictoryChart domainPadding={5} height={1400}>
        <VictoryLegend
          x={80}
          y={10}
          centerTitle
          orientation="horizontal"
          gutter={20}
          data={[
            { name: "Synne", symbol: { fill: "tomato" } },
            { name: "Tobias", symbol: { fill: "grey" } },
          ]}
        />
        <VictoryAxis
          tickValues={daysInMonth}
          style={{
            axisLabel: { fontSize: 20, padding: 30 },
            ticks: { stroke: "grey", size: 5 },
            tickLabels: { fontSize: 15, padding: 5 },
          }}
        />
        <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />
        <VictoryGroup colorScale={["tomato", "grey"]} offset={16}>
          {data.map((oneUserData, index) => {
            return (
              <VictoryBar
                barWidth={15}
                horizontal
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
