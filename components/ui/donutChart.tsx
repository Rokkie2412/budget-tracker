import { CATEGORY_COLORS } from "@/constants";
import { CategoryBreakdownItem, ExpenseCategory } from "@/types";
import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

interface DonutChartDataProps {
  data: CategoryBreakdownItem<ExpenseCategory>[];
}

const getCategoryColor = (category: ExpenseCategory) => {
  const color = CATEGORY_COLORS[category];
  return color;
};

const mapNewPieData = (data: CategoryBreakdownItem<ExpenseCategory>[]) =>
  data.map((item) => ({
    value: item.percentage,
    color: getCategoryColor(item.category),
    text: `${item.percentage}%`,
  }));

const DonatChart = ({ data }: DonutChartDataProps) => {
  const pieData = mapNewPieData(data);

  return (
    <View className="flex w-full h-full">
      <PieChart
        donut
        isThreeD
        showText
        textColor="black"
        radius={170}
        textSize={20}
        showTextBackground
        textBackgroundRadius={26}
        data={pieData}
      />
    </View>
  );
};

export default DonatChart;
