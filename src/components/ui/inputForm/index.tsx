import { ChevronDown, X } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import { COUNTRY_CODES } from "@/constants";
import { useLanguageStore } from "@/stores/languageStore";

import type { CountryCode, InputFormProps } from "./inputForm.types";

export const InputForm = ({
  label,
  placeholder,
  type = "text",
  value,
  onChangeText,
  onBlur,
  error,
  isInvalid = false,
  isRequired = false,
  isDisabled = false,
  helperText,
  keyboardType = "default",
  autoCapitalize = "none",
  leftIcon,
  rightIcon,
  className,
  showNumberDropdown = false,
  selectedCountry = COUNTRY_CODES[0],
  onSelectCountry,
}: InputFormProps): React.JSX.Element => {
  const { t } = useLanguageStore();
  const hasError = isInvalid || Boolean(error);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentCountry, setCurrentCountry] = useState<CountryCode>(selectedCountry);

  const handleSelectCountry = (country: CountryCode): void => {
    setCurrentCountry(country);
    if (onSelectCountry) {
      onSelectCountry(country);
    }
    setModalVisible(false);
  };

  return (
    <FormControl
      isInvalid={hasError}
      isRequired={isRequired}
      isDisabled={isDisabled}
      className={className}
    >
      {label ? (
        <FormControlLabel>
          <FormControlLabelText>{label}</FormControlLabelText>
        </FormControlLabel>
      ) : null}

      <Input className="w-full flex-row items-center px-3">
        {showNumberDropdown ? (
          <TouchableOpacity
            onPress={(): void => setModalVisible(true)}
            className="flex-row items-center gap-1 pr-2 mr-2 border-r border-slate-200"
          >
            <Text className="text-base">{currentCountry.flag}</Text>
            <Text className="text-sm font-semibold text-slate-700">{currentCountry.code}</Text>
            <ChevronDown size={14} color="#64748b" />
          </TouchableOpacity>
        ) : (
          leftIcon
        )}

        <InputField
          type={type}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          className="flex-1"
        />
        {rightIcon}
      </Input>

      {helperText && !hasError ? (
        <FormControlHelper>
          <FormControlHelperText>{helperText}</FormControlHelperText>
        </FormControlHelper>
      ) : null}

      {hasError && error ? (
        <FormControlError>
          <FormControlErrorText>{error}</FormControlErrorText>
        </FormControlError>
      ) : null}

      {/* Country Selection Modal */}
      {showNumberDropdown ? (
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={(): void => setModalVisible(false)}
        >
          <Pressable
            onPress={(): void => setModalVisible(false)}
            className="flex-1 bg-black/50 justify-center items-center p-4"
          >
            <Pressable
              onPress={(e): void => e.stopPropagation()}
              className="w-full max-w-xs bg-white rounded-2xl p-4 gap-3 max-h-96"
            >
              <View className="flex-row justify-between items-center pb-2 border-b border-slate-100">
                <Text className="text-base font-bold text-slate-800">{t("selectPhoneCode")}</Text>
                <TouchableOpacity onPress={(): void => setModalVisible(false)}>
                  <X size={20} color="#64748b" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={COUNTRY_CODES}
                keyExtractor={(item: CountryCode): string => item.iso}
                renderItem={({ item }: { item: CountryCode }): React.JSX.Element => (
                  <TouchableOpacity
                    onPress={(): void => handleSelectCountry(item)}
                    className={`flex-row items-center justify-between p-3 rounded-xl mb-1 ${
                      currentCountry.iso === item.iso
                        ? "bg-blue-50 border border-blue-200"
                        : "active:bg-slate-100"
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <Text className="text-xl">{item.flag}</Text>
                      <Text className="text-sm font-medium text-slate-800">{item.name}</Text>
                    </View>
                    <Text className="text-sm font-semibold text-blue-600">{item.code}</Text>
                  </TouchableOpacity>
                )}
              />
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </FormControl>
  );
};

export default InputForm;
