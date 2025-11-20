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
import CloseIcon from "@mui/icons-material/Close";

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem 
      active={selected === title} 
      onClick={() => setSelected(title)} 
      icon={icon}
      style={{
        color: selected === title ? '#FFEC01' : '#ffffff',
        backgroundColor: selected === title ? '#0025DD' : 'transparent',
        margin: '2px 0',
        borderRadius: '8px',
      }}
    >
      <Typography style={{ fontWeight: selected === title ? 'bold' : 'normal' }}>
        {title}
      </Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Vendors = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  // Handle responsive behavior
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  // Update selected and close sidebar on mobile
  const handleItemClick = (title) => {
    setSelected(title);
    if (window.innerWidth <= 768) {
      setIsToggled(false);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <IconButton
        onClick={handleToggle}
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 9999,
          backgroundColor: '#0025DD',
          color: '#FFEC01',
          '&:hover': {
            backgroundColor: '#001FB8',
          },
          display: { xs: 'block', md: 'none' },
        }}
      >
        <MenuOutlinedIcon />
      </IconButton>

      {/* Overlay for mobile */}
      {isToggled && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9997,
            display: { xs: 'block', md: 'none' },
          }}
          onClick={() => setIsToggled(false)}
        />
      )}

      <Box
        sx={{
          "& .pro-sidebar": {
            position: { xs: 'fixed', md: 'relative' },
            zIndex: 9998,
            height: { xs: '100vh', md: 'auto' },
            left: { xs: isToggled ? 0 : '-100%', md: 0 },
            transition: 'left 0.3s ease',
            overflowY: 'auto',
          },
          "& .pro-sidebar-inner": {
            background: `linear-gradient(180deg, #0025DD 0%, #001FB8 100%) !important`,
            borderRight: '2px solid #FFEC01',
          },
          "& .pro-icon-wrapper": {
            backgroundColor: 'transparent !important',
          },
          "& .pro-inner-item": {
            padding: '8px 16px !important',
          },
          "& .pro-inner-item:hover": {
            backgroundColor: '#001FB8 !important',
          },
          "& .pro-menu-item.active": {
            backgroundColor: '#FFEC01 !important',
            color: '#0025DD !important',
          },
          "& .pro-sub-menu .pro-inner-list-item": {
            backgroundColor: '#001FB8 !important',
          },
        }}
      >
        <ProSidebar 
          collapsed={isCollapsed} 
          toggled={isToggled}
          onToggle={handleToggle}
          breakPoint="md"
        >
          <Menu iconShape="square">
            {/* Header with close button for mobile */}
            <MenuItem 
              onClick={() => {
                if (window.innerWidth > 768) {
                  setIsCollapsed(!isCollapsed);
                } else {
                  setIsToggled(false);
                }
              }} 
              icon={
                window.innerWidth <= 768 ? (
                  <CloseIcon sx={{ color: '#FFEC01' }} />
                ) : (
                  <MenuOutlinedIcon sx={{ color: '#FFEC01' }} />
                )
              }
              style={{
                backgroundColor: '#0025DD',
                color: '#FFEC01',
                borderBottom: '2px solid #FFEC01',
              }}
            > 
              {!isCollapsed && (
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: '#FFEC01',
                    fontWeight: 'bold',
                    fontSize: { xs: '1.5rem', md: '1.75rem' }
                  }}
                >
                  VENDOR
                </Typography>
              )}
            </MenuItem>

            {/* Point Of Sale Section */}
            <SubMenu 
              title="Point Of Sale (POS)" 
              icon={<ShoppingCartOutlinedIcon sx={{ color: '#ffffff' }} />}
              style={{
                color: '#ffffff',
                fontWeight: 'bold',
              }}
            >
              <Item 
                title="Dashboard" 
                to="/vendor/pos/all" 
                icon={<CategoryOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="Product Sales" 
                to="/vendor/pos/new_sales" 
                icon={<BusinessCenterOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="Service Sales" 
                to="/vendor/pos/service_sales" 
                icon={<BusinessCenterOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />

              <SubMenu 
                title="Products" 
                icon={<HomeOutlinedIcon sx={{ color: '#ffffff' }} />}
                style={{
                  color: '#ffffff',
                }}
              >
                <Item 
                  title="Product List" 
                  to="/vendor/pos/products" 
                  icon={<StorageIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Service List" 
                  to="/vendor/pos/services" 
                  icon={<AssessmentIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Order Management" 
                  to="/vendor/pos/hold" 
                  icon={<PauseCircleOutlineIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Discounts & Promotions" 
                  to="/vendor/pos/dis" 
                  icon={<LocalOfferIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Refunds & Returns" 
                  to="/vendor/pos/refund" 
                  icon={<ReplayIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
              </SubMenu>

              <Item 
                title="Contacts" 
                to="/vendor/pos/contacts" 
                icon={<ImportContactsIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="Manage Sales" 
                to="/vendor/pos/manage" 
                icon={<TimelineIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="POS Report" 
                to="/vendor/pos/reports" 
                icon={<ReportIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="Settings" 
                to="/vendor/pos/settings" 
                icon={<SettingsIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
            </SubMenu>

            {/* Financial Management Section */}
            <SubMenu 
              title="Financial Management" 
              icon={<AccountBalanceOutlinedIcon sx={{ color: '#ffffff' }} />}
              style={{
                color: '#ffffff',
                fontWeight: 'bold',
              }}
            >
              <Item 
                title="Dashboard" 
                to="/vendor/pos/dashboard" 
                icon={<HomeOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />

              <SubMenu 
                title="Sales" 
                icon={<MonetizationOnOutlinedIcon sx={{ color: '#ffffff' }} />}
                style={{
                  color: '#ffffff',
                }}
              >
                <Item 
                  title="Payment listing" 
                  to="/payment-listings" 
                  icon={<DescriptionOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Sales Receipt" 
                  to="/payment/receipt" 
                  icon={<DescriptionOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
              </SubMenu>

              <Item 
                title="General Ledger" 
                to="/vendor/ledger/list" 
                icon={<MenuBookOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="Accounts Payable" 
                to="/vendor/reports/payable" 
                icon={<AccountBalanceOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="Accounts Receivable" 
                to="/vendor/reports/receivable" 
                icon={<AccountBalanceOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />

              <SubMenu 
                title="Transactions" 
                icon={<MenuBookOutlinedIcon sx={{ color: '#ffffff' }} />}
                style={{
                  color: '#ffffff',
                }}
              >
                <SubMenu 
                  title="Notes" 
                  icon={<LocalOfferOutlinedIcon sx={{ color: '#ffffff' }} />}
                  style={{
                    color: '#ffffff',
                  }}
                >
                  <Item 
                    title="Credit Note" 
                    to="/vendor/vouchers/credit" 
                    icon={<PeopleOutlinedIcon />} 
                    selected={selected} 
                    setSelected={handleItemClick} 
                  />
                  <Item 
                    title="Debit Note" 
                    to="/vendor/vouchers/debit" 
                    icon={<PeopleOutlinedIcon />} 
                    selected={selected} 
                    setSelected={handleItemClick} 
                  />
                  <Item 
                    title="Journal Ledger" 
                    to="/vendor/vouchers/journal" 
                    icon={<MenuBookOutlinedIcon />} 
                    selected={selected} 
                    setSelected={handleItemClick} 
                  />
                </SubMenu>
              </SubMenu>

              <SubMenu 
                title="Reports" 
                icon={<AssessmentOutlinedIcon sx={{ color: '#ffffff' }} />}
                style={{
                  color: '#ffffff',
                }}
              >
                <Item 
                  title="Income" 
                  to="/vendor/reports/income" 
                  icon={<AccountBalanceOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Expense" 
                  to="/vendor/reports/expense" 
                  icon={<AccountBalanceOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Income vs Expenses" 
                  to="/vendor/reports/income-vs-expenses" 
                  icon={<PaymentIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Profit & Loss" 
                  to="/vendor/reports/profit-and-loss" 
                  icon={<BalanceOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Trial Balance" 
                  to="/vendor/reports/trial-balance" 
                  icon={<AccountBalanceOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Account Balance" 
                  to="/vendor/reports/account-Balance" 
                  icon={<AccountBalanceOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Cash Flow Statement" 
                  to="/vendor/reports/cash" 
                  icon={<AccountBalanceOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Balance Sheet" 
                  to="/vendor/reports/balance-sheet" 
                  icon={<AccountBalanceOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
              </SubMenu>
            </SubMenu>

            {/* Inventory Management Section */}
            <SubMenu 
              title="Inventory Management" 
              icon={<InventoryOutlinedIcon sx={{ color: '#ffffff' }} />}
              style={{
                color: '#ffffff',
                fontWeight: 'bold',
              }}
            >
              <Item 
                title="Overview" 
                to="/inventory/overview" 
                icon={<BookOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="Manage Inventory" 
                to="/inventory/manage" 
                icon={<InventoryIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="Bills" 
                to="/bills/manage" 
                icon={<ReceiptOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />

              <SubMenu 
                title="Purchases" 
                icon={<PeopleOutlinedIcon sx={{ color: '#ffffff' }} />}
                style={{
                  color: '#ffffff',
                }}
              >
                <Item 
                  title="Purchase Order" 
                  to="/pos/add" 
                  icon={<PersonAddIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="List Purchases" 
                  to="/pos/list" 
                  icon={<PeopleOutlineIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Purchase Returns" 
                  to="/pos/returns" 
                  icon={<GroupAddIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
              </SubMenu>

              <SubMenu 
                title="Stock Movement" 
                icon={<BusinessCenterOutlinedIcon sx={{ color: '#ffffff' }} />}
                style={{
                  color: '#ffffff',
                }}
              >
                <Item 
                  title="Supply Chain" 
                  to="/inventory/supply" 
                  icon={<InventoryOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Supply Payments" 
                  to="/inventory/payments" 
                  icon={<InventoryOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Supplier List" 
                  to="/inventory/supplierList" 
                  icon={<PeopleOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Transfer List" 
                  to="/inventory/transfer" 
                  icon={<InventoryOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
                <Item 
                  title="Stock Movement" 
                  to="/inventory/stock" 
                  icon={<BusinessCenterOutlinedIcon />} 
                  selected={selected} 
                  setSelected={handleItemClick} 
                />
              </SubMenu>
            </SubMenu>

            {/* Customer Management Section */}
            <SubMenu 
              title="Customer Management" 
              icon={<PeopleAltOutlinedIcon sx={{ color: '#ffffff' }} />}
              style={{
                color: '#ffffff',
                fontWeight: 'bold',
              }}
            >
              <Item 
                title="Customer List" 
                to="/inventory/customer" 
                icon={<PeopleOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="Leads" 
                to="/crm/leads" 
                icon={<PeopleOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="Deals" 
                to="/crm/deals" 
                icon={<BusinessCenterOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="Analytics" 
                to="/crm/analytics" 
                icon={<TimelineIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
            </SubMenu>

            <Item 
              title="Profile" 
              to="/vendor/profile" 
              icon={<PeopleOutlinedIcon />} 
              selected={selected} 
              setSelected={handleItemClick} 
            />

            <Item 
              title="LOG OUT" 
              to="/" 
              icon={<ReplayIcon />} 
              selected={selected} 
              setSelected={handleItemClick} 
            />
          </Menu>
        </ProSidebar>
      </Box>
    </>
  );
};

export default Vendors;