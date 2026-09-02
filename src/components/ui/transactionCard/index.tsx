import { Text, View } from "react-native";

import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

import type { TransactionCardProps } from "./transactionCard.types";

export const TransactionSkeleton = (): React.JSX.Element => {
  return (
    <View className="flex flex-row gap-4 mt-2">
      <View className="flex-1 flex-col">
        <Skeleton variant="rounded" className="h-5 w-40" />
        <SkeletonText _lines={1} className="h-3.5 w-28" />
      </View>
      <Skeleton variant="rounded" className="h-6 w-20" />
    </View>
  );
};

const TransactionCard = ({
  title,
  amount,
  date,
  type,
  category,
}: TransactionCardProps): React.JSX.Element => {
  return (
    <View className="flex flex-row gap-4 mt-2">
      <View className="flex-1 flex-col">
        <Text className="text-lg font-bold">{title}</Text>
        <View className="flex-row gap-2">
          <Text>{new Date(date).toLocaleDateString()}</Text>
          <Text>•</Text>
          <Text>{category}</Text>
        </View>
      </View>
      <View>
        {type === "IN" ? (
          <Text className="text-lg font-bold text-[#26C289]">+ {amount}</Text>
        ) : (
          <Text className="text-lg font-bold text-[#F75D59]">- {amount}</Text>
        )}
      </View>
    </View>
  );
};

export default TransactionCard;
