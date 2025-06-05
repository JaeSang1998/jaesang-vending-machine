import { VendingMessage, MessageVariant } from "@/types/vending-machine";

type MessageDisplayProps = {
  message?: VendingMessage | null;
  variant?: MessageVariant;
  className?: string;
};

export const MessageDisplay = ({
  message,
  variant,
  className = "",
}: MessageDisplayProps) => {
  if (!message) return null;

  const finalVariant = variant || message.variant;

  const variantClasses = {
    error: "p-4 bg-red-100 border border-red-500 text-red-700",
    success: "p-4 bg-green-100 border border-green-500 text-green-700",
    info: "p-4 bg-gray-100 border border-gray-400 text-black",
    warning: "p-4 bg-yellow-100 border border-yellow-500 text-black",
  };

  return (
    <div className={`${variantClasses[finalVariant]} ${className}`.trim()}>
      {message.text}
    </div>
  );
};
