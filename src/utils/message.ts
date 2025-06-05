import { VendingMessage, MessageVariant } from "@/types/vending-machine";

export const createMessage = (
  text: string,
  variant: MessageVariant
): VendingMessage => ({
  text,
  variant,
});
