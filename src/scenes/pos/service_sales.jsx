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

// Service Data - Would be fetched from backend API
// API endpoint: GET /api/services
const [serviceData, setServiceData] = useState([]);

// Payment Methods - Would be fetched from backend API
// API endpoint: GET /api/payment-methods
const [paymentMethods, setPaymentMethods] = useState([]);

// Discount Offers - Would be fetched from backend API
// API endpoint: GET /api/discounts
const [discountOffers, setDiscountOffers] = useState([]);


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

  const navigate = useNavigate();

  // Fetch initial data from backend APIs
  useEffect(() => {
    // Fetch services
    // API call: GET /api/services
    // Example:
    /*
    fetch('/api/services')
      .then(response => response.json())
      .then(data => {
        setServices(data);
        setFilteredServices(data);
      })
      .catch(error => console.error('Error fetching services:', error));
    */

    // Fetch payment methods
    // API call: GET /api/payment-methods
    /*
    fetch('/api/payment-methods')
      .then(response => response.json())
      .then(data => setPaymentMethods(data))
      .catch(error => console.error('Error fetching payment methods:', error));
    */

    // Fetch discount offers
    // API call: GET /api/discounts
    /*
    fetch('/api/discounts')
      .then(response => response.json())
      .then(data => setDiscountOffers(data))
      .catch(error => console.error('Error fetching discounts:', error));
    */

    // Fetch payment history
    // API call: GET /api/transactions
    /*
    fetch('/api/transactions')
      .then(response => response.json())
      .then(data => setPaymentHistory(data))
      .catch(error => console.error('Error fetching transactions:', error));
    */
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

  // Category Map - Would be fetched from backend API
  // API endpoint: GET /api/categories
  const [categoryMap, setCategoryMap] = useState({});

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
      total: totalAmount,
      amountTendered: amountTendered,
      changeDue: changeDue,
      status: 'completed'
    };

    // API call to save transaction
    /*
    fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    })
    .then(response => response.json())
    .then(data => {
      setPaymentHistory([data, ...paymentHistory]);
      setCurrentReceipt(data);
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
      
      setSnackbarMessage("Payment processed successfully!");
      setOpenSnackbar(true);
    })
    .catch(error => {
      console.error('Error saving transaction:', error);
      setSnackbarMessage("Error processing payment. Please try again.");
      setOpenSnackbar(true);
    });
    */

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
    
    setSnackbarMessage("Payment processed successfully!");
    setOpenSnackbar(true);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.discount) / 100 : 0;
  const taxRate = 0.18; // 18% VAT
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const totalAmount = subtotal - discountAmount + taxRate;
  
  useEffect(() => {
    if (selectedPaymentMethod?.type === 'cash' && cashAmount) {
      const amount = parseFloat(cashAmount) || 0;
      setChangeDue(amount - totalAmount);
    } else {
      setChangeDue(0);
    }
  }, [cashAmount, totalAmount, selectedPaymentMethod]);

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
      case "Retail":
        return <ShoppingCartIcon />;
      case "Healthcare":
        return <LocalHospital />;
      case "Salons & Spas":
        return <Spa />;
      case "Grocery Stores":
        return <LocalGroceryStore />;
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
      />
      <TextField
        label="Phone Number"
        fullWidth
        margin="normal"
        value={customerDetails.phone}
        onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
      />
      <TextField
        label="Email Address"
        fullWidth
        margin="normal"
        value={customerDetails.email}
        onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
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
                p: 2
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
                React.cloneElement(method.icon, { fontSize: 'large' })
              )}
              <Typography variant="body2" textAlign="center">
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
                {Object.keys(categoryMap).map((cat) => (
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
                {category && categoryMap[category]?.map((subcat) => (
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
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={service.image}
                alt={service.name}
                sx={{ 
                  objectFit: 'contain', 
                  p: 1, 
                  bgcolor: 'white',
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
                {service.serviceType === "hospitality" && service.hospitalityType === "restaurant" && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    Menu: {service.menuItems.map(item => item.name).join(", ")}
                  </Typography>
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