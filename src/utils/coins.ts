import { Coin } from "@/types/coin";

export const COINS: { value: Coin; label: string }[] = [
  { value: 100, label: "100원" },
  { value: 500, label: "500원" },
  { value: 1000, label: "1,000원" },
  { value: 5000, label: "5,000원" },
  { value: 10000, label: "10,000원" },
] as const;
