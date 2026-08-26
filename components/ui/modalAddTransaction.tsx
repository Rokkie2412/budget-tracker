import { useLanguageStore } from "@/stores/languageStore"
import { BlurView } from "expo-blur"
import { X } from "lucide-react-native"
import { Modal, Pressable, Text, View } from "react-native"

type AddTransactionModalProps = {
  open: boolean,
  handleClose: () => void
}

const AddTransactionModal = ({
  open,
  handleClose
}: AddTransactionModalProps) => {
  const {t} = useLanguageStore()
  return (
    <Modal
      animationType="fade"
      visible={open}
      transparent={true}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Pressable className="flex-1 justify-center items-center">
        <BlurView
          blurMethod="none"
          tint="systemChromeMaterialDark"
          intensity={100}
          className="flex-1 w-full justify-center items-center px-6"
        >
          <View>
            <View>
              <Text>{t('addTransactionTitle')}</Text>
              <X/>
            </View>
          </View>
        </BlurView>
      </Pressable>
    </Modal>
  )
}

export default AddTransactionModal