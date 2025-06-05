import {
  useVendingMachineActions,
  useVendingStore,
} from "@/ui/@shared/hooks/use-vending-store";
import { Product } from "@/types/vending-machine";

export const ProductGrid = () => {
  const products = useVendingStore((state) => state.products);
  const { selectProduct } = useVendingMachineActions();

  return (
    <div className="bg-white p-8 border border-gray-300">
      <h3 className="text-lg font-medium text-black mb-6">상품 선택</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSelect={() => selectProduct(product.id)}
          />
        ))}
      </div>
    </div>
  );
};

type ProductCardProps = {
  product: Product;
  onSelect: () => void;
};

const ProductCard = ({ product, onSelect }: ProductCardProps) => {
  const { inserted, cardInfo } = useVendingStore((state) => ({
    inserted: state.inserted,
    cardInfo: state.cardInfo,
  }));
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 3;

  const hasEnoughMoney = () => {
    if (cardInfo && cardInfo.isConnected) {
      return cardInfo.balance >= product.price;
    }
    return inserted >= product.price;
  };

  const isDisabled = isOutOfStock || !hasEnoughMoney();

  return (
    <button
      className={`p-6 border text-left ${
        isDisabled
          ? "opacity-50 bg-gray-100 border-gray-400 cursor-not-allowed"
          : "bg-white hover:bg-gray-100 border-gray-400"
      }`}
      disabled={isDisabled}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{product.name}</div>
        <div className="text-right">
          <div
            className={`text-xs px-3 py-1 border ${
              isOutOfStock
                ? "bg-gray-200 text-gray-700 border-gray-400"
                : isLowStock
                ? "bg-gray-200 text-gray-700 border-gray-400"
                : "bg-gray-100 text-gray-700 border-gray-400"
            }`}
          >
            {isOutOfStock ? "품절" : isLowStock ? "재고부족" : "판매중"}
          </div>
        </div>
      </div>

      <div className="font-medium text-black mb-2">{product.name}</div>
      <div className="text-lg font-bold text-black mb-3">
        {product.price.toLocaleString()}원
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-700">재고: {product.stock}개</div>
      </div>

      {!isOutOfStock && !hasEnoughMoney() && (
        <div className="text-xs text-black mt-3 p-3 bg-gray-200 border border-gray-400">
          {cardInfo && cardInfo.isConnected ? "카드 잔액 부족" : "금액 부족"}
        </div>
      )}
    </button>
  );
};
