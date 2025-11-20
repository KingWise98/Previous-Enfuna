import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Explore What Enfuna Has to Offer" />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What financial management features does Enfuna provide?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Enfuna offers a comprehensive suite of financial tools, including a centralized General Ledger, Accounts Payable and Receivable management, Asset Management, and Budgeting & Forecasting. Our system also provides detailed Financial Reporting and seamless Bank Reconciliation to ensure accuracy in financial data.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How does Enfuna help with accounts management?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Our platform tracks and manages company capital, monitors business expenses, and streamlines sales transactions. Additionally, it helps you analyze financial performance, generate reports and statements, and track employee attendance, development, and productivity for better financial oversight.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What inventory management capabilities does Enfuna offer?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            With Enfuna, you can efficiently track inventory levels and locations, utilize barcode scanning for seamless updates, and receive stock alerts. Our system also facilitates automated reordering, supplier management, inventory movement tracking, and detailed product variant management to optimize supply chain operations.
          </Typography>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How does Enfuna handle real-time payments and accounting?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Enfuna integrates real-time payment processing that instantly updates financial records. Our automated accounting system ensures accuracy by reconciling payments seamlessly. Additionally, businesses receive payment confirmations, transaction logs are maintained, and API integration allows smooth connectivity with accounting software. Data analytics tools help monitor financial performance and customer payment trends effectively.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
