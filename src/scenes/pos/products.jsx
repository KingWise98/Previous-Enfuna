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
  Alert
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
  Close
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
    measurement:1,
    description: "",
    barcode: "",
    image: null,
    imagePreview: ""
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

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with actual API calls
        // const productsResponse = await fetch('/api/products');
        // const productsData = await productsResponse.json();
        // setProducts(productsData);
        // setFilteredProducts(productsData);
        
        // const categoriesResponse = await fetch('/api/categories');
        // const categoriesData = await categoriesResponse.json();
        // setCategoryStructure(categoriesData);
        
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
        product.description.toLowerCase().includes(term) ||
        product.barcode.includes(term)
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

  // Close all dialogs
  const handleDialogClose = () => {
    setOpenProductDialog(false);
    setOpenCategoryDialog(false);
    setSelectedProduct(null);
    setNewProduct({ 
      name: "", 
      category: "", 
      subcategory: "", 
      price: "", 
      rating: 0, 
      stock: "", 
      discount: "",
      measurement:1,
      description: "",
      barcode: "",
      image: null,
      imagePreview: ""
    });
    setIsEditing(false);
    setEditingProductId(null);
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

  // Add a new product
  const handleAddProduct = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/products', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newProduct)
      // });
      // const addedProduct = await response.json();
      
      // setProducts([...products, addedProduct]);
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
      barcode: product.barcode,
      image: null,
      imagePreview: product.image
    });
    setIsEditing(true);
    setEditingProductId(product.id);
    setOpenProductDialog(true);
  };

  // Handle saving edited product
  const handleSaveEditedProduct = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/products/${editingProductId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newProduct)
      // });
      // const updatedProduct = await response.json();
      
      // const updatedProducts = products.map(p => 
      //   p.id === editingProductId ? updatedProduct : p
      // );
      // setProducts(updatedProducts);
      
      showSnackbar("Product updated successfully", "success");
      handleDialogClose();
    } catch (err) {
      showSnackbar("Failed to update product", "error");
    }
  };

  // Add a new category
  const handleAddCategory = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/categories', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newCategory)
      // });
      // const updatedCategories = await response.json();
      // setCategoryStructure(updatedCategories);
      
      showSnackbar("Category added successfully", "success");
      handleDialogClose();
    } catch (err) {
      showSnackbar("Failed to add category", "error");
    }
  };

  // Add a subcategory to the current new category
  const handleAddSubcategory = () => {
    if (newSubcategory) {
      setNewCategory(prev => ({
        ...prev,
        subcategories: [...prev.subcategories, newSubcategory]
      }));
      setNewSubcategory("");
    }
  };

  // Remove a subcategory from the current new category
  const handleRemoveSubcategory = (subcat) => {
    setNewCategory(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter(s => s !== subcat)
    }));
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
          {selectedProduct?.name}
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
              sx={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{selectedProduct?.name}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={selectedProduct?.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>{selectedProduct?.rating}/5</Typography>
            </Box>
            <Typography variant="body1" paragraph>
              <strong>Category:</strong> {selectedProduct?.category} › {selectedProduct?.subcategory}
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              UGX {selectedProduct?.price?.toLocaleString()}
            </Typography>
             
            
            <Typography variant="body1" paragraph>
              <strong>Stock:</strong> {selectedProduct?.stock} units
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Unit of Measurement:</strong> {selectedProduct?.measurement} mm
            </Typography>

            <Typography variant="body1" paragraph>
              <strong>Discount:</strong> {selectedProduct?.discount} units
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Barcode:</strong> {selectedProduct?.barcode}
            </Typography>
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
          sx={{ backgroundColor: "purple", color: "white" }}
        >
          Edit Product
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Product Form Dialog (Add/Edit)
  // Product Form Dialog (Add/Edit)
const ProductFormDialog = () => (
  <Dialog 
    open={openProductDialog && (isEditing || !selectedProduct)} 
    onClose={handleDialogClose}
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {isEditing ? "Edit Product" : "Add New Product"}
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
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            error={!newProduct.name}
            helperText={!newProduct.name ? "Product name is required" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!newProduct.category}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newProduct.category}
              onChange={(e) => setNewProduct({...newProduct, category: e.target.value, subcategory: ""})}
              label="Category"
            >
              <MenuItem value=""><em>Select Category</em></MenuItem>
              {Object.keys(categoryStructure).map((cat) => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
            {!newProduct.category && <Typography variant="caption" color="error">Category is required</Typography>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!newProduct.subcategory && !!newProduct.category}>
            <InputLabel>Subcategory</InputLabel>
            <Select
              value={newProduct.subcategory}
              onChange={(e) => setNewProduct({...newProduct, subcategory: e.target.value})}
              label="Subcategory"
              disabled={!newProduct.category}
            >
              <MenuItem value=""><em>Select Subcategory</em></MenuItem>
              {newProduct.category && categoryStructure[newProduct.category]?.map((subcat) => (
                <MenuItem key={subcat} value={subcat}>{subcat}</MenuItem>
              ))}
            </Select>
            {!newProduct.subcategory && newProduct.category && (
              <Typography variant="caption" color="error">Subcategory is required</Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price (UGX)"
            type="number"
            value={newProduct.price}
            onChange={(e) => {
              const value = Math.max(0, parseFloat(e.target.value) || 0);
              setNewProduct({...newProduct, price: value});
            }}
            inputProps={{ min: 0, step: 100 }}
            error={!newProduct.price && newProduct.price !== 0}
            helperText={!newProduct.price && newProduct.price !== 0 ? "Price is required" : ""}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Purchase Price (UGX)"
            type="number"
            value={newProduct.purchasePrice || ""}
            onChange={(e) => {
              const value = Math.max(0, parseFloat(e.target.value) || 0);
              setNewProduct({...newProduct, purchasePrice: value});
            }}
            inputProps={{ min: 0, step: 100 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Discount (%)"
            type="number"
            value={newProduct.discount}
            onChange={(e) => {
              const value = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
              setNewProduct({...newProduct, discount: value});
            }}
            inputProps={{ min: 0, max: 100 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Unit of Measurement"
            type="number"
            value={newProduct.measurement}
            onChange={(e) => {
              const value = Math.max(1, parseFloat(e.target.value) || 1);
              setNewProduct({...newProduct, measurement: value});
            }}
            inputProps={{ min: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Stock Quantity"
            type="number"
            value={newProduct.stock}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value) || 0);
              setNewProduct({...newProduct, stock: value});
            }}
            inputProps={{ min: 0 }}
            error={!newProduct.stock && newProduct.stock !== 0}
            helperText={!newProduct.stock && newProduct.stock !== 0 ? "Stock quantity is required" : ""}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Barcode/ID"
            value={newProduct.barcode}
            onChange={(e) => setNewProduct({...newProduct, barcode: e.target.value})}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={newProduct.description}
            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">Product Rating</Typography>
          <Rating
            value={newProduct.rating}
            onChange={(e, newValue) => setNewProduct({...newProduct, rating: newValue})}
            precision={0.5}
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
          {newProduct.imagePreview && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <img 
                src={newProduct.imagePreview} 
                alt="Preview" 
                style={{ maxHeight: 200, maxWidth: '100%' }}
              />
              <Button 
                variant="text" 
                color="error" 
                size="small"
                onClick={() => setNewProduct({...newProduct, image: null, imagePreview: ""})}
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
        onClick={isEditing ? handleSaveEditedProduct : handleAddProduct}
        disabled={!newProduct.name || !newProduct.category || !newProduct.subcategory || 
                 (!newProduct.price && newProduct.price !== 0) || 
                 (!newProduct.stock && newProduct.stock !== 0)}
        sx={{ backgroundColor: "purple", color: "white" }}
      >
        {isEditing ? "Save Changes" : "Save Product"}
      </Button>
    </DialogActions>
  </Dialog>
);

  // Manage Categories Dialog
  const ManageCategoriesDialog = () => (
    <Dialog 
      open={openCategoryDialog} 
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Manage Categories
          <IconButton onClick={handleDialogClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Add New Category</Typography>
            <TextField
              fullWidth
              label="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>Subcategories</Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Subcategory"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
              />
              <Button 
                variant="contained" 
                onClick={handleAddSubcategory}
                disabled={!newSubcategory}
              >
                Add
              </Button>
            </Box>
            {newCategory.subcategories.length > 0 && (
              <Paper sx={{ p: 2, mb: 2 }}>
                {newCategory.subcategories.map((subcat, index) => (
                  <Chip
                    key={index}
                    label={subcat}
                    onDelete={() => handleRemoveSubcategory(subcat)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Paper>
            )}
          </Grid>
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>Existing Categories</Typography>
            {Object.entries(categoryStructure).map(([category, subcategories]) => (
              <Box key={category} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">{category}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {subcategories.map((subcat, idx) => (
                    <Chip key={idx} label={subcat} />
                  ))}
                </Box>
              </Box>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleAddCategory}
          disabled={!newCategory.name}
          sx={{ backgroundColor: "purple", color: "white" }}
        >
          Save Category
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ padding: 3 }}>
      {/* Page Title and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Product Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenProductDialog(true)}
            sx={{ backgroundColor: "purple", color: "white" }}
          >
            Add Product
          </Button>
          <Button
            variant="contained"
            startIcon={<Category />}
            onClick={() => setOpenCategoryDialog(true)}
            sx={{ backgroundColor: "purple", color: "white" }}
          >
            Manage Categories
          </Button>
        </Box>
      </Box>

      {/* Tabs for different views */}
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="All Products" />
        <Tab label={
          <Badge badgeContent={favorites.length} color="error">
            Favorites
          </Badge>
        } />
        <Tab label="Low Stock" />
      </Tabs>

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
              valueLabelFormat={(value) => value.toLocaleString()}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">UGX {minPrice.toLocaleString()}</Typography>
              <Typography variant="caption">UGX {maxPrice.toLocaleString()}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="body2" gutterBottom>Minimum Rating</Typography>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              precision={0.5}
            />
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
                    backgroundColor: expandedCategories[categoryName] ? '#f5f5f5' : 'transparent',
                    borderRadius: 1
                  }}
                  onClick={() => toggleCategory(categoryName)}
                >
                  {expandedCategories[categoryName] ? <ExpandLess /> : <ExpandMore />}
                  <Typography sx={{ ml: 1 }}>{categoryName}</Typography>
                  <Chip label={subcategories.length} size="small" sx={{ ml: 'auto' }} />
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
                          backgroundColor: subcategory === subcat ? '#e3f2fd' : 'transparent',
                          '&:hover': { backgroundColor: '#f5f5f5' }
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
              <Typography variant="h6">You haven't added any favorites yet</Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => setActiveTab(0)}
              >
                Browse Products
              </Button>
            </Paper>
          ) : activeTab === 2 && filteredProducts.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">No low stock items</Typography>
              <Button 
                variant="contained" 
                startIcon={<InventoryIcon />}
                sx={{ mt: 2 }}
                href="/inventory/overview"
              >
                Check Inventory
              </Button>
            </Paper>
          ) : filteredProducts.length > 0 ? (
            <Grid container spacing={2}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                      sx={{ height: 140, objectFit: 'contain', p: 1 }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>{product.name}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={product.rating} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>{product.rating}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {product.category} › {product.subcategory}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {product.description.length > 50 
                          ? `${product.description.substring(0, 50)}...` 
                          : product.description}
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ mt: 'auto' }}>
                        UGX {product.price.toLocaleString()}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: product.stock > 10 ? 'success.main' : 'error.main',
                          fontWeight: 'bold'
                        }}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Button 
                        size="small" 
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
                        >
                          <FavoriteBorder />
                        </IconButton>
                      )}
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6">No products found matching your criteria</Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                onClick={() => {
                  setCategory("");
                  setSubcategory("");
                  setSearchTerm("");
                  setRating(0);
                  setMinPrice(0);
                  setMaxPrice(100000);
                }}
              >
                Clear Filters
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