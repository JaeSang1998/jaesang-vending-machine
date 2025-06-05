import { Coin } from "@/types/coin";
import { INITIAL_CASH } from "@/utils/products";
import { Product } from "@/types/vending-machine";

export const initialProducts = (): Product[] =>
  [
    {
      id: "cola",
      name: "콜라",
      price: 1100,
      stock: 5,
    },
    {
      id: "water",
      name: "물",
      price: 600,
      stock: 5,
    },
    {
      id: "coffee",
      name: "커피",
      price: 700,
      stock: 5,
    },
  ] as const satisfies Product[];

export const initialCash = (): Record<Coin, number> => ({
  ...INITIAL_CASH,
});
