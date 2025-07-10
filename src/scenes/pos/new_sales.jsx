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
  Calculate as CalculatorIcon,
  LocalShipping as DeliveryIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  WhatsApp as WhatsAppIcon,
  Construction as ServicesIcon,
  ShoppingBag as ProductsIcon
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

// Product Data
const productData = [
  { 
    id: 1, 
    name: "Fanta", 
    category: "Beverages", 
    subcategory: "Soft Drinks", 
    price: 1500, 
    rating: 4, 
    stock: 50, 
    image: "/assets/fanta.jpg", 
    description: "A popular carbonated soft drink.",
    barcode: "123456789012",
    supplier: "Coca-Cola Uganda",
    type: "product"
  },
  { 
    id: 2, 
    name: "Mountain Dew", 
    category: "Beverages", 
    subcategory: "Soft Drinks", 
    price: 1500, 
    rating: 5, 
    stock: 30, 
    image: "/assets/dew.jpg", 
    description: "Citrusy and refreshing soft drink.",
    barcode: "234567890123",
    supplier: "PepsiCo",
    type: "product"
  },
  { 
    id: 3, 
    name: "AFIA JUICE Tropical", 
    category: "Beverages", 
    subcategory: "Juices", 
    price: 2000, 
    rating: 4, 
    stock: 20, 
    image: "/assets/afia_tropical.jpg", 
    description: "Tropical fruit juice.",
    barcode: "345678901234",
    supplier: "Mukwano Group",
    type: "product"
  },
  { 
    id: 4, 
    name: "Heineken Beer 330ml", 
    category: "Beverages", 
    subcategory: "Alcoholic", 
    price: 5000, 
    rating: 5, 
    stock: 60, 
    image: "/assets/Heineken.png", 
    description: "Premium lager beer.",
    barcode: "456789012345",
    supplier: "Heineken International",
    type: "product"
  },
  { 
    id: 5, 
    name: "Bell Lager", 
    category: "Beverages", 
    subcategory: "Alcoholic", 
    price: 4500, 
    rating: 4, 
    stock: 40, 
    image: "/assets/bell.png", 
    description: "Popular beer in Uganda.",
    barcode: "567890123456",
    supplier: "Uganda Breweries",
    type: "product"
  },
  { 
    id: 6, 
    name: "Golden Penny Semovita 2kg", 
    category: "Groceries", 
    subcategory: "Flour & Grains", 
    price: 3500, 
    rating: 4, 
    stock: 30, 
    image: "/assets/semo.jpeg", 
    description: "Premium quality semovita.",
    barcode: "678901234567",
    supplier: "Flour Mills of Nigeria",
    type: "product"
  },
  { 
    id: 7, 
    name: "Hima Cement 50kg", 
    category: "Groceries", 
    subcategory: "Building Materials", 
    price: 45000, 
    rating: 4, 
    stock: 15, 
    image: "/assets/hima.png", 
    description: "High quality construction cement.",
    barcode: "789012345678",
    supplier: "Hima Cement Ltd",
    type: "product"
  },
  { 
    id: 8, 
    name: "Luxury Toilet Paper (12 rolls)", 
    category: "Household", 
    subcategory: "Bathroom", 
    price: 12000, 
    rating: 5, 
    stock: 25, 
    image: "/assets/1.jpg", 
    description: "Premium quality toilet paper.",
    barcode: "890123456789",
    supplier: "Nice House of Plastics",
    type: "product"
  },
  { 
    id: 9, 
    name: "OMO Detergent 5kg", 
    category: "Household", 
    subcategory: "Cleaning", 
    price: 15000, 
    rating: 4, 
    stock: 18, 
    image: "/assets/omo.jpg", 
    description: "Powerful laundry detergent.",
    barcode: "901234567890",
    supplier: "Unilever",
    type: "product"
  },
  { 
    id: 10, 
    name: "Samsung Galaxy A14", 
    category: "Electronics", 
    subcategory: "Mobile Phones", 
    price: 850000, 
    rating: 4, 
    stock: 8, 
    image: "/assets/samsung.jpg", 
    description: "Latest smartphone with great features.",
    barcode: "012345678901",
    supplier: "Samsung East Africa",
    type: "product"
  },
  { 
    id: 11, 
    name: "Tecno Spark 10", 
    category: "Electronics", 
    subcategory: "Mobile Phones", 
    price: 750000, 
    rating: 4, 
    stock: 12, 
    image: "/assets/spark.jpeg", 
    description: "Affordable smartphone with good camera.",
    barcode: "123450987654",
    supplier: "Tecno Mobile",
    type: "product"
  },
  { 
    id: 12, 
    name: "Men's Casual Shirt", 
    category: "Clothing", 
    subcategory: "Men's Fashion", 
    price: 35000, 
    rating: 4, 
    stock: 20, 
    image: "/assets/casual.jpg", 
    description: "Comfortable cotton shirt for men.",
    barcode: "234561098765",
    supplier: "Textile Uganda Ltd",
    type: "product"
  },
  { 
    id: 13, 
    name: "Women's Handbag", 
    category: "Clothing", 
    subcategory: "Women's Fashion", 
    price: 45000, 
    rating: 5, 
    stock: 15, 
    image: "/assets/handbag.jpg", 
    description: "Stylish women's handbag.",
    barcode: "345672109876",
    supplier: "Leather Crafts Uganda",
    type: "product"
  },
  { 
    id: 14, 
    name: "Dove Body Wash", 
    category: "Health & Beauty", 
    subcategory: "Personal Care", 
    price: 12000, 
    rating: 4, 
    stock: 25, 
    image: "/assets/dove.jpeg", 
    description: "Moisturizing body wash.",
    barcode: "456783210987",
    supplier: "Unilever",
    type: "product"
  },
  { 
    id: 15, 
    name: "Head & Shoulders", 
    category: "Health & Beauty", 
    subcategory: "Personal Care", 
    price: 13000, 
    rating: 4, 
    stock: 25, 
    image: "/assets/head.jpeg", 
    description: "Moisturizing shampoo wash.",
    barcode: "456783210987",
    supplier: "Unilever",
    type: "product"
  },
  { 
    id: 16, 
    name: "Colgate Toothpaste", 
    category: "Health & Beauty", 
    subcategory: "Oral Care", 
    price: 5000, 
    rating: 5, 
    stock: 40, 
    image: "/assets/colgate.jpg", 
    description: "Cavity protection toothpaste.",
    barcode: "567894321098",
    supplier: "Colgate-Palmolive",
    type: "product"
  },
  { 
    id: 17, 
    name: "Tecno Spark 10", 
    category: "Electronics", 
    subcategory: "Mobile Phones", 
    price: 750000, 
    rating: 4, 
    stock: 12, 
    image: "/assets/spark.jpeg", 
    description: "Affordable smartphone with good camera.",
    barcode: "147258369",
    type: "product"
  },
  { 
    id: 18, 
    name: "Splash", 
    category: "Beverages", 
    subcategory: "Juices", 
    price: 2500, 
    rating: 4, 
    stock: 20, 
    image: "/assets/splash.jpg", 
    description: "Tropical fruit juice flavour mango.",
    barcode: "345678901234",
    supplier: "Mukwano Group",
    type: "product"
  },
];

// Service Data
const serviceData = [
  {
    id: 101,
    name: "Phone Repair",
    category: "Electronics",
    subcategory: "Repair",
    price: 25000,
    rating: 4.5,
    duration: "1-2 hours",
    description: "Professional phone screen and hardware repair",
    type: "service"
  },
  {
    id: 102,
    name: "Delivery Service",
    category: "Logistics",
    subcategory: "Delivery",
    price: 10000,
    rating: 4.2,
    duration: "Same day",
    description: "Fast and reliable delivery within the city",
    type: "service"
  },
  {
    id: 103,
    name: "IT Support",
    category: "Technology",
    subcategory: "Consulting",
    price: 50000,
    rating: 4.8,
    duration: "Per hour",
    description: "Professional IT support and troubleshooting",
    type: "service"
  },
  {
    id: 104,
    name: "Haircut",
    category: "Beauty",
    subcategory: "Salon",
    price: 15000,
    rating: 4.3,
    duration: "30 minutes",
    description: "Professional haircut and styling",
    type: "service"
  },
  {
    id: 105,
    name: "Photography Session",
    category: "Media",
    subcategory: "Photography",
    price: 80000,
    rating: 4.7,
    duration: "2 hours",
    description: "Professional photography session with edited photos",
    type: "service"
  },
  {
    id: 106,
    name: "Cleaning Service",
    category: "Home",
    subcategory: "Cleaning",
    price: 30000,
    rating: 4.1,
    duration: "3 hours",
    description: "Thorough home cleaning service",
    type: "service"
  }
];

// Payment Methods
const paymentMethods = [
  { 
    id: 1, 
    name: "MTN Mobile Money", 
    type: "mobile_money", 
    icon: <MobileMoneyIcon />,
    image: '/assets/mtn.jpg',
    fields: ["Phone Number", "Transaction ID"]
  },
  { 
    id: 2, 
    name: "Airtel Money", 
    type: "mobile_money", 
    icon: <MobileMoneyIcon />,
    image: '/assets/airtel.jpg',
    fields: ["Phone Number", "Transaction ID"]
  },
  { 
    id: 3, 
    name: "Lyca Mobile Money", 
    type: "mobile_money", 
    icon: <MobileMoneyIcon />,
    image: '/assets/lyca.png',
    fields: ["Phone Number", "Transaction ID"]
  },
  {
    id: 4,
    name: "Pay with Cash",
    type: "cash",
    icon: <CashIcon />,
    image: '',
    fields: []
  },
  {
    id: 5,
    name: "PayPal",
    type: "third_party",
    icon: <PaymentIcon />,
    image: '/assets/paypal.png',
    fields: ["Email", "Transaction ID"]
  },
  {
    id: 6,
    name: "Flutterwave",
    type: "third_party",
    icon: <PaymentIcon />,
    image: '/assets/flutter.png',
    fields: ["Email", "Transaction ID"]
  },
  {
    id: 7,
    name: "Stripe",
    type: "third_party",
    icon: <PaymentIcon />,
    image: '/assets/stripe.png',
    fields: ["Email", "Transaction ID"]
  },
  {
    id: 8,
    name: "Razorpay",
    type: "third_party",
    icon: <PaymentIcon />,
    image: '/assets/razor.png',
    fields: ["Email", "Transaction ID"]
  },
  {
    id: 9,
    name: "Paystack",
    type: "third_party",
    icon: <PaymentIcon />,
    image: '/assets/pay.png',
    fields: ["Email", "Transaction ID"]
  }
];

// Discount Offers
const discountOffers = [
  { id: 1, name: "Weekend Special", discount: 10, code: "WEEKEND10" },
  { id: 2, name: "Bulk Purchase", discount: 15, code: "BULK15" },
  { id: 3, name: "New Customer", discount: 20, code: "NEW20" },
];

// Delivery Options
const deliveryOptions = [
  { id: 1, name: "Pickup", description: "Customer will pick up the order" },
  { id: 2, name: "Standard Delivery", description: "Delivery within 3-5 business days", fee: 5000 },
  { id: 3, name: "Express Delivery", description: "Delivery within 1-2 business days", fee: 10000 },
];

const SalesPage = () => {
  // State Management
  const [products, setProducts] = useState([...productData, ...serviceData]);
  const [cart, setCart] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([...productData, ...serviceData]);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
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
    address: "",
  });
  const [barcodeInput, setBarcodeInput] = useState("");
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
  const [showAllProductsInCart, setShowAllProductsInCart] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState('0');
  const [calculatorMemory, setCalculatorMemory] = useState(null);
  const [calculatorOperator, setCalculatorOperator] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState(deliveryOptions[0]);
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [viewType, setViewType] = useState("products");
  const [shareOptionsOpen, setShareOptionsOpen] = useState(false);

  const navigate = useNavigate();

  // Filter Products/Services based on view type
  useEffect(() => {
    applyFilters();
  }, [category, subcategory, minPrice, maxPrice, rating, searchText, products, viewType]);

  const applyFilters = () => {
    const filtered = products
      .filter(item => viewType === "products" ? item.type === "product" : item.type === "service")
      .filter((item) => (category ? item.category === category : true))
      .filter((item) => (subcategory ? item.subcategory === subcategory : true))
      .filter((item) => item.price >= minPrice && item.price <= maxPrice)
      .filter((item) => (rating ? item.rating >= rating : true))
      .filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));

    setFilteredProducts(filtered);
  };

  // Category Map
  const categoryMap = {
    Beverages: ["Soft Drinks", "Juices", "Water", "Alcoholic"],
    Groceries: ["Flour & Grains", "Building Materials"],
    Household: ["Bathroom", "Cleaning"],
    Electronics: ["Mobile Phones", "Repair"],
    Clothing: ["Men's Fashion", "Women's Fashion"],
    "Health & Beauty": ["Personal Care", "Oral Care"],
    Logistics: ["Delivery"],
    Technology: ["Consulting"],
    Beauty: ["Salon"],
    Media: ["Photography"],
    Home: ["Cleaning"]
  };

  // Calculator functions
  const handleCalculatorInput = (value) => {
    if (calculatorValue === '0' && value !== '.') {
      setCalculatorValue(value);
    } else {
      setCalculatorValue(calculatorValue + value);
    }
  };

  const handleCalculatorOperator = (op) => {
    if (calculatorOperator && calculatorMemory) {
      const result = calculate(calculatorMemory, parseFloat(calculatorValue), calculatorOperator);
      setCalculatorMemory(result);
    } else {
      setCalculatorMemory(parseFloat(calculatorValue));
    }
    setCalculatorOperator(op);
    setCalculatorValue('0');
  };

  const calculate = (a, b, op) => {
    switch(op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return a / b;
      default: return b;
    }
  };

  const handleCalculatorEquals = () => {
    if (calculatorOperator && calculatorMemory !== null) {
      const result = calculate(calculatorMemory, parseFloat(calculatorValue), calculatorOperator);
      setCalculatorValue(result.toString());
      setCalculatorMemory(null);
      setCalculatorOperator(null);
    }
  };

  const handleCalculatorClear = () => {
    setCalculatorValue('0');
    setCalculatorMemory(null);
    setCalculatorOperator(null);
  };

  const handleCalculatorBackspace = () => {
    if (calculatorValue.length === 1) {
      setCalculatorValue('0');
    } else {
      setCalculatorValue(calculatorValue.slice(0, -1));
    }
  };

  const handleCalculatorUseResult = () => {
    setCashAmount(calculatorValue);
    setCalculatorOpen(false);
  };

  // Order functions
  const handlePlaceOrder = () => {
    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date(),
      items: [...cart],
      customer: customerDetails,
      delivery: {
        option: deliveryOption,
        instructions: deliveryInstructions,
        fee: deliveryOption.fee || 0,
      },
      subtotal: subtotal,
      discount: discountAmount,
      tax: taxAmount,
      total: totalAmount + (deliveryOption.fee || 0),
      status: 'pending',
      notes: orderNotes,
      type: 'order'
    };

    // Update stock levels for products
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id && item.type === "product");
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    setPaymentHistory([order, ...paymentHistory]);
    setCurrentReceipt(order);
    setReceiptModalOpen(true);
    
    // Reset system
    setCart([]);
    setAppliedDiscount(null);
    setCustomerDetails({ name: "", phone: "", email: "", address: "" });
    setDeliveryOption(deliveryOptions[0]);
    setDeliveryInstructions("");
    setOrderNotes("");
    setActiveStep(0);
    setCartDrawerOpen(false);
    
    setSnackbarMessage("Order placed successfully!");
    setOpenSnackbar(true);
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
      amountTendered: selectedPaymentMethod.type === 'cash' ? parseFloat(cashAmount) : 0,
      changeDue: selectedPaymentMethod.type === 'cash' ? changeDue : 0,
      status: 'completed',
      type: 'sale'
    };

    // Update stock levels for products
    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id && item.type === "product");
      if (cartItem) {
        return {
          ...product,
          stock: product.stock - cartItem.quantity
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    setPaymentHistory([transaction, ...paymentHistory]);
    setCurrentReceipt(transaction);
    setReceiptModalOpen(true);
    
    // Reset system
    setCart([]);
    setAppliedDiscount(null);
    setCustomerDetails({ name: "", phone: "", email: "", address: "" });
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
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.discount) / 100 : 0;
  const taxRate = 0.18; // 18% VAT
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const deliveryFee = deliveryOption?.fee || 0;
  const totalAmount = subtotal - discountAmount + taxAmount + deliveryFee;
  
  useEffect(() => {
    if (selectedPaymentMethod?.type === 'cash' && cashAmount) {
      const amount = parseFloat(cashAmount) || 0;
      setChangeDue(amount - totalAmount);
    } else {
      setChangeDue(0);
    }
  }, [cashAmount, totalAmount, selectedPaymentMethod]);

  // Steps for checkout process
  const steps = ['Cart Review', 'Customer Info', 'Payment'];

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
    let sortedProducts = [...filteredProducts];

    if (sortBy === "price_low_high") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_high_low") {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating_high_low") {
      sortedProducts.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(sortedProducts);
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
  const handleAddToCart = (item) => {
    if (item.type === "product" && item.stock <= 0) return;
    
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      if (item.type === "product" && existingItem.quantity >= item.stock) {
        setSnackbarMessage(`Only ${item.stock} items available in stock`);
        setOpenSnackbar(true);
        return;
      }
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    setSnackbarMessage(`${item.name} added to cart!`);
    setOpenSnackbar(true);
    setCartDrawerOpen(true);
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = parseInt(newQuantity) || 0;
    if (quantity < 1) return;
    
    const item = products.find(p => p.id === itemId);
    if (item.type === "product" && quantity > item.stock) {
      setSnackbarMessage(`Only ${item.stock} items available in stock`);
      setOpenSnackbar(true);
      return;
    }
    
    setCart(
      cart.map((cartItem) =>
        cartItem.id === itemId ? { ...cartItem, quantity: quantity } : cartItem
      )
    );
  };

  const handleIncreaseQuantity = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    const originalItem = products.find(p => p.id === itemId);
    
    if (originalItem.type === "product" && item.quantity >= originalItem.stock) {
      setSnackbarMessage(`Only ${originalItem.stock} items available in stock`);
      setOpenSnackbar(true);
      return;
    }
    
    setCart(
      cart.map((cartItem) =>
        cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      )
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setCart(
      cart.map((cartItem) =>
        cartItem.id === itemId && cartItem.quantity > 1 
          ? { ...cartItem, quantity: cartItem.quantity - 1 } 
          : cartItem
      )
    );
  };

  // Handle step changes
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Filter cart items based on search text
  const filteredCartItems = cart.filter(item => 
    item.name.toLowerCase().includes(cartSearchText.toLowerCase())
  );

  // Search all products/services for adding to cart
  const searchAllItems = products.filter(item => 
    item.name.toLowerCase().includes(cartSearchText.toLowerCase()) &&
    !cart.some(cartItem => cartItem.id === item.id) &&
    (viewType === "products" ? item.type === "product" : item.type === "service")
  );

  // Product Editing Functions
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const handleSaveProduct = () => {
    if (!editingProduct) return;
    
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id ? editingProduct : p
    );
    
    setProducts(updatedProducts);
    setEditModalOpen(false);
    setEditingProduct(null);
    setSnackbarMessage("Product updated successfully!");
    setOpenSnackbar(true);
  };

  const handleEditFieldChange = (field, value) => {
    if (!editingProduct) return;
    
    setEditingProduct({
      ...editingProduct,
      [field]: value
    });
  };

  // Share functions
  const handleShare = (method) => {
    switch(method) {
      case 'email':
        setSnackbarMessage("Email sharing would be implemented here");
        break;
      case 'whatsapp':
        setSnackbarMessage("WhatsApp sharing would be implemented here");
        break;
      case 'facebook':
        setSnackbarMessage("Facebook sharing would be implemented here");
        break;
      case 'twitter':
        setSnackbarMessage("Twitter sharing would be implemented here");
        break;
      default:
        setSnackbarMessage("Sharing would be implemented here");
    }
    setOpenSnackbar(true);
    setShareOptionsOpen(false);
  };

  // Render Edit Product Modal
  const renderEditProductModal = () => (
    <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        {editingProduct && (
          <Box sx={{ mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Product Name"
              value={editingProduct.name}
              onChange={(e) => handleEditFieldChange('name', e.target.value)}
              fullWidth
              sx={{ gridColumn: 'span 2' }}
            />
            
            <TextField
              label="Description"
              value={editingProduct.description}
              onChange={(e) => handleEditFieldChange('description', e.target.value)}
              fullWidth
              multiline
              rows={3}
              sx={{ gridColumn: 'span 2' }}
            />
            
            <TextField
              label="Image URL"
              value={editingProduct.image}
              onChange={(e) => handleEditFieldChange('image', e.target.value)}
              fullWidth
              sx={{ gridColumn: 'span 2' }}
            />
            
            <TextField
              label="Price"
              type="number"
              value={editingProduct.price}
              onChange={(e) => handleEditFieldChange('price', parseInt(e.target.value) || 0)}
              fullWidth
            />
            
            <TextField
              label="Stock"
              type="number"
              value={editingProduct.stock}
              onChange={(e) => handleEditFieldChange('stock', parseInt(e.target.value) || 0)}
              fullWidth
            />
            
            <TextField
              label="Category"
              value={editingProduct.category}
              onChange={(e) => handleEditFieldChange('category', e.target.value)}
              fullWidth
            />
            
            <TextField
              label="Subcategory"
              value={editingProduct.subcategory}
              onChange={(e) => handleEditFieldChange('subcategory', e.target.value)}
              fullWidth
            />
            
            <TextField
              label="Barcode"
              value={editingProduct.barcode}
              onChange={(e) => handleEditFieldChange('barcode', e.target.value)}
              fullWidth
              sx={{ gridColumn: 'span 2' }}
            />
            
            <TextField
              label="Supplier"
              value={editingProduct.supplier}
              onChange={(e) => handleEditFieldChange('supplier', e.target.value)}
              fullWidth
              sx={{ gridColumn: 'span 2' }}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleSaveProduct}>Save Changes</Button>
      </DialogActions>
    </Dialog>
  );

  // Render functions for each step
  const renderCartReview = () => (
    <Box>
      <TextField
        placeholder="Search items to add to cart..."
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
      
      <Accordion expanded={showAllProductsInCart} onChange={() => setShowAllProductsInCart(!showAllProductsInCart)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Available {viewType === "products" ? "Products" : "Services"} ({searchAllItems.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {searchAllItems.map((item) => (
              <ListItem 
                key={item.id} 
                secondaryAction={
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => handleAddToCart(item)}
                    disabled={item.type === "product" && item.stock <= 0}
                  >
                    Add
                  </Button>
                }
              >
                <ListItemAvatar>
                  <Avatar 
                    src={item.image || (item.type === "service" ? '/assets/service.jpg' : '/assets/product.jpg')} 
                    alt={item.name} 
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.name}
                  secondary={`UGX ${item.price.toLocaleString()}${item.type === "product" ? ` | Stock: ${item.stock}` : ` | Duration: ${item.duration}`}`}
                />
              </ListItem>
            ))}
            {searchAllItems.length === 0 && (
              <Typography sx={{ textAlign: 'center', p: 2 }}>No matching {viewType} found</Typography>
            )}
          </List>
        </AccordionDetails>
      </Accordion>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Cart Items ({cart.length})</Typography>
      
      <List>
        {filteredCartItems.map((item) => (
          <ListItem key={item.id} secondaryAction={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                inputProps={{ min: 1, max: item.type === "product" ? item.stock : undefined }}
                size="small"
                sx={{ width: 70 }}
              />
              <IconButton 
                onClick={() => handleRemoveFromCart(item.id)}
                color="error"
                sx={{ ml: 2 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          }>
            <ListItemAvatar>
              <Avatar 
                src={item.image || (item.type === "service" ? '/assets/service.jpg' : '/assets/product.jpg')} 
                alt={item.name} 
              />
            </ListItemAvatar>
            <ListItemText
              primary={item.name}
              secondary={`UGX ${item.price.toLocaleString()} x ${item.quantity} = UGX ${(item.price * item.quantity).toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>
      
      {cart.length === 0 && (
        <Typography sx={{ textAlign: 'center', p: 3 }}>Your cart is empty</Typography>
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
      <TextField
        label="Address"
        fullWidth
        margin="normal"
        value={customerDetails.address}
        onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
        placeholder="Required for delivery orders"
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
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
                <Button 
                  variant="outlined" 
                  onClick={() => setCalculatorOpen(true)}
                  sx={{ height: 56 }}
                >
                  <CalculatorIcon />
                </Button>
              </Box>
              
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

  // View Toggle Component
  const ViewToggle = () => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <Button
        variant={viewType === 'products' ? 'contained' : 'outlined'}
        onClick={() => setViewType('products')}
        startIcon={<ProductsIcon />}
        sx={{ mr: 2 }}
      >
        Products
      </Button>
      <Button
        variant={viewType === 'services' ? 'contained' : 'outlined'}
        onClick={() => setViewType('services')}
        startIcon={<ServicesIcon />}
      >
        Services
      </Button>
    </Box>
  );

  // Calculator Modal
  const CalculatorModal = () => (
    <Dialog open={calculatorOpen} onClose={() => setCalculatorOpen(false)}>
      <DialogTitle>Calculator</DialogTitle>
      <DialogContent>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: 1,
          width: 300
        }}>
          <TextField
            value={calculatorValue}
            variant="outlined"
            sx={{ 
              gridColumn: 'span 4',
              mb: 2,
              '& .MuiInputBase-input': {
                textAlign: 'right',
                fontSize: '1.5rem'
              }
            }}
            InputProps={{
              readOnly: true,
            }}
          />
          
          {/* Calculator buttons */}
          <Button variant="outlined" onClick={() => handleCalculatorClear()}>C</Button>
          <Button variant="outlined" onClick={() => handleCalculatorBackspace()}>&larr;</Button>
          <Button variant="outlined" onClick={() => handleCalculatorOperator('/')}>/</Button>
          <Button variant="outlined" onClick={() => handleCalculatorOperator('*')}>*</Button>
          
          <Button variant="outlined" onClick={() => handleCalculatorInput('7')}>7</Button>
          <Button variant="outlined" onClick={() => handleCalculatorInput('8')}>8</Button>
          <Button variant="outlined" onClick={() => handleCalculatorInput('9')}>9</Button>
          <Button variant="outlined" onClick={() => handleCalculatorOperator('-')}>-</Button>
          
          <Button variant="outlined" onClick={() => handleCalculatorInput('4')}>4</Button>
          <Button variant="outlined" onClick={() => handleCalculatorInput('5')}>5</Button>
          <Button variant="outlined" onClick={() => handleCalculatorInput('6')}>6</Button>
          <Button variant="outlined" onClick={() => handleCalculatorOperator('+')}>+</Button>
          
          <Button variant="outlined" onClick={() => handleCalculatorInput('1')}>1</Button>
          <Button variant="outlined" onClick={() => handleCalculatorInput('2')}>2</Button>
          <Button variant="outlined" onClick={() => handleCalculatorInput('3')}>3</Button>
          <Button variant="outlined" onClick={() => handleCalculatorEquals()}>=</Button>
          
          <Button variant="outlined" onClick={() => handleCalculatorInput('0')} sx={{ gridColumn: 'span 2' }}>0</Button>
          <Button variant="outlined" onClick={() => handleCalculatorInput('.')}>.</Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleCalculatorUseResult()}
          >
            Use
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );

  // Order/Delivery Modal
  const OrderModal = () => (
    <Dialog open={orderModalOpen} onClose={() => setOrderModalOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Order & Delivery Information</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>Delivery Options</Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Delivery Method</InputLabel>
            <Select
              value={deliveryOption.id}
              onChange={(e) => setDeliveryOption(deliveryOptions.find(o => o.id === e.target.value))}
              label="Delivery Method"
            >
              {deliveryOptions.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name} {option.fee ? `(UGX ${option.fee.toLocaleString()})` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          {deliveryOption.id !== 1 && (
            <TextField
              label="Delivery Address"
              fullWidth
              value={customerDetails.address}
              onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
              sx={{ mb: 2 }}
              required
            />
          )}
          
          <TextField
            label="Delivery Instructions"
            fullWidth
            multiline
            rows={3}
            value={deliveryInstructions}
            onChange={(e) => setDeliveryInstructions(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="Any special instructions for delivery..."
          />
          
          <TextField
            label="Order Notes"
            fullWidth
            multiline
            rows={3}
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Any additional notes for the order..."
          />
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>Order Summary</Typography>
          <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
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
            
            {deliveryOption.fee && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Delivery Fee:</Typography>
                <Typography>UGX {deliveryOption.fee.toLocaleString()}</Typography>
              </Box>
            )}
            
            <Divider sx={{ my: 1 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">UGX {(subtotal - discountAmount + taxAmount + (deliveryOption.fee || 0)).toLocaleString()}</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOrderModalOpen(false)}>Cancel</Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handlePlaceOrder}
          disabled={deliveryOption.id !== 1 && !customerDetails.address}
        >
          Place Order
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderReceipt = (transaction) => (
  <Box sx={{ p: 3, width: '100%', maxWidth: 400, bgcolor: 'background.paper' }} id="receipt">
    {/* Receipt Header */}
    <Box sx={{ textAlign: 'center', mb: 2 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>BUSINESS NAME</Typography>
      <Typography variant="body2">123 Business Street, Kampala</Typography>
      <Typography variant="body2">Tel: +256 123 456 789</Typography>
      <Typography variant="body2">Tax ID: 123456789</Typography>
      <Divider sx={{ my: 1 }} />
      <Typography variant="h6" fontWeight="bold">{transaction.type === 'order' ? 'ORDER RECEIPT' : 'SALES RECEIPT'}</Typography>
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
        {transaction.type === 'order' && transaction.customer.address && (
          <Typography>Address: {transaction.customer.address}</Typography>
        )}
      </Box>
    )}
    
    {transaction.type === 'order' && (
      <Box sx={{ mb: 2 }}>
        <Typography fontWeight="bold">Delivery:</Typography>
        <Typography>{transaction.delivery.option.name}</Typography>
        {transaction.delivery.option.fee > 0 && (
          <Typography>Fee: UGX {transaction.delivery.option.fee.toLocaleString()}</Typography>
        )}
        {transaction.delivery.instructions && (
          <Typography>Instructions: {transaction.delivery.instructions}</Typography>
        )}
      </Box>
    )}
    
    <Divider sx={{ my: 1 }} />
    
    {/* Items Table */}
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transaction.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell align="right">{item.quantity}</TableCell>
              <TableCell align="right">{item.price.toLocaleString()}</TableCell>
              <TableCell align="right">{(item.price * item.quantity).toLocaleString()}</TableCell>
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
      {transaction.type === 'order' && transaction.delivery.option.fee > 0 && (
        <Typography>Delivery Fee: UGX {transaction.delivery.option.fee.toLocaleString()}</Typography>
      )}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
        Total: UGX {transaction.total.toLocaleString()}
      </Typography>
    </Box>
    
    <Divider sx={{ my: 1 }} />
    
    {/* Payment Info */}
    {transaction.type === 'sale' && (
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
    )}
    
    {transaction.type === 'order' && transaction.notes && (
      <Box sx={{ mt: 2 }}>
        <Typography fontWeight="bold">Order Notes:</Typography>
        <Typography>{transaction.notes}</Typography>
      </Box>
    )}
    
    <Divider sx={{ my: 2 }} />
    
    {/* Footer */}
    <Box sx={{ textAlign: 'center', mt: 2 }}>
      <Typography variant="caption" display="block">Thank you for your business!</Typography>
      {transaction.type === 'order' ? (
        <Typography variant="caption" display="block">Your order will be processed shortly</Typography>
      ) : (
        <Typography variant="caption" display="block">Items cannot be returned without receipt</Typography>
      )}
      <Typography variant="caption" display="block">Terms and conditions apply</Typography>
    </Box>
  </Box>
);

  // Receipt Modal with Sharing Options
  const ReceiptModal = () => (
  <Modal
    open={receiptModalOpen}
    onClose={() => setReceiptModalOpen(false)}
    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <Box sx={{ bgcolor: 'background.paper', boxShadow: 24, maxWidth: 500 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {currentReceipt?.type === 'order' ? 'Order Receipt' : 'Sales Receipt'}
        </Typography>
        <Box>
          <Tooltip title="Print">
            <IconButton onClick={() => window.print()} sx={{ mr: 1 }}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton onClick={() => setShareOptionsOpen(true)} sx={{ mr: 1 }}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
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
);

  // Share Options Dialog
  const ShareOptionsDialog = () => (
    <Dialog open={shareOptionsOpen} onClose={() => setShareOptionsOpen(false)}>
      <DialogTitle>Share Receipt</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid item xs={6}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<EmailIcon />}
              onClick={() => handleShare('email')}
            >
              Email
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<WhatsAppIcon />}
              onClick={() => handleShare('whatsapp')}
            >
              WhatsApp
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<FacebookIcon />}
              onClick={() => handleShare('facebook')}
            >
              Facebook
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<TwitterIcon />}
              onClick={() => handleShare('twitter')}
            >
              Twitter
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShareOptionsOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );

  // Payment History Dialog
  const PaymentHistoryDialog = () => (
    <Dialog
      open={paymentHistoryOpen}
      onClose={() => setPaymentHistoryOpen(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Transaction History</Typography>
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
                <TableCell>ID</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentHistory.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(new Date(transaction.date), 'PPpp')}</TableCell>
                  <TableCell>{transaction.id}</TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.type === 'order' ? 'Order' : 'Sale'} 
                      color={transaction.type === 'order' ? 'primary' : 'success'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{transaction.customer.name || 'Walk-in'}</TableCell>
                  <TableCell>{transaction.items.length}</TableCell>
                  <TableCell>UGX {transaction.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={transaction.status} 
                      color={
                        transaction.status === 'completed' ? 'success' : 
                        transaction.status === 'pending' ? 'warning' : 'error'
                      } 
                      size="small" 
                    />
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
            <Typography>No transaction history yet</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPaymentHistoryOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  // Main render
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Calculator Modal */}
      <CalculatorModal />
      
      {/* Order/Delivery Modal */}
      <OrderModal />

      {/* Edit Product Modal */}
      {renderEditProductModal()}
      
      {/* Receipt Modal with Sharing */}
      <ReceiptModal />
      <ShareOptionsDialog />

      {/* Payment History Dialog */}
      <PaymentHistoryDialog />
      
      {/* Header with search and cart */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <TextField
            placeholder={`Search ${viewType}...`}
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />
            }}
            value={searchText}
            onChange={handleSearch}
          />
          
          <TextField
            placeholder="Scan barcode..."
            variant="outlined"
            size="small"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && barcodeInput) {
                const product = products.find(
                  (item) => item.barcode === barcodeInput && item.type === "product"
                );
                if (product) {
                  handleAddToCart(product);
                  setBarcodeInput("");
                } else {
                  setSnackbarMessage("Product not found with this barcode");
                  setOpenSnackbar(true);
                }
              }
            }}
            InputProps={{
              endAdornment: <IconButton onClick={() => setBarcodeInput('')} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            }}
          />
        </Box>
        
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
      
      {/* View Toggle */}
      <ViewToggle />
      
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
                max={100000}
                step={500}
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
      
      {/* Products/Services Grid */}
      <Grid container spacing={3}>
        {filteredProducts.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={item.image || (item.type === "service" ? '/assets/service.jpg' : '/assets/product.jpg')}
                alt={item.name}
                sx={{ 
                  objectFit: 'contain', 
                  p: 1, 
                  bgcolor: 'white',
                  cursor: 'pointer'
                }}
                onClick={() => handleAddToCart(item)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.name}
                  </Typography>
                  {item.type === "product" && (
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditProduct(item);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {item.category} &gt; {item.subcategory}
                </Typography>
                {item.type === "service" && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Duration: {item.duration}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={item.rating} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({item.rating})
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                  UGX {item.price.toLocaleString()}
                </Typography>
                {item.type === "product" && (
                  <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                    {item.stock} in stock
                  </Typography>
                )}
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleAddToCart(item)}
                  disabled={item.type === "product" && item.stock <= 0}
                  startIcon={<ShoppingCartIcon />}
                >
                  {item.type === "product" && item.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Box sx={{ textAlign: 'center', p: 5 }}>
          <Typography variant="h6" gutterBottom>
            No {viewType} found
          </Typography>
          <Typography variant="body1">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      )}
      
      {/* Cart Drawer with integrated calculator */}
      <Drawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        PaperProps={{ sx: { width: 450 } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </Typography>
          <Box>
            <Tooltip title="Calculator">
              <IconButton onClick={() => setCalculatorOpen(true)} sx={{ mr: 1 }}>
                <CalculatorIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={() => setCartDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
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
          
          {activeStep === 0 && renderCartReview()}
          {activeStep === 1 && renderCustomerInfo()}
          {activeStep === 2 && renderPaymentMethod()}
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
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOrderModalOpen(true)}
                disabled={cart.length === 0}
                startIcon={<DeliveryIcon />}
              >
                Place Order
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleCompleteSale}
                disabled={!selectedPaymentMethod || (selectedPaymentMethod.fields.length > 0 && 
                  Object.values(paymentDetails).some(val => !val))}
                startIcon={<PaymentIcon />}
              >
                Complete Sale
              </Button>
            </Box>
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

export default SalesPage;