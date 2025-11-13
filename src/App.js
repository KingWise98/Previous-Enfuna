import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Admin from "./admins/admin";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";


//Driver
import Driver from "./admins/driver/dashboard";
import Driver_Profile from "./admins/driver/profile";
import Drivers from "./admins/driver/dashboards";
import Driver_Page from "./admins/driver/page";
import Driver_Contacts from "./admins/driver/contacts";

//Rider
import Rider from "./admins/rider/dashboard";
import Rider_Profile from "./admins/rider/profile";
import Riders from "./admins/rider/dashboards";
import Rider_Page from "./admins/rider/page";
import Rider_Payments from "./admins/rider/payments";
import Rider_Group from "./admins/rider/group";
import Rider_Contacts from "./admins/rider/contacts";

//Vendor
import Vendor from "./admins/vendor/dashboard";
import Vendor_Dashboards from "./admins/vendor/pos/dashboard";

//VENDOR REPORTS
import Vendor_Income from "./admins/vendor/reports/income";
import Vendor_Expense from "./admins/vendor/reports/expense";
import Vendor_IncomeVsExpenses from "./admins/vendor/reports/income-vs-expenses";
import Vendor_TrialBalance from "./admins/vendor/reports/trial-balance";
import Vendor_BalanceSheet from "./admins/vendor/reports/balance-sheet";

import Vendor_AccountBalance from "./admins/vendor/reports/account-balance";
import Vendor_ProfitAndLoss from "./admins/vendor/reports/profit-and-loss";
import Vendor_Receipts from "./admins/vendor/pos/receipts";
import Vendor_Cash from "./admins/vendor/reports/cash";
import Vendor_Payable from "./admins/vendor/reports/payable";
import Vendor_Receive from "./admins/vendor/reports/receivable";
import Vendor_ERP from "./admins/vendor/reports/erp";

//VENDOR POS

import Vendor_Pos_Dashboard from "./admins/vendor/pos/all";
import Vendor_New_Sales from "./admins/vendor/pos/new_sales";
import Vendor_Service_Sales from "./admins/vendor/pos/service_sales";
import Vendor_Hold from "./admins/vendor/pos/hold";
import Vendor_Dis from "./admins/vendor/pos/dis";
import Vendor_Refund from "./admins/vendor/pos/refund";
import Vendor_Products from "./admins/vendor/pos/products";
import Vendor_Services from "./admins/vendor/pos/services";
import Vendor_Manage_Sales from "./admins/vendor/pos/manage";
import Vendor_Inventory_Manage from "./admins/vendor/pos/inventory";
import Vendor_Manage_Payments from "./admins/vendor/pos/payments";

import Vendor_Manage_Reports from "./admins/vendor/pos/reports";
import Vendor_Manage_Settings from "./admins/vendor/pos/settings";
import Vendor_User_Contact from "./admins/vendor/pos/contacts";

// Vendor Ledger
import Vendor_LedgerList from "./admins/vendor/ledger/index";


// Global Admin
import Super from "./scenes/super/admin";
import SuperUser from "./scenes/super/user";
import Subs from "./scenes/super/subs";
import Data from "./scenes/super/data";
import Track from "./scenes/super/track";

import Pos_Sidebar from "./scenes/global/Pos_Sidebar";
import Admin_side from "./scenes/global/admin_side";
import Rider_side from "./scenes/global/riders_side";
import Driver_side from "./scenes/global/driver_side";
import Vendor_side from "./scenes/global/vendor_side";
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
import Service_Sales from "./scenes/pos/service_sales";
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
import Service_Sale from "./scenes/user/service_sales";
import Fav from "./scenes/user/service";
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
       } else if (role === "super") {
      navigate("/super/admin");

    } else if (role === "normal") {
      navigate("/user/new_sales");
    }
     else if (role === "vendor") {
      navigate("/vendor/dashboard");
    }
     else if (role === "rider") {
      navigate("/rider/profile");
    }
     else if (role === "driver") {
      navigate("/driver/profile");
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
          {userRole === "super" && <Admin_side isSidebar={isSidebar} />}
          {userRole === "vendor" && <Vendor_side isSidebar={isSidebar} />}
          {userRole === "rider" && <Rider_side isSidebar={isSidebar} />}
          {userRole === "driver" && <Driver_side isSidebar={isSidebar} />}


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

               <Route path="/super/admin" element={
                <ProtectedRoute allowedRoles={["super"]}>
                  <Super />
                </ProtectedRoute>
              } />
               <Route path="/super/user" element={
                <ProtectedRoute allowedRoles={["super"]}>
                  <SuperUser />
                </ProtectedRoute>
              } />
              <Route path="/super/subs" element={
                <ProtectedRoute allowedRoles={["super"]}>
                  <Subs />
                </ProtectedRoute>
              } />

               <Route path="/super/track" element={
                <ProtectedRoute allowedRoles={["super"]}>
                  <Track />
                </ProtectedRoute>
              } />
               <Route path="/super/data" element={
                <ProtectedRoute allowedRoles={["super"]}>
                  <Data />
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
               <Route path="/pos/service_sales" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Service_Sales />
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
               <Route path="/user/service_sales" element={
                <ProtectedRoute allowedRoles={["normal"]}>
                  <Service_Sale />
                </ProtectedRoute>
              } />
              <Route path="/user/service" element={
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

              {/* VENDOR */}

              <Route path="/vendor/dashboard" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor />
                </ProtectedRoute>
              } />

               {/* Vendor Reports */}
              <Route path="/vendor/pos/receipts" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Receipts />
                </ProtectedRoute>
              } />
              <Route path="/vendor/reports/cash" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Cash />
                </ProtectedRoute>
              } />
              <Route path="/vendor/reports/income" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Income />
                </ProtectedRoute>
              } />
              <Route path="/vendor/reports/expense" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Expense />
                </ProtectedRoute>
              } />
              <Route path="/vendor/reports/income-vs-expenses" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_IncomeVsExpenses />
                </ProtectedRoute>
              } />
              <Route path="/vendor/reports/trial-balance" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_TrialBalance />
                </ProtectedRoute>
              } />
              <Route path="/vendor/reports/balance-sheet" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_BalanceSheet />
                </ProtectedRoute>
              } />
              <Route path="/vendor/reports/account-balance" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_AccountBalance />
                </ProtectedRoute>
              } />
              <Route path="/vendor/reports/profit-and-loss" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_ProfitAndLoss />
                </ProtectedRoute>
              } />
              <Route path="/vendor/reports/receivable" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Receive />
                </ProtectedRoute>
              } />
              <Route path="/vendor/reports/payable" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Payable />
                </ProtectedRoute>
              } />
              
              <Route path="/vendor/reports/erp" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_ERP />
                </ProtectedRoute>
              } />

              <Route path="/vendor/pos/dashboard" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Dashboards />
                </ProtectedRoute>
              } />
               {/* Vendor Ledger */}
              <Route path="/vendor/ledger/list" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_LedgerList />
                </ProtectedRoute>
              } />

               {/* VENDOR POS */}
              <Route path="/vendor/pos/all" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Pos_Dashboard />
                </ProtectedRoute>
              } />
               <Route path="/vendor/pos/dashboard" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Dashboards />
                </ProtectedRoute>
              } />
              <Route path="/vendor/pos/new_sales" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_New_Sales />
                </ProtectedRoute>
              } />
               <Route path="/vendor/pos/service_sales" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Service_Sales />
                </ProtectedRoute>
              } />
             
              <Route path="/vendor/pos/hold" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Hold />
                </ProtectedRoute>
              } />
              <Route path="/vendor/pos/dis" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Dis />
                </ProtectedRoute>
              } />
              <Route path="/vendor/pos/refund" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Refund />
                </ProtectedRoute>
              } />
              
              <Route path="/vendor/pos/products" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Products />
                </ProtectedRoute>
              } />
              <Route path="/vendor/pos/services" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Services />
                </ProtectedRoute>
              } />
              <Route path="/vendor/pos/manage" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Manage_Sales />
                </ProtectedRoute>
              } />
             
              <Route path="/vendor/pos/payments" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Manage_Payments />
                </ProtectedRoute>
              } />
              
              <Route path="/vendor/pos/reports" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Manage_Reports />
                </ProtectedRoute>
              } />
              <Route path="/vendor/pos/settings" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_Manage_Settings />
                </ProtectedRoute>
              } />
            
             
             
             
              <Route path="/vednor/pos/contacts" element={
                <ProtectedRoute allowedRoles={["vendor"]}>
                  <Vendor_User_Contact />
                </ProtectedRoute>
              } />

               {/* DRIVER */}

                <Route path="/driver/profile" element={
                <ProtectedRoute allowedRoles={["driver"]}>
                  <Driver_Profile />
                </ProtectedRoute>
              } />

           
              

               <Route path="/driver/dashboards" element={
                <ProtectedRoute allowedRoles={["driver"]}>
                  <Drivers />
                </ProtectedRoute>
              } />
              <Route path="/driver/page" element={
                <ProtectedRoute allowedRoles={["driver"]}>
                  <Driver_Page />
                </ProtectedRoute>
              } />
              <Route path="/driver/contacts" element={
                <ProtectedRoute allowedRoles={["driver"]}>
                  <Driver_Contacts />
                </ProtectedRoute>
              } />

               {/* RIDER */}
                <Route path="/rider/profile" element={
                <ProtectedRoute allowedRoles={["rider"]}>
                  <Rider_Profile />
                </ProtectedRoute>
              } />

              <Route path="/rider/dashboard" element={
                <ProtectedRoute allowedRoles={["rider"]}>
                  <Rider />
                </ProtectedRoute>
              } />

              <Route path="/rider/dashboards" element={
                <ProtectedRoute allowedRoles={["rider"]}>
                  <Riders />
                </ProtectedRoute>
              } />
              <Route path="/rider/page" element={
                <ProtectedRoute allowedRoles={["rider"]}>
                  <Rider_Page />
                </ProtectedRoute>
              } />
               <Route path="/rider/payments" element={
                <ProtectedRoute allowedRoles={["rider"]}>
                  <Rider_Payments />
                </ProtectedRoute>
              } />
               <Route path="/rider/group" element={
                <ProtectedRoute allowedRoles={["rider"]}>
                  <Rider_Group />
                </ProtectedRoute>
              } />
              <Route path="/rider/contacts" element={
                <ProtectedRoute allowedRoles={["rider"]}>
                  <Rider_Contacts />
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