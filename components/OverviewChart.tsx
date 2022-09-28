import {
  VictoryLine,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLegend,
} from "victory";

interface MonthData {
  month: 1 | 2 | 3;
  points: number;
}

const data2 = [
  { month: 1, points: 200 },
  { month: 2, points: 170 },
  { month: 3, points: 250 },
] as const;

export const OverviewChart = ({ data }: { data: readonly MonthData[] }) => {
  return (
    <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
      <VictoryLegend
        x={50}
        y={50}
        title="Legend"
        centerTitle
        orientation="horizontal"
        gutter={5}
        style={{ border: { stroke: "black" }, title: { fontSize: 10 } }}
        data={[
          { name: "Tobias", symbol: { fill: "tomato", type: "star" } },
          { name: "Synne", symbol: { fill: "orange" } },
        ]}
      />
      <VictoryAxis
        // tickValues specifies both the number of ticks and where
        // they are placed on the axis
        tickValues={[1, 2, 3]}
        tickFormat={["Juli", "August", "September"]}
      />
      <VictoryAxis
        dependentAxis
        // tickFormat specifies how ticks should be displayed
        tickFormat={(x) => `${x}`}
      />
      <VictoryLine
        interpolation="natural"
        data={data}
        // data accessor for x values
        x="month"
        // data accessor for y values
        y="points"
      />
      <VictoryLine
        interpolation="natural"
        data={data2}
        // data accessor for x values
        x="month"
        // data accessor for y values
        y="points"
      />
    </VictoryChart>
  );
};
