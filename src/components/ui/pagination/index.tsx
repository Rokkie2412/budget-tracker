import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

import { PaginationProps } from "./pagination.types";

const Pagination = ({ totalPages, page = 1, setPage }: PaginationProps): React.JSX.Element => {
  return (
    <View className="flex flex-row items-center justify-center gap-2">
      <Pressable
        onPress={() => setPage(page - 1)}
        disabled={page === 1}
        className="w-10 h-10 flex justify-center items-center"
      >
        <ChevronLeftIcon color="#20304E" size={20} />
      </Pressable>
      <Text className="text-md font-semibold">
        {page} / {totalPages}
      </Text>
      <Pressable
        onPress={() => setPage(page + 1)}
        disabled={page === totalPages}
        className="w-10 h-10 flex justify-center items-center"
      >
        <ChevronRightIcon color="#20304E" size={20} />
      </Pressable>
    </View>
  );
};

export default Pagination;
