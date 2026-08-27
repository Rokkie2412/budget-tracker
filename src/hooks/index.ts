import { useCallback } from "react";
import { useFocusEffect } from "expo-router";

export const useRefetchWhenFocus = (fn: () => any) => {
  useFocusEffect(
    useCallback(() => {
      fn();
    }, [fn]),
  );
};
