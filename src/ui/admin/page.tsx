import { Link } from "react-router-dom";
import { SystemDashboard } from "./components/system-dashboard";
import { CashManagement } from "./components/cash-management";
import { StockManagement } from "./components/stock-management";

import { useVendingStore } from "@/ui/@shared/hooks/use-vending-store";
import { MessageDisplay } from "@/ui/@shared/components/message-display";

const AdminPage = () => {
  const message = useVendingStore((state) => state.message);

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="w-[80%] mx-auto max-w-6xl px-6 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16 space-y-8">
        <div className="bg-white p-8 border border-gray-400">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-black mb-3">
                관리자 패널
              </h1>
              <p className="text-gray-700">
                자판기의 현금고와 재고를 관리하세요
              </p>
            </div>
            <Link
              to="/"
              className="px-8 py-4 bg-gray-200 text-black border border-gray-400 hover:bg-gray-300 font-medium"
            >
              자판기로 돌아가기
            </Link>
          </div>
        </div>

        <MessageDisplay message={message} />

        <div className="space-y-8">
          <SystemDashboard />
          <CashManagement />
          <StockManagement />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
