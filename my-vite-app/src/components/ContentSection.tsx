import { useEffect, useState } from "react";
import fetchDataBalance from "../services/prepaid/fetchDataBalance";
import useStore from "../services/useAppStore";
import { DataBalance } from "../types/types";
import BillPage from "./BillDetails/Billpage";
import BroadbandPrepaidAddOnPackages from "./BroadBandPrepaidPackageDetails/BroadbandPrepaidAddOnPackages";
import BroadbandPrepaidMainPackages from "./BroadBandPrepaidPackageDetails/BroadbandPrepaidMainPackages";
import BroadbandDetailsPostPaid from "./BroadbandDetails/BroadbandDetailsPostPaid";
import BroadbandDetailsPrePaid from "./BroadbandDetails/BroadbandDetailsPrePaid";
import BroadbandDetailsPrepaidAddons from "./BroadbandDetails/BroadbandDetailsPrepaidAddons";

import AddComplaints from "./AddComplaints";
import ChangeBroadbandPassword from "./BroadbandAdditionalUIs/ChangeBroadbandPassword";
import ChangeContactForm from "./BroadbandAdditionalUIs/ChangeContactInfo";
import SubscriptionPage from "./BroadbandAdditionalUIs/Subscription";
import BroadbandPostPaidGetAddOns from "./BroadbandDetails/BroadbandPostPaidGetAddOns";
import BroadbandPostPaidPackageUpgrader from "./BroadbandDetails/BroadbandPostPaidPackageUpgrader";
import DailyUsage from "./BroadbandDetails/DailyUsage";
import Complaints from "./Complaints";
import DigitalLife from "./DigitalLife";
import GiftData from "./GiftData";
import HappyDay from "./HappyDay";
import MenuLeft from "./MenuLeft";
import VerticalMenuLeft from "./VerticalMenuLeft";
import NewServicesPage from "./NewServices/NewServicesPage";
import MyPackagePeotv from "./PeoTV/MyPackagePeotv";
import PeoTvGo from "./PeoTV/PeoTvGo";
import PhoneNumberList from "./ProfileMenuUIs/PhoneNumberList";
import UserProfile from "./ProfileMenuUIs/UserProfile";
import Promotion from "./Promotion";
import Redeem from "./Redeem";
import TransactionsHistory from "./TransactionsHistory";
import CallForwarding from "./Voice/CallForwarding";
import MyPackageVoice from "./Voice/MyPackageVoice";
import GetExtraGB from "./BroadbandDetails/GetExtraGB";
import DetailedUsage from "./BroadbandDetails/DetailedUsage";
import ProtocolReport from "./BroadbandDetails/ProtocolReport";
import fetchDetaliedReportAvailability from "../services/postpaid/enableDetailedReport/fetchDetaliedReportAvailability";
import DisableDetailedReport from "./BroadbandDetails/DisableDetailedReport";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import VideoOnDemand from "./PeoTV/VideoOnDemand";

import History from "./DataAddonHistory";

import { Typography, useMediaQuery, useTheme } from "@mui/material"; // Import useMediaQuery and useTheme
import PeoTvPackages from "./PeoTV/PeoTvPackages";

const UnderConstruction = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "450px",
        backgroundColor: "white",
        borderRadius: 3,
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Typography variant="body2" sx={{ color: "#0056A2", fontSize: 24 }}>
        Under Construction
      </Typography>
    </Box>
  );
};

const ContentSection = () => {
  const [addOnData, setAddOnData] = useState<DataBalance[]>([]);
  const [mainData, setMainData] = useState<DataBalance[]>([]);
  const {
    selectedLeftMenuItem,
    selectedTelephone,
    selectedAccountNo,
    packageListUpdate,
    selectedNavbarItem,
    packageName,
    serviceDetails,
    setDetailReportAvailability,
  } = useStore();

  const theme = useTheme(); // Initialize useTheme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen is 'sm' (small) or down

  const disabledItems = [
    "New Services",
    "Promotion",
    "Digital Life",
    "Bill",
    "Hot Devices",
    "Complaints",
    "SUBMIT YOUR COMPLAINT",
    "My Profile",
    "Manage Connections",
    "Subscription",
    "ContactInformationChange",
    "BroadbandPasswordChange",
    "GetExtraGB",
  ];

  useEffect(() => {
    const getDetailedReportAvalability = async () => {
      const subcriberID = serviceDetails?.listofBBService[0]?.serviceID;
      if (subcriberID) {
        const response = await fetchDetaliedReportAvailability(subcriberID);
        setDetailReportAvailability(response!["availability"]);
      }
    };
    getDetailedReportAvalability();
  }, [serviceDetails]);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = await fetchDataBalance(selectedTelephone);

      const { addOnData, mainData } = data!.reduce(
        (acc, item) => {
          if (item.packageCategory === "Add-ons") {
            acc.addOnData.push(item);
          } else {
            acc.mainData.push(item);
          }
          return acc;
        },
        { addOnData: [], mainData: [] } as {
          addOnData: DataBalance[];
          mainData: DataBalance[];
        }
      );
      setAddOnData(addOnData);
      setMainData(mainData);
    };

    fetchData();
  }, [selectedTelephone, packageListUpdate]);

  const renderContent = () => {
    const isGridItemCandidate = [
      "Summary",
      "Daily Usage",
      "My Package",
      "GetExtraGB",
    ].includes(selectedLeftMenuItem);

    if (isMobile && isGridItemCandidate) {
      return (
        <Grid container spacing={2}> {/* Main grid container for mobile */}
          {/* Grid Row 1 for mobile */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {selectedLeftMenuItem === "Summary" && (
                <Grid item xs={12} sm={6}> {/* xs=12 for stacking on very small mobile, sm=6 for 2-column on larger mobile/tablet */}
                  <BroadbandDetailsPostPaid />
                </Grid>
              )}
              {selectedLeftMenuItem === "Daily Usage" && (
                <Grid item xs={12} sm={6}>
                  <DailyUsage />
                </Grid>
              )}
            </Grid>
          </Grid>

          {/* Grid Row 2 for mobile */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {selectedLeftMenuItem === "My Package" && (
                <Grid item xs={12} sm={6}>
                  {selectedNavbarItem === "Broadband" && <MyPackagePeotv />}
                  {selectedNavbarItem === "Voice" && <MyPackageVoice />}
                </Grid>
              )}
              {selectedLeftMenuItem === "GetExtraGB" && (
                <Grid item xs={12} sm={6}>
                  <GetExtraGB packageName={packageName} />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      );
    }

    // Default rendering for desktop or for non-grid items on mobile
    switch (selectedLeftMenuItem) {
      case "Summary":
        return <BroadbandDetailsPostPaid />;
      case "Daily Usage":
        return <DailyUsage />;
      case "Gift Data":
        return <GiftData />;
      case "History":
        return <History />;
      case "Redeem Data":
        return <Redeem />;
      case "Happy Day":
        return <HappyDay />;
      case "Subscription":
        return <SubscriptionPage />;
      case "ContactInformationChange":
        return <ChangeContactForm />;
      case "BroadbandPasswordChange":
        return <ChangeBroadbandPassword />;
      case "DetailedUsageDetails":
        return <DetailedUsage onClose={() => {}} />;
      case "ProtocolReport":
        return <ProtocolReport />;
      case "PostPaidPackageUpgrade":
        return <BroadbandPostPaidPackageUpgrader />;
      case "GetExtraGB":
        return <GetExtraGB packageName={packageName} />;
      case "GetPostpaidAddOnPackages":
        return <BroadbandPostPaidGetAddOns />;
      case "DisableDetailReport":
        return <DisableDetailedReport />;
      case "Main Packages":
        return <BroadbandDetailsPrePaid dataBalance={mainData} />;
      case "Data Add-Ons":
        return <BroadbandDetailsPrepaidAddons dataBalance={addOnData} />;
      case "GetBroadbandMainPackage":
        return <BroadbandPrepaidMainPackages />;
      case "GetBroadbandAddOnPackage":
        return <BroadbandPrepaidAddOnPackages />;
      case "Transaction":
        return <TransactionsHistory serviceId={selectedTelephone} />;
      case "My Package":
        // Conditional rendering for My Package based on navbar item
        if (selectedNavbarItem === "Broadband") {
          return <MyPackagePeotv />;
        } else if (selectedNavbarItem === "PeoTV") {
          return <MyPackagePeotv />;
        } else if (selectedNavbarItem === "Voice") {
          return <MyPackageVoice />;
        }
        return null; // Fallback
      case "VOD":
        return <VideoOnDemand />;
      case "PEOTVGO":
        return <PeoTvGo />;
      case "Packages":
        return <PeoTvPackages />;
      case "Call Forwarding":
        return <CallForwarding telephoneNo={selectedTelephone} />;
      case "New Services":
        return <NewServicesPage telephoneNo={selectedTelephone} />;
      case "Promotion":
        return <Promotion telephoneNo={selectedTelephone} />;
      case "Digital Life":
        return <DigitalLife />;
      case "Bill":
        return <BillPage telephoneNo={selectedTelephone} accountNo={selectedAccountNo} />;
      case "Hot Devices":
        return <UnderConstruction />;
      case "Complaints":
        return <Complaints />;
      case "SUBMIT YOUR COMPLAINT":
        return <AddComplaints telephoneNo={selectedTelephone} />;
      case "My Profile":
        return <UserProfile />;
      case "Manage Connections":
        return <PhoneNumberList />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: "#0F3B7A",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(15, 59, 122, 0.9)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Conditional rendering for MenuLeft/VerticalMenuLeft based on screen size and selectedNavbarItem */}
      {!disabledItems.includes(selectedLeftMenuItem) && (
        <Box sx={{ width: "100%" }}>
          {/* On mobile, always use VerticalMenuLeft if not disabled, otherwise for desktop keep the MenuLeft logic */}
          {isMobile ? (
            <VerticalMenuLeft />
          ) : (
            (selectedNavbarItem === "Broadband" || selectedNavbarItem === "") ? (
              <VerticalMenuLeft />
            ) : (
              <MenuLeft />
            )
          )}
        </Box>
      )}
      <Box
        sx={{
          width: disabledItems.includes(selectedLeftMenuItem) ? "100%" : (isMobile ? "100%" : "100%"), // Adjusted width for mobile
          height: "100%",
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default ContentSection;