import type { ReactElement } from "react";
import { Pressable, Text, View } from "react-native";

import type { ButtonGroupProps } from "./buttonGroup.types";

const ButtonGroup = ({ buttonArray, activeValue, isDisabled }: ButtonGroupProps): ReactElement => (
  <View className="flex-row w-full bg-[#EEF3FA] p-1.5 rounded-xl">
    {buttonArray.map((item) => {
      const isActive = activeValue === item.value;
      return (
        <Pressable
          disabled={isDisabled}
          key={item.value}
          onPress={item.onPress}
          className={`flex-1 py-2.5 items-center justify-center rounded-lg ${
            isActive ? "bg-[#1C2A44]" : "bg-transparent"
          }`}
        >
          <Text
            className={`text-center text-sm font-semibold ${
              isActive ? "text-[#EAF1FF]" : "text-[#1E293B]"
            }`}
          >
            {item.buttonLabel}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

export default ButtonGroup;
