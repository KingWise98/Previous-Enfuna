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
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const SalesPage = () => {
  // State Management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [cart, setCart] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [discountOffers, setDiscountOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Withholding Tax State
  const [withholdingTaxEnabled, setWithholdingTaxEnabled] = useState(false);
  const [withholdingTaxRate, setWithholdingTaxRate] = useState(0.06); // 6%
  const [withholdingTaxAmount, setWithholdingTaxAmount] = useState(0);

  const navigate = useNavigate();

  // Dummy Data
  const dummyCategories = [
    { id: 1, name: "Electronics", subcategories: ["Smartphones", "Laptops", "Tablets", "Accessories"] },
    { id: 2, name: "Clothing", subcategories: ["Men", "Women", "Kids", "Accessories"] },
    { id: 3, name: "Home & Kitchen", subcategories: ["Appliances", "Furniture", "Cookware", "Decor"] },
    { id: 4, name: "Beauty", subcategories: ["Skincare", "Makeup", "Haircare", "Fragrances"] },
    { id: 5, name: "Sports", subcategories: ["Fitness", "Outdoor", "Team Sports", "Footwear"] }
  ];

  const dummyProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      description: "Latest Apple smartphone with advanced camera system",
      price: 4500000,
      stock: 15,
      category: "Electronics",
      subcategory: "Smartphones",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300",
      barcode: "123456789012",
      supplier: "Apple Inc"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      description: "Powerful Android phone with AI features",
      price: 3200000,
      stock: 25,
      category: "Electronics",
      subcategory: "Smartphones",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
      barcode: "123456789013",
      supplier: "Samsung Electronics"
    },
    {
      id: 3,
      name: "MacBook Air M2",
      description: "Lightweight laptop with M2 chip",
      price: 6500000,
      stock: 8,
      category: "Electronics",
      subcategory: "Laptops",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300",
      barcode: "123456789014",
      supplier: "Apple Inc"
    },
    {
      id: 4,
      name: "Nike Air Max",
      description: "Comfortable running shoes",
      price: 350000,
      stock: 50,
      category: "Sports",
      subcategory: "Footwear",
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300",
      barcode: "123456789015",
      supplier: "Nike Uganda"
    },
    {
      id: 5,
      name: "Kitchen Blender",
      description: "High-speed blender for smoothies and cooking",
      price: 120000,
      stock: 30,
      category: "Home & Kitchen",
      subcategory: "Appliances",
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=300",
      barcode: "123456789016",
      supplier: "KitchenWare Ltd"
    },
    {
      id: 6,
      name: "Men's Cotton T-Shirt",
      description: "Premium quality cotton t-shirt",
      price: 45000,
      stock: 100,
      category: "Clothing",
      subcategory: "Men",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
      barcode: "123456789017",
      supplier: "Fashion Textiles"
    },
    {
      id: 7,
      name: "Wireless Headphones",
      description: "Noise-cancelling Bluetooth headphones",
      price: 280000,
      stock: 20,
      category: "Electronics",
      subcategory: "Accessories",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
      barcode: "123456789018",
      supplier: "AudioTech Ltd"
    },
    {
      id: 8,
      name: "Face Cream",
      description: "Moisturizing cream for daily use",
      price: 75000,
      stock: 60,
      category: "Beauty",
      subcategory: "Skincare",
      rating: 4.1,
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300",
      barcode: "123456789019",
      supplier: "Beauty Products Co"
    },
    {
      id: 9,
      name: "Yoga Mat",
      description: "Non-slip exercise mat",
      price: 85000,
      stock: 40,
      category: "Sports",
      subcategory: "Fitness",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300",
      barcode: "123456789020",
      supplier: "Fitness Gear Ltd"
    },
    {
      id: 10,
      name: "Coffee Maker",
      description: "Automatic drip coffee machine",
      price: 180000,
      stock: 15,
      category: "Home & Kitchen",
      subcategory: "Appliances",
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300",
      barcode: "123456789021",
      supplier: "KitchenWare Ltd"
    },
    {
      id: 11,
      name: "Women's Handbag",
      description: "Leather handbag with multiple compartments",
      price: 220000,
      stock: 25,
      category: "Clothing",
      subcategory: "Women",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300",
      barcode: "123456789022",
      supplier: "Fashion Textiles"
    },
    {
      id: 12,
      name: "Tablet Stand",
      description: "Adjustable stand for tablets and phones",
      price: 35000,
      stock: 75,
      category: "Electronics",
      subcategory: "Accessories",
      rating: 4.0,
      image: "https://images.unsplash.com/photo-1558618666-fcd25856cd63?w=300",
      barcode: "123456789023",
      supplier: "Tech Accessories Inc"
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
      name: "Welcome Discount",
      code: "WELCOME10",
      discount: 10,
      description: "10% off on your first purchase"
    },
    {
      id: 2,
      name: "Season Sale",
      code: "SEASON20",
      discount: 20,
      description: "20% off on all items"
    },
    {
      id: 3,
      name: "Clearance",
      code: "CLEARANCE15",
      discount: 15,
      description: "15% off on clearance items"
    }
  ];

  const dummyPaymentHistory = [
    {
      id: "TXN-001",
      date: new Date(2024, 0, 15, 14, 30),
      items: [
        { id: 1, name: "iPhone 15 Pro", price: 4500000, quantity: 1 },
        { id: 7, name: "Wireless Headphones", price: 280000, quantity: 1 }
      ],
      customer: { name: "John Smith", phone: "+256 712 345 678", email: "john.smith@email.com" },
      paymentMethod: dummyPaymentMethods[1],
      paymentDetails: { "Card Number": "**** **** **** 1234", "Card Holder": "John Smith" },
      subtotal: 4780000,
      discount: 0,
      tax: 860400,
      withholdingTax: 0,
      total: 5640400,
      amountTendered: 5640400,
      changeDue: 0,
      status: 'completed'
    },
    {
      id: "TXN-002",
      date: new Date(2024, 0, 14, 10, 15),
      items: [
        { id: 4, name: "Nike Air Max", price: 350000, quantity: 2 },
        { id: 6, name: "Men's Cotton T-Shirt", price: 45000, quantity: 3 }
      ],
      customer: { name: "", phone: "", email: "" },
      paymentMethod: dummyPaymentMethods[0],
      paymentDetails: {},
      subtotal: 835000,
      discount: 83500,
      tax: 135270,
      withholdingTax: 0,
      total: 886770,
      amountTendered: 900000,
      changeDue: 13230,
      status: 'completed'
    }
  ];

  // Fetch data from API - replace with your actual API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use dummy data
        setProducts(dummyProducts);
        setFilteredProducts(dummyProducts);
        setCategories(dummyCategories);
        setPaymentMethods(dummyPaymentMethods);
        setDiscountOffers(dummyDiscountOffers);
        setPaymentHistory(dummyPaymentHistory);
        
        // Create category map
        const map = {};
        dummyCategories.forEach(cat => {
          map[cat.name] = cat.subcategories || [];
        });
        setCategoryMap(map);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setSnackbarMessage("Failed to load data from server");
        setOpenSnackbar(true);
      }
    };
    
    fetchData();
  }, []);

  // Filter Products
  useEffect(() => {
    applyFilters();
  }, [category, subcategory, minPrice, maxPrice, rating, searchText, products]);

  const applyFilters = () => {
    const filtered = products
      .filter((product) => (category ? product.category === category : true))
      .filter((product) => (subcategory ? product.subcategory === subcategory : true))
      .filter((product) => product.price >= minPrice && product.price <= maxPrice)
      .filter((product) => (rating ? product.rating >= rating : true))
      .filter((product) => product.name.toLowerCase().includes(searchText.toLowerCase()));

    setFilteredProducts(filtered);
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
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
        <Typography variant="h5" fontWeight="bold" gutterBottom>BUSINESS NAME</Typography>
        <Typography variant="body2">123 Business Street, Kampala</Typography>
        <Typography variant="body2">Tel: +256 123 456 789</Typography>
        <Typography variant="body2">Tax ID: 123456789</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="h6" fontWeight="bold">SALES RECEIPT</Typography>
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
        <Typography variant="caption" display="block">Items cannot be returned without receipt</Typography>
        <Typography variant="caption" display="block">Terms and conditions apply</Typography>
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
  const handleAddToCart = (product) => {
    if (product.stock <= 0) return;
    
    const existingProduct = cart.find((item) => item.id === product.id);
    if (existingProduct) {
      if (existingProduct.quantity >= product.stock) {
        setSnackbarMessage(`Only ${product.stock} items available in stock`);
        setOpenSnackbar(true);
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setSnackbarMessage(`${product.name} added to cart!`);
    setOpenSnackbar(true);
    setCartDrawerOpen(true);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity) || 0;
    if (quantity < 1) return;
    
    const product = products.find(p => p.id === productId);
    if (quantity > product.stock) {
      setSnackbarMessage(`Only ${product.stock} items available in stock`);
      setOpenSnackbar(true);
      return;
    }
    
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const handleIncreaseQuantity = (productId) => {
    const product = cart.find(item => item.id === productId);
    const originalProduct = products.find(p => p.id === productId);
    
    if (product.quantity >= originalProduct.stock) {
      setSnackbarMessage(`Only ${originalProduct.stock} items available in stock`);
      setOpenSnackbar(true);
      return;
    }
    
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (productId) => {
    setCart(
      cart.map((item) =>
        item.id === productId && item.quantity > 1 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  };

  // Payment Processing
  const handleCompleteSale = async () => {
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

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update stock levels
      const updatedProducts = products.map(product => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem) {
          return {
            ...product,
            stock: product.stock - cartItem.quantity
          };
        }
        return product;
      });
      
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      
      // Update UI
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
    } catch (err) {
      setSnackbarMessage("Failed to complete transaction");
      setOpenSnackbar(true);
      console.error("Transaction error:", err);
    }
  };

  // Steps for checkout process
  const steps = ['Cart Review', 'Customer Info', 'Payment'];

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

  // Search all products for adding to cart
  const searchAllProducts = products.filter(product => 
    product.name.toLowerCase().includes(cartSearchText.toLowerCase()) &&
    !cart.some(item => item.id === product.id)
  );

  // Product Editing Functions
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setEditModalOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedProducts = products.map(p => 
        p.id === editingProduct.id ? editingProduct : p
      );
      
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setEditModalOpen(false);
      setEditingProduct(null);
      setSnackbarMessage("Product updated successfully!");
      setOpenSnackbar(true);
    } catch (err) {
      setSnackbarMessage("Failed to update product");
      setOpenSnackbar(true);
      console.error("Update product error:", err);
    }
  };

  const handleEditFieldChange = (field, value) => {
    if (!editingProduct) return;
    
    setEditingProduct({
      ...editingProduct,
      [field]: value
    });
  };

  // Render Edit Product Modal
  const renderEditProductModal = () => (
    <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
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
            
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={editingProduct.category}
                label="Category"
                onChange={(e) => handleEditFieldChange('category', e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={editingProduct.subcategory}
                label="Subcategory"
                onChange={(e) => handleEditFieldChange('subcategory', e.target.value)}
              >
                {categoryMap[editingProduct.category]?.map((subcat) => (
                  <MenuItem key={subcat} value={subcat}>{subcat}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
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
            
            <TextField
              label="Rating"
              type="number"
              value={editingProduct.rating}
              onChange={(e) => handleEditFieldChange('rating', parseFloat(e.target.value) || 0)}
              fullWidth
              inputProps={{ min: 0, max: 5, step: 0.1 }}
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
          <Typography>Available Products ({searchAllProducts.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {searchAllProducts.map((product) => (
              <ListItem 
                key={product.id} 
                secondaryAction={
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                  >
                    Add
                  </Button>
                }
              >
                <ListItemAvatar>
                  <Avatar src={product.image} alt={product.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={product.name}
                  secondary={`UGX ${product.price.toLocaleString()} | Stock: ${product.stock}`}
                />
              </ListItem>
            ))}
            {searchAllProducts.length === 0 && (
              <Typography sx={{ textAlign: 'center', p: 2 }}>No matching products found</Typography>
            )}
          </List>
        </AccordionDetails>
      </Accordion>
      
      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>Cart Items ({cart.length})</Typography>
      
      <List>
        {filteredCartItems.map((item) => (
          <ListItem key={item.id} secondaryAction={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                size="small" 
                onClick={() => handleDecreaseQuantity(item.id)}
                disabled={item.quantity <= 1}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                inputProps={{ min: 1, max: item.stock }}
                size="small"
                sx={{ width: 70, mx: 1 }}
              />
              <IconButton 
                size="small" 
                onClick={() => handleIncreaseQuantity(item.id)}
                disabled={item.quantity >= item.stock}
              >
                <AddIcon />
              </IconButton>
              <IconButton 
                onClick={() => handleRemoveFromCart(item.id)}
                color="error"
                sx={{ ml: 1 }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          }>
            <ListItemAvatar>
              <Avatar src={item.image} alt={item.name} />
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
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6" color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Edit Product Modal */}
      {renderEditProductModal()}
      
      {/* Header with search and cart */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <TextField
          placeholder="Search products..."
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
          <TextField
            placeholder="Scan barcode..."
            variant="outlined"
            size="small"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && barcodeInput) {
                const product = products.find(
                  (item) => item.barcode === barcodeInput
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
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
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
      
      {/* Products Grid */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                image={product.image}
                alt={product.name}
                sx={{ 
                  objectFit: 'contain', 
                  p: 1, 
                  bgcolor: 'white',
                  cursor: 'pointer'
                }}
                onClick={() => handleAddToCart(product)}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProduct(product);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {product.category} &gt; {product.subcategory}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={product.rating} precision={0.5} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({product.rating})
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                  UGX {product.price.toLocaleString()}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontStyle: 'italic', 
                    mb: 2,
                    color: product.stock > 10 ? 'success.main' : product.stock > 0 ? 'warning.main' : 'error.main'
                  }}
                >
                  {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  startIcon={<ShoppingCartIcon />}
                >
                  {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
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
            No products found
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
            Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
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
            <Typography variant="h6">Payment History</Typography>
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
                  <TableCell>Items</TableCell>
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
              <Typography>No payment history yet</Typography>
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

export default SalesPage;