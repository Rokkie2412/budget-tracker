import { type ReactElement, useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { BlurView } from "expo-blur";
import { Calendar as CalendarIcon, X } from "lucide-react-native";

import { useLanguageStore } from "@/stores/languageStore";
import type { Setter } from "@/types";

type Props = {
  open: boolean;
  setOpen: Setter<boolean>;
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  onApply?: (startDate: string, endDate: string) => void;
};

type MarkedDay = {
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
  textColor?: string;
  selected?: boolean;
};

type MarkedDates = Record<string, MarkedDay>;

const addDays = (dateStr: string, days: number): string => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(Date.UTC(year, month - 1, day + days));
  return d.toISOString().split("T")[0];
};

const buildMarkedDates = (
  startDate: string | null,
  endDate: string | null,
): MarkedDates => {
  if (!startDate) return {};

  if (!endDate || startDate === endDate) {
    return {
      [startDate]: {
        startingDay: true,
        endingDay: true,
        color: "#20304E",
        textColor: "#FFFFFF",
      },
    };
  }

  const marked: MarkedDates = {};
  let current = startDate;

  while (current <= endDate) {
    if (current === startDate) {
      marked[current] = {
        startingDay: true,
        color: "#20304E",
        textColor: "#FFFFFF",
      };
    } else if (current === endDate) {
      marked[current] = {
        endingDay: true,
        color: "#20304E",
        textColor: "#FFFFFF",
      };
    } else {
      marked[current] = {
        color: "#EEF3FA",
        textColor: "#20304E",
      };
    }
    current = addDays(current, 1);
  }

  return marked;
};

type ModalContentProps = {
  initialStartDate: string | null;
  initialEndDate: string | null;
  onClose: () => void;
  onApply?: (startDate: string, endDate: string) => void;
};

const CustomDateModalContent = ({
  initialStartDate,
  initialEndDate,
  onClose,
  onApply,
}: ModalContentProps): ReactElement => {
  const { t } = useLanguageStore();
  const [startDate, setStartDate] = useState<string | null>(initialStartDate);
  const [endDate, setEndDate] = useState<string | null>(initialEndDate);

  const handleDayPress = (day: DateData): void => {
    const selected = day.dateString;

    if (!startDate || (startDate && endDate)) {
      setStartDate(selected);
      setEndDate(null);
    } else {
      if (selected < startDate) {
        setStartDate(selected);
        setEndDate(null);
      } else {
        setEndDate(selected);
      }
    }
  };

  const handleReset = (): void => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleApply = (): void => {
    if (!startDate) return;
    const finalEnd = endDate || startDate;
    onApply?.(startDate, finalEnd);
    onClose();
  };

  const markedDates = useMemo<MarkedDates>(() => {
    return buildMarkedDates(startDate, endDate);
  }, [startDate, endDate]);

  return (
    <Pressable
      onPress={(e): void => e.stopPropagation()}
      className="flex w-full max-w-sm bg-[#FFFFFF] shadow-xl rounded-3xl p-5"
    >
      {/* Header */}
      <View className="flex flex-row w-full justify-between items-center pb-3 border-b border-gray-100 mb-3">
        <View className="flex-row items-center gap-2">
          <CalendarIcon size={20} color="#20304E" />
          <Text className="text-lg font-bold text-[#1E293B]">
            {t("customDateFilterTitle")}
          </Text>
        </View>
        <Pressable
          onPress={onClose}
          className="p-1.5 rounded-full active:bg-gray-100"
        >
          <X size={20} color="#64748B" />
        </Pressable>
      </View>

      {/* Date Range Badges Preview */}
      <View className="flex-row items-center justify-between gap-2 mb-3 bg-[#F8FAFC] p-2.5 rounded-xl border border-gray-100">
        <View className="flex-1">
          <Text className="text-xs text-gray-500 font-medium">
            {t("startCustomDateFilter")}
          </Text>
          <Text className="text-sm font-semibold text-[#1E293B]">
            {startDate || "-"}
          </Text>
        </View>
        <Text className="text-gray-400 font-bold">→</Text>
        <View className="flex-1 items-end">
          <Text className="text-xs text-gray-500 font-medium">
            {t("endCustomDateFilter")}
          </Text>
          <Text className="text-sm font-semibold text-[#1E293B]">
            {endDate || (startDate ? startDate : "-")}
          </Text>
        </View>
      </View>

      {/* Calendar with Period Range Selection */}
      <Calendar
        firstDay={0}
        markingType="period"
        markedDates={markedDates}
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

      {/* Actions */}
      <View className="flex-row items-center justify-end gap-2 pt-3 border-t border-gray-100 mt-2">
        <Pressable
          onPress={handleReset}
          className="px-4 py-2.5 rounded-xl bg-gray-100 active:bg-gray-200"
        >
          <Text className="text-sm font-semibold text-gray-600">
            {t("reset")}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleApply}
          disabled={!startDate}
          className={`px-5 py-2.5 rounded-xl flex-row items-center justify-center ${
            startDate
              ? "bg-[#20304E] active:bg-[#162238]"
              : "bg-gray-200 opacity-60"
          }`}
        >
          <Text
            className={`text-sm font-bold ${
              startDate ? "text-white" : "text-gray-400"
            }`}
          >
            {t("apply")}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};

const CustomDateModal = ({
  open,
  setOpen,
  initialStartDate = null,
  initialEndDate = null,
  onApply,
}: Props): ReactElement => {
  const handleClose = (): void => {
    setOpen(false);
  };

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
          {open && (
            <CustomDateModalContent
              initialStartDate={initialStartDate}
              initialEndDate={initialEndDate}
              onClose={handleClose}
              onApply={onApply}
            />
          )}
        </BlurView>
      </Pressable>
    </Modal>
  );
};

export default CustomDateModal;
