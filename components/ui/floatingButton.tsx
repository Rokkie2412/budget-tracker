import { Pressable, StyleSheet, Text } from "react-native";
import { Plus } from "lucide-react-native";

interface FloatingButtonProps {
  onPress: () => void;
}

const FloatingButton = ({
  onPress,
}: FloatingButtonProps): React.JSX.Element => {
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

const styles = StyleSheet.create({
  button: {
    zIndex: 999,
    elevation: 8,
  },
});

export default FloatingButton;
