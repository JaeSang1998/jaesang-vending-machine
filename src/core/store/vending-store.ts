import { Coin } from "@/types/coin";
import { initialProducts, initialCash } from "@/utils/seed";
import { EventEmitter } from "@/core/event-emitter";
import { CardInfo, VendingMessage, Product } from "@/types/vending-machine";
import { CARD_TIMEOUT_DURATION } from "@/utils/products";
import { CashService } from "@/core/services/cash.service";
import { ProductService } from "@/core/services/product.service";
import { PaymentService } from "@/core/services/payment.service";
import { VendingStoreUtils } from "./vending-store-utils";

export type Snapshot = {
  inserted: number;
  products: Product[];
  message: VendingMessage | null;
  cash: Record<Coin, number>;
  lastChange: Record<Coin, number> | null;
  cardInfo: CardInfo | null;
};

class VendingStore extends EventEmitter {
  private productService: ProductService;
  private cashService: CashService;
  private paymentService: PaymentService;
  private utils: VendingStoreUtils;

  private inserted = 0;
  private message: VendingMessage | null = null;
  private lastChange: Record<Coin, number> | null = null;
  private cardTimeoutId: number | null = null;
  private cachedSnapshot: Snapshot | null = null;

  constructor() {
    super();

    this.productService = new ProductService(initialProducts());
    this.cashService = new CashService(initialCash());
    this.paymentService = new PaymentService(this.cashService);

    this.utils = new VendingStoreUtils((message) => {
      this.message = message;
      this.emitChange();
    });
  }

  subscribe = (cb: () => void) => {
    this.on("change", cb);
    return () => this.off("change", cb);
  };

  getSnapshot = (): Snapshot => {
    if (this.cachedSnapshot === null) {
      this.cachedSnapshot = {
        inserted: this.inserted,
        message: this.message,
        cash: this.cashService.getInventory(),
        lastChange: this.lastChange ? { ...this.lastChange } : null,
        cardInfo: this.paymentService.getCardInfo(),
        products: this.productService.getAllProducts(),
      };
    }
    return this.cachedSnapshot;
  };

  actions = {
    insertCash: (value: number) => this.insertCash(value),
    selectProduct: (id: string) => this.selectProduct(id),
    cancel: () => this.refundAll("거래 취소", "info"),
    insertCard: (balance: number) => this.insertCard(balance),
    disconnectCard: () => this.disconnectCard(),
  } as const;

  adminActions = {
    refillCash: (value: Coin, amount: number) => this.refillCash(value, amount),
    updateProductStock: (productId: string, newStock: number) =>
      this.updateProductStock(productId, newStock),
  } as const;

  private insertCash(value: number) {
    const cardInfo = this.paymentService.getCardInfo();
    if (cardInfo?.isConnected)
      return this.utils.msg.fail(
        "카드 결제 모드입니다. 동전을 투입할 수 없습니다"
      );

    const coin = value as Coin;
    const result = this.cashService.addCoin(coin);

    if (!this.utils.handle(result)) return;

    this.inserted += value;
    this.lastChange = null;
    this.utils.msg.clear();
  }

  private selectProduct(productId: string) {
    const productResult =
      this.productService.validateProductAvailability(productId);
    if (!this.utils.handle(productResult)) return;

    const product = productResult.data;
    const cardInfo = this.paymentService.getCardInfo();

    if (cardInfo?.isConnected) {
      this.purchaseWithCard(productId, product);
    } else {
      this.purchaseWithCash(productId, product);
    }
  }

  private purchaseWithCard(productId: string, product: any) {
    const cardResult = this.paymentService.purchaseWithCard(product);
    if (!this.utils.handle(cardResult)) return this.disconnectCard();

    const purchaseResult = this.productService.purchaseProduct(productId);
    if (!this.utils.handle(purchaseResult)) return;

    this.disconnectCard();
    this.utils.msg.ok(`${cardResult.data.message} 카드가 반환됩니다.`);
  }

  private purchaseWithCash(productId: string, product: any) {
    const cashResult = this.paymentService.purchaseWithCash(
      product,
      this.inserted
    );
    if (!this.utils.handle(cashResult)) return;

    const purchaseResult = this.productService.purchaseProduct(productId);
    if (!this.utils.handle(purchaseResult)) return;

    this.inserted = 0;
    this.lastChange = cashResult.data.change || null;
    this.utils.msg.ok(cashResult.data.message);
  }

  private refundAll(
    msg: string,
    variant: "success" | "error" | "warning" | "info" = "info"
  ) {
    const cardInfo = this.paymentService.getCardInfo();
    if (cardInfo?.isConnected) this.disconnectCard();

    if (this.inserted === 0)
      return this.utils.msg.fail("반환할 금액이 없습니다");

    const refundResult = this.paymentService.refundCash(this.inserted);
    if (!this.utils.handle(refundResult)) return;

    this.lastChange = refundResult.data;
    this.inserted = 0;

    switch (variant) {
      case "success":
        return this.utils.msg.ok(msg);
      case "warning":
        return this.utils.msg.warn(msg);
      case "error":
        return this.utils.msg.fail(msg);
      default:
        return this.utils.msg.info(msg);
    }
  }

  private refillCash(value: Coin, amount: number) {
    const result = this.cashService.setCoinAmount(value, amount);
    if (!this.utils.handle(result)) return;

    this.utils.msg.ok("현금고가 업데이트되었습니다");
  }

  private updateProductStock(productId: string, newStock: number) {
    const result = this.productService.updateProductStock(productId, newStock);
    if (!this.utils.handle(result)) return;

    this.utils.msg.ok("재고가 업데이트되었습니다");
  }

  private insertCard(balance: number) {
    const result = this.paymentService.connectCard(balance);
    if (!this.utils.handle(result)) return;

    if (this.inserted > 0) {
      const refundResult = this.paymentService.refundCash(this.inserted);
      if (this.utils.handle(refundResult)) {
        this.lastChange = refundResult.data;
        this.inserted = 0;
        this.utils.msg.info("카드가 연결되었습니다. 현금이 반환됩니다.");
      }
    } else {
      this.utils.msg.ok(
        `카드가 연결되었습니다 (잔액: ${balance.toLocaleString()}원)`
      );
    }

    this.resetCardTimer();
  }

  private disconnectCard() {
    if (this.cardTimeoutId) {
      clearTimeout(this.cardTimeoutId);
      this.cardTimeoutId = null;
    }

    this.paymentService.disconnectCard();
    this.utils.msg.info("카드 연결이 해제되었습니다");
  }

  private emitChange() {
    this.cachedSnapshot = null;
    this.emit("change");
  }

  private resetCardTimer() {
    if (this.cardTimeoutId) clearTimeout(this.cardTimeoutId);

    this.cardTimeoutId = window.setTimeout(() => {
      const currentCardInfo = this.paymentService.getCardInfo();
      if (currentCardInfo?.isConnected) {
        this.paymentService.disconnectCard();
        this.utils.msg.warn("카드 연결 시간이 초과되었습니다");
      }
    }, CARD_TIMEOUT_DURATION);
  }
}

export const store = new VendingStore();
