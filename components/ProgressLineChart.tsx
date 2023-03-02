import {
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryGroup,
  VictoryLegend,
  VictoryLine,
} from "victory";
import { api } from "~/utils/api";
import { Loader } from "./lib/Loader";

const colors = ["tomato", "darkcyan", "grey"] as const;

export const ProgressLineChart = ({ month }: { month: number }) => {
  const { data: chartData, isLoading } = api.chart.getChart.useQuery(month);

  if (isLoading) {
    return <Loader />;
  }

  if (!chartData) {
    throw new Error("No data");
  }

  const { daysInMonth, workoutChartData, today } = chartData;

  const users = Object.keys(workoutChartData);

  return (
    <>
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
          tickValues={daysInMonth.filter(
            (dayNumber) => month < 0 || dayNumber <= today.getDate()
          )}
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
              <VictoryLine
                key={index}
                data={workoutChartData[userName]
                  ?.filter((el) => month < 0 || el.dayNumber <= today.getDate())
                  ?.map((el) => ({
                    x: el.dayNumber,
                    y: el.scoreSum,
                  }))}
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
