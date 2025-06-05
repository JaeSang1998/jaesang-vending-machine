import { COINS } from "@/utils/coins";
import {
  useVendingMachineActions,
  useVendingStore,
} from "@/ui/@shared/hooks/use-vending-store";
import { useState } from "react";

export const PaymentInterface = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <CashPayment />
      <CardPayment />
    </div>
  );
};

const CashPayment = () => {
  const inserted = useVendingStore((state) => state.inserted);
  const { insertCash, cancel } = useVendingMachineActions();

  return (
    <div className="bg-white p-8 border border-gray-300">
      <h3 className="text-lg font-medium text-black mb-6">현금 결제</h3>

      <div className="bg-gray-100 p-5 border border-gray-300 mb-6">
        <div className="text-sm text-gray-700 mb-2">투입 금액</div>
        <div className="text-2xl font-bold text-black">
          {inserted.toLocaleString()}원
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm font-medium text-gray-700 mb-4">동전 선택</div>
        <div className="flex flex-wrap gap-3 mb-4">
          {COINS.map(({ value, label }) => (
            <div
              key={value}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData("value", String(value))
              }
              className="w-16 h-16 border border-gray-400 flex items-center justify-center bg-white cursor-grab select-none hover:bg-gray-100 text-xs font-medium text-black"
            >
              {label}
            </div>
          ))}
        </div>

        <div
          className="w-full h-20 border-2 border-dashed border-gray-500 flex items-center justify-center bg-white hover:bg-gray-50"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const v = Number(e.dataTransfer.getData("value"));
            insertCash(v);
          }}
        >
          <span className="text-gray-700 font-medium">동전 투입구</span>
        </div>
      </div>

      <button
        className="w-full px-5 py-3 bg-gray-200 text-black border border-gray-400 hover:bg-gray-300 font-medium"
        onClick={cancel}
      >
        취소 / 환불
      </button>
    </div>
  );
};

const CardPayment = () => {
  const cardInfo = useVendingStore((state) => state.cardInfo);
  const { insertCard, disconnectCard } = useVendingMachineActions();

  const [balance, setBalance] = useState(50000);

  const handleInsertCard = () => {
    insertCard(balance);
  };

  return (
    <div className="bg-white p-8 border border-gray-300">
      <h3 className="text-lg font-medium text-black mb-6">카드 결제</h3>

      {cardInfo && cardInfo.isConnected ? (
        <ConnectedCardView cardInfo={cardInfo} onDisconnect={disconnectCard} />
      ) : (
        <CardConnectionForm
          balance={balance}
          onBalanceChange={setBalance}
          onConnect={handleInsertCard}
        />
      )}
    </div>
  );
};

type ConnectedCardViewProps = {
  cardInfo: { balance: number; isConnected: boolean };
  onDisconnect: () => void;
};

const ConnectedCardView = ({
  cardInfo,
  onDisconnect,
}: ConnectedCardViewProps) => {
  return (
    <div className="space-y-5">
      <div className="bg-gray-100 p-5 border border-gray-300">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-700">연결된 카드</div>
          <div className="w-3 h-3 bg-gray-500"></div>
        </div>
        <div className="text-lg font-medium text-black">
          잔액: {cardInfo.balance.toLocaleString()}원
        </div>
      </div>
      <button
        onClick={onDisconnect}
        className="w-full px-5 py-3 bg-gray-200 text-black border border-gray-400 hover:bg-gray-300 font-medium"
      >
        카드 연결 해제
      </button>
    </div>
  );
};

type CardConnectionFormProps = {
  balance: number;
  onBalanceChange: (balance: number) => void;
  onConnect: () => void;
};

const CardConnectionForm = ({
  balance,
  onBalanceChange,
  onConnect,
}: CardConnectionFormProps) => {
  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카드 잔액
          </label>
          <input
            type="number"
            value={balance}
            onChange={(e) => onBalanceChange(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-400"
            placeholder="잔액 입력"
            min="0"
          />
        </div>
      </div>
      <button
        onClick={onConnect}
        disabled={balance <= 0}
        className="w-full px-5 py-3 bg-gray-200 text-black border border-gray-400 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        카드 연결 (30초 타임아웃)
      </button>
    </div>
  );
};
