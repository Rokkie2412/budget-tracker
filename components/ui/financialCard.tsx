import { Text, View } from "react-native";
import { ArrowDown, ArrowUp, TrendingDown, TrendingUp, Wallet } from "lucide-react-native";

import { useLanguageStore } from "@/stores/languageStore";

interface TypeCard {
  type: "total" | "outgoing" | "incoming";
}

interface Props extends TypeCard {
  amount: string;
  data?: string;
  status?: "plus" | "minus";
}

interface DataFromLastMonthProps {
  data?: string;
  status?: "plus" | "minus";
  subString: string;
}

const DataFromLastMonth = ({ data, status, subString }: DataFromLastMonthProps) => {
  if (data && status) {
    if (status === "plus") {
      return (
        <View className="flex-row items-center gap-2">
          <TrendingUp size={18} color="#10B981" />
          <Text className="text-[#10B981]">{`${data} ${subString}`}</Text>
        </View>
      );
    }
    return (
      <View className="flex-row items-center gap-2">
        <TrendingDown size={18} color="#F87171" />
        <Text className="text-[#F87171]">{`${data} ${subString}`}</Text>
      </View>
    );
  }

  return "";
};

const RenderIcon = ({ type }: TypeCard): React.ReactNode => {
  if (type === "total") {
    return <Wallet width={20} height={20} color="#677798" />;
  }

  if (type === "incoming") {
    return (
      <View className="bg-[#4EDEA3] rounded-full w-8 h-8 items-center justify-center">
        <ArrowUp width={18} height={18} color="#677798" />
      </View>
    );
  }

  if (type === "outgoing") {
    return (
      <View className="bg-[#FFB3B0] rounded-full w-8 h-8 items-center justify-center">
        <ArrowDown width={18} height={18} color="#677798" />
      </View>
    );
  }

  return null;
};

const FinancialCard = ({ type, amount, data, status }: Props) => {
  const { t } = useLanguageStore();

  const isTotal = type === "total";

  return (
    <View
      className={`flex flex-col w-full gap-2.5 ${
        isTotal ? "p-5 bg-[#1A2B48]" : "p-4 bg-[#FFFFFF]"
      } rounded-xl shadow-sm`}
    >
      <View className="flex-row items-center gap-2">
        <RenderIcon type={type} />
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          className={`${
            isTotal ? "text-[#677798] text-lg" : "text-gray-800 text-base"
          } font-medium flex-1pt`}
        >
          {t(type)}
        </Text>
      </View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        className={`${
          isTotal ? "text-4xl text-white mt-1" : "text-2xl text-gray-900 mt-2"
        } font-bold`}
      >
        Rp {parseFloat(amount || "0").toLocaleString("id-ID")}
      </Text>
      <DataFromLastMonth subString={t("lastMonthData")} data={data} status={status} />
    </View>
  );
};

export default FinancialCard;
