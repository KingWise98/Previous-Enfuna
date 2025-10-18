import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Rating,
  Snackbar,
  Alert,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  Avatar,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Modal,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Receipt as ReceiptIcon,
  Discount as DiscountIcon,
  Loyalty as LoyaltyIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Payment as PaymentIcon,
  LocalOffer as LocalOfferIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  History as HistoryIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  PhoneIphone as MobileMoneyIcon,
  Print as PrintIcon,
  AttachMoney as CashIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Restaurant,
  LocalHospital,
  Spa,
  LocalGroceryStore,
  Event,
  Work as ServiceIcon,
  ContentCut,
  Hotel,
  LocalDining,
  LocalBar,
  KingBed,
  RoomService,
  MedicalServices,
  ConfirmationNumber,
  Place
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const ServiceSalesPage = () => {
  // State Management
  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [rating, setRating] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [amountTendered, setAmountTendered] = useState(0);
  const [changeDue, setChangeDue] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [activeStep, setActiveStep] = useState(0);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [cartSearchText, setCartSearchText] = useState("");
  const [cashAmount, setCashAmount] = useState('');
  const [showAllServicesInCart, setShowAllServicesInCart] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("12:00");
  
  // Payment Methods and Discounts State
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [discountOffers, setDiscountOffers] = useState([]);
  
  // Withholding Tax State
  const [withholdingTaxEnabled, setWithholdingTaxEnabled] = useState(false);
  const [withholdingTaxRate, setWithholdingTaxRate] = useState(0.06); // 6%
  const [withholdingTaxAmount, setWithholdingTaxAmount] = useState(0);

  const navigate = useNavigate();

  // Dummy Data
  const dummyServices = [
    {
      id: 1,
      name: "Luxury Hotel Suite",
      description: "Premium suite with ocean view and all amenities included",
      price: 450000,
      category: "Hospitality",
      subcategory: "Hotels",
      serviceType: "hospitality",
      hospitalityType: "hotel",
      rating: 4.8,
      available: true,
      duration: 1440, // 24 hours in minutes
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300",
      features: ["Free WiFi", "Swimming Pool", "Spa Access", "Breakfast Included"]
    },
    {
      id: 2,
      name: "Fine Dining Experience",
      description: "Gourmet 5-course meal with wine pairing",
      price: 250000,
      category: "Hospitality",
      subcategory: "Restaurants",
      serviceType: "hospitality",
      hospitalityType: "restaurant",
      rating: 4.9,
      available: true,
      duration: 180, // 3 hours in minutes
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300",
      menuItems: [
        { name: "Appetizer Platter", price: 50000 },
        { name: "Main Course", price: 120000 },
        { name: "Dessert", price: 30000 },
        { name: "Wine Pairing", price: 50000 }
      ]
    },
    {
      id: 3,
      name: "Spa & Wellness Package",
      description: "Full body massage, facial treatment, and relaxation therapy",
      price: 180000,
      category: "Salons & Spas",
      subcategory: "Spa Services",
      serviceType: "salon",
      rating: 4.7,
      available: true,
      duration: 120, // 2 hours in minutes
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300",
      features: ["Aromatherapy", "Hot Stone", "Steam Room", "Refreshments"]
    },
    {
      id: 4,
      name: "Medical Consultation",
      description: "Comprehensive health check-up with specialist doctor",
      price: 150000,
      category: "Healthcare",
      subcategory: "Medical Services",
      serviceType: "healthcare",
      rating: 4.6,
      available: true,
      duration: 60, // 1 hour in minutes
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300",
      features: ["Blood Tests", "ECG", "Doctor Consultation", "Health Report"]
    },
    {
      id: 5,
      name: "Haircut & Styling",
      description: "Professional haircut, wash, and styling session",
      price: 45000,
      category: "Salons & Spas",
      subcategory: "Hair Services",
      serviceType: "salon",
      rating: 4.4,
      available: true,
      duration: 90, // 1.5 hours in minutes
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300",
      features: ["Consultation", "Hair Wash", "Cut & Style", "Finishing Products"]
    },
    {
      id: 6,
      name: "Event Planning Service",
      description: "Complete event management for weddings, corporate events",
      price: 2000000,
      category: "Event Management",
      subcategory: "Event Planning",
      serviceType: "event",
      rating: 4.8,
      available: true,
      duration: 480, // 8 hours in minutes
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300",
      features: ["Venue Selection", "Catering", "Decoration", "Coordination"]
    },
    {
      id: 7,
      name: "Bar & Lounge Experience",
      description: "Premium cocktail tasting with mixology session",
      price: 120000,
      category: "Hospitality",
      subcategory: "Bars & Lounges",
      serviceType: "hospitality",
      hospitalityType: "bar",
      rating: 4.5,
      available: true,
      duration: 120, // 2 hours in minutes
      image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=300",
      menuItems: [
        { name: "Craft Cocktails", price: 40000 },
        { name: "Appetizers", price: 30000 },
        { name: "Mixology Class", price: 50000 }
      ]
    },
    {
      id: 8,
      name: "Dental Check-up",
      description: "Complete dental examination and cleaning",
      price: 80000,
      category: "Healthcare",
      subcategory: "Dental Services",
      serviceType: "healthcare",
      rating: 4.6,
      available: true,
      duration: 45, // 45 minutes in minutes
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=300",
      features: ["Examination", "Cleaning", "X-Rays", "Consultation"]
    },
    {
      id: 9,
      name: "Manicure & Pedicure",
      description: "Luxury nail care treatment with massage",
      price: 75000,
      category: "Salons & Spas",
      subcategory: "Nail Services",
      serviceType: "salon",
      rating: 4.3,
      available: true,
      duration: 90, // 1.5 hours in minutes
      image: "https://images.unsplash.com/photo-1607778833979-4a89c0bc5be1?w=300",
      features: ["Soak", "Exfoliation", "Massage", "Polish"]
    },
    {
      id: 10,
      name: "Conference Room Booking",
      description: "Professional meeting space with AV equipment",
      price: 150000,
      category: "Hospitality",
      subcategory: "Business Services",
      serviceType: "hospitality",
      hospitalityType: "conference",
      rating: 4.4,
      available: true,
      duration: 480, // 8 hours in minutes
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300",
      features: ["Projector", "WiFi", "Catering", "Support Staff"]
    },
    {
      id: 11,
      name: "Fitness Training Session",
      description: "Personal training with certified fitness instructor",
      price: 60000,
      category: "Healthcare",
      subcategory: "Fitness Services",
      serviceType: "healthcare",
      rating: 4.7,
      available: true,
      duration: 60, // 1 hour in minutes
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300",
      features: ["Assessment", "Workout Plan", "Guidance", "Progress Tracking"]
    },
    {
      id: 12,
      name: "Catering Service",
      description: "Premium catering for events and gatherings",
      price: 350000,
      category: "Hospitality",
      subcategory: "Catering",
      serviceType: "hospitality",
      hospitalityType: "catering",
      rating: 4.5,
      available: true,
      duration: 240, // 4 hours in minutes
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=300",
      menuItems: [
        { name: "Buffet Setup", price: 200000 },
        { name: "Beverages", price: 80000 },
        { name: "Service Staff", price: 70000 }
      ]
    }
  ];

  const dummyPaymentMethods = [
    {
      id: 1,
      name: "Cash",
      type: "cash",
      icon: <CashIcon />,
      fields: []
    },
    {
      id: 2,
      name: "Credit Card",
      type: "card",
      icon: <CreditCardIcon />,
      fields: ["Card Number", "Card Holder", "Expiry Date", "CVV"]
    },
    {
      id: 3,
      name: "Mobile Money",
      type: "mobile",
      icon: <MobileMoneyIcon />,
      fields: ["Phone Number", "Transaction ID"]
    },
    {
      id: 4,
      name: "Bank Transfer",
      type: "bank",
      icon: <BankIcon />,
      fields: ["Bank Name", "Account Number", "Transaction Reference"]
    }
  ];

  const dummyDiscountOffers = [
    {
      id: 1,
      name: "First Time Booking",
      code: "WELCOME15",
      discount: 15,
      description: "15% off on your first service booking"
    },
    {
      id: 2,
      name: "Weekend Special",
      code: "WEEKEND20",
      discount: 20,
      description: "20% off on weekend bookings"
    },
    {
      id: 3,
      name: "Loyalty Discount",
      code: "LOYALTY10",
      discount: 10,
      description: "10% off for loyal customers"
    }
  ];

  const dummyCategoryMap = {
    "Hospitality": ["Hotels", "Restaurants", "Bars & Lounges", "Business Services", "Catering"],
    "Healthcare": ["Medical Services", "Dental Services", "Fitness Services"],
    "Salons & Spas": ["Spa Services", "Hair Services", "Nail Services"],
    "Event Management": ["Event Planning", "Venue Booking", "Coordination"]
  };

  const dummyPaymentHistory = [
    {
      id: "TXN-S001",
      date: new Date(2024, 0, 15, 14, 30),
      items: [
        { id: 1, name: "Luxury Hotel Suite", price: 450000, quantity: 1 },
        { id: 3, name: "Spa & Wellness Package", price: 180000, quantity: 1 }
      ],
      customer: { name: "Sarah Johnson", phone: "+256 712 345 678", email: "sarah.j@email.com" },
      paymentMethod: dummyPaymentMethods[1],
      paymentDetails: { "Card Number": "**** **** **** 1234", "Card Holder": "Sarah Johnson" },
      subtotal: 630000,
      discount: 0,
      tax: 113400,
      withholdingTax: 0,
      total: 743400,
      amountTendered: 743400,
      changeDue: 0,
      status: 'completed'
    },
    {
      id: "TXN-S002",
      date: new Date(2024, 0, 14, 10, 15),
      items: [
        { id: 5, name: "Haircut & Styling", price: 45000, quantity: 1 },
        { id: 9, name: "Manicure & Pedicure", price: 75000, quantity: 1 }
      ],
      customer: { name: "", phone: "", email: "" },
      paymentMethod: dummyPaymentMethods[0],
      paymentDetails: {},
      subtotal: 120000,
      discount: 12000,
      tax: 19440,
      withholdingTax: 0,
      total: 127440,
      amountTendered: 150000,
      changeDue: 22560,
      status: 'completed'
    }
  ];

  // Fetch initial data from backend APIs
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setServices(dummyServices);
      setFilteredServices(dummyServices);
      setPaymentMethods(dummyPaymentMethods);
      setDiscountOffers(dummyDiscountOffers);
      setPaymentHistory(dummyPaymentHistory);
    }, 1000);
  }, []);

  // Filter Services
  useEffect(() => {
    applyFilters();
  }, [category, subcategory, minPrice, maxPrice, rating, searchText, services]);

  const applyFilters = () => {
    const filtered = services
      .filter((service) => (category ? service.category === category : true))
      .filter((service) => (subcategory ? service.subcategory === subcategory : true))
      .filter((service) => service.price >= minPrice && service.price <= maxPrice)
      .filter((service) => (rating ? service.rating >= rating : true))
      .filter((service) => 
        service.name.toLowerCase().includes(searchText.toLowerCase()) ||
        service.description.toLowerCase().includes(searchText.toLowerCase())
      );

    setFilteredServices(filtered);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.discount) / 100 : 0;
  const taxableAmount = subtotal - discountAmount;
  const taxRate = 0.18; // 18% VAT
  const taxAmount = taxableAmount * taxRate;

  // Calculate withholding tax if enabled
  const calculatedWithholdingTax = withholdingTaxEnabled ? taxableAmount * withholdingTaxRate : 0;
  
  useEffect(() => {
    setWithholdingTaxAmount(calculatedWithholdingTax);
  }, [withholdingTaxEnabled, taxableAmount, withholdingTaxRate]);

  const totalAmount = taxableAmount + taxAmount - calculatedWithholdingTax;
  
  useEffect(() => {
    if (selectedPaymentMethod?.type === 'cash' && cashAmount) {
      const amount = parseFloat(cashAmount) || 0;
      setChangeDue(amount - totalAmount);
    } else {
      setChangeDue(0);
    }
  }, [cashAmount, totalAmount, selectedPaymentMethod]);

  const renderReceipt = (transaction) => (
    <Box sx={{ p: 3, width: '100%', maxWidth: 400, bgcolor: 'background.paper' }} id="receipt">
      {/* Receipt Header */}
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>SERVICE PROVIDER</Typography>
        <Typography variant="body2">123 Service Street, Kampala</Typography>
        <Typography variant="body2">Tel: +256 123 456 789</Typography>
        <Typography variant="body2">Tax ID: 123456789</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6" fontWeight="bold">SERVICE RECEIPT</Typography>
        <Typography variant="caption">{format(new Date(transaction.date), 'PPPpp')}</Typography>
        <Typography variant="body2">Receipt #: {transaction.id}</Typography>
      </Box>
      
      {/* Customer Info */}
      {transaction.customer.name && (
        <Box sx={{ mb: 2 }}>
          <Typography fontWeight="bold">Customer:</Typography>
          <Typography>{transaction.customer.name}</Typography>
          {transaction.customer.phone && <Typography>Phone: {transaction.customer.phone}</Typography>}
          {transaction.customer.email && <Typography>Email: {transaction.customer.email}</Typography>}
        </Box>
      )}
      
      <Divider sx={{ my: 1 }} />
      
      {/* Services Table */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Service</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transaction.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.name}
                  {item.serviceType === "hospitality" && item.hospitalityType === "hotel" && (
                    <Typography variant="caption" display="block">
                      Check-in: {format(new Date(item.bookingDetails.checkIn), 'PP')}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">{item.price.toLocaleString()}</TableCell>
                <TableCell align="right">{item.price.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Divider sx={{ my: 1 }} />
      
      {/* Totals */}
      <Box sx={{ textAlign: 'right' }}>
        <Typography>Subtotal: UGX {transaction.subtotal.toLocaleString()}</Typography>
        {transaction.discount > 0 && (
          <Typography>Discount: -UGX {transaction.discount.toLocaleString()}</Typography>
        )}
        <Typography>Tax (18%): UGX {transaction.tax.toLocaleString()}</Typography>
        {transaction.withholdingTax > 0 && (
          <Typography>Withholding Tax (6%): -UGX {transaction.withholdingTax.toLocaleString()}</Typography>
        )}
        <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
          Total: UGX {transaction.total.toLocaleString()}
        </Typography>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      {/* Payment Info */}
      <Box>
        <Typography fontWeight="bold">Payment Method:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {transaction.paymentMethod.image ? (
            <img 
              src={transaction.paymentMethod.image} 
              alt={transaction.paymentMethod.name}
              style={{ height: 20 }}
            />
          ) : (
            React.cloneElement(transaction.paymentMethod.icon, { fontSize: 'small' })
          )}
          <Typography>{transaction.paymentMethod.name}</Typography>
        </Box>
        
        {Object.entries(transaction.paymentDetails).map(([key, value]) => (
          <Typography key={key}>
            {key}: {value}
          </Typography>
        ))}
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="caption" display="block">Thank you for your business!</Typography>
        <Typography variant="caption" display="block">Please arrive on time for your appointment</Typography>
        <Typography variant="caption" display="block">Cancellation policy applies</Typography>
      </Box>
    </Box>
  );

  // Handlers
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    setSubcategory("");
  };

  const handleSubcategoryChange = (e) => {
    setSubcategory(e.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  const handleSort = (e) => {
    const sortBy = e.target.value;
    let sortedServices = [...filteredServices];

    if (sortBy === "price_low_high") {
      sortedServices.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_high_low") {
      sortedServices.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating_high_low") {
      sortedServices.sort((a, b) => b.rating - a.rating);
    }

    setFilteredServices(sortedServices);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setCashAmount('');
    if (method.type !== 'cash') {
      const details = {};
      method.fields.forEach(field => {
        details[field] = '';
      });
      setPaymentDetails(details);
    }
  };
  
  const handlePaymentDetailChange = (field, value) => {
    const updatedDetails = { ...paymentDetails, [field]: value };
    setPaymentDetails(updatedDetails);

    if (selectedPaymentMethod?.type === 'cash' && field.toLowerCase().includes('amount')) {
      const amount = parseFloat(value) || 0;
      setAmountTendered(amount);
    }
  };

  // Cart Management
  const handleAddToCart = (service) => {
    if (!service.available) return;
    
    // For hospitality services, add booking details
    const cartItem = service.serviceType === "hospitality" ? {
      ...service,
      bookingDetails: {
        date: selectedDate,
        time: selectedTime,
        ...(service.hospitalityType === "hotel" && {
          checkIn: new Date(selectedDate),
          checkOut: new Date(new Date(selectedDate).setDate(selectedDate.getDate() + 1))
        })
      }
    } : service;

    setCart([...cart, cartItem]);
    setSnackbarMessage(`${service.name} added to cart!`);
    setOpenSnackbar(true);
    setCartDrawerOpen(true);
  };

  const handleRemoveFromCart = (serviceId) => {
    setCart(cart.filter((item) => item.id !== serviceId));
  };

  // Payment Processing
  const handleCompleteSale = () => {
    if (selectedPaymentMethod?.type === 'cash') {
      const amount = parseFloat(cashAmount) || 0;
      if (amount < totalAmount) {
        setSnackbarMessage(`Insufficient amount. Still need UGX ${(totalAmount - amount).toLocaleString()}`);
        setOpenSnackbar(true);
        return;
      }
    }

    const transaction = {
      id: `TXN-${Date.now()}`,
      date: new Date(),
      items: [...cart],
      customer: customerDetails,
      paymentMethod: selectedPaymentMethod,
      paymentDetails: paymentDetails,
      subtotal: subtotal,
      discount: discountAmount,
      tax: taxAmount,
      withholdingTax: withholdingTaxAmount,
      total: totalAmount,
      amountTendered: amountTendered,
      changeDue: changeDue,
      status: 'completed',
      withholdingTaxEnabled: withholdingTaxEnabled
    };

    // For demo purposes without API
    setPaymentHistory([transaction, ...paymentHistory]);
    setCurrentReceipt(transaction);
    setReceiptModalOpen(true);
    
    // Reset system
    setCart([]);
    setAppliedDiscount(null);
    setCustomerDetails({ name: "", phone: "", email: "" });
    setSelectedPaymentMethod(null);
    setPaymentDetails({});
    setActiveStep(0);
    setCartDrawerOpen(false);
    setAmountTendered(0);
    setChangeDue(0);
    setWithholdingTaxEnabled(false);
    setWithholdingTaxAmount(0);
    setDiscountCode("");
    
    setSnackbarMessage("Payment processed successfully!");
    setOpenSnackbar(true);
  };

  // Steps for checkout process
  const steps = ['Service Selection', 'Booking Details', 'Customer Info', 'Payment'];

  // Handle step changes
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Get icon for service category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Hospitality":
        return <Restaurant />;
      case "Healthcare":
        return <LocalHospital />;
      case "Salons & Spas":
        return <Spa />;
      case "Event Management":
        return <Event />;
      default:
        return <ServiceIcon />;
    }
  };

  // Render functions for each step
  const renderServiceSelection = () => (
    <Box>
      <TextField
        placeholder="Search services..."
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1 }} />
        }}
        value={cartSearchText}
        onChange={(e) => setCartSearchText(e.target.value)}
      />
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
        Selected Services ({cart.length})
      </Typography>
      
      <List>
        {cart.map((item) => (
          <ListItem 
            key={item.id} 
            secondaryAction={
              <IconButton 
                onClick={() => handleRemoveFromCart(item.id)}
                color="error"
              >
                <CloseIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar src={item.image} alt={item.name} />
            </ListItemAvatar>
            <ListItemText
              primary={item.name}
              secondary={`UGX ${item.price.toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>
      
      {cart.length === 0 && (
        <Typography sx={{ textAlign: 'center', p: 3 }}>No services selected</Typography>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Subtotal:</Typography>
          <Typography>UGX {subtotal.toLocaleString()}</Typography>
        </Box>
        
        {appliedDiscount && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Discount ({appliedDiscount.discount}%):</Typography>
            <Typography color="success.main">-UGX {discountAmount.toLocaleString()}</Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography>Tax (18%):</Typography>
          <Typography>UGX {taxAmount.toLocaleString()}</Typography>
        </Box>
        
        {/* Withholding Tax Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography>Apply 6% Withholding Tax</Typography>
          <Switch
            checked={withholdingTaxEnabled}
            onChange={(e) => setWithholdingTaxEnabled(e.target.checked)}
            color="primary"
          />
        </Box>
        
        {withholdingTaxEnabled && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Withholding Tax (6%):</Typography>
            <Typography color="warning.main">-UGX {withholdingTaxAmount.toLocaleString()}</Typography>
          </Box>
        )}
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6">UGX {totalAmount.toLocaleString()}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            label="Discount Code"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            size="small"
            fullWidth
          />
          {appliedDiscount ? (
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => {
                setAppliedDiscount(null);
                setDiscountCode("");
                setSnackbarMessage("Discount removed.");
                setOpenSnackbar(true);
              }}
            >
              Remove
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={() => {
                const discount = discountOffers.find((offer) => offer.code === discountCode.toUpperCase());
                if (discount) {
                  setAppliedDiscount(discount);
                  setSnackbarMessage(`Discount '${discount.name}' applied!`);
                  setOpenSnackbar(true);
                } else {
                  setSnackbarMessage("Invalid discount code.");
                  setOpenSnackbar(true);
                }
              }}
              disabled={!discountCode}
            >
              Apply
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );

  const renderBookingDetails = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Booking Details</Typography>
      
      {cart.map((service) => (
        <Box key={service.id} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{service.name}</Typography>
          
          {service.serviceType === "hospitality" && (
            <>
              <TextField
                label="Date"
                type="date"
                fullWidth
                margin="normal"
                value={format(service.bookingDetails.date, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const updatedCart = cart.map(item => 
                    item.id === service.id ? {
                      ...item,
                      bookingDetails: {
                        ...item.bookingDetails,
                        date: new Date(e.target.value)
                      }
                    } : item
                  );
                  setCart(updatedCart);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              <TextField
                label="Time"
                type="time"
                fullWidth
                margin="normal"
                value={service.bookingDetails.time}
                onChange={(e) => {
                  const updatedCart = cart.map(item => 
                    item.id === service.id ? {
                      ...item,
                      bookingDetails: {
                        ...item.bookingDetails,
                        time: e.target.value
                      }
                    } : item
                  );
                  setCart(updatedCart);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              {service.hospitalityType === "hotel" && (
                <>
                  <TextField
                    label="Check-in Date"
                    type="date"
                    fullWidth
                    margin="normal"
                    value={format(service.bookingDetails.checkIn, 'yyyy-MM-dd')}
                    onChange={(e) => {
                      const updatedCart = cart.map(item => 
                        item.id === service.id ? {
                          ...item,
                          bookingDetails: {
                            ...item.bookingDetails,
                            checkIn: new Date(e.target.value),
                            checkOut: new Date(new Date(e.target.value).setDate(new Date(e.target.value).getDate() + 1))
                          }
                        } : item
                      );
                      setCart(updatedCart);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  
                  <TextField
                    label="Check-out Date"
                    type="date"
                    fullWidth
                    margin="normal"
                    value={format(service.bookingDetails.checkOut, 'yyyy-MM-dd')}
                    onChange={(e) => {
                      const updatedCart = cart.map(item => 
                        item.id === service.id ? {
                          ...item,
                          bookingDetails: {
                            ...item.bookingDetails,
                            checkOut: new Date(e.target.value)
                          }
                        } : item
                      );
                      setCart(updatedCart);
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </>
              )}
            </>
          )}
          
          {service.serviceType === "salon" && (
            <>
              <TextField
                label="Appointment Date"
                type="date"
                fullWidth
                margin="normal"
                value={format(service.bookingDetails.date, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const updatedCart = cart.map(item => 
                    item.id === service.id ? {
                      ...item,
                      bookingDetails: {
                        ...item.bookingDetails,
                        date: new Date(e.target.value)
                      }
                    } : item
                  );
                  setCart(updatedCart);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              <TextField
                label="Appointment Time"
                type="time"
                fullWidth
                margin="normal"
                value={service.bookingDetails.time}
                onChange={(e) => {
                  const updatedCart = cart.map(item => 
                    item.id === service.id ? {
                      ...item,
                      bookingDetails: {
                        ...item.bookingDetails,
                        time: e.target.value
                      }
                    } : item
                  );
                  setCart(updatedCart);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </>
          )}
        </Box>
      ))}
    </Box>
  );

  const renderCustomerInfo = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Customer Information</Typography>
      <TextField
        label="Customer Name"
        fullWidth
        margin="normal"
        value={customerDetails.name}
        onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
        placeholder="Optional"
      />
      <TextField
        label="Phone Number"
        fullWidth
        margin="normal"
        value={customerDetails.phone}
        onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
        placeholder="Optional"
      />
      <TextField
        label="Email Address"
        fullWidth
        margin="normal"
        value={customerDetails.email}
        onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
        placeholder="Optional"
      />
    </Box>
  );

  const renderPaymentMethod = () => (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>Select Payment Method</Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {paymentMethods.map((method) => (
          <Grid item xs={6} sm={4} key={method.id}>
            <Card 
              variant={selectedPaymentMethod?.id === method.id ? 'outlined' : 'elevation'}
              sx={{ 
                cursor: 'pointer',
                borderColor: selectedPaymentMethod?.id === method.id ? 'primary.main' : '',
                borderWidth: selectedPaymentMethod?.id === method.id ? 2 : 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3
                }
              }}
              onClick={() => handlePaymentMethodSelect(method)}
            >
              {method.image ? (
                <img 
                  src={method.image} 
                  alt={method.name}
                  style={{ height: 30, marginBottom: 8 }}
                />
              ) : (
                React.cloneElement(method.icon, { 
                  fontSize: 'large',
                  color: selectedPaymentMethod?.id === method.id ? 'primary' : 'action'
                })
              )}
              <Typography 
                variant="body2" 
                textAlign="center"
                color={selectedPaymentMethod?.id === method.id ? 'primary' : 'text.primary'}
                fontWeight={selectedPaymentMethod?.id === method.id ? 'bold' : 'normal'}
              >
                {method.name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {selectedPaymentMethod && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            {selectedPaymentMethod.name} Details
          </Typography>
          
          {/* Cash Payment Section */}
          {selectedPaymentMethod.type === 'cash' && (
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Amount Received (UGX)"
                fullWidth
                margin="normal"
                value={cashAmount}
                onChange={(e) => setCashAmount(e.target.value)}
                type="number"
                inputProps={{ min: 0, step: 100 }}
                required
                helperText="Enter the amount received from customer"
              />
              
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                bgcolor: '#f5f5f5', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: changeDue >= 0 ? 'success.light' : 'error.light'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Total Amount:</Typography>
                  <Typography fontWeight="bold">UGX {totalAmount.toLocaleString()}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Amount Tendered:</Typography>
                  <Typography fontWeight="bold">UGX {(parseFloat(cashAmount) || 0).toLocaleString()}</Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1">
                    {changeDue >= 0 ? 'Change Due:' : 'Amount Due:'}
                  </Typography>
                  <Typography 
                    variant="subtitle1"
                    color={changeDue >= 0 ? 'success.main' : 'error.main'}
                    fontWeight="bold"
                  >
                    UGX {Math.abs(changeDue).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
          
          {/* Other payment method fields */}
          {selectedPaymentMethod.type !== 'cash' && selectedPaymentMethod.fields.map((field) => (
            <TextField
              key={field}
              label={field}
              fullWidth
              margin="normal"
              value={paymentDetails[field] || ''}
              onChange={(e) => handlePaymentDetailChange(field, e.target.value)}
              required
            />
          ))}
        </Box>
      )}
    </Box>
  );

  // Main render
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header with search and cart */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Search services..."
          variant="outlined"
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />
          }}
          value={searchText}
          onChange={handleSearch}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Badge badgeContent={cart.length} color="primary">
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={() => setCartDrawerOpen(true)}
            >
              Cart
            </Button>
          </Badge>
          
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => setPaymentHistoryOpen(true)}
          >
            History
          </Button>
        </Box>
      </Box>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                {Object.keys(dummyCategoryMap).map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={subcategory}
                label="Subcategory"
                onChange={handleSubcategoryChange}
                disabled={!category}
              >
                <MenuItem value="">All Subcategories</MenuItem>
                {category && dummyCategoryMap[category]?.map((subcat) => (
                  <MenuItem key={subcat} value={subcat}>{subcat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ px: 2 }}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={[minPrice, maxPrice]}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={5000000}
                step={5000}
                valueLabelFormat={(value) => `UGX ${value.toLocaleString()}`}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                defaultValue=""
                label="Sort By"
                onChange={handleSort}
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="price_low_high">Price: Low to High</MenuItem>
                <MenuItem value="price_high_low">Price: High to Low</MenuItem>
                <MenuItem value="rating_high_low">Rating: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Services Grid */}
      <Grid container spacing={3}>
        {filteredServices.map((service) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
              }
            }}>
              <CardMedia
                component="img"
                height="140"
                image={service.image}
                alt={service.name}
                sx={{ 
                  objectFit: 'cover', 
                  cursor: 'pointer'
                }}
                onClick={() => handleAddToCart(service)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {service.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={service.rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({service.rating})
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                    {getCategoryIcon(service.category)}
                    <Box component="span" sx={{ ml: 1 }}>
                      {service.category} &gt; {service.subcategory}
                    </Box>
                  </Box>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {service.description}
                </Typography>
                {service.features && (
                  <Box sx={{ mt: 1 }}>
                    {service.features.slice(0, 2).map((feature, index) => (
                      <Chip 
                        key={index}
                        label={feature} 
                        size="small" 
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                    {service.features.length > 2 && (
                      <Chip 
                        label={`+${service.features.length - 2} more`} 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                  </Box>
                )}
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" color="primary">
                    UGX {service.price.toLocaleString()}
                  </Typography>
                  {service.duration && (
                    <Chip 
                      label={`${Math.floor(service.duration / 60)}h ${service.duration % 60}m`} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleAddToCart(service)}
                  disabled={!service.available}
                  startIcon={<ShoppingCartIcon />}
                >
                  {service.available ? 'Book Now' : 'Not Available'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <Box sx={{ textAlign: 'center', p: 5 }}>
          <Typography variant="h6" gutterBottom>
            No services found
          </Typography>
          <Typography variant="body1">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      )}
      
      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        PaperProps={{ sx: { width: 450 } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Service Cart ({cart.length} {cart.length === 1 ? 'service' : 'services'})
          </Typography>
          <IconButton onClick={() => setCartDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        <Box sx={{ p: 2 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === 0 && renderServiceSelection()}
          {activeStep === 1 && renderBookingDetails()}
          {activeStep === 2 && renderCustomerInfo()}
          {activeStep === 3 && renderPaymentMethod()}
        </Box>
        
        <Divider />
        
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              color="success"
              onClick={handleCompleteSale}
              disabled={!selectedPaymentMethod || (selectedPaymentMethod.fields.length > 0 && 
                Object.values(paymentDetails).some(val => !val))}
              startIcon={<PaymentIcon />}
            >
              Complete Booking
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === 0 && cart.length === 0}
            >
              Next
            </Button>
          )}
        </Box>
      </Drawer>

      {/* Payment History Dialog */}
      <Dialog
        open={paymentHistoryOpen}
        onClose={() => setPaymentHistoryOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Booking History</Typography>
            <IconButton onClick={() => setPaymentHistoryOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Services</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paymentHistory.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(new Date(transaction.date), 'PPpp')}</TableCell>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.customer.name || 'Walk-in'}</TableCell>
                    <TableCell>{transaction.items.length}</TableCell>
                    <TableCell>UGX {transaction.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {transaction.paymentMethod.image ? (
                          <img 
                            src={transaction.paymentMethod.image} 
                            alt={transaction.paymentMethod.name}
                            style={{ height: 20 }}
                          />
                        ) : (
                          React.cloneElement(transaction.paymentMethod.icon, { fontSize: 'small' })
                        )}
                        <Typography>{transaction.paymentMethod.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<ReceiptIcon />}
                        onClick={() => {
                          setCurrentReceipt(transaction);
                          setReceiptModalOpen(true);
                        }}
                      >
                        Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {paymentHistory.length === 0 && (
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography>No booking history yet</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentHistoryOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Receipt Modal */}
      <Modal
        open={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box sx={{ bgcolor: 'background.paper', boxShadow: 24, maxWidth: 500 }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Receipt</Typography>
            <Box>
              <IconButton onClick={() => window.print()} sx={{ mr: 1 }}>
                <PrintIcon />
              </IconButton>
              <IconButton onClick={() => setReceiptModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ p: 3 }}>
            {currentReceipt && renderReceipt(currentReceipt)}
          </Box>
          <DialogActions>
            <Button onClick={() => setReceiptModalOpen(false)}>Close</Button>
          </DialogActions>
        </Box>
      </Modal>

      {/* Snackbar Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ServiceSalesPage;