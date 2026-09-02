import { router } from "expo-router";
import { useFormik } from "formik";
import { Eye, EyeOff, Globe, Lock, LogIn } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import * as Yup from "yup";

import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import InputForm from "@/components/ui/inputForm";
import type { CountryCode } from "@/components/ui/inputForm/inputForm.types";
import { useAuthStore } from "@/stores/authStore";
import { useLanguageStore } from "@/stores/languageStore";
import { KeyLanguage } from "@/types";

interface FormikInitialID {
  userId: string;
  password: string;
}

const formikInitialValue: FormikInitialID = {
  userId: "",
  password: "",
};

const phoneRegex = /^(\+?62|0)?[0-9]{8,13}$/;

const loginValidationSchema = (t: KeyLanguage) =>
  Yup.object().shape({
    userId: Yup.string().required(t("userIdRequired")).matches(phoneRegex, t("invalidPhone")),
    password: Yup.string().required(t("passwordRequired")).min(6, t("passwordMinLength")),
  });

const LoginPage = (): React.JSX.Element => {
  const { t, language, setLanguage } = useLanguageStore();
  const loginStore = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");
  const [country, setCountry] = useState<CountryCode>({
    flag: "🇮🇩",
    code: "+62",
    name: "Indonesia",
    iso: "ID",
  });

  const formik = useFormik({
    initialValues: formikInitialValue,
    validationSchema: loginValidationSchema(t),
    onSubmit: async (values, { setSubmitting }): Promise<void> => {
      setServerError("");

      const formattedNumber = values.userId.trim().replace(/^0/, "");
      const fullPhoneNumber = `${country.code}${formattedNumber}`;

      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: fullPhoneNumber,
            password: values.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setServerError(data.message || t("loginFailed"));
          return;
        }

        await loginStore(data.user, data.token);
        router.replace("/(tabs)/dashboard");
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : t("loginFailed");
        setServerError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <View className="flex-1 w-full h-full bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 40,
            margin: 8,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Center Form Card */}
          <View className="bg-white h-full p-6 gap-6">
            {/* Header */}
            <View className="items-center gap-2">
              <View className="w-16 h-16 bg-[#1A2B48] rounded-2xl justify-center items-center mb-1 shadow-md">
                <LogIn size={32} color="#ffffff" />
              </View>
              <Text className="text-2xl font-bold text-slate-900">{t("welcome")}</Text>
              <Text className="text-center text-slate-500 text-sm px-2">{t("welcomeSubs")}</Text>
            </View>

            <View className="absolute right-4 top-24">
              <Pressable
                onPress={(): Promise<void> => setLanguage(language === "id" ? "en" : "id")}
                className="flex-row items-center gap-1.5 px-3 py-1.5 bg-slate-200 rounded-full"
              >
                <Globe size={16} color="#475569" />
                <Text className="text-xs font-bold text-slate-700 uppercase">{language}</Text>
              </Pressable>
            </View>

            {/* Server Error Alert */}
            {serverError ? (
              <View className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <Text className="text-xs text-red-600 font-medium text-center">{serverError}</Text>
              </View>
            ) : null}

            {/* Form Inputs */}
            <View className="gap-4">
              <InputForm
                label={t("userId")}
                placeholder={t("userIdPlaceholderInput")}
                value={formik.values.userId}
                onChangeText={formik.handleChange("userId")}
                onBlur={formik.handleBlur("userId")}
                error={
                  formik.touched.userId && formik.errors.userId ? formik.errors.userId : undefined
                }
                keyboardType="phone-pad"
                showNumberDropdown
                selectedCountry={country}
                onSelectCountry={(selected: CountryCode): void => setCountry(selected)}
                isRequired
              />

              <InputForm
                label={t("password")}
                placeholder={t("passwordPlaceholderInput")}
                type={showPassword ? "text" : "password"}
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                error={
                  formik.touched.password && formik.errors.password
                    ? formik.errors.password
                    : undefined
                }
                leftIcon={<Lock size={18} color="#94a3b8" className="mr-2" />}
                rightIcon={
                  <Pressable onPress={(): void => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff size={18} color="#94a3b8" />
                    ) : (
                      <Eye size={18} color="#94a3b8" />
                    )}
                  </Pressable>
                }
                isRequired
              />

              <Button
                onPress={(): void => formik.handleSubmit()}
                isDisabled={formik.isSubmitting}
                className="mt-2 py-3.5 rounded-xl bg-[#1A2B48] active:bg-[#142437] shadow-sm"
              >
                {formik.isSubmitting ? <ButtonSpinner className="mr-2" /> : null}
                <ButtonText className="text-white font-semibold text-base">{t("login")}</ButtonText>
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer Version */}
      <Text className="text-center text-xs text-slate-400 font-medium mb-8">
        Budget Tracker v1.0
      </Text>
    </View>
  );
};

export default LoginPage;
