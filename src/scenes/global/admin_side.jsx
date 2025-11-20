import { useState } from "react";
import { ProSidebar, Menu, SubMenu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import CakeIcon from "@mui/icons-material/Cake";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ReplayIcon from "@mui/icons-material/Replay";
import TimelineIcon from "@mui/icons-material/Timeline";
import InventoryIcon from "@mui/icons-material/Inventory";
import StorageIcon from "@mui/icons-material/Storage";
import PaymentIcon from "@mui/icons-material/Payment";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";

const Item = ({ title, to, icon, selected, setSelected }) => (
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
      <Link 
        to={to} 
        style={{ 
          color: 'inherit', 
          textDecoration: 'none',
          display: 'block',
          width: '100%'
        }}
      >
        {title}
      </Link>
    </Typography>
  </MenuItem>
);

const POSSidebar = () => {
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
                    fontSize: { xs: '1.2rem', md: '1.5rem' }
                  }}
                >
                  SYSTEM ADMIN
                </Typography>
              )}
            </MenuItem>

            {/* Main Menu Items */}
            <SubMenu 
              title="DASHBOARD" 
              icon={<PeopleAltOutlinedIcon sx={{ color: '#FFEC01' }} />}
              style={{
                color: '#FFEC01',
                fontWeight: 'bold',
              }}
            >
              <Item 
                title="Admin" 
                to="/super/admin" 
                icon={<PeopleOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="User Management" 
                to="/super/user" 
                icon={<PeopleOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="Billing Management" 
                to="/super/subs" 
                icon={<MonetizationOnOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
              <Item 
                title="Track" 
                to="/super/track" 
                icon={<PeopleOutlinedIcon />} 
                selected={selected} 
                setSelected={handleItemClick} 
              />
            </SubMenu>

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

export default POSSidebar;