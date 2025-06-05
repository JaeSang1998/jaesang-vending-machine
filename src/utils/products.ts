import { Coin } from "@/types/coin";

export const INITIAL_CASH: Record<Coin, number> = {
  100: 30,
  500: 20,
  1000: 10,
  5000: 5,
  10000: 5,
};

export const CARD_TIMEOUT_DURATION = 10000;
