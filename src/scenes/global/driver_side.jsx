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

const Driver = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  // Handle responsive behavior
  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const handleCloseSidebar = () => {
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
                  DRIVER
                </Typography>
              )}
            </MenuItem>

            {/* Main Menu Items */}
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
                to="/driver/dashboards" 
                icon={<CategoryOutlinedIcon />} 
                selected={selected} 
                setSelected={setSelected} 
              />
              <Item 
                title="New Drive" 
                to="/driver/drive" 
                icon={<LocalOfferIcon />} 
                selected={selected} 
                setSelected={setSelected} 
              />
              <Item 
                title="Queue" 
                to="/driver/queue" 
                icon={<ImportContactsIcon />} 
                selected={selected} 
                setSelected={setSelected} 
              />
              <Item 
                title="Deliveries" 
                to="/driver/delivery" 
                icon={<WorkOutlineIcon />} 
                selected={selected} 
                setSelected={setSelected} 
              />
              <Item 
                title="Agent" 
                to="/driver/agent" 
                icon={<ImportContactsIcon />} 
                selected={selected} 
                setSelected={setSelected} 
              />
              <Item 
                title="Payments" 
                to="/driver/page" 
                icon={<MonetizationOnOutlinedIcon />} 
                selected={selected} 
                setSelected={setSelected} 
              />
              <Item 
                title="Expenses" 
                to="/driver/expense" 
                icon={<TimelineIcon />} 
                selected={selected} 
                setSelected={setSelected} 
              />
             
              <Item 
                title="Statements" 
                to="/driver/statements" 
                icon={<DescriptionOutlinedIcon />} 
                selected={selected} 
                setSelected={setSelected} 
              />
              <Item 
                title="Customers" 
                to="/driver/contacts" 
                icon={<ImportContactsIcon />} 
                selected={selected} 
                setSelected={setSelected} 
              />
              <Item 
                title="Earnings" 
                to="/driver/earning" 
                icon={<ImportContactsIcon />} 
                selected={selected} 
                setSelected={setSelected} 
              />
            </SubMenu>

            <Item 
                          title="Support & Disputes" 
                          to="/driver/support" 
                          icon={<GroupAddIcon />} 
                          selected={selected} 
                          setSelected={PeopleOutlineIcon} 
                        />

            <Item 
              title="Profile" 
              to="/driver/profile" 
              icon={<PeopleOutlinedIcon />} 
              selected={selected} 
              setSelected={setSelected} 
            />

            <Item 
              title="LOG OUT" 
              to="/" 
              icon={<ReplayIcon />} 
              selected={selected} 
              setSelected={setSelected} 
            />
          </Menu>
        </ProSidebar>
      </Box>
    </>
  );
};

export default Driver;