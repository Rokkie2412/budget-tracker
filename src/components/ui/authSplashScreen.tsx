import { Wallet } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";

export default function AuthSplashScreen(): React.JSX.Element {
  return (
    <View className="flex-1 bg-slate-50 justify-center items-center p-6 gap-8">
      {/* Logo Badge */}
      <View className="items-center gap-4">
        <View className="w-20 h-20 bg-blue-600 rounded-3xl justify-center items-center shadow-lg shadow-blue-500/30">
          <Wallet size={40} color="#ffffff" />
        </View>
        <Text className="text-2xl font-bold text-slate-900 tracking-tight">Budget Tracker</Text>
      </View>

      {/* Loading Indicator */}
      <View className="items-center gap-2">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-xs font-medium text-slate-400">Memeriksa sesi pengguna...</Text>
      </View>
    </View>
  );
}
