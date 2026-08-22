import type { ButtonArray } from "@/components/ui/buttonGroup";
import type { KeyLanguage, Setter } from "@/types";

export const ButtonGroupList = (
  t: KeyLanguage,
  setCashFlowActive: Setter<"income" | "expense">,
): ButtonArray[] => {
  return [
    {
      buttonLabel: t("outgoing"),
      value: "expense",
      onPress: (): void => setCashFlowActive("expense"),
    },
    {
      buttonLabel: t("incoming"),
      value: "income",
      onPress: (): void => setCashFlowActive("income"),
    },
  ];
};

export const buttonGroupList = ButtonGroupList;
