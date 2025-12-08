"use client"

import { useState } from "react"
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar"
import { Box, IconButton, Typography, useTheme, Chip } from "@mui/material"
import { Link } from "react-router-dom"
import "react-pro-sidebar/dist/css/styles.css"
import { tokens } from "../../theme"
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"
import WorkOutlineIcon from "@mui/icons-material/WorkOutline"
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined"
import TimelineIcon from "@mui/icons-material/Timeline"
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined"
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined"
import PaymentIcon from "@mui/icons-material/Payment"
import ImportContactsIcon from "@mui/icons-material/ImportContacts"
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined"
import SettingsIcon from "@mui/icons-material/Settings"
import ReplayIcon from "@mui/icons-material/Replay"
import CloseIcon from "@mui/icons-material/Close"

const Item = ({ title, to, icon, selected, setSelected }) => {
  return (
    <MenuItem
      active={selected === title}
      onClick={() => setSelected(title)}
      icon={icon}
      style={{
        color: selected === title ? "#FFEC01" : "#ffffff",
        backgroundColor: selected === title ? "#0024DC" : "transparent",
        margin: "2px 0",
        borderRadius: "8px",
      }}
    >
      <Typography style={{ fontWeight: selected === title ? "bold" : "normal" }}>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  )
}

const Riders = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isToggled, setIsToggled] = useState(false)
  const [selected, setSelected] = useState("Dashboard")

  const handleToggle = () => {
    setIsToggled(!isToggled)
  }

  const handleItemClick = (title) => {
    setSelected(title)
    if (window.innerWidth <= 768) {
      setIsToggled(false)
    }
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <IconButton
        onClick={handleToggle}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 9999,
          backgroundColor: "#E4EBFE",
          color: "#FFEC01",
          "&:hover": {
            backgroundColor: "#E4EBFE",
          },
          display: { xs: "block", md: "none" },
        }}
      >
        <MenuOutlinedIcon />
      </IconButton>

      {/* Overlay for mobile */}
      {isToggled && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9997,
            display: { xs: "block", md: "none" },
          }}
          onClick={() => setIsToggled(false)}
        />
      )}

      <Box
        sx={{
          "& .pro-sidebar": {
            position: { xs: "fixed", md: "relative" },
            zIndex: 9998,
            height: { xs: "100vh", md: "auto" },
            left: { xs: isToggled ? 0 : "-100%", md: 0 },
            transition: "left 0.3s ease",
          },
          "& .pro-sidebar-inner": {
            background: `linear-gradient(180deg, #0025DD 0%, #001FB8 100%) !important`,
            borderRight: "2px solid #FFEC01",
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "8px 16px !important",
          },
          "& .pro-inner-item:hover": {
            backgroundColor: "#E4EBFE !important",
          },
          "& .pro-menu-item.active": {
            backgroundColor: "#FFEC01 !important",
            color: "#0025DD !important",
          },
        }}
      >
        <ProSidebar collapsed={isCollapsed} toggled={isToggled} onToggle={handleToggle} breakPoint="md">
          <Menu iconShape="square">
            <MenuItem
              onClick={() => {
                if (window.innerWidth > 768) {
                  setIsCollapsed(!isCollapsed)
                } else {
                  setIsToggled(false)
                }
              }}
              icon={
                window.innerWidth <= 768 ? (
                  <CloseIcon sx={{ color: "#FFEC01" }} />
                ) : (
                  <MenuOutlinedIcon sx={{ color: "#FFEC01" }} />
                )
              }
              style={{
                backgroundColor: "#0025DD",
                color: "#FFEC01",
                borderBottom: "2px solid #FFEC01",
              }}
            >
              {!isCollapsed && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img src="/logo1.png" alt="Enfuna" style={{ height: "80px", width: "auto" }} />
                </Box>
              )}
            </MenuItem>

            <Box sx={{ padding: "16px", color: "#ffffff", borderBottom: "1px solid #FFEC01" }}>
              <Typography sx={{ fontSize: "12px", color: "#FFEC01", fontWeight: "bold" }}>RIDER</Typography>
              <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>Dashboard</Typography>
            </Box>

            <Box
              sx={{
                padding: "12px",
                margin: "12px",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                textAlign: "left",
              }}
            >
              <Typography sx={{ fontSize: "14px", fontWeight: "bold", color: "#0025DD" }}>Peter Kure</Typography>
              <Typography sx={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Rider • Mukono</Typography>
              <Chip
                label="*Free Trial"
                size="small"
                sx={{
                  backgroundColor: "#FFEC01",
                  color: "#0025DD",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              />
            </Box>

            <Box sx={{ padding: "12px", margin: "12px" }}>
              <Box
                sx={{
                  backgroundColor: "#E4EBFE",
                  color: "#0025DD",
                  padding: "10px",
                  borderRadius: "8px",
                  textAlign: "center",
                  fontWeight: "bold",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#FFEC01",
                  },
                }}
              >
                Dashboard
              </Box>
            </Box>

            <Box sx={{ borderTop: "1px solid #FFEC01", margin: "12px 0" }} />

            <Item
              title="Trips"
              to="/rider/trips"
              icon={<WorkOutlineIcon />}
              selected={selected}
              setSelected={handleItemClick}
            />
            <Item
              title="Deliveries"
              to="/rider/deliveries"
              icon={<WorkOutlineIcon />}
              selected={selected}
              setSelected={handleItemClick}
            />
            <Item
              title="Payments"
              to="/rider/payments"
              icon={<MonetizationOnOutlinedIcon />}
              selected={selected}
              setSelected={handleItemClick}
            />
            <Item
              title="Earnings"
              to="/rider/earnings"
              icon={<MonetizationOnOutlinedIcon />}
              selected={selected}
              setSelected={handleItemClick}
            />
            <Item
              title="Expenses"
              to="/rider/expenses"
              icon={<TimelineIcon />}
              selected={selected}
              setSelected={handleItemClick}
            />
            <Item
              title="Wallet"
              to="/rider/wallet"
              icon={<AccountBalanceOutlinedIcon />}
              selected={selected}
              setSelected={handleItemClick}
            />
            <Item
              title="Transactions"
              to="/rider/transactions"
              icon={<ReceiptLongOutlinedIcon />}
              selected={selected}
              setSelected={handleItemClick}
            />
            <Item
              title="Financials & Reports"
              to="/rider/financials"
              icon={<PaymentIcon />}
              selected={selected}
              setSelected={handleItemClick}
            />
            <Item
              title="Customers"
              to="/rider/customers"
              icon={<ImportContactsIcon />}
              selected={selected}
              setSelected={handleItemClick}
            />
            <Item
              title="Support & Disputes"
              to="/rider/support"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={handleItemClick}
            />
            <Item
              title="Profile"
              to="/rider/profile"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={handleItemClick}
            />

            <Box sx={{ marginTop: "auto", borderTop: "1px solid #FFEC01", paddingTop: "12px" }}>
              <Item
                title="Settings"
                to="/rider/settings"
                icon={<SettingsIcon />}
                selected={selected}
                setSelected={handleItemClick}
              />
              <Item title="Logout" to="/" icon={<ReplayIcon />} selected={selected} setSelected={handleItemClick} />
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </>
  )
}

export default Riders
