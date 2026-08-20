import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

export const useRefetchWhenFocus = (fn: () => any) => {
  useFocusEffect(
    useCallback(() => {
      fn();
    }, [fn]),
  );
};
