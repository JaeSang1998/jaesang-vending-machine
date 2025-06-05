import { Link } from "react-router-dom";
import { PaymentInterface } from "./components/payment-interface";
import { ProductGrid } from "./components/product-grid";
import { ResultDisplay } from "./components/result-display";

const VendingMachine = () => {
  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="w-[80%] mx-auto max-w-6xl px-6 md:px-8 lg:px-12 py-8 md:py-12 lg:py-16 space-y-8">
        <Header />
        <PaymentInterface />
        <ProductGrid />
        <ResultDisplay />
      </div>
    </div>
  );
};

export default VendingMachine;

const Header = () => {
  return (
    <div className="bg-white p-8 border border-gray-400">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-black mb-3">
            Vending Machine
          </h1>
        </div>
        <Link
          to="/admin"
          className="px-8 py-4 bg-gray-200 text-black border border-gray-400 hover:bg-gray-300 font-medium"
        >
          관리자 페이지
        </Link>
      </div>
    </div>
  );
};
