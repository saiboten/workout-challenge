import { Heading } from "@chakra-ui/react";
import { VictoryChart, VictoryAxis, VictoryBar, VictoryTooltip } from "victory";

interface MonthData {
  x: number;
  y: number;
}

export const OverviewChart = ({
  data,
  daysInMonth,
}: {
  data: MonthData[];
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
        <VictoryBar
          data={data}
          style={{ data: { fill: "#c43a31" } }}
          labels={({ datum }) => `y: ${datum.y}`}
          labelComponent={
            <VictoryTooltip flyoutHeight={20} style={{ fontSize: 10 }} />
          }
        />
      </VictoryChart>
    </>
  );
};
