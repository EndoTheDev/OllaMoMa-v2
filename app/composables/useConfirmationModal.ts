interface ConfirmationModalOptions {
  initialValue?: string;
  validateInput?: (value: string) => string | undefined;
  onConfirm: (value?: string) => void;
  onCancel?: () => void;
}

export function useConfirmationModal(options: ConfirmationModalOptions) {
  const isOpen = ref(true);
  const inputValue = ref(options.initialValue || "");
  const error = ref("");

  // Reset form when modal opens
  watch(
    () => isOpen.value,
    (newValue) => {
      if (newValue) {
        inputValue.value = options.initialValue || "";
        error.value = "";
      }
    }
  );

  function handleCancel() {
    inputValue.value = options.initialValue || "";
    error.value = "";
    isOpen.value = false;
    options.onCancel?.();
  }

  function handleConfirm() {
    if (options.validateInput) {
      const validationError = options.validateInput(inputValue.value);
      if (validationError) {
        error.value = validationError;
        return;
      }
    }

    options.onConfirm(inputValue.value);
    isOpen.value = false;
  }

  return {
    isOpen,
    inputValue,
    error,
    handleCancel,
    handleConfirm,
  };
}
