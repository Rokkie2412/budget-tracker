import { Text } from "@/components/ui/text";
import { useLanguageStore } from "@/stores/languageStore";
import { Setter } from "@/types";
import { BlurView } from "expo-blur";
import { X } from "lucide-react-native";
import { type ReactElement, useState } from "react";
import { Modal, Pressable, View } from "react-native";

type Props = {
  open: boolean;
  setOpen: Setter<boolean>;
};

const CustomDateModal = ({ open, setOpen }: Props): ReactElement => {
  const { t } = useLanguageStore();
  const [startDate, setStartDate] = useState<Date | string>(new Date());
  const [endDate, setEndDate] = useState<Date | string>(new Date());

  return (
    <Modal
      animationType="fade"
      visible={open}
      transparent={true}
      onRequestClose={() => setOpen(false)}
      statusBarTranslucent
    >
      <Pressable
        onPress={() => setOpen(false)}
        className="flex-1 justify-center items-center"
      >
        <BlurView
          blurMethod="none"
          tint="systemChromeMaterialDark"
          intensity={100}
          className="flex-1 justify-center items-center px-6"
        >
          <View className="flex w-full h-auto bg-[#FFFFFF] shadow-md rounded-lg p-4">
            <View className="flex flex-row w-full justify-between p-4">
              <Text className="text-xl font-bold">
                {t("customDateFilterTitle")}
              </Text>
              <X />
            </View>
          </View>
        </BlurView>
      </Pressable>
    </Modal>
  );
};

export default CustomDateModal;
