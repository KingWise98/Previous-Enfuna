import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Admin from "./admins/admin";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Pos_Sidebar from "./scenes/global/Pos_Sidebar";
import Dashboard from "./scenes/dashboard";
import Payment from "./scenes/payment";
import ReceiptSale from "./scenes/payment/receipt";
import Listings from "./scenes/payment-listings";
import ManageBill from "./scenes/bills/manage";
import CreateBill from "./scenes/bills/create";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";

// Reports
import Income from "./scenes/reports/income";
import Expense from "./scenes/reports/expense";
import IncomeVsExpenses from "./scenes/reports/income-vs-expenses";
import TrialBalance from "./scenes/reports/trial-balance";
import BalanceSheet from "./scenes/reports/balance-sheet";

import AccountBalance from "./scenes/reports/account-balance";
import ProfitAndLoss from "./scenes/reports/profit-and-loss";
import Receipts from "./scenes/pos/receipts";
import Cash from "./scenes/reports/cash";
import Payable from "./scenes/reports/payable";
import Receive from "./scenes/reports/receivable";
import ERP from "./scenes/reports/erp";

// Ledger
import LedgerList from "./scenes/ledger/index";
import LedgerCreate from "./scenes/ledger/create";

// Vouchers
import CreditVoucher from "./scenes/vouchers/credit";
import DebitVoucher from "./scenes/vouchers/debit";
import CreateVoucher from "./scenes/vouchers/create";
import JournalVoucher from "./scenes/vouchers/journal";

// Inventory
import Inventory from "./scenes/inventory/overview";
import ProductList from "./scenes/inventory/product-list";
import Barcode from "./scenes/inventory/print-bar-code";
import Stock from "./scenes/inventory/stock";
import Supply from "./scenes/inventory/supplierList";
import Transfer from "./scenes/inventory/transfer";
import CustomerList from "./scenes/inventory/customer";
import SupplyChain from "./scenes/inventory/supply";
import SupplyPay from "./scenes/inventory/payments";
import Manage from "./scenes/inventory/manage";

// CRM
import Leads from "./scenes/CRM/leads";
import Deals from "./scenes/CRM/deals";
import Analytics from "./scenes/CRM/analytics";

// HRM
import List from "./scenes/HRM/list";
import Payroll from "./scenes/HRM/payroll";
import Reports from "./scenes/HRM/reports";
import Timestamp from "./scenes/HRM/timestamp";

// POS
import Pos_Dashboard from "./scenes/pos/all";
import Dashboards from "./scenes/pos/dashboard";
import New_Sales from "./scenes/pos/new_sales";
import Favorites from "./scenes/pos/fav";
import Beverages from "./scenes/pos/beverages";
import Dessert from "./scenes/pos/dessert";
import Hold from "./scenes/pos/hold";
import Dis from "./scenes/pos/dis";
import Refund from "./scenes/pos/refund";
import Movement from "./scenes/pos/stock";
import Products from "./scenes/pos/products";
import Services from "./scenes/pos/services";
import Manage_Sales from "./scenes/pos/manage";
import Inventory_Manage from "./scenes/pos/inventory";
import Manage_Payments from "./scenes/pos/payments";
import Manage_Customers from "./scenes/pos/customers";
import Manage_Reports from "./scenes/pos/reports";
import Manage_Settings from "./scenes/pos/settings";
import Customer_Group from "./scenes/pos/customer_groups";
import User_Pos from "./scenes/pos/user";
import Roles from "./scenes/pos/roles";
import User_Sales from "./scenes/pos/sales";
import User_Contact from "./scenes/pos/contacts";
import Import_Contact from "./scenes/pos/import_contacts";
import Add from "./scenes/pos/Add";
import List_p from "./scenes/pos/list";
import Returns from "./scenes/pos/returns";

// User
import New_Sale from "./scenes/user/new_sales";
import Fav from "./scenes/user/fav";
import Beverage from "./scenes/user/beverages";
import Desserts from "./scenes/user/dessert";
import Holds from "./scenes/user/hold";
import Discounted from "./scenes/user/dis";
import Refunds from "./scenes/user/refund";
import Movements from "./scenes/user/stock";
import Product from "./scenes/user/products";
import Manage_Sale from "./scenes/user/manage";
import Inventory_Manages from "./scenes/user/inventory";
import Manage_Payment from "./scenes/user/payments";
import Manage_Customer from "./scenes/user/customers";
import Manage_Report from "./scenes/user/reports";

// Login
import Login from "./scenes/login/SignUp";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || null);
  const navigate = useNavigate();

  // Added port configuration (for logging/debugging)
  const port = process.env.PORT || 1000;
  console.log(`Application configured to run on port: ${port}`);

  useEffect(() => {
    // Check if user was logged in before refresh
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) {
      setUserRole(savedRole);
    } else {
      // If no user role is found, ensure we're at the login page
      if (window.location.pathname !== "/") {
        navigate("/");
      }
    }
  }, [navigate]);

  const handleLogin = (role) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
    if (role === "admin") {
      navigate("/dashboard");
    } else if (role === "normal") {
      navigate("/user/new_sales");
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem('userRole');
    navigate("/");
  };

  // Protected Route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!userRole) {
      return <Navigate to="/" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to={userRole === "admin" ? "/dashboard" : "/user/new_sales"} replace />;
    }
    return children;
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* Conditionally render Sidebar or Pos_Sidebar based on user role */}
          {userRole === "admin" && <Sidebar isSidebar={isSidebar} />}
          {userRole === "normal" && <Pos_Sidebar isSidebar={isSidebar} />}

          <main className="content">
            {/* Render Topbar only if user is logged in */}
            {userRole && <Topbar setIsSidebar={setIsSidebar} onLogout={handleLogout} />}

            <Routes>
              {/* Default route to Login */}
              <Route path="/" element={<Login onLogin={handleLogin} />} />

              {/* Admin Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              } />
               {/* Admin Routes */}
              <Route path="./admins/admin" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/team" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Team />
                </ProtectedRoute>
              } />
              <Route path="/payment" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Payment />
                </ProtectedRoute>
              } />
              
              <Route path="/contacts" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Contacts />
                </ProtectedRoute>
              } />
              <Route path="/invoices" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Invoices />
                </ProtectedRoute>
              } />
              <Route path="/payment-listings" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Listings />
                </ProtectedRoute>
              } />
              <Route path="/form" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Form />
                </ProtectedRoute>
              } />
              <Route path="/bar" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Bar />
                </ProtectedRoute>
              } />
              <Route path="/pie" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Pie />
                </ProtectedRoute>
              } />
              <Route path="/line" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Line />
                </ProtectedRoute>
              } />
              <Route path="/faq" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <FAQ />
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Calendar />
                </ProtectedRoute>
              } />
              <Route path="/geography" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Geography />
                </ProtectedRoute>
              } />

              {/* Reports */}
              <Route path="/pos/receipts" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Receipts />
                </ProtectedRoute>
              } />
              <Route path="/reports/cash" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Cash />
                </ProtectedRoute>
              } />
              <Route path="/reports/income" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Income />
                </ProtectedRoute>
              } />
              <Route path="/reports/expense" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Expense />
                </ProtectedRoute>
              } />
              <Route path="/reports/income-vs-expenses" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <IncomeVsExpenses />
                </ProtectedRoute>
              } />
              <Route path="/reports/trial-balance" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <TrialBalance />
                </ProtectedRoute>
              } />
              <Route path="/reports/balance-sheet" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <BalanceSheet />
                </ProtectedRoute>
              } />
              <Route path="/reports/account-balance" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AccountBalance />
                </ProtectedRoute>
              } />
              <Route path="/reports/profit-and-loss" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ProfitAndLoss />
                </ProtectedRoute>
              } />
              <Route path="/reports/receivable" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Receive />
                </ProtectedRoute>
              } />
              <Route path="/reports/payable" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Payable />
                </ProtectedRoute>
              } />
              
              <Route path="/reports/erp" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ERP />
                </ProtectedRoute>
              } />
              <Route path="/payment/receipt" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ReceiptSale />
                </ProtectedRoute>
              } />
              {/* Bills */}
              <Route path="/bills/manage" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ManageBill />
                </ProtectedRoute>
              } />
              <Route path="/bills/create" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CreateBill />
                </ProtectedRoute>
              } />

              {/* Inventory */}
              <Route path="/inventory/overview" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Inventory />
                </ProtectedRoute>
              } />
              <Route path="/inventory/payments" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SupplyPay />
                </ProtectedRoute>
              } />
              <Route path="/inventory/product-list" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ProductList />
                </ProtectedRoute>
              } />
              <Route path="/inventory/print-bar-code" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Barcode />
                </ProtectedRoute>
              } />
              <Route path="/inventory/manage" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Manage />
                </ProtectedRoute>
              } />
              <Route path="/inventory/supply" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <SupplyChain />
                </ProtectedRoute>
              } />
              <Route path="/inventory/stock" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Stock />
                </ProtectedRoute>
              } />
              <Route path="/inventory/supplierList" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Supply />
                </ProtectedRoute>
              } />
              <Route path="/inventory/transfer" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Transfer />
                </ProtectedRoute>
              } />
              <Route path="/inventory/customer" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CustomerList />
                </ProtectedRoute>
              } />

              {/* Ledger */}
              <Route path="/ledger/list" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <LedgerList />
                </ProtectedRoute>
              } />
              <Route path="/ledger/create" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <LedgerCreate />
                </ProtectedRoute>
              } />

              {/* Vouchers */}
              <Route path="/vouchers/credit" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CreditVoucher />
                </ProtectedRoute>
              } />
              <Route path="/vouchers/debit" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DebitVoucher />
                </ProtectedRoute>
              } />
              <Route path="/vouchers/create" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CreateVoucher />
                </ProtectedRoute>
              } />
              <Route path="/vouchers/journal" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <JournalVoucher />
                </ProtectedRoute>
              } />

              {/* CRM */}
              <Route path="/CRM/leads" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Leads />
                </ProtectedRoute>
              } />
              <Route path="/CRM/deals" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Deals />
                </ProtectedRoute>
              } />
              <Route path="/CRM/analytics" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Analytics />
                </ProtectedRoute>
              } />

              {/* HRM */}
              <Route path="/HRM/list" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <List />
                </ProtectedRoute>
              } />
              <Route path="/HRM/payroll" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Payroll />
                </ProtectedRoute>
              } />
              <Route path="/HRM/reports" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/HRM/timestamp" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Timestamp />
                </ProtectedRoute>
              } />

              {/* POS */}
              <Route path="/pos/all" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Pos_Dashboard />
                </ProtectedRoute>
              } />
               <Route path="/pos/dashboard" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboards />
                </ProtectedRoute>
              } />
              <Route path="/pos/new_sales" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <New_Sales />
                </ProtectedRoute>
              } />
              <Route path="/pos/fav" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Favorites />
                </ProtectedRoute>
              } />
              <Route path="/pos/beverages" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Beverages />
                </ProtectedRoute>
              } />
              <Route path="/pos/dessert" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dessert />
                </ProtectedRoute>
              } />
              <Route path="/pos/hold" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Hold />
                </ProtectedRoute>
              } />
              <Route path="/pos/dis" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dis />
                </ProtectedRoute>
              } />
              <Route path="/pos/refund" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Refund />
                </ProtectedRoute>
              } />
              <Route path="/pos/stock" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Movement />
                </ProtectedRoute>
              } />
              <Route path="/pos/products" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Products />
                </ProtectedRoute>
              } />
              <Route path="/pos/services" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Services />
                </ProtectedRoute>
              } />
              <Route path="/pos/manage" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Manage_Sales />
                </ProtectedRoute>
              } />
              <Route path="/pos/inventory" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Inventory_Manage />
                </ProtectedRoute>
              } />
              <Route path="/pos/payments" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Manage_Payments />
                </ProtectedRoute>
              } />
              <Route path="/pos/customers" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Manage_Customers />
                </ProtectedRoute>
              } />
              <Route path="/pos/reports" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Manage_Reports />
                </ProtectedRoute>
              } />
              <Route path="/pos/settings" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Manage_Settings />
                </ProtectedRoute>
              } />
              <Route path="/pos/customer_groups" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Customer_Group />
                </ProtectedRoute>
              } />
              <Route path="/pos/user" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <User_Pos />
                </ProtectedRoute>
              } />
              <Route path="/pos/roles" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Roles />
                </ProtectedRoute>
              } />
              <Route path="/pos/sales" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <User_Sales />
                </ProtectedRoute>
              } />
              <Route path="/pos/contacts" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <User_Contact />
                </ProtectedRoute>
              } />
              <Route path="/pos/import_contacts" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Import_Contact />
                </ProtectedRoute>
              } />
              <Route path="/pos/add" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Add />
                </ProtectedRoute>
              } />
              <Route path="/pos/list" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <List_p />
                </ProtectedRoute>
              } />
              <Route path="/pos/returns" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Returns />
                </ProtectedRoute>
              } />

              {/* User Routes */}
              <Route path="/user/new_sales" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <New_Sale />
                </ProtectedRoute>
              } />
              <Route path="/user/fav" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Fav />
                </ProtectedRoute>
              } />
              <Route path="/user/beverages" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Beverage />
                </ProtectedRoute>
              } />
              <Route path="/user/dessert" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Desserts />
                </ProtectedRoute>
              } />
              <Route path="/user/hold" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Holds />
                </ProtectedRoute>
              } />
              <Route path="/user/dis" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Discounted />
                </ProtectedRoute>
              } />
              <Route path="/user/refund" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Refunds />
                </ProtectedRoute>
              } />
              <Route path="/user/stock" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Movements />
                </ProtectedRoute>
              } />
              <Route path="/user/products" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Product />
                </ProtectedRoute>
              } />
              <Route path="/user/manage" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Manage_Sale />
                </ProtectedRoute>
              } />
              <Route path="/user/inventory" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Inventory_Manages />
                </ProtectedRoute>
              } />
              
              <Route path="/user/payments" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Manage_Payment />
                </ProtectedRoute>
              } />
              <Route path="/user/customers" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Manage_Customer />
                </ProtectedRoute>
              } />
              <Route path="/user/reports" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Manage_Report />
                </ProtectedRoute>
              } />

              {/* Catch-all route redirects to login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;