"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import ReceiptIcon from "@mui/icons-material/Receipt";
import ArchiveIcon from "@mui/icons-material/Archive";
import InventoryIcon from "@mui/icons-material/Inventory";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import StoreIcon from "@mui/icons-material/Store";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ReviewsIcon from "@mui/icons-material/Reviews";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

type Anchor = "left";

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false,
  });

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const iconArray = [
    <DashboardIcon />,
    <MenuIcon />,
    <AccountCircleIcon />,
    <FormatAlignCenterIcon />,
    <ReceiptIcon />,
    <ArchiveIcon />,
    <InventoryIcon />,
    <ReviewsIcon />,
    <SettingsIcon />,
    <QrCode2Icon />,
    <PeopleIcon />,
    <InventoryIcon />,

    <StoreIcon />,
  ];

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 300 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {[
          { text: "Dashboard", href: "/admin/dashboard" },
          { text: "Menu", href: "/admin/menu" },
          { text: "My Profile", href: "/admin/info" },
          { text: "Category", href: "/admin/categories" },
          { text: "Daily Transaction", href: "/admin/transaction" },
          { text: "Archive Transaction", href: "/admin/archiveTransaction" },
          { text: "Inventory", href: "/admin/inventory" },
          { text: "Reward", href: "/admin/reward" },

          { text: "Store Setting", href: "/admin/storeInfo" },
          { text: "QR Generator", href: "/admin/generateqr" },
          { text: "Employee", href: "/admin/employee" },
          { text: "Branches", href: "/admin/selectBranch" },
        ].map((item, index) => (
          <ListItem sx={{ textAlign: "center" }} key={item.text}>
            <ListItemButton component="a" href={item.href}>
              <ListItemIcon>
                <ListItemIcon>
                  {iconArray[index % iconArray.length]}
                </ListItemIcon>
              </ListItemIcon>
              <ListItemText primary={item.text} sx={{ textAlign: "left" }} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem sx={{ textAlign: "center" }}>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ textAlign: "left" }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      {(["left"] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <ArrowForwardIosIcon style={{ fontSize: 35, color: "#DB1B1B" }} />
          </Button>
          <Drawer
            // variant="permanent"
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
