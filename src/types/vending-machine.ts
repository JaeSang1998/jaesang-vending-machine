import { Coin } from "@/types/coin";

export type MessageVariant = "success" | "error" | "warning" | "info";

export type VendingMessage = {
  text: string;
  variant: MessageVariant;
};

export type CardInfo = {
  balance: number;
  isConnected: boolean;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export type VendingMachineActions = {
  insertCash: (value: number) => void;
  selectProduct: (id: string) => void;
  cancel: () => void;
  insertCard: (balance: number) => void;
  disconnectCard: () => void;
};

export type VendingMachineAdminActions = {
  refillCash: (value: Coin, amount: number) => void;
  updateProductStock: (productId: string, newStock: number) => void;
};
