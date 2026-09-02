import type { NativeSyntheticEvent, TextInputFocusEventData, TextInputProps } from "react-native";

export type CountryCode = {
  flag: string;
  code: string;
  name: string;
  iso: string;
};

export type InputFormProps = {
  label?: string;
  placeholder?: string;
  type?: "text" | "password";
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  error?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  helperText?: string;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  showNumberDropdown?: boolean;
  selectedCountry?: CountryCode;
  onSelectCountry?: (country: CountryCode) => void;
};
