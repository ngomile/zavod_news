import {
  useState,
  useEffect
} from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  getTagViewsDataSet
} from '@/admin/statistics/_actions';

const chartConfig = {
  views: {
    label: "Views",
    color: "#2563eb",
  }
} satisfies ChartConfig

import {
  type TagViewsChartConfig
} from '@/admin/statistics/_types';

export default function Component() {
  const [data, setData] = useState<TagViewsChartConfig[]>();

  useEffect(() => {
    getTagViewsDataSet().then(dataSet => {
      setData(dataSet);
    });
  }, []);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="tag"
          tickLine={false}
          tickMargin={1}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="views" fill="var(--color-views)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
};