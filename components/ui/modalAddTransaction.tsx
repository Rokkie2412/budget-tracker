import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
  AlertCircle,
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
import { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import * as Yup from "yup";

import {
  BUDGET_CATEGORIES_EXPENSE,
  BUDGET_CATEGORIES_INCOME,
  getCategoryColor,
  predictCategory,
} from "@/constants";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores/languageStore";
import type {
  AddTransactionFormValues,
  AddTransactionModalProps,
  CategoryPickerProps,
  DatePickerModalProps,
  KeyLanguage,
  ModalContentProps,
} from "@/types";
import type { AddTransactionPayload } from "@/types/transactions";

const postAddTransactionUrl = "/api/addTransaction";

const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const validationSchema = (t: KeyLanguage): Yup.ObjectSchema<AddTransactionFormValues> =>
  Yup.object().shape({
    type: Yup.string().oneOf<"OUT" | "IN">(["OUT", "IN"]).required(),
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
      <Pressable onPress={onClose} className="flex-1 justify-center items-center bg-black/50 px-6">
        <Pressable
          onPress={(e): void => e.stopPropagation()}
          className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl max-h-[80%]"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between pb-3 border-b border-gray-100 mb-3">
            <Text className="text-lg font-bold text-[#1E293B]">{title}</Text>
            <Pressable onPress={onClose} className="p-1.5 rounded-full active:bg-gray-100">
              <X size={20} color="#64748B" />
            </Pressable>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2 mb-3">
            <Search size={16} color="#94A3B8" />
            <TextInput
              placeholder={searchPlaceholder}
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-sm text-[#1E293B] p-0"
              autoFocus
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={(): void => setSearchQuery("")}>
                <X size={14} color="#94A3B8" />
              </Pressable>
            )}
          </View>

          {/* Category List */}
          <ScrollView showsVerticalScrollIndicator={false} className="max-h-72">
            <View className="gap-1.5">
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
                    className={`flex-row items-center justify-between px-3.5 py-3 rounded-xl active:bg-gray-50 ${
                      isSelected ? "bg-[#EEF3FA] border border-[#20304E]/20" : ""
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        style={{ backgroundColor: color }}
                        className="w-3.5 h-3.5 rounded-full"
                      />
                      <Text
                        className={`text-sm ${
                          isSelected ? "font-bold text-[#20304E]" : "font-medium text-[#334155]"
                        }`}
                      >
                        {item}
                      </Text>
                    </View>
                    {isSelected && <Check size={18} color="#20304E" />}
                  </Pressable>
                );
              })}
              {filteredCategories.length === 0 && (
                <View className="py-8 items-center">
                  <Text className="text-sm text-gray-400">Tidak ada kategori ditemukan</Text>
                </View>
              )}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const DatePickerModal = ({
  open,
  selectedDate,
  onSelect,
  onClose,
  title,
}: DatePickerModalProps): React.JSX.Element | null => {
  const maxDate = getTodayDateString();

  if (!open) return null;

  return (
    <Modal
      animationType="fade"
      visible={open}
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable onPress={onClose} className="flex-1 justify-center items-center bg-black/50 px-6">
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
            <Pressable onPress={onClose} className="p-1.5 rounded-full active:bg-gray-100">
              <X size={20} color="#64748B" />
            </Pressable>
          </View>

          {/* Calendar Picker (cannot select dates after today) */}
          <Calendar
            current={selectedDate}
            maxDate={maxDate}
            onDayPress={(day: DateData): void => {
              onSelect(day.dateString);
              onClose();
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: "#20304E",
                selectedTextColor: "#FFFFFF",
              },
            }}
            theme={{
              todayTextColor: "#20304E",
              arrowColor: "#20304E",
              textDayFontWeight: "500",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "600",
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const AddTransactionModalContent = ({
  onClose,
  onSubmit,
}: ModalContentProps): React.JSX.Element => {
  const { t } = useLanguageStore();
  const [showCategoryPicker, setShowCategoryPicker] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isAutoCategory, setIsAutoCategory] = useState<boolean>(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
        setSubmitError(null);
        if (onSubmit) {
          await onSubmit(values);
        }
        resetForm();
        onClose();
      } catch (err: unknown) {
        const errorMsg =
          err instanceof Error ? err.message : "Terjadi kesalahan saat menambahkan transaksi.";
        setSubmitError(errorMsg);
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
    values.type === "IN" ? BUDGET_CATEGORIES_INCOME : BUDGET_CATEGORIES_EXPENSE;

  // Debounced auto category prediction based on description keywords
  useEffect(() => {
    if (!isAutoCategory) return;

    const trimmedDesc = values.description.trim();
    if (!trimmedDesc) return;

    const timeoutId = setTimeout(() => {
      const predicted = predictCategory(trimmedDesc, values.type);
      if (predicted) {
        setFieldValue("category", predicted);
        setFieldTouched("category", true, false);
      }
    }, 300);

    return (): void => clearTimeout(timeoutId);
  }, [values.description, values.type, isAutoCategory, setFieldValue, setFieldTouched]);

  const handleTypeChange = (newType: "OUT" | "IN"): void => {
    setFieldValue("type", newType);
    const validCategories: readonly string[] =
      newType === "IN" ? BUDGET_CATEGORIES_INCOME : BUDGET_CATEGORIES_EXPENSE;

    if (values.category && !validCategories.includes(values.category)) {
      if (isAutoCategory && values.description.trim()) {
        const matched = predictCategory(values.description.trim(), newType);
        setFieldValue("category", matched ?? "");
      } else {
        setFieldValue("category", "");
      }
    }
  };

  const handleAmountChange = (text: string): void => {
    const rawNumber = text.replace(/[^0-9]/g, "");
    setFieldValue("amount", rawNumber);
  };

  const handleCategorySelect = (cat: string): void => {
    setFieldValue("category", cat);
    setFieldTouched("category", true, true);
  };

  const handleDateSelect = (dateStr: string): void => {
    setFieldValue("date", dateStr);
    setFieldTouched("date", true, true);
  };

  const handleToggleAutoCategory = (value: boolean): void => {
    setIsAutoCategory(value);
    if (value && values.description.trim()) {
      const matched = predictCategory(values.description.trim(), values.type);
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

  const selectedCategoryColor = values.category ? getCategoryColor(values.category) : null;

  return (
    <Pressable
      onPress={(e): void => e.stopPropagation()}
      className="w-full bg-white rounded-3xl p-5 shadow-2xl max-h-[90%]"
    >
      {/* Modal Header */}
      <View className="flex-row w-full justify-between items-center pb-3 border-b border-gray-100 mb-4">
        <View className="flex-row items-center gap-2">
          <PlusCircle size={20} color="#20304E" />
          <Text className="text-lg font-bold text-[#1E293B]">{t("addTransactionTitle")}</Text>
        </View>
        <Pressable
          onPress={(): void => {
            resetForm();
            setSubmitError(null);
            onClose();
          }}
          className="p-1.5 rounded-full active:bg-gray-100"
        >
          <X size={20} color="#64748B" />
        </Pressable>
      </View>

      {/* Error Alert Banner */}
      {submitError && (
        <View className="flex-row items-center justify-between bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
          <View className="flex-row items-center gap-2 flex-1 mr-2">
            <AlertCircle size={18} color="#DC2626" />
            <Text className="text-xs text-red-600 font-medium flex-1">{submitError}</Text>
          </View>
          <Pressable onPress={(): void => setSubmitError(null)} className="p-1">
            <X size={14} color="#DC2626" />
          </Pressable>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4 }}>
        {/* Type Switcher: Income / Outcome Button Group */}
        <View className="flex-row w-full bg-[#EEF3FA] p-1.5 rounded-xl mb-4">
          <Pressable
            onPress={(): void => handleTypeChange("OUT")}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg gap-1.5 ${
              values.type === "OUT" ? "bg-[#20304E]" : "bg-transparent"
            }`}
          >
            <ArrowUpRight size={16} color={values.type === "OUT" ? "#FFFFFF" : "#64748B"} />
            <Text
              className={`text-center text-sm font-semibold ${
                values.type === "OUT" ? "text-[#FFFFFF]" : "text-[#1E293B]"
              }`}
            >
              {t("outcome")}
            </Text>
          </Pressable>

          <Pressable
            onPress={(): void => handleTypeChange("IN")}
            className={`flex-1 flex-row items-center justify-center py-2.5 rounded-lg gap-1.5 ${
              values.type === "IN" ? "bg-[#20304E]" : "bg-transparent"
            }`}
          >
            <ArrowDownLeft size={16} color={values.type === "IN" ? "#FFFFFF" : "#64748B"} />
            <Text
              className={`text-center text-sm font-semibold ${
                values.type === "IN" ? "text-[#FFFFFF]" : "text-[#1E293B]"
              }`}
            >
              {t("income")}
            </Text>
          </Pressable>
        </View>

        {/* Amount Input */}
        <View className="mb-3.5">
          <Text className="text-xs font-semibold text-gray-500 mb-1.5">{t("amount")}</Text>
          <View
            className={`flex-row items-center bg-[#F8FAFC] border rounded-xl px-3 py-2.5 ${
              touched.amount && errors.amount ? "border-red-400" : "border-gray-200"
            }`}
          >
            <Text className="text-sm font-bold text-[#20304E] mr-2">Rp</Text>
            <TextInput
              keyboardType="numeric"
              placeholder={t("amountPlaceholder")}
              placeholderTextColor="#94A3B8"
              value={formattedDisplayAmount}
              onChangeText={handleAmountChange}
              onBlur={handleBlur("amount")}
              className="flex-1 text-sm font-semibold text-[#1E293B] p-0"
            />
          </View>
          {touched.amount && errors.amount ? (
            <Text className="text-xs text-red-500 mt-1">{errors.amount}</Text>
          ) : null}
        </View>

        {/* Description Input */}
        <View className="mb-3.5">
          <Text className="text-xs font-semibold text-gray-500 mb-1.5">{t("description")}</Text>
          <View
            className={`flex-row items-center bg-[#F8FAFC] border rounded-xl px-3 py-2.5 ${
              touched.description && errors.description ? "border-red-400" : "border-gray-200"
            }`}
          >
            <TextInput
              placeholder={t("descriptionPlaceholder")}
              placeholderTextColor="#94A3B8"
              value={values.description}
              onChangeText={handleChange("description")}
              onBlur={handleBlur("description")}
              className="flex-1 text-sm text-[#1E293B] p-0"
            />
          </View>
          {touched.description && errors.description ? (
            <Text className="text-xs text-red-500 mt-1">{errors.description}</Text>
          ) : null}
        </View>

        {/* Auto Category Toggle */}
        <View className="flex-row items-center justify-between bg-[#F8FAFC] border border-gray-200/80 rounded-xl px-3.5 py-2.5 mb-3.5">
          <View className="flex-row items-center gap-2.5 flex-1 pr-2">
            <View className="p-1.5 rounded-lg bg-[#EEF3FA]">
              <Sparkles size={16} color={isAutoCategory ? "#20304E" : "#94A3B8"} />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-bold text-[#1E293B]">{t("autoCategory")}</Text>
              <Text className="text-[11px] text-gray-400" numberOfLines={1}>
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

        {/* Category Trigger */}
        <View className="mb-3.5">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs font-semibold text-gray-500">{t("category")}</Text>
            {isAutoCategory && values.category && (
              <View className="flex-row items-center gap-1 bg-[#EEF3FA] px-1.5 py-0.5 rounded-md">
                <Sparkles size={10} color="#20304E" />
                <Text className="text-[10px] font-semibold text-[#20304E]">Auto</Text>
              </View>
            )}
          </View>
          <Pressable
            onPress={(): void => setShowCategoryPicker(true)}
            className={`flex-row items-center justify-between bg-[#F8FAFC] border rounded-xl px-3 py-2.5 ${
              touched.category && errors.category ? "border-red-400" : "border-gray-200"
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
                  values.category ? "font-semibold text-[#1E293B]" : "text-gray-400"
                }`}
                numberOfLines={1}
              >
                {values.category || t("selectCategory")}
              </Text>
            </View>
            <ChevronDown size={18} color="#64748B" />
          </Pressable>
          {touched.category && errors.category ? (
            <Text className="text-xs text-red-500 mt-1">{errors.category}</Text>
          ) : null}
        </View>

        {/* Date Trigger */}
        <View className="mb-4">
          <Text className="text-xs font-semibold text-gray-500 mb-1.5">{t("date")}</Text>
          <Pressable
            onPress={(): void => setShowDatePicker(true)}
            className="flex-row items-center justify-between bg-[#F8FAFC] border border-gray-200 rounded-xl px-3 py-2.5 active:bg-gray-100"
          >
            <View className="flex-row items-center gap-2">
              <CalendarIcon size={16} color="#20304E" />
              <Text className="text-sm font-semibold text-[#1E293B]">{values.date}</Text>
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
            setSubmitError(null);
            onClose();
          }}
          disabled={isSubmitting}
          className="px-4 py-2.5 rounded-xl bg-gray-100 active:bg-gray-200"
        >
          <Text className="text-sm font-semibold text-gray-600">{t("cancel")}</Text>
        </Pressable>

        <Pressable
          onPress={(): void => handleSubmit()}
          disabled={isSubmitting}
          className={`px-5 py-2.5 rounded-xl flex-row items-center justify-center gap-2 ${
            isSubmitting ? "bg-[#20304E]/70" : "bg-[#20304E] active:bg-[#162238]"
          }`}
        >
          {isSubmitting && <ActivityIndicator size="small" color="#FFFFFF" />}
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

      {/* Date Picker Sub-Modal */}
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

const postTransactionFetcher =
  (token: string | null) =>
  async (
    url: string,
    { arg }: { arg: AddTransactionPayload },
  ): Promise<{ message: string; data?: unknown }> => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(arg),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({}))) as { message?: string };
      throw new Error(errorData.message || "Failed to add transaction");
    }

    return response.json();
  };

const AddTransactionModal = ({
  open,
  handleClose,
}: AddTransactionModalProps): React.JSX.Element => {
  const { token, user } = useAuthStore();
  const { trigger: addTransactionTrigger } = useSWRMutation(
    postAddTransactionUrl,
    postTransactionFetcher(token),
  );

  const handleFormSubmit = async (values: AddTransactionFormValues): Promise<void> => {
    if (!user?.userId) {
      throw new Error("User tidak teridentifikasi. Silakan login ulang.");
    }

    await addTransactionTrigger({
      type: values.type,
      amount: Number(values.amount.replace(/[^0-9]/g, "")),
      category: values.category,
      description: values.description.trim(),
      date: values.date,
      userId: user.userId,
    });

    await mutate((key: unknown): boolean =>
      Array.isArray(key)
        ? key[0] === "get-monthly-transactions" ||
          key[0] === "get-transactions" ||
          key[0] === "get-monthly-report"
        : typeof key === "string" && key.startsWith("/api/"),
    );
  };

  return (
    <Modal
      animationType="fade"
      visible={open}
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Pressable onPress={handleClose} className="flex-1 justify-center items-center">
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
              <AddTransactionModalContent onClose={handleClose} onSubmit={handleFormSubmit} />
            )}
          </KeyboardAvoidingView>
        </BlurView>
      </Pressable>
    </Modal>
  );
};

export default AddTransactionModal;
