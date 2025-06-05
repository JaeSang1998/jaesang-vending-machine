import { useVendingStore } from "@/ui/@shared/hooks/use-vending-store";

export const SystemDashboard = () => {
  const totalCashValue = useVendingStore((state) =>
    Object.entries(state.cash).reduce(
      (total, [value, count]) => total + Number(value) * count,
      0
    )
  );

  const totalStock = useVendingStore((state) =>
    state.products.reduce((total, product) => total + product.stock, 0)
  );

  const systemStatus = useVendingStore((state) => {
    const lowCashCoins = Object.entries(state.cash).filter(
      ([_, count]) => count < 5
    );
    const outOfStockProducts = state.products.filter((p) => p.stock === 0);
    const lowStockProducts = state.products.filter(
      (p) => p.stock > 0 && p.stock < 3
    );

    return {
      lowCashCoins,
      outOfStockProducts,
      lowStockProducts,
      isAllNormal:
        lowCashCoins.length === 0 &&
        outOfStockProducts.length === 0 &&
        lowStockProducts.length === 0,
    };
  });

  const cash = useVendingStore((state) => state.cash);
  const products = useVendingStore((state) => state.products);

  return (
    <div className="bg-white p-6 border border-gray-400">
      <h2 className="text-2xl font-bold text-black mb-6">시스템 현황</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 p-6 border border-gray-400">
          <h3 className="text-lg font-medium text-black mb-3">현금고 현황</h3>
          <div className="text-3xl font-bold text-black mb-4">
            {totalCashValue.toLocaleString()}원
          </div>
          <div className="space-y-2">
            {Object.entries(cash).map(([value, count]) => (
              <div key={value} className="flex justify-between items-center">
                <span className="text-gray-700">{value}원</span>
                <span className="font-medium text-black">{count}개</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-6 border border-gray-400">
          <h3 className="text-lg font-medium text-black mb-3">재고 현황</h3>
          <div className="text-3xl font-bold text-black mb-4">
            {totalStock}개
          </div>
          <div className="space-y-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex justify-between items-center"
              >
                <span className="text-gray-700">{product.name}</span>
                <span className="font-medium text-black">
                  {product.stock}개
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-100 p-6 border border-gray-400">
          <h3 className="text-lg font-medium text-black mb-3">상태 알림</h3>
          <div className="space-y-3">
            {systemStatus.lowCashCoins.length > 0 && (
              <div className="bg-gray-200 border border-gray-500 p-3">
                <div className="text-sm text-black font-medium">동전 부족</div>
                <div className="text-xs text-gray-700">
                  {systemStatus.lowCashCoins
                    .map(([value]) => `${value}원`)
                    .join(", ")}
                </div>
              </div>
            )}
            {systemStatus.outOfStockProducts.length > 0 && (
              <div className="bg-gray-200 border border-gray-500 p-3">
                <div className="text-sm text-black font-medium">품절 상품</div>
                <div className="text-xs text-gray-700">
                  {systemStatus.outOfStockProducts
                    .map((p) => p.name)
                    .join(", ")}
                </div>
              </div>
            )}
            {systemStatus.lowStockProducts.length > 0 && (
              <div className="bg-gray-200 border border-gray-500 p-3">
                <div className="text-sm text-black font-medium">재고 부족</div>
                <div className="text-xs text-gray-700">
                  {systemStatus.lowStockProducts.map((p) => p.name).join(", ")}
                </div>
              </div>
            )}
            {systemStatus.isAllNormal && (
              <div className="bg-gray-100 border border-gray-400 p-3">
                <div className="text-sm text-black font-medium">
                  모든 상태 정상
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
