import { useState, useEffect } from "react";
import { 
  Box, Typography, useTheme, TextField, Button, Grid, Paper, Divider, 
  IconButton, InputAdornment, Tabs, Tab, Select, MenuItem, FormControl, 
  InputLabel, Dialog, DialogTitle, DialogContent, DialogActions, 
  FormControlLabel, Switch, Rating, Chip, Badge, Card, CardContent, 
  CardActions, Avatar, Stack, Snackbar, Alert, Slider
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices, mockItems } from "../../data/mock";
import Header from "../../components/Header";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import EditIcon from "@mui/icons-material/Edit";
import CategoryIcon from "@mui/icons-material/Category";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ScheduleIcon from "@mui/icons-material/Schedule";
import InventoryIcon from "@mui/icons-material/Inventory";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // Document state
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [quotationNumber, setQuotationNumber] = useState(`QUO-${Math.floor(1000 + Math.random() * 9000)}`);
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [taxRate, setTaxRate] = useState(0.1);
  const [discount, setDiscount] = useState(0);
  const [documentType, setDocumentType] = useState("invoice");
  const [status, setStatus] = useState("draft");
  const [validityPeriod, setValidityPeriod] = useState(14);
  
  // Service/Product dialog state
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  
  // Form states
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    cost: "",
    category: "",
    duration: "",
    rating: 0,
    available: true,
    requiresAppointment: true,
    tags: [],
    image: null,
    imagePreview: ""
  });
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    cost: "",
    category: "",
    inventory: "",
    rating: 0,
    available: true,
    tags: [],
    image: null,
    imagePreview: ""
  });
  
  const [newTag, setNewTag] = useState("");
  
  // Company/client info
  const [senderInfo, setSenderInfo] = useState({
    name: "Your Company Name",
    address: "123 Business St, City, Country",
    email: "contact@yourcompany.com",
    phone: "0782033444",
    taxId: "TAX-123456789"
  });
  
  const [recipientInfo, setRecipientInfo] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    taxId: ""
  });

  // Categories
  const categories = [
    "Web Development",
    "Design",
    "Marketing",
    "Consulting",
    "Electronics",
    "Home Goods",
    "Office Supplies"
  ];

  useEffect(() => {
    setInvoiceItems(mockItems);
  }, []);

  // Helper functions
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleDocumentTypeChange = (event, newValue) => {
    setDocumentType(newValue);
    if (newValue === "quotation") {
      setStatus("pending");
    } else {
      setStatus("draft");
    }
  };

  const handleValidityPeriodChange = (days) => {
    setValidityPeriod(days);
    const newExpiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setExpiryDate(newExpiryDate.toISOString().split('T')[0]);
  };

  const filteredItems = invoiceItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Item management
  const addItemToDocument = (item) => {
    const newItem = {
      ...item,
      id: selectedItems.length + 1,
      quantity: 1
    };
    setSelectedItems([...selectedItems, newItem]);
  };

  const removeItemFromDocument = (id) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id, quantity) => {
    setSelectedItems(selectedItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const calculateSubtotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * taxRate;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - discount;
  };

  // Service dialog handlers
  const handleOpenServiceDialog = () => {
    setOpenServiceDialog(true);
    setIsEditing(false);
    setNewService({
      name: "",
      description: "",
      cost: "",
      category: "",
      duration: "",
      rating: 0,
      available: true,
      requiresAppointment: true,
      tags: [],
      image: null,
      imagePreview: ""
    });
  };

  const handleCloseServiceDialog = () => {
    setOpenServiceDialog(false);
  };

  const handleServiceImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewService({
          ...newService,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveService = () => {
    const service = {
      id: isEditing ? editingItemId : invoiceItems.length + 1,
      name: newService.name,
      description: newService.description,
      cost: parseFloat(newService.cost),
      category: newService.category,
      type: "service",
      duration: newService.duration,
      rating: newService.rating,
      available: newService.available,
      requiresAppointment: newService.requiresAppointment,
      tags: newService.tags,
      image: newService.imagePreview || "/assets/default-service.png"
    };
    
    if (isEditing) {
      setInvoiceItems(invoiceItems.map(item => 
        item.id === editingItemId ? service : item
      ));
      showSnackbar("Service updated successfully");
    } else {
      setInvoiceItems([...invoiceItems, service]);
      showSnackbar("Service created successfully");
    }
    
    handleCloseServiceDialog();
  };

  const handleEditService = (service) => {
    setNewService({
      name: service.name,
      description: service.description,
      cost: service.cost,
      category: service.category,
      duration: service.duration,
      rating: service.rating,
      available: service.available,
      requiresAppointment: service.requiresAppointment,
      tags: service.tags || [],
      image: null,
      imagePreview: service.image || ""
    });
    setEditingItemId(service.id);
    setIsEditing(true);
    setOpenServiceDialog(true);
  };

  // Product dialog handlers
  const handleOpenProductDialog = () => {
    setOpenProductDialog(true);
    setIsEditing(false);
    setNewProduct({
      name: "",
      description: "",
      cost: "",
      category: "",
      inventory: "",
      rating: 0,
      available: true,
      tags: [],
      image: null,
      imagePreview: ""
    });
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({
          ...newProduct,
          image: file,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = () => {
    const product = {
      id: isEditing ? editingItemId : invoiceItems.length + 1,
      name: newProduct.name,
      description: newProduct.description,
      cost: parseFloat(newProduct.cost),
      category: newProduct.category,
      type: "product",
      inventory: parseInt(newProduct.inventory),
      rating: newProduct.rating,
      available: newProduct.available,
      tags: newProduct.tags,
      image: newProduct.imagePreview || "/assets/default-product.png"
    };
    
    if (isEditing) {
      setInvoiceItems(invoiceItems.map(item => 
        item.id === editingItemId ? product : item
      ));
      showSnackbar("Product updated successfully");
    } else {
      setInvoiceItems([...invoiceItems, product]);
      showSnackbar("Product created successfully");
    }
    
    handleCloseProductDialog();
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      cost: product.cost,
      category: product.category,
      inventory: product.inventory,
      rating: product.rating,
      available: product.available,
      tags: product.tags || [],
      image: null,
      imagePreview: product.image || ""
    });
    setEditingItemId(product.id);
    setIsEditing(true);
    setOpenProductDialog(true);
  };

  // Common tag handlers
  const handleAddTag = (type) => {
    if (newTag) {
      if (type === 'service') {
        setNewService({
          ...newService,
          tags: [...newService.tags, newTag]
        });
      } else {
        setNewProduct({
          ...newProduct,
          tags: [...newProduct.tags, newTag]
        });
      }
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag, type) => {
    if (type === 'service') {
      setNewService({
        ...newService,
        tags: newService.tags.filter(t => t !== tag)
      });
    } else {
      setNewProduct({
        ...newProduct,
        tags: newProduct.tags.filter(t => t !== tag)
      });
    }
  };

  // DataGrid columns
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    {
      field: "name",
      headerName: "Item",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          {params.row.image && (
            <Avatar 
              src={params.row.image} 
              sx={{ width: 40, height: 40, mr: 2 }}
              variant={params.row.type === "service" ? "rounded" : "circular"}
            />
          )}
          <Box>
            <Typography>{params.row.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {params.row.type === "service" ? "Service" : "Product"}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1.5,
    },
    {
      field: "quantity",
      headerName: "Qty",
      width: 80,
      editable: true,
    },
    {
      field: "cost",
      headerName: "Unit Price",
      width: 100,
      renderCell: (params) => (
        <Typography>UGX{params.row.cost.toFixed(2)}</Typography>
      ),
    },
    {
      field: "total",
      headerName: "Total",
      width: 100,
      renderCell: (params) => (
        <Typography fontWeight="bold">
          UGX{(params.row.cost * params.row.quantity).toFixed(2)}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton 
            onClick={() => params.row.type === "service" 
              ? handleEditService(params.row) 
              : handleEditProduct(params.row)}
            color="primary"
            size="small"
            sx={{ mr: 1 }}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            onClick={() => removeItemFromDocument(params.row.id)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  // Service Dialog Component
  const ServiceDialog = () => (
    <Dialog 
      open={openServiceDialog} 
      onClose={handleCloseServiceDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditing ? "Edit Service" : "Create New Service"}
          </Typography>
          <IconButton onClick={handleCloseServiceDialog}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" gutterBottom>Service Image</Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="service-image-upload"
              type="file"
              onChange={handleServiceImageUpload}
            />
            <label htmlFor="service-image-upload">
              <Button variant="outlined" component="span" fullWidth>
                Upload Image
              </Button>
            </label>
            {newService.imagePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img 
                  src={newService.imagePreview} 
                  alt="Preview" 
                  style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 4 }}
                />
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Name"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price (UGX)"
                  type="number"
                  value={newService.cost}
                  onChange={(e) => setNewService({...newService, cost: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  type="number"
                  value={newService.duration}
                  onChange={(e) => setNewService({...newService, duration: e.target.value})}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <ScheduleIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newService.category}
                    onChange={(e) => setNewService({...newService, category: e.target.value})}
                    label="Category"
                  >
                    <MenuItem value=""><em>Select Category</em></MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2">Rating</Typography>
                <Rating
                  value={newService.rating}
                  onChange={(e, newValue) => setNewService({...newService, rating: newValue})}
                  precision={0.5}
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarIcon fontSize="inherit" />}
                />
              </Grid>
              
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newService.available}
                      onChange={(e) => setNewService({...newService, available: e.target.checked})}
                      color="primary"
                    />
                  }
                  label="Available"
                />
              </Grid>
              
              <Grid item xs={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newService.requiresAppointment}
                      onChange={(e) => setNewService({...newService, requiresAppointment: e.target.checked})}
                      color="primary"
                    />
                  }
                  label="Requires Appointment"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>Tags</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalOfferIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={() => handleAddTag('service')}
                    disabled={!newTag}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Box>
                {newService.tags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {newService.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag, 'service')}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseServiceDialog} color="inherit">
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSaveService}
          disabled={!newService.name || !newService.cost}
          color="primary"
          startIcon={isEditing ? <EditIcon /> : <AddIcon />}
        >
          {isEditing ? "Update Service" : "Create Service"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Product Dialog Component
  const ProductDialog = () => (
    <Dialog 
      open={openProductDialog} 
      onClose={handleCloseProductDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {isEditing ? "Edit Product" : "Create New Product"}
          </Typography>
          <IconButton onClick={handleCloseProductDialog}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" gutterBottom>Product Image</Typography>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="product-image-upload"
              type="file"
              onChange={handleProductImageUpload}
            />
            <label htmlFor="product-image-upload">
              <Button variant="outlined" component="span" fullWidth>
                Upload Image
              </Button>
            </label>
            {newProduct.imagePreview && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img 
                  src={newProduct.imagePreview} 
                  alt="Preview" 
                  style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 4 }}
                />
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price (UGX)"
                  type="number"
                  value={newProduct.cost}
                  onChange={(e) => setNewProduct({...newProduct, cost: e.target.value})}
                />
              </Grid>
              
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Inventory"
                  type="number"
                  value={newProduct.inventory}
                  onChange={(e) => setNewProduct({...newProduct, inventory: e.target.value})}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <InventoryIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    label="Category"
                  >
                    <MenuItem value=""><em>Select Category</em></MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2">Rating</Typography>
                <Rating
                  value={newProduct.rating}
                  onChange={(e, newValue) => setNewProduct({...newProduct, rating: newValue})}
                  precision={0.5}
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarIcon fontSize="inherit" />}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newProduct.available}
                      onChange={(e) => setNewProduct({...newProduct, available: e.target.checked})}
                      color="primary"
                    />
                  }
                  label="Available"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" gutterBottom>Tags</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalOfferIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={() => handleAddTag('product')}
                    disabled={!newTag}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Box>
                {newProduct.tags.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {newProduct.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        onDelete={() => handleRemoveTag(tag, 'product')}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseProductDialog} color="inherit">
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSaveProduct}
          disabled={!newProduct.name || !newProduct.cost}
          color="primary"
          startIcon={isEditing ? <EditIcon /> : <AddIcon />}
        >
          {isEditing ? "Update Product" : "Create Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box m="20px">
      <Header title="Manage Invoices" subtitle="Create and manage invoices & quotations" />
      
      {/* Dialogs */}
      <ServiceDialog />
      <ProductDialog />
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      <Tabs 
        value={documentType} 
        onChange={handleDocumentTypeChange}
        sx={{ mb: 3 }}
      >
        <Tab 
          value="invoice" 
          label="Invoice" 
          icon={<ReceiptIcon />} 
          iconPosition="start" 
        />
        <Tab 
          value="quotation" 
          label="Quotation" 
          icon={<DescriptionIcon />} 
          iconPosition="start" 
        />
      </Tabs>
      
      <Grid container spacing={3}>
        {/* Document Form Section */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {documentType === "invoice" ? "Invoice Details" : "Quotation Details"}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={documentType === "invoice" ? "Invoice Number" : "Quotation Number"}
                  value={documentType === "invoice" ? invoiceNumber : quotationNumber}
                  onChange={(e) => documentType === "invoice" 
                    ? setInvoiceNumber(e.target.value) 
                    : setQuotationNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={documentType === "invoice" ? "Invoice Date" : "Quotation Date"}
                  type="date"
                  value={documentDate}
                  onChange={(e) => setDocumentDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              {documentType === "invoice" && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Due Date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
              {documentType === "quotation" && (
                <>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel>Validity Period</InputLabel>
                      <Select
                        value={validityPeriod}
                        onChange={(e) => handleValidityPeriodChange(e.target.value)}
                        label="Validity Period"
                      >
                        <MenuItem value={7}>7 days</MenuItem>
                        <MenuItem value={14}>14 days</MenuItem>
                        <MenuItem value={30}>30 days</MenuItem>
                        <MenuItem value={60}>60 days</MenuItem>
                        <MenuItem value={90}>90 days</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Expiry Date"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    label="Status"
                  >
                    {documentType === "invoice" ? (
                      <>
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="sent">Sent</MenuItem>
                        <MenuItem value="paid">Paid</MenuItem>
                        <MenuItem value="overdue">Overdue</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="accepted">Accepted</MenuItem>
                        <MenuItem value="rejected">Rejected</MenuItem>
                        <MenuItem value="expired">Expired</MenuItem>
                        <MenuItem value="converted">Converted to Invoice</MenuItem>
                      </>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Sender Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Company Name"
                  value={senderInfo.name}
                  onChange={(e) => setSenderInfo({...senderInfo, name: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={senderInfo.address}
                  onChange={(e) => setSenderInfo({...senderInfo, address: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={senderInfo.email}
                  onChange={(e) => setSenderInfo({...senderInfo, email: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={senderInfo.phone}
                  onChange={(e) => setSenderInfo({...senderInfo, phone: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tax ID"
                  value={senderInfo.taxId}
                  onChange={(e) => setSenderInfo({...senderInfo, taxId: e.target.value})}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Recipient Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Client Name"
                  value={recipientInfo.name}
                  onChange={(e) => setRecipientInfo({...recipientInfo, name: e.target.value})}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={recipientInfo.address}
                  onChange={(e) => setRecipientInfo({...recipientInfo, address: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={recipientInfo.email}
                  onChange={(e) => setRecipientInfo({...recipientInfo, email: e.target.value})}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={recipientInfo.phone}
                  onChange={(e) => setRecipientInfo({...recipientInfo, phone: e.target.value})}
                />
              </Grid>
              {documentType === "invoice" && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Tax ID"
                    value={recipientInfo.taxId}
                    onChange={(e) => setRecipientInfo({...recipientInfo, taxId: e.target.value})}
                  />
                </Grid>
              )}
            </Grid>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Add Items</Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleOpenServiceDialog}
                sx={{ mr: 2 }}
              >
                Create Service
              </Button>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleOpenProductDialog}
              >
                Create Product
              </Button>
            </Box>
            
            <TextField
              fullWidth
              variant="outlined"
              label="Search Items"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            <Box sx={{ height: 200, overflow: 'auto', mb: 2 }}>
              {filteredItems.map((item) => (
                <Paper 
                  key={item.id} 
                  sx={{ 
                    p: 2, 
                    mb: 1, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderLeft: `4px solid ${item.type === "service" ? colors.blueAccent[500] : colors.greenAccent[500]}`
                  }}
                >
                  <Box display="flex" alignItems="center">
                    {item.image && (
                      <Avatar 
                        src={item.image} 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          mr: 2,
                          borderRadius: item.type === "service" ? '4px' : '50%'
                        }}
                      />
                    )}
                    <Box>
                      <Typography fontWeight="bold">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                      <Box display="flex" alignItems="center" mt={0.5}>
                        <Typography variant="body2" sx={{ mr: 2 }}>
                          UGX{item.cost.toFixed(2)}
                        </Typography>
                        {item.type === "service" ? (
                          <Chip 
                            label="Service" 
                            size="small" 
                            color="primary" 
                            icon={<ScheduleIcon fontSize="small" />}
                          />
                        ) : (
                          <Chip 
                            label="Product" 
                            size="small" 
                            color="secondary" 
                            icon={<InventoryIcon fontSize="small" />}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => addItemToDocument(item)}
                    size="small"
                  >
                    Add
                  </Button>
                </Paper>
              ))}
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              {documentType === "invoice" ? "Invoice Items" : "Quotation Items"}
            </Typography>
            <Box sx={{ height: 300 }}>
              <DataGrid
                rows={selectedItems}
                columns={columns}
                disableSelectionOnClick
                processRowUpdate={(updatedRow, originalRow) => {
                  updateItemQuantity(updatedRow.id, updatedRow.quantity);
                  return updatedRow;
                }}
                onProcessRowUpdateError={(error) => console.error(error)}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Document Preview Section */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h4">
                {documentType === "invoice" ? "INVOICE" : "QUOTATION"}
              </Typography>
              <Typography variant="h6">
                #{documentType === "invoice" ? invoiceNumber : quotationNumber}
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">From:</Typography>
                <Typography>{senderInfo.name}</Typography>
                <Typography>{senderInfo.address}</Typography>
                <Typography>Email: {senderInfo.email}</Typography>
                <Typography>Phone: {senderInfo.phone}</Typography>
                <Typography>Tax ID: {senderInfo.taxId}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">To:</Typography>
                <Typography>{recipientInfo.name || "Client Name"}</Typography>
                <Typography>{recipientInfo.address || "Client Address"}</Typography>
                {recipientInfo.email && <Typography>Email: {recipientInfo.email}</Typography>}
                {recipientInfo.phone && <Typography>Phone: {recipientInfo.phone}</Typography>}
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">
                  {documentType === "invoice" ? "Invoice Date:" : "Quotation Date:"}
                </Typography>
                <Typography>{documentDate}</Typography>
              </Grid>
              <Grid item xs={6}>
                {documentType === "invoice" ? (
                  <>
                    <Typography variant="subtitle2">Due Date:</Typography>
                    <Typography>{dueDate}</Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="subtitle2">Expiry Date:</Typography>
                    <Typography>{expiryDate}</Typography>
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Status:</Typography>
                <Typography sx={{ 
                  color: status === "paid" || status === "accepted" ? "success.main" :
                         status === "overdue" || status === "rejected" ? "error.main" :
                         status === "pending" ? "warning.main" : "text.primary"
                }}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
              <DataGrid
                rows={selectedItems}
                columns={[
                  { 
                    field: "name", 
                    headerName: "Item", 
                    flex: 1,
                    renderCell: (params) => (
                      <Box display="flex" alignItems="center">
                        {params.row.image && (
                          <Avatar 
                            src={params.row.image} 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              mr: 1,
                              borderRadius: params.row.type === "service" ? '4px' : '50%'
                            }}
                          />
                        )}
                        <Typography>{params.row.name}</Typography>
                      </Box>
                    )
                  },
                  { field: "quantity", headerName: "Qty", width: 60 },
                  { 
                    field: "cost", 
                    headerName: "Price", 
                    width: 80,
                    renderCell: (params) => `UGX${params.row.cost.toFixed(2)}`
                  },
                  { 
                    field: "total", 
                    headerName: "Total", 
                    width: 80,
                    renderCell: (params) => `UGX${(params.row.cost * params.row.quantity).toFixed(2)}`
                  }
                ]}
                hideFooter
                disableSelectionOnClick
                autoHeight
              />
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Typography>Subtotal: UGX{calculateSubtotal().toFixed(2)}</Typography>
              <Typography>Tax ({taxRate * 100}%): UGX{calculateTax().toFixed(2)}</Typography>
              {discount > 0 && <Typography>Discount: UGX{discount.toFixed(2)}</Typography>}
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
                Total: UGX{calculateTotal().toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {documentType === "quotation" && (
              <TextField
                fullWidth
                label="Terms & Conditions"
                multiline
                rows={3}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Payment terms, delivery terms, etc."
                sx={{ mb: 2 }}
              />
            )}

            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={documentType === "invoice" 
                ? "Thank you for your business!" 
                : "We appreciate your consideration of this quotation."}
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button variant="outlined" color="secondary">
                Save Draft
              </Button>
              {documentType === "invoice" ? (
                <Button variant="contained" color="primary">
                  Send Invoice
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="success">
                    Convert to Invoice
                  </Button>
                  <Button variant="contained" color="primary">
                    Send Quotation
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Invoices;