import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import useStore from "../services/useAppStore";
import { useTranslation } from 'react-i18next';

const MenuLeft: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const {
    serviceDetails,
    setLeftMenuItem,
    selectedLeftMenuItem,
    selectedNavbarItem,
    detailReportAvailability,
  } = useStore();

  const isPrepaid =
    serviceDetails?.promotionType === "Prepaid" ||
    serviceDetails?.promotionType === null;

  // Keep English keys for internal logic
  const postPaidItems = [
    "summary",
    "dailyUsage",
    "giftData",
    "history",
    "redeemData",
    "happyDay",
    "more",
  ];
  const prePaidItems = ["mainPackages", "dataAddOns"];
  const broadbandItems = isPrepaid ? prePaidItems : postPaidItems;
  const peoTVItems = ["myPackage", "vod", "peoTvGo", "packages"];
  const voiceItems = ["myPackage", "callForwarding"];

  let items =
    selectedNavbarItem === "Broadband"
      ? broadbandItems
      : selectedNavbarItem === "PeoTV"
      ? peoTVItems
      : voiceItems;

  const [selectedItem, setSelectedItem] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mousePosition, setMousePosition] = useState<{ mouseX: number; mouseY: number } | null>(null);

  // Calculate grid columns based on screen size and number of items
  const getGridItemWidth = () => {
    // If there are only 2 items, make them take full width (6 columns each)
    if (items.length <= 2) return 6;
    
    // For more items, use responsive columns
    if (isXs || isSm) return 3; // 4 items per row (12/3)
    if (isMd) return 2.4;       // 5 items per row (12/5)
    if (isLgUp) return 12/7;    // 7 items per row (matches original layout)
    return 3;                   // Default fallback
  };

  const gridItemWidth = getGridItemWidth();

  // Helper function to get display text
  const getDisplayText = (itemKey: string): string => {
    return t(`menu.${itemKey}`);
  };

  // Helper function to convert display text back to key (for backward compatibility)
  const getKeyFromDisplayText = (displayText: string): string => {
    // Map of display texts to keys for backward compatibility
    const displayToKeyMap: { [key: string]: string } = {
      "Summary": "summary",
      "Daily Usage": "dailyUsage",
      "Gift Data": "giftData",
      "History": "history",
      "Redeem Data": "redeemData",
      "Happy Day": "happyDay",
      "More": "more",
      "Main Packages": "mainPackages",
      "Data Add-Ons": "dataAddOns",
      "My Package": "myPackage",
      "VOD": "vod",
      "PEOTVGO": "peoTvGo",
      "Packages": "packages",
      "Call Forwarding": "callForwarding",
    };
    
    return displayToKeyMap[displayText] || displayText;
  };

  useEffect(() => {
    if (isPrepaid && selectedNavbarItem === "Broadband") {
      setSelectedItem("mainPackages");
      setLeftMenuItem("Main Packages"); // Keep backward compatibility for store
    } else if (!isPrepaid && selectedNavbarItem === "Broadband") {
      setSelectedItem("summary");
      setLeftMenuItem("Summary"); // Keep backward compatibility for store
    } else {
      setSelectedItem("myPackage");
      setLeftMenuItem("My Package"); // Keep backward compatibility for store
    }
  }, [isPrepaid, selectedNavbarItem]);

  useEffect(() => {
    // Convert selectedLeftMenuItem to key format for internal use
    const selectedKey = getKeyFromDisplayText(selectedLeftMenuItem);
    setSelectedItem(selectedKey);
  }, [selectedLeftMenuItem]);

  const handleMoreClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setMousePosition({ mouseX: event.clientX, mouseY: event.clientY });
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMousePosition(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "more-popover" : undefined;

  // More menu items with their translation keys
  const moreMenuItems = [
    {
      key: detailReportAvailability ? "disableDetailReport" : "subscription",
      displayKey: detailReportAvailability ? "disableDetailReport" : "subscription",
      legacyValue: detailReportAvailability ? "DisableDetailReport" : "Subscription"
    },
    {
      key: "contactInformationChange",
      displayKey: "contactInformationChange", 
      legacyValue: "ContactInformationChange"
    }
  ];

  return (
    <Box
      sx={{
        width: "100%",
        color: "#FFFFFF1A",
        padding: 1,
        background: "linear-gradient(to right, #0068B1, #183366)",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        boxSizing: "border-box",
      }}
    >
      <Grid container spacing={1} sx={{ width: "100%", margin: 0 }}>
        {items.map((item, index) => (
          <Grid 
            item 
            xs={gridItemWidth} 
            key={index} 
            sx={{ 
              padding: "4px !important",
              minWidth: items.length <= 2 ? "50%" : "100px", // Full width for 2 items
              flexGrow: items.length <= 2 ? 1 : 0 // Allow equal distribution for 2 items
            }}
          >
            <Button
              fullWidth
              sx={{
                backgroundColor: item === selectedItem ? "rgba(255, 255, 255, 0.15)" : "#192B5F",
                borderRadius: "8px",
                padding: "8px 4px",
                color: "#ffffff",
                minHeight: "64px",
                justifyContent: "center",
                margin: 0,
                "&:hover": {
                  backgroundColor: item === selectedItem ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.1)",
                  borderColor: "#50B748",
                },
                width: items.length <= 2 ? "100%" : undefined // Full width for 2 items
              }}
              onClick={(event) => {
                if (item === "more") {
                  handleMoreClick(event);
                } else {
                  setSelectedItem(item);
                  // Convert key back to legacy format for store compatibility
                  const legacyMap: { [key: string]: string } = {
                    "summary": "Summary",
                    "dailyUsage": "Daily Usage",
                    "giftData": "Gift Data",
                    "history": "History",
                    "redeemData": "Redeem Data",
                    "happyDay": "Happy Day",
                    "mainPackages": "Main Packages",
                    "dataAddOns": "Data Add-Ons",
                    "myPackage": "My Package",
                    "vod": "VOD",
                    "peoTvGo": "PEOTVGO",
                    "packages": "Packages",
                    "callForwarding": "Call Forwarding",
                  };
                  setLeftMenuItem(legacyMap[item] || item);
                }
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: {
                    xs: "12px",
                    sm: "13px",
                    md: "14px",
                    lg: "16px"
                  },
                  color: "#FFFFFF",
                  textTransform: "capitalize",
                  fontWeight: 600,
                  textAlign: "center",
                  wordBreak: "break-word",
                  lineHeight: "1.2",
                  padding: "0 4px",
                }}
              >
                {getDisplayText(item)}
              </Typography>
            </Button>
          </Grid>
        ))}
      </Grid>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={mousePosition ? { top: mousePosition.mouseY + 10, left: mousePosition.mouseX } : undefined}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#1A2148",
            minWidth: 200,
            padding: 0,
            color: "#333",
          },
        }}
      >
        <List>
          {moreMenuItems.map((menuItem, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  handleClose();
                  setLeftMenuItem(menuItem.legacyValue);
                }}
              >
                <ListItemText>
                  <Typography variant="body2" sx={{ color: "#fff", fontSize: 16 }}>
                    {t(`menu.${menuItem.displayKey}`)}
                  </Typography>
                </ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </Box>
  );
};

export default MenuLeft;