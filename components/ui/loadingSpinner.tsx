import { Spinner } from "@/components/ui/spinner";
import { useLanguageStore } from "@/stores/languageStore";
import { Text, View } from "react-native";

interface Props {
  text?: string;
}

const LoadingSpinner = ({ text }: Props) => {
  const { t } = useLanguageStore();
  const loadingText = text ?? t("commonLoading");
  return (
    <View className="flex flex-1 w-full h-full justify-center items-center gap-3">
      <Spinner size={48} color="#20304E" />
      <Text className="text-lg text-[#20304E] font-bold">{loadingText}</Text>
    </View>
  );
};

export default LoadingSpinner;
