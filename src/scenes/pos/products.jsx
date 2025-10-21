import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
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
  Rating,
  IconButton,
  CardMedia,
  Chip,
  Divider,
  Paper,
  Tabs,
  Tab,
  Badge,
  Avatar,
  Stack,
  Snackbar,
  Alert,
  Switch,
  FormControlLabel
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Add,
  Category,
  ExpandMore,
  ExpandLess,
  Search,
  FilterList,
  Sort,
  Inventory as InventoryIcon,
  Edit,
  Close,
  LocalOffer,
  TrendingUp
} from "@mui/icons-material";

const ProductsPage = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryStructure, setCategoryStructure] = useState({});
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [rating, setRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    name: "", 
    category: "", 
    subcategory: "", 
    price: "", 
    rating: 0, 
    stock: "", 
    discount: "",
    measurement: 1,
    description: "",
    image: null,
    imagePreview: "",
    costPrice: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    subcategories: []
  });
  const [newSubcategory, setNewSubcategory] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Withholding Tax State
  const [withholdingTaxEnabled, setWithholdingTaxEnabled] = useState(false);
  const [withholdingTaxRate, setWithholdingTaxRate] = useState(0.06); // 6%

  // Sample data for demonstration
  const sampleProducts = [
    {
      id: 1,
      name: "iPhone 15 Pro",
      description: "Latest Apple smartphone with advanced camera system",
      price: 4500000,
      costPrice: 3500000,
      stock: 15,
      category: "Electronics",
      subcategory: "Smartphones",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300",
      discount: 5,
      measurement: 1
    },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      description: "Powerful Android phone with AI features",
      price: 3200000,
      costPrice: 2500000,
      stock: 25,
      category: "Electronics",
      subcategory: "Smartphones",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
      discount: 0,
      measurement: 1
    },
    {
      id: 3,
      name: "MacBook Air M2",
      description: "Lightweight laptop with M2 chip",
      price: 6500000,
      costPrice: 5200000,
      stock: 8,
      category: "Electronics",
      subcategory: "Laptops",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300",
      discount: 10,
      measurement: 1
    },
    {
      id: 4,
      name: "Wireless Headphones",
      description: "Noise-cancelling Bluetooth headphones",
      price: 280000,
      costPrice: 180000,
      stock: 20,
      category: "Electronics",
      subcategory: "Accessories",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
      discount: 15,
      measurement: 1
    }
  ];

  const sampleCategories = {
    "Electronics": ["Smartphones", "Laptops", "Tablets", "Accessories"],
    "Clothing": ["Men", "Women", "Kids", "Accessories"],
    "Home & Kitchen": ["Appliances", "Furniture", "Cookware", "Decor"]
  };

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use sample data
        setProducts(sampleProducts);
        setFilteredProducts(sampleProducts);
        setCategoryStructure(sampleCategories);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        showSnackbar("Failed to load data", "error");
      }
    };

    fetchData();
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filtered = [...products];
    
    // Apply tab-specific filters
    if (activeTab === 1) { // Favorites tab
      filtered = filtered.filter(product => favorites.some(fav => fav.id === product.id));
    } else if (activeTab === 2) { // Low stock tab
      filtered = filtered.filter(product => product.stock < 10);
    } else if (activeTab === 3) { // High profit tab
      filtered = filtered.filter(product => {
        const profitMargin = ((product.price - product.costPrice) / product.costPrice) * 100;
        return profitMargin > 30;
      });
    }
    
    // Category filter
    if (category) {
      filtered = filtered.filter(product => product.category === category);
    }
    
    // Subcategory filter
    if (subcategory) {
      filtered = filtered.filter(product => product.subcategory === subcategory);
    }
    
    // Price filter
    filtered = filtered.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
    
    // Rating filter
    if (rating > 0) {
      filtered = filtered.filter(product => product.rating >= rating);
    }
    
    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredProducts(filtered);
  }, [products, category, subcategory, minPrice, maxPrice, rating, searchTerm, activeTab, favorites]);

  // Toggle category expansion
  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Handle adding to favorites
  const handleAddToFavorites = (product) => {
    if (!favorites.some((fav) => fav.id === product.id)) {
      setFavorites([...favorites, product]);
      showSnackbar("Added to favorites", "success");
    }
  };

  // Handle removing from favorites
  const handleRemoveFromFavorites = (productId) => {
    setFavorites(favorites.filter((fav) => fav.id !== productId));
    showSnackbar("Removed from favorites", "info");
  };

  // View product details
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setOpenProductDialog(true);
  };

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

  // Open add product dialog
  const handleOpenAddProduct = () => {
    setNewProduct({ 
      name: "", 
      category: "", 
      subcategory: "", 
      price: "", 
      rating: 0, 
      stock: "", 
      discount: "",
      measurement: 1,
      description: "", 
      image: null,
      imagePreview: "",
      costPrice: ""
    });
    setIsEditing(false);
    setEditingProductId(null);
    setOpenProductDialog(true);
  };

  // Open manage categories dialog
  const handleOpenManageCategories = () => {
    setNewCategory({
      name: "",
      subcategories: []
    });
    setNewSubcategory("");
    setOpenCategoryDialog(true);
  };

  // Close all dialogs
  const handleDialogClose = () => {
    setOpenProductDialog(false);
    setOpenCategoryDialog(false);
    setSelectedProduct(null);
  };

  // Handle image upload for new product
  const handleImageUpload = (e) => {
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

  // Handle sorting
  const handleSort = (e) => {
    const sortValue = e.target.value;
    let sortedProducts = [...filteredProducts];
    switch (sortValue) {
      case "priceAsc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "ratingAsc":
        sortedProducts.sort((a, b) => a.rating - b.rating);
        break;
      case "ratingDesc":
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "nameAsc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "profitMarginDesc":
        sortedProducts.sort((a, b) => {
          const marginA = ((a.price - a.costPrice) / a.costPrice) * 100;
          const marginB = ((b.price - b.costPrice) / b.costPrice) * 100;
          return marginB - marginA;
        });
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  // Handle subcategory selection from sidebar
  const handleSubcategorySelect = (subcat) => {
    setSubcategory(subcat);
    // Find the category that contains this subcategory
    const parentCategory = Object.keys(categoryStructure).find(cat => 
      categoryStructure[cat].includes(subcat)
    );
    if (parentCategory) {
      setCategory(parentCategory);
    }
  };

  // Add a new product
  const handleAddProduct = async () => {
    try {
      const newProductWithId = {
        ...newProduct,
        id: Date.now(),
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        discount: parseFloat(newProduct.discount) || 0,
        costPrice: parseFloat(newProduct.costPrice) || 0
      };
      
      setProducts([...products, newProductWithId]);
      setFilteredProducts([...products, newProductWithId]);
      showSnackbar("Product added successfully", "success");
      handleDialogClose();
    } catch (err) {
      showSnackbar("Failed to add product", "error");
    }
  };

  // Handle opening the edit product dialog
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      rating: product.rating,
      stock: product.stock,
      discount: product.discount,
      measurement: product.measurement,
      description: product.description,
      image: null,
      imagePreview: product.image,
      costPrice: product.costPrice
    });
    setIsEditing(true);
    setEditingProductId(product.id);
    setOpenProductDialog(true);
  };

  // Handle saving edited product
  const handleSaveEditedProduct = async () => {
    try {
      const updatedProduct = {
        ...newProduct,
        id: editingProductId,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        discount: parseFloat(newProduct.discount) || 0,
        costPrice: parseFloat(newProduct.costPrice) || 0
      };
      
      const updatedProducts = products.map(p => 
        p.id === editingProductId ? updatedProduct : p
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      
      showSnackbar("Product updated successfully", "success");
      handleDialogClose();
    } catch (err) {
      showSnackbar("Failed to update product", "error");
    }
  };

  // Add a new category
  const handleAddCategory = async (categoryData) => {
    try {
      setCategoryStructure(prev => ({
        ...prev,
        [categoryData.name]: categoryData.subcategories
      }));
      showSnackbar("Category added successfully", "success");
      handleDialogClose();
    } catch (err) {
      showSnackbar("Failed to add category", "error");
    }
  };

  // Calculate product profit
  const calculateProductProfit = (product) => {
    const profit = product.price - product.costPrice;
    const profitMargin = product.costPrice > 0 ? ((profit / product.costPrice) * 100).toFixed(1) : 0;
    return { profit, profitMargin };
  };

  // Loading and error states
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>Loading products...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  // Product Details Dialog
  const ProductDetailsDialog = () => (
    <Dialog 
      open={openProductDialog && selectedProduct && !isEditing} 
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{selectedProduct?.name}</Typography>
          <IconButton onClick={handleDialogClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={selectedProduct?.image}
              alt={selectedProduct?.name}
              sx={{ width: '100%', maxHeight: 300, objectFit: 'contain', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={selectedProduct?.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>{selectedProduct?.rating}/5</Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1" paragraph>
                <strong>Category:</strong> {selectedProduct?.category} › {selectedProduct?.subcategory}
              </Typography>
              <Typography variant="h4" color="primary" gutterBottom>
                UGX {selectedProduct?.price?.toLocaleString()}
              </Typography>
              
              {selectedProduct?.discount > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LocalOffer color="success" fontSize="small" />
                  <Typography variant="body1" color="success.main">
                    {selectedProduct.discount}% Discount Applied
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                <Typography variant="body1">
                  <strong>Cost Price:</strong> UGX {selectedProduct?.costPrice?.toLocaleString()}
                </Typography>
                <Typography variant="body1" color="success.main">
                  <strong>Profit:</strong> UGX {(selectedProduct?.price - selectedProduct?.costPrice)?.toLocaleString()}
                </Typography>
              </Box>
              
              <Typography variant="body1" paragraph>
                <strong>Stock:</strong> {selectedProduct?.stock} units
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Withholding Tax Section */}
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={withholdingTaxEnabled}
                    onChange={(e) => setWithholdingTaxEnabled(e.target.checked)}
                    color="primary"
                  />
                }
                label="Apply 6% Withholding Tax"
              />
              {withholdingTaxEnabled && (
                <Box sx={{ mt: 1, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="white">
                    Withholding Tax (6%): UGX {(selectedProduct?.price * withholdingTaxRate).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="white">
                    Net Amount: UGX {(selectedProduct?.price * (1 - withholdingTaxRate)).toLocaleString()}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1">
              <strong>Description:</strong> {selectedProduct?.description}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Close</Button>
        <Button 
          variant="contained" 
          onClick={() => handleEditProduct(selectedProduct)}
          startIcon={<Edit />}
        >
          Edit Product
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Product Form Dialog (Add/Edit)
  const ProductFormDialog = () => {
    const [localProduct, setLocalProduct] = useState(newProduct);

    useEffect(() => {
      setLocalProduct(newProduct);
    }, [newProduct]);

    const handleLocalChange = (e) => {
      const { name, value } = e.target;
      setLocalProduct(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSave = () => {
      setNewProduct(localProduct);
      if (isEditing) {
        handleSaveEditedProduct();
      } else {
        handleAddProduct();
      }
    };

    const calculateProfit = () => {
      const sellingPrice = parseFloat(localProduct.price) || 0;
      const costPrice = parseFloat(localProduct.costPrice) || 0;
      if (costPrice > 0 && sellingPrice > 0) {
        const profit = sellingPrice - costPrice;
        const margin = ((profit / costPrice) * 100).toFixed(1);
        return { profit, margin };
      }
      return { profit: 0, margin: 0 };
    };

    const { profit, margin } = calculateProfit();

    return (
      <Dialog 
        open={openProductDialog && (isEditing || !selectedProduct)} 
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{isEditing ? "Edit Product" : "Add New Product"}</Typography>
            <IconButton onClick={handleDialogClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Product Name"
                name="name"
                value={localProduct.name}
                onChange={handleLocalChange}
                error={!localProduct.name}
                helperText={!localProduct.name ? "Product name is required" : ""}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!localProduct.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={localProduct.category}
                  onChange={handleLocalChange}
                  label="Category"
                >
                  <MenuItem value=""><em>Select Category</em></MenuItem>
                  {Object.keys(categoryStructure).map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
                {!localProduct.category && (
                  <Typography variant="caption" color="error">Category is required</Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!localProduct.subcategory && !!localProduct.category}>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  name="subcategory"
                  value={localProduct.subcategory}
                  onChange={handleLocalChange}
                  label="Subcategory"
                  disabled={!localProduct.category}
                >
                  <MenuItem value=""><em>Select Subcategory</em></MenuItem>
                  {localProduct.category && categoryStructure[localProduct.category]?.map((subcat) => (
                    <MenuItem key={subcat} value={subcat}>{subcat}</MenuItem>
                  ))}
                </Select>
                {!localProduct.subcategory && localProduct.category && (
                  <Typography variant="caption" color="error">Subcategory is required</Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                name="stock"
                value={localProduct.stock}
                onChange={handleLocalChange}
                inputProps={{ min: 0 }}
                error={!localProduct.stock && localProduct.stock !== 0}
                helperText={!localProduct.stock && localProduct.stock !== 0 ? "Stock quantity is required" : ""}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cost Price (UGX)"
                type="number"
                name="costPrice"
                value={localProduct.costPrice}
                onChange={handleLocalChange}
                inputProps={{ min: 0, step: 100 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Selling Price (UGX)"
                type="number"
                name="price"
                value={localProduct.price}
                onChange={handleLocalChange}
                inputProps={{ min: 0, step: 100 }}
                error={!localProduct.price && localProduct.price !== 0}
                helperText={!localProduct.price && localProduct.price !== 0 ? "Price is required" : ""}
              />
            </Grid>
            
            {profit !== 0 && (
              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 2, 
                  bgcolor: profit > 0 ? 'success.light' : 'error.light', 
                  color: 'white' 
                }}>
                  <Typography variant="body2" fontWeight="bold">
                    {profit > 0 ? `Profit: UGX ${profit.toLocaleString()} (${margin}% Margin)` : 'Warning: Selling below cost price'}
                  </Typography>
                </Paper>
              </Grid>
            )}
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Discount (%)"
                type="number"
                name="discount"
                value={localProduct.discount}
                onChange={handleLocalChange}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2" gutterBottom>Product Rating</Typography>
                <Rating
                  name="rating"
                  value={parseFloat(localProduct.rating)}
                  onChange={(e, newValue) => setLocalProduct(prev => ({...prev, rating: newValue}))}
                  precision={0.5}
                  size="large"
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Description"
                name="description"
                multiline
                rows={3}
                value={localProduct.description}
                onChange={handleLocalChange}
                placeholder="Enter product description..."
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>Product Image</Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="product-image-upload"
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="product-image-upload">
                <Button variant="outlined" component="span" fullWidth>
                  Upload Image
                </Button>
              </label>
              {localProduct.imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img 
                    src={localProduct.imagePreview} 
                    alt="Preview" 
                    style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8 }}
                  />
                  <Button 
                    variant="text" 
                    color="error" 
                    size="small"
                    onClick={() => setLocalProduct(prev => ({...prev, image: null, imagePreview: ""}))}
                    sx={{ mt: 1 }}
                  >
                    Remove Image
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={!localProduct.name || !localProduct.category || !localProduct.subcategory || 
                     (!localProduct.price && localProduct.price !== 0) || 
                     (!localProduct.stock && localProduct.stock !== 0)}
          >
            {isEditing ? "Save Changes" : "Add Product"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Manage Categories Dialog
  const ManageCategoriesDialog = () => {
    const [localCategory, setLocalCategory] = useState(newCategory);
    const [localSubcategory, setLocalSubcategory] = useState("");

    useEffect(() => {
      setLocalCategory(newCategory);
      setLocalSubcategory("");
    }, [newCategory]);

    const handleAddLocalSubcategory = () => {
      if (localSubcategory && !localCategory.subcategories.includes(localSubcategory)) {
        setLocalCategory(prev => ({
          ...prev,
          subcategories: [...prev.subcategories, localSubcategory]
        }));
        setLocalSubcategory("");
      }
    };

    const handleRemoveLocalSubcategory = (subcat) => {
      setLocalCategory(prev => ({
        ...prev,
        subcategories: prev.subcategories.filter(s => s !== subcat)
      }));
    };

    const handleSaveCategory = () => {
      if (localCategory.name && !categoryStructure[localCategory.name]) {
        handleAddCategory(localCategory);
      } else {
        showSnackbar("Category name already exists or is invalid", "error");
      }
    };

    const handleRemoveCategory = (categoryName) => {
      const updatedStructure = { ...categoryStructure };
      delete updatedStructure[categoryName];
      setCategoryStructure(updatedStructure);
      showSnackbar("Category removed successfully", "success");
    };

    return (
      <Dialog 
        open={openCategoryDialog} 
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Manage Categories</Typography>
            <IconButton onClick={handleDialogClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Add New Category Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Add New Category</Typography>
              <TextField
                fullWidth
                label="Category Name"
                value={localCategory.name}
                onChange={(e) => setLocalCategory(prev => ({...prev, name: e.target.value}))}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body1" gutterBottom>Subcategories</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Add Subcategory"
                  value={localSubcategory}
                  onChange={(e) => setLocalSubcategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddLocalSubcategory()}
                />
                <Button 
                  variant="contained" 
                  onClick={handleAddLocalSubcategory}
                  disabled={!localSubcategory}
                >
                  Add
                </Button>
              </Box>
              
              {localCategory.subcategories.length > 0 && (
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="body2" gutterBottom>Subcategories:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {localCategory.subcategories.map((subcat, index) => (
                      <Chip
                        key={index}
                        label={subcat}
                        onDelete={() => handleRemoveLocalSubcategory(subcat)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Paper>
              )}
              
              <Button 
                variant="contained" 
                onClick={handleSaveCategory}
                disabled={!localCategory.name || localCategory.subcategories.length === 0}
                fullWidth
                sx={{ mt: 2 }}
              >
                Save Category
              </Button>
            </Grid>

            {/* Existing Categories Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Existing Categories</Typography>
              {Object.entries(categoryStructure).length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No categories created yet
                </Typography>
              ) : (
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {Object.entries(categoryStructure).map(([category, subcategories]) => (
                    <Paper key={category} sx={{ p: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">{category}</Typography>
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => handleRemoveCategory(category)}
                        >
                          Remove
                        </Button>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {subcategories.map((subcat, idx) => (
                          <Chip 
                            key={idx} 
                            label={subcat} 
                            size="small"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Page Title and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Product Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddProduct}
          >
            Add Product
          </Button>
          <Button
            variant="outlined"
            startIcon={<Category />}
            onClick={handleOpenManageCategories}
          >
            Manage Categories
          </Button>
        </Box>
      </Box>

      {/* Tabs for different views */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="All Products" />
          <Tab label={
            <Badge badgeContent={favorites.length} color="error" showZero={false}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Favorite sx={{ fontSize: 20, mr: 1 }} />
                Favorites
              </Box>
            </Badge>
          } />
          <Tab label="Low Stock" />
          <Tab label="High Profit" />
        </Tabs>
      </Paper>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Products"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
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

          <Grid item xs={12} md={4}>
            <Typography variant="body2" gutterBottom>Price Range (UGX)</Typography>
            <Slider
              value={[minPrice, maxPrice]}
              onChange={(e, newValue) => {
                setMinPrice(newValue[0]);
                setMaxPrice(newValue[1]);
              }}
              valueLabelDisplay="auto"
              min={0}
              max={100000}
              step={1000}
              valueLabelFormat={(value) => `UGX ${value.toLocaleString()}`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">UGX {minPrice.toLocaleString()}</Typography>
              <Typography variant="caption">UGX {maxPrice.toLocaleString()}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" gutterBottom>Minimum Rating</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating
                value={rating}
                onChange={(e, newValue) => setRating(newValue)}
                precision={0.5}
              />
              {rating > 0 && (
                <Typography variant="body2">({rating}+)</Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                defaultValue=""
                onChange={handleSort}
                label="Sort By"
              >
                <MenuItem value="nameAsc">Name (A-Z)</MenuItem>
                <MenuItem value="nameDesc">Name (Z-A)</MenuItem>
                <MenuItem value="priceAsc">Price (Low to High)</MenuItem>
                <MenuItem value="priceDesc">Price (High to Low)</MenuItem>
                <MenuItem value="ratingAsc">Rating (Low to High)</MenuItem>
                <MenuItem value="ratingDesc">Rating (High to Low)</MenuItem>
                <MenuItem value="profitMarginDesc">Profit Margin (High to Low)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Category Navigation Sidebar and Product Grid */}
      <Grid container spacing={3}>
        {/* Category Navigation Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Categories</Typography>
            {Object.entries(categoryStructure).map(([categoryName, subcategories]) => (
              <Box key={categoryName} sx={{ mb: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    cursor: 'pointer',
                    backgroundColor: expandedCategories[categoryName] ? 'primary.light' : 'transparent',
                    color: expandedCategories[categoryName] ? 'white' : 'inherit',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white'
                    }
                  }}
                  onClick={() => toggleCategory(categoryName)}
                >
                  {expandedCategories[categoryName] ? <ExpandLess /> : <ExpandMore />}
                  <Typography sx={{ ml: 1, fontWeight: 'medium' }}>{categoryName}</Typography>
                  <Chip 
                    label={subcategories.length} 
                    size="small" 
                    sx={{ 
                      ml: 'auto',
                      backgroundColor: expandedCategories[categoryName] ? 'white' : 'primary.main',
                      color: expandedCategories[categoryName] ? 'primary.main' : 'white'
                    }} 
                  />
                </Box>
                {expandedCategories[categoryName] && (
                  <Box sx={{ pl: 4, mt: 1 }}>
                    {subcategories.map(subcat => (
                      <Typography
                        key={subcat}
                        variant="body2"
                        sx={{
                          p: 1,
                          mb: 0.5,
                          borderRadius: 1,
                          cursor: 'pointer',
                          backgroundColor: subcategory === subcat ? 'primary.main' : 'transparent',
                          color: subcategory === subcat ? 'white' : 'inherit',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                            color: 'white'
                          }
                        }}
                        onClick={() => handleSubcategorySelect(subcat)}
                      >
                        {subcat}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Product Grid */}
        <Grid item xs={12} md={9}>
          {activeTab === 1 && favorites.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Favorite sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>No favorites yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Products you add to favorites will appear here
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => setActiveTab(0)}
              >
                Browse Products
              </Button>
            </Paper>
          ) : activeTab === 2 && filteredProducts.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <InventoryIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>No low stock items</Typography>
              <Typography variant="body2" color="text.secondary">
                All products are sufficiently stocked
              </Typography>
            </Paper>
          ) : activeTab === 3 && filteredProducts.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>No high profit products</Typography>
              <Typography variant="body2" color="text.secondary">
                Products with profit margin above 30% will appear here
              </Typography>
            </Paper>
          ) : filteredProducts.length > 0 ? (
            <Grid container spacing={2}>
              {filteredProducts.map((product) => {
                const { profit, profitMargin } = calculateProductProfit(product);
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          image={product.image}
                          alt={product.name}
                          sx={{ 
                            height: 160, 
                            objectFit: 'contain', 
                            p: 1,
                            backgroundColor: '#f5f5f5'
                          }}
                        />
                        {product.discount > 0 && (
                          <Chip
                            label={`${product.discount}% OFF`}
                            color="success"
                            size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 8, 
                              right: 8,
                              fontWeight: 'bold'
                            }}
                          />
                        )}
                        <Chip
                          label={`${profitMargin}% Margin`}
                          color={profitMargin > 30 ? "success" : profitMargin > 15 ? "warning" : "default"}
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: 8, 
                            left: 8,
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ 
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          height: '2.5em',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {product.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={product.rating} precision={0.5} readOnly size="small" />
                          <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                            {product.rating}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {product.category} › {product.subcategory}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" color="primary">
                            UGX {product.price.toLocaleString()}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: product.stock > 10 ? 'success.main' : product.stock > 0 ? 'warning.main' : 'error.main',
                              fontWeight: 'bold'
                            }}
                          >
                            {product.stock} in stock
                          </Typography>
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                        <Button 
                          size="small" 
                          variant="outlined"
                          onClick={() => handleViewDetails(product)}
                        >
                          Details
                        </Button>
                        {favorites.some((fav) => fav.id === product.id) ? (
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveFromFavorites(product.id)}
                            color="error"
                          >
                            <Favorite />
                          </IconButton>
                        ) : (
                          <IconButton 
                            size="small" 
                            onClick={() => handleAddToFavorites(product)}
                            color="default"
                          >
                            <FavoriteBorder />
                          </IconButton>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>No products found</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Try adjusting your search criteria or filters
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => {
                  setCategory("");
                  setSubcategory("");
                  setSearchTerm("");
                  setRating(0);
                  setMinPrice(0);
                  setMaxPrice(100000);
                }}
              >
                Clear All Filters
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Render Dialogs */}
      <ProductDetailsDialog />
      <ProductFormDialog />
      <ManageCategoriesDialog />

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

export default ProductsPage;