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

const Riders = () => {
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
            {!isCollapsed && <Typography variant="h3">RIDER</Typography>}
          </MenuItem>
           <Item title="Business Summary" to="/rider/dashboard" icon={<CategoryOutlinedIcon />} selected={selected} setSelected={setSelected} />

          <SubMenu title="Dashboard" icon={<ShoppingCartOutlinedIcon />}>
         
          <Item title="Dashboard" to="/rider/dashboards" icon={<CategoryOutlinedIcon />} selected={selected} setSelected={setSelected} />
    
          <Item title="Rewards" to="/rider/page" icon={<BusinessCenterOutlinedIcon />} selected={selected} setSelected={setSelected} />
         
  

  

             <Item title="Contacts" to="/pos/contacts" icon={<ImportContactsIcon />} selected={selected} setSelected={setSelected} />
            
            

 
  
 
</SubMenu>

          

          <SubMenu title="Financial Management" icon={<AccountBalanceOutlinedIcon />}>
          <Item title="Dashboard" to="/pos/dashboard" icon={<HomeOutlinedIcon />} selected={selected} setSelected={setSelected} />
          
          
            <SubMenu title="Sales" icon={<MonetizationOnOutlinedIcon />}>

            
              
              
              
            

            
              <Item title="Payment listing" to="/payment-listings" icon={<DescriptionOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Sales Receipt" to="/payment/receipt" icon={<DescriptionOutlinedIcon />} selected={selected} setSelected={setSelected} />
             
            </SubMenu>

           
            <Item title="General Ledger" to="/ledger/list" icon={<MenuBookOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Accounts Payable" to="/reports/payable" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <Item title="Accounts Receivable" to="/reports/receivable" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
            <SubMenu title="Transactions" icon={<MenuBookOutlinedIcon />}>
            
            <SubMenu title="Notes" icon={<LocalOfferOutlinedIcon />}>
              <Item title="Credit Note" to="/vouchers/credit" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Debit Note" to="/vouchers/debit" icon={<PeopleOutlinedIcon />} selected={selected} setSelected={setSelected} />
              
              <Item title="Journal Legder" to="/vouchers/journal" icon={<MenuBookOutlinedIcon />} selected={selected} setSelected={setSelected} />
              
            </SubMenu>
            
             
              
            
              
              
             
             
            </SubMenu>
            
            <SubMenu title="Reports" icon={<AssessmentOutlinedIcon />}>
            
            <Item title="Income" to="/reports/income" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Expense" to="/reports/expense" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Income vs Expenses" to="/reports/income-vs-expenses" icon={<PaymentIcon />} selected={selected} setSelected={setSelected} />
              
              <Item title="Profit & Loss" to="/reports/profit-and-loss" icon={<BalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Trial Balance" to="/reports/trial-balance" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Account Balance" to="/reports/account-Balance" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Cash Flow Statement" to="/reports/cash" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              <Item title="Balance Sheet" to="/reports/balance-sheet" icon={<AccountBalanceOutlinedIcon />} selected={selected} setSelected={setSelected} />
              
              
            </SubMenu>
          </SubMenu>

         



         <Item title="LOG OUT" to="/" icon={<ReplayIcon />} selected={selected} setSelected={setSelected} />

         

        </Menu>
        
      </ProSidebar>

     
      
    </Box>
  );
};

export default Riders;