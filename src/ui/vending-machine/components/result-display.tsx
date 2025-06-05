import { MessageDisplay } from "@/ui/@shared/components/message-display";
import { useVendingStore } from "@/ui/@shared/hooks/use-vending-store";

export const ResultDisplay = () => {
  const displayData = useVendingStore((state) => ({
    lastChange: state.lastChange,
    message: state.message,
    cash: state.cash,
    hasLowCash: Object.values(state.cash).some((cnt) => cnt < 5),
  }));

  return (
    <div className="space-y-6">
      <MessageDisplay message={displayData.message} />

      {displayData.lastChange && (
        <div className="bg-gray-100 p-6 border border-gray-400">
          <h3 className="text-lg font-medium text-black mb-4">거스름돈</h3>

          {Object.values(displayData.lastChange).some((cnt) => cnt > 0) ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(displayData.lastChange)
                .filter(([_, cnt]) => Number(cnt) > 0)
                .map(([value, cnt]) => (
                  <div
                    key={value}
                    className="bg-white p-4 border border-gray-400 text-center"
                  >
                    <div className="font-bold text-black">{value}원</div>
                    <div className="text-sm text-gray-700">{String(cnt)}개</div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-black">거스름돈이 없습니다.</div>
          )}
        </div>
      )}

      <div className="bg-gray-100 p-6 border border-gray-400">
        <h3 className="text-lg font-medium text-black mb-4">현금고 상태</h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {Object.entries(displayData.cash).map(([value, count]) => {
            const isLow = count < 5;
            return (
              <div
                key={value}
                className={`p-4 border text-center ${
                  isLow
                    ? "bg-gray-200 border-gray-500 text-black"
                    : "bg-white border-gray-400 text-black"
                }`}
              >
                <div className="font-medium">{value}원</div>
                <div className="text-sm">{count}개</div>
              </div>
            );
          })}
        </div>

        {displayData.hasLowCash && (
          <div className="bg-gray-200 border border-gray-500 p-4">
            <p className="text-sm text-black">
              일부 동전이 부족합니다. 어드민 페이지에서 보충하세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
