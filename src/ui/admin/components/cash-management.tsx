import { useState } from "react";

import { Coin } from "@/types/coin";
import { COINS } from "@/utils/coins";
import {
  useVendingAdminActions,
  useVendingStore,
} from "@/ui/@shared/hooks/use-vending-store";

export const CashManagement = () => {
  const cash = useVendingStore((state) => state.cash);
  const { refillCash } = useVendingAdminActions();

  const handleFillAllCash = () => {
    COINS.forEach(({ value }) => {
      refillCash(value, 20);
    });
  };

  return (
    <div className="bg-white p-6 border border-gray-400">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">현금고 관리</h2>
        <button
          onClick={handleFillAllCash}
          className="px-6 py-3 bg-gray-200 text-black border border-gray-400 hover:bg-gray-300 font-medium"
        >
          전체 보충 (20개)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {COINS.map(({ value, label }) => (
          <CashItem
            key={value}
            value={value}
            label={label}
            currentAmount={cash[value]}
          />
        ))}
      </div>
    </div>
  );
};

type CashItemProps = {
  value: Coin;
  label: string;
  currentAmount: number;
};

const CashItem = ({ value, label, currentAmount }: CashItemProps) => {
  const [amount, setAmount] = useState<number>(currentAmount);
  const { refillCash } = useVendingAdminActions();

  const handleUpdate = () => {
    refillCash(value, amount);
  };

  return (
    <div className="bg-gray-100 p-4 border border-gray-400">
      <div className="text-center mb-3">
        <div className="text-lg font-bold text-black">{label}</div>
        <div className="text-sm text-gray-700">현재: {currentAmount}개</div>
      </div>
      <div className="space-y-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-400"
          min="0"
        />
        <button
          onClick={handleUpdate}
          className="w-full px-3 py-2 bg-gray-200 text-black border border-gray-400 hover:bg-gray-300 text-sm font-medium"
        >
          업데이트
        </button>
      </div>
    </div>
  );
};
