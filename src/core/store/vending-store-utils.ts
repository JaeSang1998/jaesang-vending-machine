import { createMessage } from "@/utils/message";
import { Result } from "@/utils/result";
import { VendingMessage } from "@/types/vending-machine";

export class VendingStoreUtils {
  constructor(private setState: (message: VendingMessage | null) => void) {}

  private setMsg(
    text: string | null,
    variant: "success" | "error" | "warning" | "info" = "error"
  ) {
    const message = text ? createMessage(text, variant) : null;
    this.setState(message);
  }

  msg = {
    ok: (text: string) => this.setMsg(text, "success"),
    warn: (text: string) => this.setMsg(text, "warning"),
    info: (text: string) => this.setMsg(text, "info"),
    fail: (text: string) => this.setMsg(text, "error"),
    clear: () => this.setMsg(null),
  };

  handle<T, E extends { message: string } = Error>(
    result: Result<T, E>
  ): result is { success: true; data: T } {
    if (!result.success) {
      this.msg.fail(result.error.message);
      return false;
    }
    return true;
  }
}
