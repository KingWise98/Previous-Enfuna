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
    supplier: "Coca-Cola Uganda"
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
    supplier: "PepsiCo"
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
    supplier: "Mukwano Group"
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
    supplier: "Heineken International"
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
    supplier: "Uganda Breweries"
  },
  
  // Groceries
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
    supplier: "Flour Mills of Nigeria"
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
    supplier: "Hima Cement Ltd"
  },
  
  // Household
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
    supplier: "Nice House of Plastics"
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
    supplier: "Unilever"
  },
  
  // Electronics
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
    supplier: "Samsung East Africa"
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
    supplier: "Tecno Mobile"
  },
  
  // Clothing & Accessories
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
    supplier: "Textile Uganda Ltd"
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
    supplier: "Leather Crafts Uganda"
  },
  
  // Health & Beauty
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
    supplier: "Unilever"
  },
  { 
    id: 15, 
    name: "Colgate Toothpaste", 
    category: "Health & Beauty", 
    subcategory: "Oral Care", 
    price: 5000, 
    rating: 5, 
    stock: 40, 
    image: "/assets/colgate.jpg", 
    description: "Cavity protection toothpaste.",
    barcode: "567894321098",
    supplier: "Colgate-Palmolive"
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

const SalesPage = () => {
  // State Management
  const [products, setProducts] = useState(productData);
  const [cart, setCart] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(productData);
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

  const navigate = useNavigate();

  // Filter Products
  useEffect(() => {
    applyFilters();
  }, [category, subcategory, minPrice, maxPrice, rating, searchText, products]);

  const applyFilters = () => {
    const filtered = productData
      .filter((product) => (category ? product.category === category : true))
      .filter((product) => (subcategory ? product.subcategory === subcategory : true))
      .filter((product) => product.price >= minPrice && product.price <= maxPrice)
      .filter((product) => (rating ? product.rating >= rating : true))
      .filter((product) => product.name.toLowerCase().includes(searchText.toLowerCase()));

    setFilteredProducts(filtered);
  };

  // Category Map
  const categoryMap = {
    Beverages: ["Soft Drinks", "Juices", "Water"],
    Snacks: ["Chips", "Biscuits", "Nuts"],
    Dairy: ["Milk", "Cheese", "Yogurt"],
    Bakery: ["Bread", "Cakes", "Pastries"],
  };
  
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
      status: 'completed',
      amountTendered: selectedPaymentMethod.type === 'cash' ? parseFloat(cashAmount) : 0,
      changeDue: selectedPaymentMethod.type === 'cash' ? changeDue : 0
    };

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
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.discount) / 100 : 0;
  const taxRate = 0.18; // 18% VAT
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const totalAmount = subtotal - discountAmount + taxAmount;
  
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
              <TextField
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                inputProps={{ min: 1, max: item.stock }}
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
      
      {/* Products Grid */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 2 }}>
                  {product.stock} in stock
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