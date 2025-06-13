import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  IconButton,
  Divider,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Badge,
  Snackbar,
  Alert,
  CardActions,
  LinearProgress,
  Tooltip,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {
  Add,
  Search,
  FilterList,
  Sort,
  Inventory as InventoryIcon,
  Edit,
  Close,
  Delete,
  DateRange,
  AttachMoney,
  LocalShipping,
  Receipt,
  Warning,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Cancel
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, subDays, isAfter, isBefore, parseISO } from "date-fns";

// Sample initial inventory data
const initialInventoryData = [
  {
    id: 1,
    name: "Fanta",
    category: "Beverages",
    subcategory: "Soft Drinks",
    purchasePrice: 1000,
    sellingPrice: 1500,
    currentStock: 50,
    minStockLevel: 10,
    expiryDate: "2023-12-31",
    supplier: "Coca-Cola Distributors",
    lastPurchaseDate: "2023-06-15",
    barcode: "123456789",
    value: 50000
  },
  {
    id: 2,
    name: "Mountain Dew",
    category: "Beverages",
    subcategory: "Soft Drinks",
    purchasePrice: 1100,
    sellingPrice: 1500,
    currentStock: 30,
    minStockLevel: 10,
    expiryDate: "2024-01-15",
    supplier: "PepsiCo",
    lastPurchaseDate: "2023-06-10",
    barcode: "987654321",
    value: 33000
  },
  {
    id: 3,
    name: "AFIA JUICE Tropical",
    category: "Beverages",
    subcategory: "Juices",
    purchasePrice: 1500,
    sellingPrice: 2000,
    currentStock: 20,
    minStockLevel: 5,
    expiryDate: "2023-09-30",
    supplier: "Afia International",
    lastPurchaseDate: "2023-06-05",
    barcode: "456123789",
    value: 30000
  },
  {
    id: 4,
    name: "Heineken Beer 330ml",
    category: "Beverages",
    subcategory: "Alcoholic",
    purchasePrice: 3500,
    sellingPrice: 5000,
    currentStock: 60,
    minStockLevel: 20,
    expiryDate: "2024-03-31",
    supplier: "Heineken Uganda",
    lastPurchaseDate: "2023-06-18",
    barcode: "789123456",
    value: 210000
  },
  {
    id: 5,
    name: "Golden Penny Semovita 2kg",
    category: "Groceries",
    subcategory: "Flour & Grains",
    purchasePrice: 3000,
    sellingPrice: 3500,
    currentStock: 30,
    minStockLevel: 15,
    expiryDate: "2024-02-28",
    supplier: "Flour Mills of Nigeria",
    lastPurchaseDate: "2023-06-12",
    barcode: "321654987",
    value: 90000
  },
  {
    id: 6,
    name: "OMO Detergent 5kg",
    category: "Household",
    subcategory: "Cleaning",
    purchasePrice: 12000,
    sellingPrice: 15000,
    currentStock: 18,
    minStockLevel: 10,
    expiryDate: "2025-01-31",
    supplier: "Unilever",
    lastPurchaseDate: "2023-06-08",
    barcode: "654987321",
    value: 216000
  },
  {
    id: 7,
    name: "Tecno Spark 10",
    category: "Electronics",
    subcategory: "Mobile Phones",
    purchasePrice: 650000,
    sellingPrice: 750000,
    currentStock: 12,
    minStockLevel: 5,
    expiryDate: null, // No expiry for electronics
    supplier: "Tecno Mobile",
    lastPurchaseDate: "2023-06-01",
    barcode: "147258369",
    value: 7800000
  },
  {
    id: 8,
    name: "Dove Body Wash",
    category: "Health & Beauty",
    subcategory: "Personal Care",
    purchasePrice: 9000,
    sellingPrice: 12000,
    currentStock: 25,
    minStockLevel: 10,
    expiryDate: "2024-06-30",
    supplier: "Unilever",
    lastPurchaseDate: "2023-05-28",
    barcode: "369258147",
    value: 225000
  },
  {
    id: 9,
    name: "Hima Cement 50kg",
    category: "Groceries",
    subcategory: "Building Materials",
    purchasePrice: 40000,
    sellingPrice: 45000,
    currentStock: 5,
    minStockLevel: 3,
    expiryDate: null, // No expiry for cement
    supplier: "Hima Cement",
    lastPurchaseDate: "2023-05-20",
    barcode: "192087321",
    value: 200000
  },
];

// Sample inventory history data
const inventoryHistoryData = [
  { id: 1, productId: 1, type: "purchase", quantity: 50, date: "2023-06-15", price: 1000, total: 50000, supplier: "Coca-Cola Distributors" },
  { id: 2, productId: 2, type: "purchase", quantity: 30, date: "2023-06-10", price: 1100, total: 33000, supplier: "PepsiCo" },
  { id: 3, productId: 3, type: "purchase", quantity: 20, date: "2023-06-05", price: 1500, total: 30000, supplier: "Afia International" },
  { id: 4, productId: 1, type: "sale", quantity: -5, date: "2023-06-16", price: 1500, total: -7500, supplier: null },
  { id: 5, productId: 2, type: "sale", quantity: -3, date: "2023-06-12", price: 1500, total: -4500, supplier: null },
  { id: 6, productId: 4, type: "purchase", quantity: 60, date: "2023-06-18", price: 3500, total: 210000, supplier: "Heineken Uganda" },
  { id: 7, productId: 5, type: "purchase", quantity: 30, date: "2023-06-12", price: 3000, total: 90000, supplier: "Flour Mills of Nigeria" },
  { id: 8, productId: 6, type: "purchase", quantity: 18, date: "2023-06-08", price: 12000, total: 216000, supplier: "Unilever" },
  { id: 9, productId: 7, type: "purchase", quantity: 12, date: "2023-06-01", price: 650000, total: 7800000, supplier: "Tecno Mobile" },
  { id: 10, productId: 8, type: "purchase", quantity: 25, date: "2023-05-28", price: 9000, total: 225000, supplier: "Unilever" },
  { id: 11, productId: 9, type: "purchase", quantity: 5, date: "2023-05-20", price: 40000, total: 200000, supplier: "Hima Cement" },
  { id: 12, productId: 3, type: "sale", quantity: -2, date: "2023-06-14", price: 2000, total: -4000, supplier: null },
  { id: 13, productId: 4, type: "sale", quantity: -6, date: "2023-06-19", price: 5000, total: -30000, supplier: null },
  { id: 14, productId: 5, type: "sale", quantity: -3, date: "2023-06-15", price: 3500, total: -10500, supplier: null },
];

// Sample suppliers data
const suppliersData = [
  { id: 1, name: "Coca-Cola Distributors", contact: "0712345678", email: "orders@coke.ug", address: "Kampala" },
  { id: 2, name: "PepsiCo", contact: "0723456789", email: "orders@pepsi.ug", address: "Kampala" },
  { id: 3, name: "Afia International", contact: "0734567890", email: "orders@afia.com", address: "Kampala" },
  { id: 4, name: "Heineken Uganda", contact: "0745678901", email: "orders@heineken.ug", address: "Kampala" },
  { id: 5, name: "Flour Mills of Nigeria", contact: "0756789012", email: "orders@flourmills.ng", address: "Lagos" },
  { id: 6, name: "Unilever", contact: "0767890123", email: "orders@unilever.com", address: "Nairobi" },
  { id: 7, name: "Tecno Mobile", contact: "0778901234", email: "orders@tecno.com", address: "Shenzhen" },
  { id: 8, name: "Hima Cement", contact: "0789012345", email: "orders@hima.com", address: "Kasese" },
];

const InventoryPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State management
  const [inventory, setInventory] = useState(initialInventoryData);
  const [filteredInventory, setFilteredInventory] = useState(initialInventoryData);
  const [inventoryHistory, setInventoryHistory] = useState(inventoryHistoryData);
  const [suppliers, setSuppliers] = useState(suppliersData);
  const [selectedItem, setSelectedItem] = useState(null);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [minStock, setMinStock] = useState(0);
  const [maxStock, setMaxStock] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [openPurchaseDialog, setOpenPurchaseDialog] = useState(false);
  const [openSupplierDialog, setOpenSupplierDialog] = useState(false);
  const [newItem, setNewItem] = useState({ 
    name: "", 
    category: "", 
    subcategory: "", 
    purchasePrice: "", 
    sellingPrice: "", 
    currentStock: "", 
    minStockLevel: "",
    expiryDate: null,
    supplier: "",
    barcode: ""
    
  });
  const [newPurchase, setNewPurchase] = useState({
    productId: "",
    quantity: "",
    price: "",
    date: new Date(),
    supplier: ""
  });
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    contact: "",
    email: "",
    address: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [historyPage, setHistoryPage] = useState(0);
  const [historyRowsPerPage, setHistoryRowsPerPage] = useState(5);
  const [suppliersPage, setSuppliersPage] = useState(0);
  const [suppliersRowsPerPage, setSuppliersRowsPerPage] = useState(5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date()
  });
  const [valuationFilter, setValuationFilter] = useState("all");

  // Category structure with subcategories
  const categoryStructure = {
    "Beverages": ["Soft Drinks", "Juices", "Alcoholic", "Energy Drinks"],
    "Groceries": ["Flour & Grains", "Cooking Oil", "Rice & Pasta", "Building Materials"],
    "Household": ["Cleaning", "Bathroom", "Kitchen"],
    "Electronics": ["Mobile Phones", "Laptops", "Accessories"],
    "Health & Beauty": ["Personal Care", "Hair Care", "Makeup"]
  };

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filtered = [...inventory];
    
    // Apply tab-specific filters
    if (activeTab === 1) { // Low stock tab
      filtered = filtered.filter(item => item.currentStock <= item.minStockLevel);
    } else if (activeTab === 2) { // Near expiry tab
      const today = new Date();
      const next30Days = new Date(today.setDate(today.getDate() + 30));
      filtered = filtered.filter(item => 
        item.expiryDate && isAfter(parseISO(item.expiryDate), new Date()) && 
        isBefore(parseISO(item.expiryDate), next30Days)
      );
    }
    
    // Category filter
    if (category) {
      filtered = filtered.filter(item => item.category === category);
    }
    
    // Subcategory filter
    if (subcategory) {
      filtered = filtered.filter(item => item.subcategory === subcategory);
    }
    
    // Stock filter
    filtered = filtered.filter(item => 
      item.currentStock >= minStock && item.currentStock <= maxStock
    );
    
    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.barcode.includes(term) ||
        item.supplier.toLowerCase().includes(term)
      );
    }
    
    setFilteredInventory(filtered);
  }, [inventory, category, subcategory, minStock, maxStock, searchTerm, activeTab]);

  // Calculate inventory metrics
  const calculateInventoryMetrics = () => {
    const totalItems = inventory.length;
    const totalStockValue = inventory.reduce((sum, item) => sum + (item.purchasePrice * item.currentStock), 0);
    const totalSellingValue = inventory.reduce((sum, item) => sum + (item.sellingPrice * item.currentStock), 0);
    const lowStockItems = inventory.filter(item => item.currentStock <= item.minStockLevel).length;
    const nearExpiryItems = inventory.filter(item => 
      item.expiryDate && 
      isAfter(parseISO(item.expiryDate), new Date()) && 
      isBefore(parseISO(item.expiryDate), new Date(new Date().setDate(new Date().getDate() + 30))
    )).length;
    
    return {
      totalItems,
      totalStockValue,
      totalSellingValue,
      lowStockItems,
      nearExpiryItems
    };
  };

  const metrics = calculateInventoryMetrics();

  // Filter inventory history by date range
  const filteredHistory = inventoryHistory.filter(record => {
    const recordDate = parseISO(record.date);
    return isAfter(recordDate, dateRange.start) && isBefore(recordDate, dateRange.end);
  });

  // Filter valuation by type
  const filteredValuation = valuationFilter === "all" 
    ? filteredInventory 
    : valuationFilter === "lowStock" 
      ? filteredInventory.filter(item => item.currentStock <= item.minStockLevel)
      : filteredInventory.filter(item => 
          item.expiryDate && 
          isAfter(parseISO(item.expiryDate), new Date()) && 
          isBefore(parseISO(item.expiryDate), new Date(new Date().setDate(new Date().getDate() + 30))
        ));

  // Show snackbar notification
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Close all dialogs
  const handleDialogClose = () => {
    setOpenItemDialog(false);
    setOpenPurchaseDialog(false);
    setOpenSupplierDialog(false);
    setSelectedItem(null);
    setNewItem({ 
      name: "", 
      category: "", 
      subcategory: "", 
      purchasePrice: "", 
      sellingPrice: "", 
      currentStock: "", 
      minStockLevel: "",
      expiryDate: null,
      supplier: "",
      barcode: ""
    });
    setNewPurchase({
      productId: "",
      quantity: "",
      price: "",
      date: new Date(),
      supplier: ""
    });
    setNewSupplier({
      name: "",
      contact: "",
      email: "",
      address: ""
    });
    setIsEditing(false);
    setEditingItemId(null);
  };

  // Add a new inventory item
  const handleAddItem = () => {
    const newItemWithId = {
      ...newItem,
      id: inventory.length + 1,
      purchasePrice: Number(newItem.purchasePrice),
      sellingPrice: Number(newItem.sellingPrice),
      currentStock: Number(newItem.currentStock) || 0,
      minStockLevel: Number(newItem.minStockLevel) || 0,
      expiryDate: newItem.expiryDate ? format(newItem.expiryDate, "yyyy-MM-dd") : null,
      lastPurchaseDate: format(new Date(), "yyyy-MM-dd"),
      value: Number(newItem.purchasePrice) * (Number(newItem.currentStock) || 0)
    };
    
    setInventory([...inventory, newItemWithId]);
    
    // Add to history if stock is added
    if (newItem.currentStock > 0) {
      const newHistoryRecord = {
        id: inventoryHistory.length + 1,
        productId: inventory.length + 1,
        type: "purchase",
        quantity: Number(newItem.currentStock),
        date: format(new Date(), "yyyy-MM-dd"),
        price: Number(newItem.purchasePrice),
        total: Number(newItem.purchasePrice) * Number(newItem.currentStock),
        supplier: newItem.supplier
      };
      setInventoryHistory([...inventoryHistory, newHistoryRecord]);
    }
    
    showSnackbar("Item added successfully", "success");
    handleDialogClose();
  };

  // Handle opening the edit item dialog
  const handleEditItem = (item) => {
    setSelectedItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      subcategory: item.subcategory,
      purchasePrice: item.purchasePrice,
      sellingPrice: item.sellingPrice,
      currentStock: item.currentStock,
      minStockLevel: item.minStockLevel,
      expiryDate: item.expiryDate ? parseISO(item.expiryDate) : null,
      supplier: item.supplier,
      barcode: item.barcode
    });
    setIsEditing(true);
    setEditingItemId(item.id);
    setOpenItemDialog(true);
  };

  // Handle saving edited item
  const handleSaveEditedItem = () => {
    const updatedInventory = inventory.map(item => {
      if (item.id === editingItemId) {
        return {
          ...item,
          name: newItem.name,
          category: newItem.category,
          subcategory: newItem.subcategory,
          purchasePrice: Number(newItem.purchasePrice),
          sellingPrice: Number(newItem.sellingPrice),
          currentStock: Number(newItem.currentStock),
          minStockLevel: Number(newItem.minStockLevel),
          expiryDate: newItem.expiryDate ? format(newItem.expiryDate, "yyyy-MM-dd") : null,
          supplier: newItem.supplier,
          barcode: newItem.barcode,
          value: Number(newItem.purchasePrice) * Number(newItem.currentStock)
        };
      }
      return item;
    });

    setInventory(updatedInventory);
    setFilteredInventory(updatedInventory);
    showSnackbar("Item updated successfully", "success");
    handleDialogClose();
  };

  // Handle adding a purchase
  const handleAddPurchase = () => {
    const updatedInventory = inventory.map(item => {
      if (item.id === Number(newPurchase.productId)) {
        const updatedStock = item.currentStock + Number(newPurchase.quantity);
        return {
          ...item,
          currentStock: updatedStock,
          lastPurchaseDate: format(newPurchase.date, "yyyy-MM-dd"),
          supplier: newPurchase.supplier,
          value: item.purchasePrice * updatedStock
        };
      }
      return item;
    });

    setInventory(updatedInventory);
    
    // Add to history
    const product = inventory.find(item => item.id === Number(newPurchase.productId));
    const newHistoryRecord = {
      id: inventoryHistory.length + 1,
      productId: Number(newPurchase.productId),
      type: "purchase",
      quantity: Number(newPurchase.quantity),
      date: format(newPurchase.date, "yyyy-MM-dd"),
      price: Number(newPurchase.price),
      total: Number(newPurchase.price) * Number(newPurchase.quantity),
      supplier: newPurchase.supplier
    };
    setInventoryHistory([...inventoryHistory, newHistoryRecord]);
    
    showSnackbar("Purchase added successfully", "success");
    handleDialogClose();
  };

  // Handle adding a new supplier
  const handleAddSupplier = () => {
    const newSupplierWithId = {
      ...newSupplier,
      id: suppliers.length + 1
    };
    setSuppliers([...suppliers, newSupplierWithId]);
    showSnackbar("Supplier added successfully", "success");
    handleDialogClose();
  };

  // Handle deleting a supplier
  const handleDeleteSupplier = (supplierId) => {
    if (inventory.some(item => item.supplier === suppliers.find(s => s.id === supplierId)?.name)) {
      showSnackbar("Cannot delete supplier with associated inventory items", "error");
      return;
    }
    setSuppliers(suppliers.filter(supplier => supplier.id !== supplierId));
    showSnackbar("Supplier deleted successfully", "success");
  };

  // Handle changing history page
  const handleHistoryPageChange = (event, newPage) => {
    setHistoryPage(newPage);
  };

  // Handle changing history rows per page
  const handleHistoryRowsPerPageChange = (event) => {
    setHistoryRowsPerPage(parseInt(event.target.value, 10));
    setHistoryPage(0);
  };

  // Handle changing suppliers page
  const handleSuppliersPageChange = (event, newPage) => {
    setSuppliersPage(newPage);
  };

  // Handle changing suppliers rows per page
  const handleSuppliersRowsPerPageChange = (event) => {
    setSuppliersRowsPerPage(parseInt(event.target.value, 10));
    setSuppliersPage(0);
  };

  // Inventory Item Form Dialog (Add/Edit)
  const InventoryItemFormDialog = () => (
    <Dialog 
      open={openItemDialog} 
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {isEditing ? "Edit Inventory Item" : "Add New Inventory Item"}
          <IconButton onClick={handleDialogClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value, subcategory: ""})}
                label="Category"
                required
              >
                <MenuItem value=""><em>Select Category</em></MenuItem>
                {Object.keys(categoryStructure).map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={newItem.subcategory}
                onChange={(e) => setNewItem({...newItem, subcategory: e.target.value})}
                label="Subcategory"
                disabled={!newItem.category}
              >
                <MenuItem value=""><em>Select Subcategory</em></MenuItem>
                {newItem.category && categoryStructure[newItem.category]?.map((subcat) => (
                  <MenuItem key={subcat} value={subcat}>{subcat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Purchase Price (UGX)"
              type="number"
              value={newItem.purchasePrice}
              onChange={(e) => setNewItem({...newItem, purchasePrice: e.target.value})}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Selling Price (UGX)"
              type="number"
              value={newItem.sellingPrice}
              onChange={(e) => setNewItem({...newItem, sellingPrice: e.target.value})}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Current Stock"
              type="number"
              value={newItem.currentStock}
              onChange={(e) => setNewItem({...newItem, currentStock: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Minimum Stock Level"
              type="number"
              value={newItem.minStockLevel}
              onChange={(e) => setNewItem({...newItem, minStockLevel: e.target.value})}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Expiry Date (if applicable)"
                value={newItem.expiryDate}
                onChange={(newValue) => setNewItem({...newItem, expiryDate: newValue})}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Supplier</InputLabel>
              <Select
                value={newItem.supplier}
                onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                label="Supplier"
              >
                <MenuItem value=""><em>Select Supplier</em></MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.name}>{supplier.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Barcode/ID"
              value={newItem.barcode}
              onChange={(e) => setNewItem({...newItem, barcode: e.target.value})}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={isEditing ? handleSaveEditedItem : handleAddItem}
          disabled={!newItem.name || !newItem.category || !newItem.purchasePrice || !newItem.sellingPrice}
        >
          {isEditing ? "Save Changes" : "Add Item"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Purchase Form Dialog
  const PurchaseFormDialog = () => (
    <Dialog 
      open={openPurchaseDialog} 
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Add Purchase
          <IconButton onClick={handleDialogClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Product</InputLabel>
              <Select
                value={newPurchase.productId}
                onChange={(e) => {
                  const product = inventory.find(item => item.id === Number(e.target.value));
                  setNewPurchase({
                    ...newPurchase,
                    productId: e.target.value,
                    price: product?.purchasePrice || "",
                    supplier: product?.supplier || ""
                  });
                }}
                label="Product"
                required
              >
                <MenuItem value=""><em>Select Product</em></MenuItem>
                {inventory.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={newPurchase.quantity}
              onChange={(e) => setNewPurchase({...newPurchase, quantity: e.target.value})}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price per Unit (UGX)"
              type="number"
              value={newPurchase.price}
              onChange={(e) => setNewPurchase({...newPurchase, price: e.target.value})}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Purchase Date"
                value={newPurchase.date}
                onChange={(newValue) => setNewPurchase({...newPurchase, date: newValue})}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Supplier</InputLabel>
              <Select
                value={newPurchase.supplier}
                onChange={(e) => setNewPurchase({...newPurchase, supplier: e.target.value})}
                label="Supplier"
              >
                <MenuItem value=""><em>Select Supplier</em></MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.name}>{supplier.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleAddPurchase}
          disabled={!newPurchase.productId || !newPurchase.quantity || !newPurchase.price}
        >
          Add Purchase
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Supplier Form Dialog
  const SupplierFormDialog = () => (
    <Dialog 
      open={openSupplierDialog} 
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Add New Supplier
          <IconButton onClick={handleDialogClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Supplier Name"
              value={newSupplier.name}
              onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Number"
              value={newSupplier.contact}
              onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newSupplier.email}
              onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={newSupplier.address}
              onChange={(e) => setNewSupplier({...newSupplier, address: e.target.value})}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleAddSupplier}
          disabled={!newSupplier.name || !newSupplier.contact}
        >
          Add Supplier
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ padding: isMobile ? 1 : 3 }}>
      {/* Page Title and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Inventory Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setOpenItemDialog(true);
              setIsEditing(false);
            }}
          >
            Add Item
          </Button>
          <Button
            variant="contained"
            startIcon={<LocalShipping />}
            onClick={() => setOpenPurchaseDialog(true)}
          >
            Add Purchase
          </Button>
        </Box>
      </Box>

      {/* Inventory Dashboard */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <InventoryIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Items</Typography>
              </Box>
              <Typography variant="h4">{metrics.totalItems}</Typography>
              <Typography variant="body2" color="text.secondary">in inventory</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AttachMoney color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Stock Value</Typography>
              </Box>
              <Typography variant="h4">UGX {metrics.totalStockValue.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">at cost</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Selling Value</Typography>
              </Box>
              <Typography variant="h4">UGX {metrics.totalSellingValue.toLocaleString()}</Typography>
              <Typography variant="body2" color="text.secondary">potential revenue</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Low Stock</Typography>
              </Box>
              <Typography variant="h4">{metrics.lowStockItems}</Typography>
              <Typography variant="body2" color="text.secondary">items need restocking</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="All Inventory" />
        <Tab label={
          <Badge badgeContent={metrics.lowStockItems} color="error">
            Low Stock
          </Badge>
        } />
        <Tab label={
          <Badge badgeContent={metrics.nearExpiryItems} color="error">
            Near Expiry
          </Badge>
        } />
        <Tab label="Inventory History" />
        <Tab label="Suppliers" />
      </Tabs>

      {/* Content based on active tab */}
      {activeTab < 3 ? (
        <>
          {/* Filters Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search Inventory"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ mr: 1 }} />
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSubcategory("");
                    }}
                    label="Category"
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {Object.keys(categoryStructure).map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    label="Subcategory"
                    disabled={!category}
                  >
                    <MenuItem value="">All Subcategories</MenuItem>
                    {category && categoryStructure[category]?.map((subcat) => (
                      <MenuItem key={subcat} value={subcat}>{subcat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>Stock Range</Typography>
                <Slider
                  value={[minStock, maxStock]}
                  onChange={(e, newValue) => {
                    setMinStock(newValue[0]);
                    setMaxStock(newValue[1]);
                  }}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">{minStock} units</Typography>
                  <Typography variant="caption">{maxStock} units</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Inventory Valuation Section */}
          {activeTab === 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Inventory Valuation</Typography>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    value={valuationFilter}
                    onChange={(e) => setValuationFilter(e.target.value)}
                    label="Filter"
                  >
                    <MenuItem value="all">All Items</MenuItem>
                    <MenuItem value="lowStock">Low Stock Items</MenuItem>
                    <MenuItem value="nearExpiry">Near Expiry Items</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Stock</TableCell>
                      <TableCell align="right">Cost Price</TableCell>
                      <TableCell align="right">Selling Price</TableCell>
                      <TableCell align="right">Cost Value</TableCell>
                      <TableCell align="right">Selling Value</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredValuation.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography>{item.name}</Typography>
                            {item.currentStock <= item.minStockLevel && (
                              <Tooltip title="Low stock">
                                <Warning color="warning" sx={{ ml: 1 }} />
                              </Tooltip>
                            )}
                            {item.expiryDate && isAfter(parseISO(item.expiryDate), new Date()) && 
                              isBefore(parseISO(item.expiryDate), new Date(new Date().setDate(new Date().getDate() + 30))) && (
                              <Tooltip title="Near expiry">
                                <Warning color="error" sx={{ ml: 1 }} />
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>{item.category} › {item.subcategory}</TableCell>
                        <TableCell align="right">{item.currentStock}</TableCell>
                        <TableCell align="right">UGX {item.purchasePrice.toLocaleString()}</TableCell>
                        <TableCell align="right">UGX {item.sellingPrice.toLocaleString()}</TableCell>
                        <TableCell align="right">UGX {(item.purchasePrice * item.currentStock).toLocaleString()}</TableCell>
                        <TableCell align="right">UGX {(item.sellingPrice * item.currentStock).toLocaleString()}</TableCell>
                        <TableCell>
                          {item.currentStock <= item.minStockLevel ? (
                            <Chip label="Low Stock" color="warning" size="small" />
                          ) : (
                            <Chip label="In Stock" color="success" size="small" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Inventory List */}
          <Grid container spacing={3}>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">{item.name}</Typography>
                        {item.currentStock <= item.minStockLevel && (
                          <Tooltip title="Low stock">
                            <Warning color="warning" />
                          </Tooltip>
                        )}
                        {item.expiryDate && isAfter(parseISO(item.expiryDate), new Date()) && 
                          isBefore(parseISO(item.expiryDate), new Date(new Date().setDate(new Date().getDate() + 30))) && (
                          <Tooltip title="Near expiry">
                            <Warning color="error" />
                          </Tooltip>
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {item.category} › {item.subcategory}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Cost:</Typography>
                        <Typography variant="body2">UGX {item.purchasePrice.toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Selling:</Typography>
                        <Typography variant="body2">UGX {item.sellingPrice.toLocaleString()}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Stock:</Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: item.currentStock <= item.minStockLevel ? 'error.main' : 'inherit'
                          }}
                        >
                          {item.currentStock} / {item.minStockLevel}
                        </Typography>
                      </Box>
                      {item.expiryDate && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Expires:</Typography>
                          <Typography 
                            variant="body2"
                            sx={{
                              color: isAfter(new Date(), parseISO(item.expiryDate)) 
                                ? 'error.main' 
                                : isBefore(parseISO(item.expiryDate), new Date(new Date().setDate(new Date().getDate() + 30))) 
                                  ? 'warning.main' 
                                  : 'inherit'
                            }}
                          >
                            {format(parseISO(item.expiryDate), "MMM dd, yyyy")}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Supplier:</Typography>
                        <Typography variant="body2">{item.supplier}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Barcode:</Typography>
                        <Typography variant="body2">{item.barcode}</Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button 
                        size="small" 
                        onClick={() => handleEditItem(item)}
                        startIcon={<Edit />}
                      >
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6">No items found matching your criteria</Typography>
                  <Button 
                    variant="outlined" 
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setCategory("");
                      setSubcategory("");
                      setSearchTerm("");
                      setMinStock(0);
                      setMaxStock(100);
                    }}
                  >
                    Clear Filters
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      ) : activeTab === 3 ? (
        <>
          {/* Inventory History Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Inventory History</Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <DatePicker
                    label="Start Date"
                    value={dateRange.start}
                    onChange={(newValue) => setDateRange({...dateRange, start: newValue})}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                  <DatePicker
                    label="End Date"
                    value={dateRange.end}
                    onChange={(newValue) => setDateRange({...dateRange, end: newValue})}
                    renderInput={(params) => <TextField {...params} size="small" />}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price (UGX)</TableCell>
                    <TableCell align="right">Total (UGX)</TableCell>
                    <TableCell>Supplier</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHistory
                    .slice(historyPage * historyRowsPerPage, historyPage * historyRowsPerPage + historyRowsPerPage)
                    .map((record) => {
                      const product = inventory.find(item => item.id === record.productId);
                      return (
                        <TableRow key={record.id}>
                          <TableCell>{format(parseISO(record.date), "MMM dd, yyyy")}</TableCell>
                          <TableCell>{product?.name || "Unknown Product"}</TableCell>
                          <TableCell>
                            <Chip 
                              label={record.type} 
                              color={record.type === "purchase" ? "primary" : "success"} 
                              size="small" 
                            />
                          </TableCell>
                          <TableCell align="right">
                            {record.type === "purchase" ? record.quantity : Math.abs(record.quantity)}
                          </TableCell>
                          <TableCell align="right">{record.price.toLocaleString()}</TableCell>
                          <TableCell align="right">{Math.abs(record.total).toLocaleString()}</TableCell>
                          <TableCell>{record.supplier || "-"}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredHistory.length}
              rowsPerPage={historyRowsPerPage}
              page={historyPage}
              onPageChange={handleHistoryPageChange}
              onRowsPerPageChange={handleHistoryRowsPerPageChange}
            />
          </Paper>
        </>
      ) : (
        <>
          {/* Suppliers Section */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Suppliers</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenSupplierDialog(true)}
              >
                Add Supplier
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Items Supplied</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suppliers
                    .slice(suppliersPage * suppliersRowsPerPage, suppliersPage * suppliersRowsPerPage + suppliersRowsPerPage)
                    .map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>{supplier.name}</TableCell>
                        <TableCell>{supplier.contact}</TableCell>
                        <TableCell>{supplier.email || "-"}</TableCell>
                        <TableCell>{supplier.address || "-"}</TableCell>
                        <TableCell>
                          {inventory.filter(item => item.supplier === supplier.name).length}
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDeleteSupplier(supplier.id)}
                            disabled={inventory.some(item => item.supplier === supplier.name)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={suppliers.length}
              rowsPerPage={suppliersRowsPerPage}
              page={suppliersPage}
              onPageChange={handleSuppliersPageChange}
              onRowsPerPageChange={handleSuppliersRowsPerPageChange}
            />
          </Paper>
        </>
      )}

      {/* Render Dialogs */}
      <InventoryItemFormDialog />
      <PurchaseFormDialog />
      <SupplierFormDialog />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InventoryPage;