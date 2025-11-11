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
  FormControlLabel,
  FormGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  Add,
  Category,
  ExpandMore as ExpandMoreIcon,
  ExpandLess,
  Search,
  FilterList,
  Sort,
  Inventory as InventoryIcon,
  Edit,
  Close,
  Delete,
  AddCircle,
  RemoveCircle
} from "@mui/icons-material";

const ServicesPage = () => {
  // State management
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [categoryStructure, setCategoryStructure] = useState({});
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [rating, setRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newService, setNewService] = useState({ 
    name: "", 
    category: "", 
    subcategory: "", 
    price: "", 
    rating: 0, 
    duration: "",
    description: "",
    image: null,
    imagePreview: "",
    isActive: true,
    customFields: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
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
  const [newCustomField, setNewCustomField] = useState({
    name: "",
    type: "text",
    required: false
  });

  // Sample data for demonstration
  const sampleCategories = {
    "Restaurant": ["Dining", "Takeaway", "Catering"],
    "Automotive": ["Maintenance", "Repair", "Detailing"],
    "Beauty": ["Hair", "Nails", "Skincare"],
    "Home Services": ["Cleaning", "Repair", "Installation"]
  };

  const demoServices = [
    {
      id: 1,
      name: "Full Car Detailing",
      category: "Automotive",
      subcategory: "Detailing",
      price: 150000,
      rating: 4.8,
      duration: "3 hours",
      description: "Complete interior and exterior detailing service with waxing and polishing",
      image: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=300",
      isActive: true,
      customFields: [
        { name: "Vehicle Type", value: "SUV", type: "text", required: true },
        { name: "Interior Cleaning", value: "Yes", type: "checkbox", required: false }
      ]
    },
    {
      id: 2,
      name: "Fine Dining Experience",
      category: "Restaurant",
      subcategory: "Dining",
      price: 85000,
      rating: 4.9,
      duration: "2 hours",
      description: "Multi-course gourmet meal with wine pairing and professional service",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300",
      isActive: true,
      customFields: [
        { name: "Dietary Restrictions", value: "None", type: "text", required: false },
        { name: "Number of Guests", value: "2", type: "number", required: true }
      ]
    },
    {
      id: 3,
      name: "Hair Styling & Coloring",
      category: "Beauty",
      subcategory: "Hair",
      price: 45000,
      rating: 4.7,
      duration: "1.5 hours",
      description: "Professional hair styling, cutting and coloring service",
      image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300",
      isActive: true,
      customFields: [
        { name: "Hair Length", value: "Medium", type: "text", required: true },
        { name: "Color Treatment", value: "Yes", type: "checkbox", required: false }
      ]
    },
    {
      id: 4,
      name: "Home Deep Cleaning",
      category: "Home Services",
      subcategory: "Cleaning",
      price: 120000,
      rating: 4.5,
      duration: "4 hours",
      description: "Complete home deep cleaning service including kitchen, bathrooms, and living areas",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300",
      isActive: false,
      customFields: [
        { name: "House Size", value: "3 Bedrooms", type: "text", required: true },
        { name: "Pets", value: "No", type: "checkbox", required: false }
      ]
    }
  ];

  // Fetch services and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setCategoryStructure(sampleCategories);
        setServices(demoServices);
        setFilteredServices(demoServices);
        
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
    let filtered = [...services];
    
    // Apply tab-specific filters
    if (activeTab === 1) { // Favorites tab
      filtered = filtered.filter(service => favorites.some(fav => fav.id === service.id));
    } else if (activeTab === 2) { // Inactive services tab
      filtered = filtered.filter(service => !service.isActive);
    }
    
    // Category filter
    if (category) {
      filtered = filtered.filter(service => service.category === category);
    }
    
    // Subcategory filter
    if (subcategory) {
      filtered = filtered.filter(service => service.subcategory === subcategory);
    }
    
    // Price filter
    filtered = filtered.filter(service => 
      service.price >= minPrice && service.price <= maxPrice
    );
    
    // Rating filter
    if (rating > 0) {
      filtered = filtered.filter(service => service.rating >= rating);
    }
    
    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(term) ||
        service.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredServices(filtered);
  }, [services, category, subcategory, minPrice, maxPrice, rating, searchTerm, activeTab, favorites]);

  // Toggle category expansion
  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Handle adding to favorites
  const handleAddToFavorites = (service) => {
    if (!favorites.some((fav) => fav.id === service.id)) {
      setFavorites([...favorites, service]);
      showSnackbar("Added to favorites", "success");
    }
  };

  // Handle removing from favorites
  const handleRemoveFromFavorites = (serviceId) => {
    setFavorites(favorites.filter((fav) => fav.id !== serviceId));
    showSnackbar("Removed from favorites", "info");
  };

  // View service details
  const handleViewDetails = (service) => {
    setSelectedService(service);
    setOpenServiceDialog(true);
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

  // Open add service dialog
  const handleOpenAddService = () => {
    setNewService({ 
      name: "", 
      category: "", 
      subcategory: "", 
      price: "", 
      rating: 0, 
      duration: "",
      description: "",
      image: null,
      imagePreview: "",
      isActive: true,
      customFields: []
    });
    setIsEditing(false);
    setEditingServiceId(null);
    setOpenServiceDialog(true);
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
    setOpenServiceDialog(false);
    setOpenCategoryDialog(false);
    setSelectedService(null);
  };

  // Handle image upload for new service
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewService(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle sorting
  const handleSort = (e) => {
    const sortValue = e.target.value;
    let sortedServices = [...filteredServices];
    switch (sortValue) {
      case "priceAsc":
        sortedServices.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        sortedServices.sort((a, b) => b.price - a.price);
        break;
      case "ratingAsc":
        sortedServices.sort((a, b) => a.rating - b.rating);
        break;
      case "ratingDesc":
        sortedServices.sort((a, b) => b.rating - a.rating);
        break;
      case "nameAsc":
        sortedServices.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        sortedServices.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    setFilteredServices(sortedServices);
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

  // Add a new service
  const handleAddService = async () => {
    try {
      // Generate a unique ID for the new service
      const newId = Math.max(...services.map(s => s.id), 0) + 1;
      
      const serviceToAdd = {
        ...newService,
        id: newId,
        price: parseFloat(newService.price) || 0,
        rating: parseFloat(newService.rating) || 0
      };
      
      setServices(prev => [...prev, serviceToAdd]);
      setFilteredServices(prev => [...prev, serviceToAdd]);
      showSnackbar("Service added successfully", "success");
      handleDialogClose();
    } catch (err) {
      showSnackbar("Failed to add service", "error");
    }
  };

  // Handle opening the edit service dialog
  const handleEditService = (service) => {
    setSelectedService(service);
    setNewService({
      name: service.name,
      category: service.category,
      subcategory: service.subcategory,
      price: service.price,
      rating: service.rating,
      duration: service.duration,
      description: service.description,
      image: null,
      imagePreview: service.image,
      isActive: service.isActive,
      customFields: service.customFields || []
    });
    setIsEditing(true);
    setEditingServiceId(service.id);
    setOpenServiceDialog(true);
  };

  // Handle saving edited service
  const handleSaveEditedService = async () => {
    try {
      const updatedService = {
        ...newService,
        id: editingServiceId,
        price: parseFloat(newService.price) || 0,
        rating: parseFloat(newService.rating) || 0
      };
      
      const updatedServices = services.map(s => 
        s.id === editingServiceId ? updatedService : s
      );
      setServices(updatedServices);
      setFilteredServices(updatedServices);
      
      showSnackbar("Service updated successfully", "success");
      handleDialogClose();
    } catch (err) {
      showSnackbar("Failed to update service", "error");
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

  // Add a custom field to the service
  const handleAddCustomField = () => {
    if (newCustomField.name) {
      setNewService(prev => ({
        ...prev,
        customFields: [...prev.customFields, { ...newCustomField, value: "" }]
      }));
      setNewCustomField({ name: "", type: "text", required: false });
    }
  };

  // Remove a custom field from the service
  const handleRemoveCustomField = (index) => {
    setNewService(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }));
  };

  // Update a custom field value
  const handleCustomFieldChange = (index, field, value) => {
    const updatedFields = [...newService.customFields];
    updatedFields[index][field] = value;
    setNewService(prev => ({
      ...prev,
      customFields: updatedFields
    }));
  };

  // Toggle service active status
  const toggleServiceStatus = (serviceId) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, isActive: !service.isActive } 
        : service
    ));
    showSnackbar("Service status updated", "success");
  };

  // Delete a service
  const handleDeleteService = (serviceId) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
    setFavorites(prev => prev.filter(fav => fav.id !== serviceId));
    showSnackbar("Service deleted", "info");
  };

  // Loading and error states
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>Loading services...</Typography>
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

  // Service Details Dialog
  const ServiceDetailsDialog = () => (
    <Dialog 
      open={openServiceDialog && selectedService && !isEditing} 
      onClose={handleDialogClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{selectedService?.name}</Typography>
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
              image={selectedService?.image}
              alt={selectedService?.name}
              sx={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Chip 
                label={selectedService?.isActive ? "Active" : "Inactive"} 
                color={selectedService?.isActive ? "success" : "error"} 
                size="small" 
              />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={selectedService?.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>{selectedService?.rating}/5</Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              <strong>Category:</strong> {selectedService?.category} › {selectedService?.subcategory}
            </Typography>
            
            <Typography variant="h4" color="primary" gutterBottom>
              UGX {selectedService?.price?.toLocaleString()}
            </Typography>
            
            <Typography variant="body1" paragraph>
              <strong>Duration:</strong> {selectedService?.duration}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" paragraph>
              <strong>Description:</strong> {selectedService?.description}
            </Typography>
            
            {selectedService?.customFields && selectedService.customFields.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Additional Information</Typography>
                {selectedService.customFields.map((field, index) => (
                  <Box key={index} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      <strong>{field.name}:</strong> {field.value || "Not specified"}
                      {field.required && <Chip label="Required" size="small" sx={{ ml: 1 }} />}
                    </Typography>
                  </Box>
                ))}
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Close</Button>
        <Button 
          variant="contained" 
          onClick={() => handleEditService(selectedService)}
          startIcon={<Edit />}
        >
          Edit Service
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Service Form Dialog (Add/Edit)
  const ServiceFormDialog = () => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setNewService(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSave = () => {
      // Validate required fields
      if (!newService.name || !newService.category || !newService.subcategory || !newService.price) {
        showSnackbar("Please fill in all required fields", "error");
        return;
      }

      if (isEditing) {
        handleSaveEditedService();
      } else {
        handleAddService();
      }
    };

    return (
      <Dialog 
        open={openServiceDialog && (isEditing || !selectedService)} 
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{isEditing ? "Edit Service" : "Add New Service"}</Typography>
            <IconButton onClick={handleDialogClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service Name *"
                name="name"
                value={newService.name}
                onChange={handleChange}
                error={!newService.name}
                helperText={!newService.name ? "Service name is required" : ""}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!newService.category}>
                <InputLabel>Category *</InputLabel>
                <Select
                  name="category"
                  value={newService.category}
                  onChange={handleChange}
                  label="Category *"
                >
                  <MenuItem value=""><em>Select Category</em></MenuItem>
                  {Object.keys(categoryStructure).map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
                {!newService.category && (
                  <Typography variant="caption" color="error">Category is required</Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!newService.subcategory && !!newService.category}>
                <InputLabel>Subcategory *</InputLabel>
                <Select
                  name="subcategory"
                  value={newService.subcategory}
                  onChange={handleChange}
                  label="Subcategory *"
                  disabled={!newService.category}
                >
                  <MenuItem value=""><em>Select Subcategory</em></MenuItem>
                  {newService.category && categoryStructure[newService.category]?.map((subcat) => (
                    <MenuItem key={subcat} value={subcat}>{subcat}</MenuItem>
                  ))}
                </Select>
                {!newService.subcategory && newService.category && (
                  <Typography variant="caption" color="error">Subcategory is required</Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (UGX) *"
                type="number"
                name="price"
                value={newService.price}
                onChange={handleChange}
                inputProps={{ min: 0, step: 1000 }}
                error={!newService.price && newService.price !== 0}
                helperText={!newService.price && newService.price !== 0 ? "Price is required" : ""}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                name="duration"
                value={newService.duration}
                onChange={handleChange}
                placeholder="e.g., 1 hour, 30 minutes"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={3}
                value={newService.description}
                onChange={handleChange}
                placeholder="Describe the service in detail..."
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="body2" gutterBottom>Service Rating</Typography>
                <Rating
                  name="rating"
                  value={parseFloat(newService.rating)}
                  onChange={(e, newValue) => setNewService(prev => ({...prev, rating: newValue}))}
                  precision={0.5}
                  size="large"
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newService.isActive}
                    onChange={(e) => setNewService(prev => ({...prev, isActive: e.target.checked}))}
                    name="isActive"
                  />
                }
                label="Service is active"
              />
            </Grid>
            
            {/* Custom Fields Section */}
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">Custom Fields</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Add custom fields to collect specific information from customers when they book this service.
                  </Typography>
                  
                  <Paper sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Add New Field</Typography>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Field Name"
                          value={newCustomField.name}
                          onChange={(e) => setNewCustomField(prev => ({...prev, name: e.target.value}))}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Field Type</InputLabel>
                          <Select
                            value={newCustomField.type}
                            onChange={(e) => setNewCustomField(prev => ({...prev, type: e.target.value}))}
                            label="Field Type"
                          >
                            <MenuItem value="text">Text</MenuItem>
                            <MenuItem value="number">Number</MenuItem>
                            <MenuItem value="checkbox">Checkbox</MenuItem>
                            <MenuItem value="dropdown">Dropdown</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={newCustomField.required}
                              onChange={(e) => setNewCustomField(prev => ({...prev, required: e.target.checked}))}
                            />
                          }
                          label="Required"
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Button 
                          variant="contained" 
                          onClick={handleAddCustomField}
                          disabled={!newCustomField.name}
                          startIcon={<Add />}
                          fullWidth
                        >
                          Add
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                  
                  {newService.customFields.length > 0 ? (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>Current Fields</Typography>
                      {newService.customFields.map((field, index) => (
                        <Paper key={index} sx={{ p: 2, mb: 1 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={3}>
                              <Typography variant="body2"><strong>{field.name}</strong></Typography>
                              <Typography variant="caption" color="textSecondary">
                                {field.type} {field.required && "(Required)"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={7}>
                              {field.type === "checkbox" ? (
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={field.value === "Yes"}
                                      onChange={(e) => handleCustomFieldChange(index, "value", e.target.checked ? "Yes" : "No")}
                                    />
                                  }
                                  label={field.value === "Yes" ? "Yes" : "No"}
                                />
                              ) : (
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={field.value}
                                  onChange={(e) => handleCustomFieldChange(index, "value", e.target.value)}
                                  placeholder="Default value"
                                />
                              )}
                            </Grid>
                            <Grid item xs={12} sm={2}>
                              <IconButton 
                                color="error" 
                                onClick={() => handleRemoveCustomField(index)}
                                size="small"
                              >
                                <Delete />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                      No custom fields added yet
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2" gutterBottom>Service Image</Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="service-image-upload"
                type="file"
                onChange={handleImageUpload}
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
                    style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8 }}
                  />
                  <Button 
                    variant="text" 
                    color="error" 
                    size="small"
                    onClick={() => setNewService(prev => ({...prev, image: null, imagePreview: ""}))}
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
            disabled={!newService.name || !newService.category || !newService.subcategory || !newService.price}
          >
            {isEditing ? "Save Changes" : "Add Service"}
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
        <Typography variant="h4" fontWeight="bold">Service Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenAddService}
          >
            Add Service
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
          <Tab label="All Services" />
          <Tab label={
            <Badge badgeContent={favorites.length} color="error" showZero={false}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Favorite sx={{ fontSize: 20, mr: 1 }} />
                Favorites
              </Box>
            </Badge>
          } />
          <Tab label="Inactive Services" />
        </Tabs>
      </Paper>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Services"
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
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Category Navigation Sidebar and Service Grid */}
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
                  {expandedCategories[categoryName] ? <ExpandLess /> : <ExpandMoreIcon />}
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

        {/* Service Grid */}
        <Grid item xs={12} md={9}>
          {activeTab === 1 && favorites.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Favorite sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>No favorites yet</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Services you add to favorites will appear here
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => setActiveTab(0)}
              >
                Browse Services
              </Button>
            </Paper>
          ) : activeTab === 2 && filteredServices.filter(s => !s.isActive).length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <InventoryIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>No inactive services</Typography>
              <Typography variant="body2" color="text.secondary">
                All services are currently active
              </Typography>
            </Paper>
          ) : filteredServices.length > 0 ? (
            <Grid container spacing={2}>
              {filteredServices.map((service) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={service.id}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    opacity: service.isActive ? 1 : 0.7,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        image={service.image}
                        alt={service.name}
                        sx={{ height: 160, objectFit: 'cover' }}
                      />
                      <Chip 
                        label={service.isActive ? "Active" : "Inactive"} 
                        color={service.isActive ? "success" : "error"} 
                        size="small" 
                        sx={{ position: 'absolute', top: 10, right: 10 }}
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
                        {service.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={service.rating} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                          {service.rating}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {service.category} › {service.subcategory}
                      </Typography>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" color="primary">
                          UGX {service.price.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.duration}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => handleViewDetails(service)}
                      >
                        Details
                      </Button>
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => toggleServiceStatus(service.id)}
                          color={service.isActive ? "default" : "success"}
                        >
                          {service.isActive ? <RemoveCircle /> : <AddCircle />}
                        </IconButton>
                        {favorites.some((fav) => fav.id === service.id) ? (
                          <IconButton 
                            size="small" 
                            onClick={() => handleRemoveFromFavorites(service.id)}
                            color="error"
                          >
                            <Favorite />
                          </IconButton>
                        ) : (
                          <IconButton 
                            size="small" 
                            onClick={() => handleAddToFavorites(service)}
                            color="default"
                          >
                            <FavoriteBorder />
                          </IconButton>
                        )}
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteService(service.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Search sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>No services found</Typography>
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
      <ServiceDetailsDialog />
      <ServiceFormDialog />
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

export default ServicesPage;