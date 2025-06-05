import {
  useVendingAdminActions,
  useVendingStore,
} from "@/ui/@shared/hooks/use-vending-store";
import { useState } from "react";

export const StockManagement = () => {
  const products = useVendingStore((state) => state.products);
  const { updateProductStock } = useVendingAdminActions();

  const [stockAmounts, setStockAmounts] = useState<Record<string, number>>(() =>
    products.reduce((acc, product) => {
      acc[product.id] = product.stock;
      return acc;
    }, {} as Record<string, number>)
  );

  const handleStockUpdate = (productId: string) => {
    updateProductStock(productId, stockAmounts[productId]);
  };

  const handleFillAllStock = () => {
    products.forEach((product) => {
      updateProductStock(product.id, 20);
    });
  };

  return (
    <div className="bg-white p-6 border border-gray-400">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">재고 관리</h2>
        <button
          onClick={handleFillAllStock}
          className="px-6 py-3 bg-gray-200 text-black border border-gray-400 hover:bg-gray-300 font-medium"
        >
          전체 보충 (20개)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-100 p-4 border border-gray-400"
          >
            <div className="text-center mb-3">
              <div className="text-lg font-bold text-black">{product.name}</div>
              <div className="text-sm text-gray-700">
                현재: {product.stock}개 | 가격: {product.price.toLocaleString()}
                원
              </div>
            </div>
            <div className="space-y-2">
              <input
                type="number"
                value={stockAmounts[product.id]}
                onChange={(e) =>
                  setStockAmounts({
                    ...stockAmounts,
                    [product.id]: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-400"
                min="0"
              />
              <button
                onClick={() => handleStockUpdate(product.id)}
                className="w-full px-3 py-2 bg-gray-200 text-black border border-gray-400 hover:bg-gray-300 text-sm font-medium"
              >
                업데이트
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
