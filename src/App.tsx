import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VendingMachine from "./ui/vending-machine/page";
import AdminPage from "./ui/admin/page";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VendingMachine />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default App;
