import { Product } from "@/types/vending-machine";
import { Result, success, failure } from "@/utils/result";

export class ProductService {
  private products: Product[];

  constructor(initialProducts: Product[]) {
    this.products = [...initialProducts.map((p) => ({ ...p }))];
  }

  getAllProducts(): Product[] {
    return [...this.products.map((p) => ({ ...p }))];
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((product) => product.id === id);
  }

  validateProductAvailability(productId: string): Result<Product, Error> {
    const product = this.getProductById(productId);

    if (!product) return failure(new Error("상품을 찾을 수 없습니다"));

    if (product.stock <= 0)
      return failure(new Error(`${product.name}은(는) 품절되었습니다`));

    return success(product);
  }

  updateProductStock(
    productId: string,
    newStock: number
  ): Result<Product, Error> {
    if (newStock < 0) return failure(new Error("재고는 음수가 될 수 없습니다"));

    const productIndex = this.products.findIndex((p) => p.id === productId);

    if (productIndex === -1)
      return failure(new Error("상품을 찾을 수 없습니다"));

    this.products[productIndex] = {
      ...this.products[productIndex],
      stock: newStock,
    };

    return success({ ...this.products[productIndex] });
  }

  purchaseProduct(productId: string): Result<Product, Error> {
    const availabilityResult = this.validateProductAvailability(productId);

    if (!availabilityResult.success) return availabilityResult;

    const product = availabilityResult.data;
    return this.updateProductStock(productId, product.stock - 1);
  }
}
