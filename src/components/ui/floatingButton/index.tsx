import { Plus } from "lucide-react-native";
import { Pressable, Text } from "react-native";

import styles from "./floatingButton.styles";
import type { FloatingButtonProps } from "./floatingButton.types";

const FloatingButton = ({ onPress }: FloatingButtonProps): React.JSX.Element => {
  return (
    <Pressable
      onPress={onPress}
      style={styles.button}
      className="absolute bottom-20 right-6 w-14 h-14 rounded-full bg-[#20304E] flex items-center justify-center shadow-lg"
    >
      <Text className="text-white text-2xl font-bold">
        <Plus size={24} color="white" />
      </Text>
    </Pressable>
  );
};

export default FloatingButton;
