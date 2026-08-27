import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Calendar, type DateData } from "react-native-calendars";
import { BlurView } from "expo-blur";
import { useFormik } from "formik";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  PlusCircle,
  Search,
  Sparkles,
  X,
} from "lucide-react-native";
import * as Yup from "yup";

import {
  BUDGET_CATEGORIES_EXPENSE,
  BUDGET_CATEGORIES_INCOME,
  getCategoryColor,
  predictCategory,
} from "@/constants";
import { useLanguageStore } from "@/stores/languageStore";
import type { KeyLanguage } from "@/types";

export interface AddTransactionFormValues {
  type: "OUT" | "IN";
  amount: string;
  category: string;
  description: string;
  date: string;
}

export type AddTransactionModalProps = {
  open: boolean;
  handleClose: () => void;
  onSubmit?: (values: AddTransactionFormValues) => Promise<void> | void;
};

const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const validationSchema = (t: KeyLanguage): Yup.ObjectSchema<AddTransactionFormValues> =>
  Yup.object().shape({
    type: Yup.string()
      .oneOf<"OUT" | "IN">(["OUT", "IN"])
      .required(),
    amount: Yup.string()
      .required(t("amountRequired"))
      .test("is-positive-number", t("amountPositive"), (value: string | undefined): boolean => {
        if (!value) return false;
        const numeric = Number(value.replace(/[^0-9]/g, ""));
        return !isNaN(numeric) && numeric > 0;
      }),
    category: Yup.string().required(t("categoryRequired")),
    description: Yup.string().required(t("descriptionRequired")),
    date: Yup.string().required(),
  });

type CategoryPickerProps = {
  open: boolean;
  selectedCategory: string;
  categories: readonly string[];
  onSelect: (category: string) => void;
  onClose: () => void;
  title: string;
  searchPlaceholder: string;
};

const CategoryPickerModal = ({
  open,
  selectedCategory,
  categories,
  onSelect,
  onClose,
  title,
  searchPlaceholder,
}: CategoryPickerProps): React.JSX.Element | null => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredCategories = useMemo<string[]>(() => {
    if (!searchQuery.trim()) {
      return [...categories];
    }
    return categories.filter((cat: string): boolean =>
      cat.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );
  }, [categories, searchQuery]);

  if (!open) return null;

  return (
    <Modal
      animationType="fade"
      visible={open}
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={onClose}
        className="flex-1 justify-center items-center bg-black/50 px-6"
      >
        <Pressable
          onPress={(e): void => e.stopPropagation()}
          className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl max-h-[80%]"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <Text className="text-lg font-bold text-[#1E293B]">{title}</Text>
            <Pressable
              onPress={onClose}
              className="p-1.5 rounded-full active:bg-gray-100"
            >
              <X size={20} color="#64748B" />
            </Pressable>
          </View>

          {/* Search bar */}
          <View className="flex-row items-center bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2 mb-3">
            <Search size={16} color="#94A3B8" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={searchPlaceholder}
              placeholderTextColor="#94A3B8"
              className="flex-1 ml-2 text-sm text-[#1E293B] p-0"
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={(): void => setSearchQuery("")}>
                <X size={16} color="#94A3B8" />
              </Pressable>
            )}
          </View>

          {/* Category List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="w-full"
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {filteredCategories.map((item: string): React.JSX.Element => {
              const isSelected = selectedCategory === item;
              const color = getCategoryColor(item);
              return (
                <Pressable
                  key={item}
                  onPress={(): void => {
                    onSelect(item);
                    onClose();
                  }}
                  className={`flex-row items-center justify-between p-3 rounded-xl mb-1.5 ${
                    isSelected
                      ? "bg-[#EEF3FA] border border-[#20304E]/20"
                      : "active:bg-gray-50 border border-transparent"
                  }`}
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      style={{ backgroundColor: color }}
                      className="w-3.5 h-3.5 rounded-full"
                    />
                    <Text
                      className={`text-sm ${
                        isSelected
                          ? "font-bold text-[#20304E]"
                          : "font-medium text-[#334155]"
                      }`}
                    >
                      {item}
                    </Text>
                  </View>
                  {isSelected && <Check size={18} color="#20304E" />}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

type DatePickerModalProps = {
  open: boolean;
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
  title: string;
};

const DatePickerModal = ({
  open,
  selectedDate,
  onSelect,
  onClose,
  title,
}: DatePickerModalProps): React.JSX.Element | null => {
  const today = getTodayDateString();

  if (!open) return null;

  const handleDayPress = (day: DateData): void => {
    if (day.dateString <= today) {
      onSelect(day.dateString);
      onClose();
    }
  };

  return (
    <Modal
      animationType="fade"
      visible={open}
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={onClose}
        className="flex-1 justify-center items-center bg-black/50 px-6"
      >
        <Pressable
          onPress={(e): void => e.stopPropagation()}
          className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <View className="flex-row items-center gap-2">
              <CalendarIcon size={20} color="#20304E" />
              <Text className="text-lg font-bold text-[#1E293B]">{title}</Text>
            </View>
            <Pressable
              onPress={onClose}
              className="p-1.5 rounded-full active:bg-gray-100"
            >
              <X size={20} color="#64748B" />
            </Pressable>
          </View>

          {/* Calendar with maxDate set to today */}
          <Calendar
            current={selectedDate || today}
            maxDate={today}
            markedDates={{
              [selectedDate || today]: {
                selected: true,
                selectedColor: "#20304E",
                textColor: "#FFFFFF",
              },
            }}
            onDayPress={handleDayPress}
            theme={{
              todayTextColor: "#20304E",
              arrowColor: "#20304E",
              monthTextColor: "#20304E",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "600",
              textDayFontSize: 14,
              textMonthFontSize: 16,
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

type ModalContentProps = {
  onClose: () => void;
  onSubmit?: (values: AddTransactionFormValues) => Promise<void> | void;
};

const AddTransactionModalContent = ({
  onClose,
  onSubmit,
}: ModalContentProps): React.JSX.Element => {
  const { t } = useLanguageStore();
  const [showCategoryPicker, setShowCategoryPicker] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isAutoCategory, setIsAutoCategory] = useState<boolean>(true);

  const initialValues: AddTransactionFormValues = {
    type: "OUT",
    amount: "",
    category: "",
    description: "",
    date: getTodayDateString(),
  };

  const formik = useFormik<AddTransactionFormValues>({
    initialValues,
    validationSchema: validationSchema(t),
    onSubmit: async (
      values: AddTransactionFormValues,
      { resetForm, setSubmitting },
    ): Promise<void> => {
      try {
        if (onSubmit) {
          await onSubmit(values);
        }
        resetForm();
        onClose();
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldTouched,
  } = formik;

  const availableCategories =
    values.type === "IN"
      ? BUDGET_CATEGORIES_INCOME
      : BUDGET_CATEGORIES_EXPENSE;

  // Debounced auto category prediction based on description keywords
  useEffect(() => {
    if (!isAutoCategory) return;
    const desc = values.description.trim();
    if (!desc) return;

    const timer = setTimeout(() => {
      const matched = predictCategory(desc, values.type);
      if (matched && matched !== values.category) {
        setFieldValue("category", matched);
        setFieldTouched("category", true, false);
      }
    }, 450);

    return (): void => {
      clearTimeout(timer);
    };
  }, [
    values.description,
    values.type,
    values.category,
    isAutoCategory,
    setFieldValue,
    setFieldTouched,
  ]);

  const handleTypeChange = (type: "OUT" | "IN"): void => {
    setFieldValue("type", type);
    setFieldValue("category", "");

    // If auto-category is on, re-evaluate prediction for new type
    if (isAutoCategory && values.description.trim()) {
      const matched = predictCategory(values.description.trim(), type);
      if (matched) {
        setFieldValue("category", matched);
      }
    }
  };

  const handleCategorySelect = (category: string): void => {
    setFieldValue("category", category);
    setFieldTouched("category", true, false);
  };

  const handleDateSelect = (date: string): void => {
    setFieldValue("date", date);
    setFieldTouched("date", true, false);
  };

  const handleAmountChange = (text: string): void => {
    const cleanNumbers = text.replace(/[^0-9]/g, "");
    setFieldValue("amount", cleanNumbers);
  };

  const handleToggleAutoCategory = (value: boolean): void => {
    setIsAutoCategory(value);
    if (value && values.description.trim()) {
      const matched = predictCategory(
        values.description.trim(),
        values.type,
      );
      if (matched) {
        setFieldValue("category", matched);
        setFieldTouched("category", true, false);
      }
    }
  };

  const formattedDisplayAmount = useMemo<string>(() => {
    if (!values.amount) return "";
    const num = Number(values.amount);
    if (isNaN(num)) return values.amount;
    return num.toLocaleString("id-ID");
  }, [values.amount]);

  const selectedCategoryColor = values.category
    ? getCategoryColor(values.category)
    : null;

  return (
    <Pressable
      onPress={(e): void => e.stopPropagation()}
      className="flex w-full max-w-sm bg-[#FFFFFF] shadow-xl rounded-3xl p-5"
    >
      {/* Header */}
      <View className="flex-row w-full justify-between items-center pb-3 border-b border-gray-100 mb-4">
        <View className="flex-row items-center gap-2">
          <PlusCircle size={20} color="#20304E" />
          <Text className="text-lg font-bold text-[#1E293B]">
            {t("addTransactionTitle")}
          </Text>
        </View>
        <Pressable
          onPress={onClose}
          className="p-1.5 rounded-full active:bg-gray-100"
        >
          <X size={20} color="#64748B" />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 4 }}
      >
        {/* Type Switcher: Income / Outcome Button Group */}
        <View className="flex-row w-full bg-[#EEF3FA] p-1.5 rounded-xl mb-4">
          <Pressable
            onPress={(): void => handleTypeChange("OUT")}
            className={`flex-1 py-2.5 flex-row items-center justify-center gap-1.5 rounded-lg ${
              values.type === "OUT" ? "bg-[#20304E]" : "bg-transparent"
            }`}
          >
            <ArrowUpRight
              size={16}
              color={values.type === "OUT" ? "#FFFFFF" : "#64748B"}
            />
            <Text
              className={`text-center text-sm font-semibold ${
                values.type === "OUT"
                  ? "text-[#FFFFFF]"
                  : "text-[#1E293B]"
              }`}
            >
              {t("outcome")}
            </Text>
          </Pressable>

          <Pressable
            onPress={(): void => handleTypeChange("IN")}
            className={`flex-1 py-2.5 flex-row items-center justify-center gap-1.5 rounded-lg ${
              values.type === "IN" ? "bg-[#20304E]" : "bg-transparent"
            }`}
          >
            <ArrowDownLeft
              size={16}
              color={values.type === "IN" ? "#FFFFFF" : "#64748B"}
            />
            <Text
              className={`text-center text-sm font-semibold ${
                values.type === "IN"
                  ? "text-[#FFFFFF]"
                  : "text-[#1E293B]"
              }`}
            >
              {t("income")}
            </Text>
          </Pressable>
        </View>

        {/* Amount Input */}
        <View className="mb-3.5">
          <Text className="text-xs font-semibold text-gray-500 mb-1.5">
            {t("amount")}
          </Text>
          <View
            className={`flex-row items-center bg-[#F8FAFC] border rounded-xl px-3 py-2.5 ${
              touched.amount && errors.amount
                ? "border-red-400"
                : "border-gray-200"
            }`}
          >
            <Text className="text-sm font-bold text-[#20304E] mr-2">Rp</Text>
            <TextInput
              value={formattedDisplayAmount}
              onChangeText={handleAmountChange}
              onBlur={handleBlur("amount")}
              placeholder={t("amountPlaceholder")}
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              className="flex-1 text-sm font-semibold text-[#1E293B] p-0"
            />
          </View>
          {touched.amount && errors.amount ? (
            <Text className="text-xs text-red-500 mt-1">
              {errors.amount}
            </Text>
          ) : null}
        </View>

        {/* Description Input */}
        <View className="mb-3.5">
          <Text className="text-xs font-semibold text-gray-500 mb-1.5">
            {t("description")}
          </Text>
          <View
            className={`flex-row items-center bg-[#F8FAFC] border rounded-xl px-3 py-2.5 ${
              touched.description && errors.description
                ? "border-red-400"
                : "border-gray-200"
            }`}
          >
            <TextInput
              value={values.description}
              onChangeText={handleChange("description")}
              onBlur={handleBlur("description")}
              placeholder={t("descriptionPlaceholder")}
              placeholderTextColor="#94A3B8"
              className="flex-1 text-sm text-[#1E293B] p-0"
            />
          </View>
          {touched.description && errors.description ? (
            <Text className="text-xs text-red-500 mt-1">
              {errors.description}
            </Text>
          ) : null}
        </View>

        {/* Auto Category Switch */}
        <View className="flex-row items-center justify-between bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 mb-3.5">
          <View className="flex-row items-center gap-2.5 flex-1 pr-2">
            <View className="p-1.5 rounded-lg bg-[#EEF3FA]">
              <Sparkles
                size={16}
                color={isAutoCategory ? "#20304E" : "#94A3B8"}
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-[#1E293B]">
                {t("autoCategory")}
              </Text>
              <Text
                className="text-[11px] text-gray-400"
                numberOfLines={1}
              >
                {t("autoCategoryDesc")}
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: "#E2E8F0", true: "#20304E" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E2E8F0"
            value={isAutoCategory}
            onValueChange={handleToggleAutoCategory}
          />
        </View>

        {/* Category Dropdown Trigger */}
        <View className="mb-3.5">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs font-semibold text-gray-500">
              {t("category")}
            </Text>
            {isAutoCategory && values.category && (
              <View className="flex-row items-center gap-1 bg-[#EEF3FA] px-1.5 py-0.5 rounded-md">
                <Sparkles size={10} color="#20304E" />
                <Text className="text-[10px] font-semibold text-[#20304E]">
                  Auto
                </Text>
              </View>
            )}
          </View>
          <Pressable
            onPress={(): void => setShowCategoryPicker(true)}
            className={`flex-row items-center justify-between bg-[#F8FAFC] border rounded-xl px-3 py-2.5 ${
              touched.category && errors.category
                ? "border-red-400"
                : "border-gray-200"
            }`}
          >
            <View className="flex-row items-center gap-2 flex-1">
              {selectedCategoryColor && (
                <View
                  style={{ backgroundColor: selectedCategoryColor }}
                  className="w-3 h-3 rounded-full"
                />
              )}
              <Text
                className={`text-sm ${
                  values.category
                    ? "font-semibold text-[#1E293B]"
                    : "text-gray-400"
                }`}
                numberOfLines={1}
              >
                {values.category || t("selectCategory")}
              </Text>
            </View>
            <ChevronDown size={18} color="#64748B" />
          </Pressable>
          {touched.category && errors.category ? (
            <Text className="text-xs text-red-500 mt-1">
              {errors.category}
            </Text>
          ) : null}
        </View>

        {/* Date Field Trigger */}
        <View className="mb-4">
          <Text className="text-xs font-semibold text-gray-500 mb-1.5">
            {t("date")}
          </Text>
          <Pressable
            onPress={(): void => setShowDatePicker(true)}
            className="flex-row items-center justify-between bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2.5 active:bg-gray-100"
          >
            <View className="flex-row items-center gap-2">
              <CalendarIcon size={16} color="#20304E" />
              <Text className="text-sm font-semibold text-[#1E293B]">
                {values.date}
              </Text>
            </View>
            <ChevronDown size={18} color="#64748B" />
          </Pressable>
        </View>
      </ScrollView>

      {/* Actions */}
      <View className="flex-row items-center justify-end gap-2 pt-3 border-t border-gray-100">
        <Pressable
          onPress={(): void => {
            resetForm();
            onClose();
          }}
          className="px-4 py-2.5 rounded-xl bg-gray-100 active:bg-gray-200"
        >
          <Text className="text-sm font-semibold text-gray-600">
            {t("cancel")}
          </Text>
        </Pressable>

        <Pressable
          onPress={(): void => handleSubmit()}
          disabled={isSubmitting}
          className={`px-5 py-2.5 rounded-xl flex-row items-center justify-center ${
            isSubmitting
              ? "bg-[#20304E]/70"
              : "bg-[#20304E] active:bg-[#162238]"
          }`}
        >
          <Text className="text-sm font-bold text-white">
            {isSubmitting ? t("commonLoading") : t("save")}
          </Text>
        </Pressable>
      </View>

      {/* Category Picker Sub-Modal */}
      <CategoryPickerModal
        open={showCategoryPicker}
        selectedCategory={values.category}
        categories={availableCategories}
        onSelect={handleCategorySelect}
        onClose={(): void => setShowCategoryPicker(false)}
        title={t("selectCategory")}
        searchPlaceholder={t("searchCategory")}
      />

      {/* Date Picker Sub-Modal (Max date: Today) */}
      <DatePickerModal
        open={showDatePicker}
        selectedDate={values.date}
        onSelect={handleDateSelect}
        onClose={(): void => setShowDatePicker(false)}
        title={t("selectDate")}
      />
    </Pressable>
  );
};

const AddTransactionModal = ({
  open,
  handleClose,
  onSubmit,
}: AddTransactionModalProps): React.JSX.Element => {
  return (
    <Modal
      animationType="fade"
      visible={open}
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={handleClose}
        className="flex-1 justify-center items-center"
      >
        <BlurView
          blurMethod="none"
          tint="systemChromeMaterialDark"
          intensity={100}
          className="flex-1 w-full justify-center items-center px-6"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="w-full items-center justify-center"
          >
            {open && (
              <AddTransactionModalContent
                onClose={handleClose}
                onSubmit={onSubmit}
              />
            )}
          </KeyboardAvoidingView>
        </BlurView>
      </Pressable>
    </Modal>
  );
};

export default AddTransactionModal;
