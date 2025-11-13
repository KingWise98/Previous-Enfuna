import { useState } from "react";
import { ProSidebar, Menu, SubMenu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import BalanceOutlinedIcon from "@mui/icons-material/BalanceOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import TimelineIcon from "@mui/icons-material/Timeline";
import PaymentIcon from "@mui/icons-material/Payment";
import ReportIcon from "@mui/icons-material/Report";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CakeIcon from "@mui/icons-material/Cake";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ReplayIcon from "@mui/icons-material/Replay";
import InventoryIcon from "@mui/icons-material/Inventory";
import StorageIcon from "@mui/icons-material/Storage";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd"; 
import GroupAddIcon from "@mui/icons-material/GroupAdd"; 
import ImportContactsIcon from "@mui/icons-material/ImportContacts"; 


const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem active={selected === title} onClick={() => setSelected(title)} icon={icon}>
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Vendors = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          <MenuItem onClick={() => setIsCollapsed(!isCollapsed)} icon={<MenuOutlinedIcon />}> 
            {!isCollapsed && <Typography variant="h3">VENDOR</Typography>}
          </MenuItem>

          <Item title="Profile" to="/vendor/profile" icon={<CategoryOutlinedIcon />} selected={selected} setSelected={setSelected} />
           <Item title="Dashboard" to="/vendor/dashboard" icon={<CategoryOutlinedIcon />} selected={selected} setSelected={setSelected} />

          <SubMenu title="Point Of Sale (POS)" icon={<ShoppingCartOutlinedIcon />}>
         
          <Item title="Dashboard" to="/vendor/pos/all" icon={<CategoryOutlinedIcon />} selected={selected} setSelected={setSelected} />
    
          <Item title="Product Sales" to="/vendor/pos/new_sales" icon={<BusinessCenterOutlinedIcon />} selected={selected} setSelected={setSelected} />
          <Item title="Service Sales" to="/vendor/pos/service_sales" icon={<BusinessCenterOutlinedIcon />} selected={selected} setSelected={setSelected} />
        
  <SubMenu title="Products" icon={<HomeOutlinedIcon />}>
   <Item title="Manage Products" to="/vendor/pos/products" icon={<StorageIcon />} selected={selected} setSelected={setSelected} />
  <Item title="Manage Services" to="/vendor/pos/services" icon={<AssessmentIcon />} selected={selected} setSelected={setSelected} />
  
      
      
      <Item title="Order Management" to="/vendor/pos/hold" icon={<PauseCircleOutlineIcon />} selected={selected} setSelected={setSelected} />
      <Item title="Discounts & Promotions" to="/vendor/pos/dis" icon={<LocalOfferIcon />} selected={selected} setSelected={setSelected} />
      <Item title="Refunds & Returns" to="/vendor/pos/refund" icon={<ReplayIcon />} selected={selected} setSelected={setSelected} />
  </SubMenu>

  

             <Item title="Contacts" to="/vendor/pos/contacts" icon={<ImportContactsIcon />} selected={selected} setSelected={setSelected} />
            
            

  <Item title="Manage Sales" to="/vendor/pos/manage" icon={<TimelineIcon />} selected={selected} setSelected={setSelected} />
  
 
  
  <Item title="POS Report" to="/vendor/pos/reports" icon={<ReportIcon />} selected={selected} setSelected={setSelected} />
  <Item title="Settings" to="/vendor/pos/settings" icon={<SettingsIcon />} selected={selected} setSelected={setSelected} />
</SubMenu>

          

          <SubMenu title="Financial Management" icon={<AccountBalanceOutlinedIcon />}>
          <Item title="Dashboard" to="/vendor/pos/dashboard" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} />
          
          
            <SubMenu title="Sales" icon={<MonetizationOnOutlinedIcon />}>

            
              
              
              
            

            
              <Item title="Payment listing" to="/payment-listings" icon={<DescriptionOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Sales Receipt" to="/payment/receipt" icon={<DescriptionOutlinedIcon />} selected={selected} setSelected={setSelected} />
             
            </SubMenu>

           
            <Item title="General Ledger" to="/vendor/ledger/list" icon={<MenuBookOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Accounts Payable" to="/vendor/reports/payable" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Accounts Receivable" to="/vendor/reports/receivable" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <SubMenu title="Transactions" icon={<MenuBookOutlinedIcon />}>
            
            <SubMenu title="Notes" icon={<LocalOfferOutlinedIcon />}>
              <Item title="Credit Note" to="/vendor/vouchers/credit" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Debit Note" to="/vendor/vouchers/debit" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />
              
              <Item title="Journal Legder" to="/vendor/vouchers/journal" icon={<MenuBookOutlinedIcon />} selected={selected} setSelected={setSelected} />
              
            </SubMenu>
            
             
              
            
              
              
             
             
            </SubMenu>
            
            <SubMenu title="Reports" icon={<AssessmentOutlinedIcon />}>
            
            <Item title="Income" to="/vendor/reports/income" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Expense" to="/vendor/reports/expense" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Income vs Expenses" to="/vendor/reports/income-vs-expenses" icon={<PaymentIcon />} selected={selected} setSelected={setSelected} />
              
              <Item title="Profit & Loss" to="/vendor/reports/profit-and-loss" icon={<BalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Trial Balance" to="/vendor/reports/trial-balance" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Account Balance" to="/vendor/reports/account-Balance" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Cash Flow Statement" to="/vendor/reports/cash" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Balance Sheet" to="/vendor/reports/balance-sheet" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              
              
            </SubMenu>
          </SubMenu>

          <SubMenu title="Inventory Management" icon={<InventoryOutlinedIcon />}>
            <Item title="Overview" to="/inventory/overview" icon={<BookOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Manage Inventory" to="/inventory/manage" icon={<InventoryIcon />} selected={selected} setSelected={setSelected} />
             <Item title="Bills" to="/bills/manage" icon={<ReceiptOutlinedIcon />} selected={selected} setSelected={setSelected} />
           
            <SubMenu title="Purchases" icon={<PeopleOutlinedIcon />}>
              <Item title="Purchase Order" to="/pos/add" icon={<PersonAddIcon />} selected={selected} setSelected={setSelected} />
              <Item title="List Purchases" to="/pos/list" icon={<PeopleOutlineIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Purchase Returns" to="/pos/returns" icon={<GroupAddIcon />} selected={selected} setSelected={setSelected} />
              
            </SubMenu>
            
           
            <SubMenu title="Stock Movement" icon={<BusinessCenterOutlinedIcon />}>
            <Item title="Supply Chain" to="/inventory/supply" icon={<InventoryOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Supply Payments" to="/inventory/payments" icon={<InventoryOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Supplier List" to="/inventory/supplierList" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />
             
              <Item title="Transfer List" to="/inventory/transfer" icon={<InventoryOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Stock Movement" to="/inventory/stock" icon={<BusinessCenterOutlinedIcon />} selected={selected} setSelected={setSelected} />
            </SubMenu>
          </SubMenu>

          <SubMenu title="Customer Management" icon={<PeopleAltOutlinedIcon />}>
           <Item title="Customer List" to="/inventory/customer" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />
          
            <Item title="Leads" to="/crm/leads" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Deals" to="/crm/deals" icon={<BusinessCenterOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Analytics" to="/crm/analytics" icon={<TimelineIcon />} selected={selected} setSelected={setSelected} />
          </SubMenu>

          



         <Item title="LOG OUT" to="/" icon={<ReplayIcon />} selected={selected} setSelected={setSelected} />

         

        </Menu>
        
      </ProSidebar>

     
      
    </Box>
  );
};

export default Vendors;