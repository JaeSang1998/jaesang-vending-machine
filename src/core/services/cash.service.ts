import { Coin } from "@/types/coin";
import { Result, success, failure } from "@/utils/result";

export class CashService {
  private cashInventory: Record<Coin, number>;

  constructor(initialInventory: Record<Coin, number>) {
    this.cashInventory = { ...initialInventory };
  }

  getInventory(): Record<Coin, number> {
    return { ...this.cashInventory };
  }

  calculateChange(amount: number): Result<Record<Coin, number>, Error> {
    if (amount <= 0)
      return success({ 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 });

    const coins: Coin[] = [10000, 5000, 1000, 500, 100];
    let remaining = amount;

    const change = coins.reduce<Record<Coin, number>>(
      (acc, coin) => {
        const available = this.cashInventory[coin];
        const count = Math.min(Math.floor(remaining / coin), available);
        acc[coin] = count;
        remaining -= coin * count;
        return acc;
      },
      { 100: 0, 500: 0, 1000: 0, 5000: 0, 10000: 0 }
    );

    if (remaining > 0)
      return failure(
        new Error(
          "거스름돈을 정확히 제공할 수 없습니다. 관리자에게 문의하세요."
        )
      );

    return success(change);
  }

  refund(changeMap: Record<Coin, number>): Result<Record<Coin, number>, Error> {
    try {
      for (const coin of [100, 500, 1000, 5000, 10000] as Coin[]) {
        const count = changeMap[coin] || 0;
        if (this.cashInventory[coin] < count)
          return failure(new Error("동전이 부족합니다"));
      }

      const updated = { ...this.cashInventory };
      for (const coin of [100, 500, 1000, 5000, 10000] as Coin[]) {
        if (changeMap[coin]) updated[coin] -= changeMap[coin];
      }

      this.cashInventory = updated;
      return success(updated);
    } catch (error) {
      return failure(new Error("재고 업데이트 중 오류가 발생했습니다"));
    }
  }

  addCoin(coin: Coin): Result<Record<Coin, number>, Error> {
    try {
      const updated = { ...this.cashInventory };
      updated[coin] += 1;
      this.cashInventory = updated;
      return success(updated);
    } catch (error) {
      return failure(new Error("동전 추가 중 오류가 발생했습니다"));
    }
  }

  setCoinAmount(
    coin: Coin,
    amount: number
  ): Result<Record<Coin, number>, Error> {
    try {
      if (amount < 0) return failure(new Error("음수는 설정할 수 없습니다"));

      const updated = { ...this.cashInventory };
      updated[coin] = amount;
      this.cashInventory = updated;
      return success(updated);
    } catch (error) {
      return failure(new Error("동전 수량 설정 중 오류가 발생했습니다"));
    }
  }
}
