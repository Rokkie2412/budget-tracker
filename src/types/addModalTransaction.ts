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
};

export type CategoryPickerProps = {
  open: boolean;
  selectedCategory: string;
  categories: readonly string[];
  onSelect: (category: string) => void;
  onClose: () => void;
  title: string;
  searchPlaceholder: string;
};

export type DatePickerModalProps = {
  open: boolean;
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
  title: string;
};

export type ModalContentProps = {
  onClose: () => void;
  onSubmit?: (values: AddTransactionFormValues) => Promise<void> | void;
};
