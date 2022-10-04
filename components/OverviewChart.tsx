import { Heading } from "@chakra-ui/react";
import {
  VictoryChart,
  VictoryAxis,
  VictoryBar,
  VictoryTooltip,
  VictoryGroup,
  VictoryLegend,
} from "victory";

interface MonthData {
  x: number;
  y: number;
}

const colors = ["tomato", "darkcyan", "grey"] as const;

export const OverviewChart = ({
  data,
  daysInMonth,
}: {
  data: { [user: string]: MonthData[] };
  daysInMonth: number[];
}) => {
  const users = Object.keys(data);

  return (
    <>
      <Heading size="lg">Månedens treningspoeng</Heading>
      <VictoryChart domainPadding={5}>
        <VictoryLegend
          x={80}
          y={10}
          centerTitle
          orientation="horizontal"
          gutter={20}
          data={users.map((el, index) => ({
            name: el,
            symbol: { fill: colors[index % 2] },
          }))}
        />
        <VictoryAxis
          tickValues={daysInMonth}
          tickCount={15}
          style={{
            axisLabel: { fontSize: 20, padding: 30 },
            ticks: { stroke: "grey", size: 5 },
            tickLabels: { fontSize: 15, padding: 5 },
          }}
        />
        <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />
        <VictoryGroup
          colorScale={users.map((el, index) => colors[index % 2] ?? "black")}
          offset={4}
        >
          {users.map((userName, index) => {
            return (
              <VictoryBar
                barWidth={3}
                key={index}
                data={data[userName]}
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
