import { Coin } from "@/types/coin";
import { CardInfo, Product } from "@/types/vending-machine";
import { CashService } from "./cash.service";
import { failure, Result, success } from "@/utils/result";

export interface PaymentResult {
  change?: Record<Coin, number>;
  updatedCardBalance?: number;
  message: string;
}

export class PaymentService {
  private cashService: CashService;
  private cardInfo: CardInfo | null = null;

  constructor(cashService: CashService) {
    this.cashService = cashService;
  }

  getCardInfo(): CardInfo | null {
    return this.cardInfo ? { ...this.cardInfo } : null;
  }

  connectCard(balance: number): Result<CardInfo, Error> {
    if (balance < 0)
      return failure(new Error("카드 잔액은 음수가 될 수 없습니다"));

    this.cardInfo = {
      balance: balance,
      isConnected: true,
    };

    return success(this.cardInfo);
  }

  disconnectCard(): void {
    this.cardInfo = null;
  }

  purchaseWithCard(product: Product): Result<PaymentResult, Error> {
    if (!this.cardInfo?.isConnected)
      return failure(new Error("카드가 연결되어 있지 않습니다"));

    if (this.cardInfo.balance < product.price)
      return failure(new Error("카드 잔액이 부족합니다"));

    const updatedBalance = this.cardInfo.balance - product.price;
    this.cardInfo = {
      ...this.cardInfo,
      balance: updatedBalance,
    };

    return success({
      updatedCardBalance: updatedBalance,
      message: `${product.name}을(를) 카드로 구매했습니다. 남은 잔액: ${updatedBalance}원`,
    });
  }

  purchaseWithCash(
    product: Product,
    insertedAmount: number
  ): Result<PaymentResult, Error> {
    if (insertedAmount < product.price)
      return failure(
        new Error(
          `금액이 부족합니다: 투입액 ${insertedAmount}원, 가격 ${product.price}원`
        )
      );

    const changeAmount = insertedAmount - product.price;

    const changeResult = this.cashService.calculateChange(changeAmount);
    if (!changeResult.success) return changeResult;

    const updateResult = this.cashService.refund(changeResult.data);
    if (!updateResult.success) return updateResult;

    return success({
      change: changeResult.data,
      message: `${product.name}을(를) 현금으로 구매했습니다. 거스름돈: ${changeAmount}원`,
    });
  }

  refundCash(insertedAmount: number): Result<Record<Coin, number>, Error> {
    if (insertedAmount <= 0)
      return success({ 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 });

    const changeResult = this.cashService.calculateChange(insertedAmount);
    if (!changeResult.success) return changeResult;

    const updateResult = this.cashService.refund(changeResult.data);
    if (!updateResult.success) return updateResult;

    return success(changeResult.data);
  }
}
