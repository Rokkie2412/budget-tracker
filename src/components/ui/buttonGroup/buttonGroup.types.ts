export type ButtonArray = {
  buttonLabel: string;
  value: string;
  onPress: () => void;
};

export type ButtonGroupProps = {
  buttonArray: ButtonArray[];
  activeValue: string;
  isDisabled?: boolean;
};
