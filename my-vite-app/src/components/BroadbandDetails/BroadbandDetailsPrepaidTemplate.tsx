import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import fetchServiceDetailByTelephone from "../../services/fetchServiceDetails";
import { parseTime } from "../../services/helperFunctions";
import useStore from "../../services/useAppStore";
import { DataBalance, ServiceDetailsAPIResponse } from "../../types/types";
import CircularProgressBar from "../CircularProgressBar";
import { FaClock, FaUser } from 'react-icons/fa'
import './BroadbandDetailsPrePaid.css'
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const commonButtonStyle = {
  borderRadius: "10px",
  width: "90%",
};

interface CustomSectionProps {
  label: string;
  value: string;
}

const CustomSection2 = ({ label, value }: CustomSectionProps) => (
  <div className="package-details-prepaid">
    <div className={`${label.toLowerCase().replace(/\s+/g, '-')}-indicator-prepaid`}>
      {label === "Active" ? <FaClock /> : <FaUser />} {value || "Loading..."}
    </div>
  </div>
);

interface ActionButtonProps {
  text: string;
  variant?: "outlined" | "contained";
  onClick: () => void;
}

const ActionButton = ({
  text,
  variant = "outlined",
  onClick,
}: ActionButtonProps) => (
  <Button
    variant={variant}
    sx={{
      ...commonButtonStyle,
      zIndex: 10,
      border: variant === "outlined" ? "3px solid #0056A2" : "1px solid #fff",
      backgroundColor: variant === "contained" ? "#192B5F" : "#fff",
      color: variant === "contained" ? "#ffffff" : "#0056A2",
      marginY: variant === "contained" ? 0 : 3,
      padding: variant === "contained" ? 1 : 2.5,
      "&:hover": {
        backgroundColor: variant === "contained" ? "#071835" : "#e0f7fa",
        border: variant === "outlined" ? "3px solid #004b8c" : "1px solid #fff",
        color: variant === "contained" ? "#ffffff" : "#004b8c",
      },
    }}
    onClick={onClick}
  >
    <Typography
      variant="body2"
      textTransform="capitalize"
      sx={{ fontWeight: "bold", fontSize: 16 }}
    >
      {text}
    </Typography>
  </Button>
);

interface BroadbandDetailsPrepaidTemplateProps {
  dataBalance: DataBalance[];
  isMain: boolean;
}

const BroadbandDetailsPrepaidTemplate = ({
  dataBalance,
}: BroadbandDetailsPrepaidTemplateProps) => {
  const { setLeftMenuItem, selectedTelephone } = useStore();
  const [serviceDetails, setServiceDetails] = useState<ServiceDetailsAPIResponse | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentPackage, setCurrentPackage] = useState<DataBalance | null>(null);
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down(1400));

  useEffect(() => {
    if (selectedTelephone) {
      const fetchDetails = async () => {
        const details = await fetchServiceDetailByTelephone(selectedTelephone);
        setServiceDetails(details);
      };
      fetchDetails();
    }
  }, [selectedTelephone]);

  useEffect(() => {
    if (dataBalance.length > 0) {
      setCurrentPackage(dataBalance[selectedIndex]);
    } else {
      setCurrentPackage(null);
    }
  }, [dataBalance, selectedIndex]);

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex < dataBalance.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const percentage = currentPackage
    ? (parseFloat(currentPackage.currentAmount) / parseFloat(currentPackage.initialAmount)) * 100
    : 0;

  const serviceID = serviceDetails?.listofBBService[0]?.serviceID || "Loading...";
  const serviceStatus = serviceDetails?.listofBBService[0]?.serviceStatus || "Loading...";
  const packageName = serviceDetails?.listofBBService[0]?.packageName || "Loading...";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#1B1D41",
        color: "#FFFFFF1A",
        padding: 2,
        borderRadius: "10px",
        boxShadow: "0px 3px 3px #0000004A",
        width: "100%",
      }}
    >
      <Box sx={{ 
        display: "flex",
        flexDirection: isMediumScreen ? "column" : "row",
        justifyContent: "space-between",
        gap: 3,
        width: "100%",
      }}>
        {/* Data Usage Container */}
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            padding: 3,
            border: "1px solid #0056A252",
            borderRadius: "10px",
            minHeight: isMediumScreen ? "auto" : "400px",
            backgroundColor: "#1B1D41",
            order: isMediumScreen ? 1 : 0,
          }}
        >
          {currentPackage ? (
            <>
              <Typography
                variant="body2"
                sx={{
                  fontSize: 20,
                  textAlign: "center",
                  fontWeight: 700,
                  color: "#FFF",
                }}
              >
                {currentPackage.packageName}
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  minHeight: "300px",
                }}
              >
                <ArrowBackIos
                  sx={{
                    color: selectedIndex === 0 ? "gray" : "#0056A2",
                    cursor: selectedIndex === 0 ? "not-allowed" : "pointer",
                    fontSize: "2rem",
                    position: "absolute",
                    left: isMobile ? "10px" : "30px",
                    zIndex: 2,
                  }}
                  onClick={handlePrev}
                />
                
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "400px",
                    position: 'relative',
                    height: '300px'
                  }}
                >
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={selectedIndex}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                      }}
                    >
                      <CircularProgressBar 
                        percentage={percentage} 
                        totalData={parseFloat(currentPackage.initialAmount)} 
                      />
                    </motion.div>
                  </AnimatePresence>
                </Box>

                <ArrowForwardIos
                  sx={{
                    color: selectedIndex === dataBalance.length - 1 ? "gray" : "#0056A2",
                    cursor: selectedIndex === dataBalance.length - 1 ? "not-allowed" : "pointer",
                    fontSize: "2rem",
                    position: "absolute",
                    right: isMobile ? "10px" : "30px",
                    zIndex: 2,
                  }}
                  onClick={handleNext}
                />
              </Box>
              <Box sx={{ textAlign: "center", width: "100%" }}>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 20, fontWeight: 700, color: "#FFF" }}
                >
                  {t('prepaid.dataUsage.gbUsedOf', { 
                    used: (parseFloat(currentPackage.initialAmount) - parseFloat(currentPackage.currentAmount)).toFixed(1), 
                    total: parseFloat(currentPackage.initialAmount).toFixed(1)
                  })}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: 16, fontWeight: 500, color: "#FFF" }}
                >
                  {t('prepaid.dataUsage.validTill', { 
                    date: parseTime(currentPackage.expireTime)?.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    }) || "N/A"
                  })}
                </Typography>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: 20, fontWeight: 700, color: "#FFF" }}
              >
                {t('prepaid.dataUsage.noDataToShow')}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Package Details Container */}
        <Box
          sx={{
            width: isMediumScreen ? "100%" : "280px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "start",
            alignItems: "center",
            gap: 2,
            padding: 2,
            backgroundColor: "#0056A2",
            borderRadius: "10px",
            minHeight: isMediumScreen ? "auto" : "400px",
            flexShrink: 0,
            order: isMediumScreen ? 2 : 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              backgroundColor: "#1B1D41",
              borderRadius: "10px",
              padding: 2,
              gap: 2,
            }}
          >
            <div className="package-name-prepaid">{packageName}</div>
            
            <Box sx={{ 
              display: "flex", 
              width: "100%", 
              justifyContent: "space-between",
              gap: 1,
              flexDirection: isMobile ? "column" : "row",
            }}>
              <CustomSection2 
                label="Active" 
                value={serviceStatus ? t('prepaid.status.active') : t('prepaid.status.inactive')} 
              />
              <CustomSection2 
                label="Account" 
                value={serviceID} 
              />
            </Box>
          </Box>

          <ActionButton
            text={t('prepaid.buttons.dataUsage')}
            variant="outlined"
            onClick={() => {}}
          />
          <ActionButton
            text={t('prepaid.buttons.getMainPackage')}
            variant="contained"
            onClick={() => {
              setLeftMenuItem("GetBroadbandMainPackage");
            }}
          />
          <ActionButton
            text={t('prepaid.buttons.getDataAddOns')}
            variant="contained"
            onClick={() => {
              setLeftMenuItem("GetBroadbandAddOnPackage");
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default BroadbandDetailsPrepaidTemplate;