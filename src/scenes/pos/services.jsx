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
  Work as ServiceIcon,
  Edit,
  Close,
  Schedule,
  People,
  LocalOffer,
  Star,
  StarHalf,
  StarBorder
} from "@mui/icons-material";

// Service category structure
const serviceCategoryStructure = {
  "Web Development": ["Websites", "Development", "Tech", "Online"],
  "Beauty & Wellness": ["Hair Salon", "Spa", "Nails", "Massage"],
  "Home Services": ["Cleaning", "Plumbing", "Electrical", "Handyman"],
  "Professional Services": ["Legal", "Accounting", "Consulting", "Thearpy"],
  "Health & Fitness": ["Personal Training", "Yoga", "Physical Therapy", "Nutrition"],
  "Automotive": ["Car Wash", "Mechanic", "Detailing", "Towing"],
   
};

// Enhanced service data
const initialServiceData = [
  { 
    id: 1, 
    name: "Web Development", 
    category: "Web Development", 
    subcategory: "Websites", 
    price: 350000, 
    duration: 60, 
    rating: 4.5, 
    provider: "Harold Tech Support",
    providerRating: 4.8,
    available: true,
    image: "/assets/web.jpeg", 
    description: "Professional Websites developed according to the users needs.",
    requiresAppointment: true,
    maxParticipants: 1,
    tags: ["web", "development", "tech"]
  },
  { 
    id: 2, 
    name: "Deep Cleaning", 
    category: "Home Services", 
    subcategory: "Cleaning", 
    price: 150000, 
    duration: 240, 
    rating: 4.7, 
    provider: "Sparkle Clean",
    providerRating: 4.9,
    available: true,
    image: "/assets/cleaning.jpg", 
    description: "Thorough deep cleaning of your entire home or office.",
    requiresAppointment: true,
    maxParticipants: null,
    tags: ["cleaning", "home", "deep clean"]
  },
  { 
    id: 3, 
    name: "Legal Consultation", 
    category: "Professional Services", 
    subcategory: "Legal", 
    price: 100000, 
    duration: 60, 
    rating: 4.9, 
    provider: "Law Associates Ltd",
    providerRating: 4.8,
    available: true,
    image: "/assets/legal.jpeg", 
    description: "Initial consultation with our experienced attorneys.",
    requiresAppointment: true,
    maxParticipants: 1,
    tags: ["legal", "consultation", "lawyer"]
  },
  
  
];

const ServicesPage = () => {
  // State management
  const [services, setServices] = useState(initialServiceData);
  const [filteredServices, setFilteredServices] = useState(initialServiceData);
  const [selectedService, setSelectedService] = useState(null);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [rating, setRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [newService, setNewService] = useState({ 
    name: "", 
    category: "", 
    subcategory: "", 
    price: "", 
    duration: "",
    rating: 0, 
    provider: "",
    providerRating: 0,
    available: true,
    description: "",
    requiresAppointment: true,
    maxParticipants: "",
    tags: [],
    image: null,
    imagePreview: ""
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
  const [newTag, setNewTag] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filtered = [...services];
    
    // Apply tab-specific filters
    if (activeTab === 1) { // Favorites tab
      filtered = filtered.filter(service => favorites.some(fav => fav.id === service.id));
    } else if (activeTab === 2) { // Popular services tab
      filtered = filtered.filter(service => service.rating >= 4.5);
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
        service.description.toLowerCase().includes(term) ||
        service.provider.toLowerCase().includes(term) ||
        service.tags.some(tag => tag.toLowerCase().includes(term))
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

  // Close all dialogs
  const handleDialogClose = () => {
    setOpenServiceDialog(false);
    setOpenCategoryDialog(false);
    setSelectedService(null);
    setNewService({ 
      name: "", 
      category: "", 
      subcategory: "", 
      price: "", 
      duration: "",
      rating: 0, 
      provider: "",
      providerRating: 0,
      available: true,
      description: "",
      requiresAppointment: true,
      maxParticipants: "",
      tags: [],
      image: null,
      imagePreview: ""
    });
    setIsEditing(false);
    setEditingServiceId(null);
  };

  // Handle image upload for new service
  const handleImageUpload = (e) => {
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

  // Add a new service
  const handleAddService = () => {
    const newServiceWithId = {
      ...newService,
      id: services.length + 1,
      price: Number(newService.price),
      duration: Number(newService.duration),
      rating: Number(newService.rating),
      providerRating: Number(newService.providerRating),
      maxParticipants: newService.maxParticipants ? Number(newService.maxParticipants) : null,
      image: newService.imagePreview || "/assets/default-service.png",
      tags: newService.tags
    };
    setServices([...services, newServiceWithId]);
    showSnackbar("Service added successfully", "success");
    handleDialogClose();
  };

  // Handle opening the edit service dialog
  const handleEditService = (service) => {
    setSelectedService(service);
    setNewService({
      name: service.name,
      category: service.category,
      subcategory: service.subcategory,
      price: service.price,
      duration: service.duration,
      rating: service.rating,
      provider: service.provider,
      providerRating: service.providerRating,
      available: service.available,
      description: service.description,
      requiresAppointment: service.requiresAppointment,
      maxParticipants: service.maxParticipants,
      tags: service.tags,
      image: null,
      imagePreview: service.image
    });
    setIsEditing(true);
    setEditingServiceId(service.id);
    setOpenServiceDialog(true);
  };

  // Handle saving edited service
  const handleSaveEditedService = () => {
    const updatedServices = services.map(service => {
      if (service.id === editingServiceId) {
        return {
          ...service,
          name: newService.name,
          category: newService.category,
          subcategory: newService.subcategory,
          price: Number(newService.price),
          duration: Number(newService.duration),
          rating: Number(newService.rating),
          provider: newService.provider,
          providerRating: Number(newService.providerRating),
          available: newService.available,
          description: newService.description,
          requiresAppointment: newService.requiresAppointment,
          maxParticipants: newService.maxParticipants ? Number(newService.maxParticipants) : null,
          tags: newService.tags,
          image: newService.imagePreview || service.image
        };
      }
      return service;
    });

    setServices(updatedServices);
    setFilteredServices(updatedServices);
    showSnackbar("Service updated successfully", "success");
    handleDialogClose();
  };

  // Add a new category
  const handleAddCategory = () => {
    if (newCategory.name && !serviceCategoryStructure[newCategory.name]) {
      serviceCategoryStructure[newCategory.name] = newCategory.subcategories;
      showSnackbar("Category added successfully", "success");
    } else if (newCategory.name && newCategory.subcategories.length > 0) {
      serviceCategoryStructure[newCategory.name] = [
        ...(serviceCategoryStructure[newCategory.name] || []),
        ...newCategory.subcategories
      ];
      showSnackbar("Subcategories added successfully", "success");
    }
    handleDialogClose();
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
      case "durationAsc":
        sortedServices.sort((a, b) => a.duration - b.duration);
        break;
      case "durationDesc":
        sortedServices.sort((a, b) => b.duration - a.duration);
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
    const parentCategory = Object.keys(serviceCategoryStructure).find(cat => 
      serviceCategoryStructure[cat].includes(subcat)
    );
    if (parentCategory) {
      setCategory(parentCategory);
    }
  };

  // Add a tag to the new service
  const handleAddTag = () => {
    if (newTag && !newService.tags.includes(newTag)) {
      setNewService(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag("");
    }
  };

  // Remove a tag from the new service
  const handleRemoveTag = (tag) => {
    setNewService(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

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
          {selectedService?.name}
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
              sx={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
            />
            <Box sx={{ display: 'flex', mt: 2 }}>
              {selectedService?.tags?.map((tag, index) => (
                <Chip key={index} label={tag} sx={{ mr: 1, mb: 1 }} />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>{selectedService?.name}</Typography>
            <Typography variant="subtitle1" gutterBottom>
              Provided by: {selectedService?.provider}
              <Rating 
                value={selectedService?.providerRating} 
                precision={0.1} 
                readOnly 
                sx={{ ml: 1 }} 
              />
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={selectedService?.rating} precision={0.1} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>{selectedService?.rating}/5</Typography>
            </Box>
            
            <Typography variant="body1" paragraph>
              <strong>Category:</strong> {selectedService?.category} › {selectedService?.subcategory}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              <Box>
                <Typography variant="body1">
                  <strong>Price:</strong>
                </Typography>
                <Typography variant="h4" color="primary">
                  UGX {selectedService?.price?.toLocaleString()}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body1">
                  <strong>Duration:</strong>
                </Typography>
                <Typography variant="h6">
                  {Math.floor(selectedService?.duration / 60)}h {selectedService?.duration % 60}m
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                <strong>Availability:</strong> 
                <Chip 
                  label={selectedService?.available ? "Available" : "Not Available"} 
                  color={selectedService?.available ? "success" : "error"} 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Typography>
              
              <Typography variant="body1">
                <strong>Appointment Required:</strong> 
                <Chip 
                  label={selectedService?.requiresAppointment ? "Yes" : "No"} 
                  color={selectedService?.requiresAppointment ? "primary" : "default"} 
                  size="small" 
                  sx={{ ml: 1 }}
                />
              </Typography>
              
              {selectedService?.maxParticipants && (
                <Typography variant="body1">
                  <strong>Max Participants:</strong> {selectedService?.maxParticipants}
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1">
              <strong>Description:</strong> 
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedService?.description}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Close</Button>
        <Button 
          variant="contained" 
          onClick={() => handleEditService(selectedService)}
          startIcon={<Edit />}
          sx={{ backgroundColor: "purple", color: "white" }}
        >
          Edit Service
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Service Form Dialog (Add/Edit)
  const ServiceFormDialog = () => (
    <Dialog 
      open={openServiceDialog && (isEditing || !selectedService)} 
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {isEditing ? "Edit Service" : "Add New Service"}
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
              label="Service Name"
              value={newService.name}
              onChange={(e) => setNewService({...newService, name: e.target.value})}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newService.category}
                onChange={(e) => setNewService({...newService, category: e.target.value, subcategory: ""})}
                label="Category"
              >
                <MenuItem value=""><em>Select Category</em></MenuItem>
                {Object.keys(serviceCategoryStructure).map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={newService.subcategory}
                onChange={(e) => setNewService({...newService, subcategory: e.target.value})}
                label="Subcategory"
                disabled={!newService.category}
              >
                <MenuItem value=""><em>Select Subcategory</em></MenuItem>
                {newService.category && serviceCategoryStructure[newService.category]?.map((subcat) => (
                  <MenuItem key={subcat} value={subcat}>{subcat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Provider/Company"
              value={newService.provider}
              onChange={(e) => setNewService({...newService, provider: e.target.value})}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Provider Rating (0-5)"
              type="number"
              inputProps={{ min: 0, max: 5, step: 0.1 }}
              value={newService.providerRating}
              onChange={(e) => setNewService({...newService, providerRating: e.target.value})}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price (UGX)"
              type="number"
              value={newService.price}
              onChange={(e) => setNewService({...newService, price: e.target.value})}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Duration (minutes)"
              type="number"
              value={newService.duration}
              onChange={(e) => setNewService({...newService, duration: e.target.value})}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={newService.description}
              onChange={(e) => setNewService({...newService, description: e.target.value})}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="body2">Service Rating</Typography>
            <Rating
              value={newService.rating}
              onChange={(e, newValue) => setNewService({...newService, rating: newValue})}
              precision={0.5}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
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
          
          <Grid item xs={12} sm={6}>
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
            <TextField
              fullWidth
              label="Max Participants (leave empty if not applicable)"
              type="number"
              value={newService.maxParticipants || ""}
              onChange={(e) => setNewService({...newService, maxParticipants: e.target.value})}
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
              />
              <Button 
                variant="contained" 
                onClick={handleAddTag}
                disabled={!newTag}
              >
                Add
              </Button>
            </Box>
            {newService.tags.length > 0 && (
              <Paper sx={{ p: 2, mb: 2 }}>
                {newService.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Paper>
            )}
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
                  style={{ maxHeight: 200, maxWidth: '100%' }}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={isEditing ? handleSaveEditedService : handleAddService}
          disabled={!newService.name || !newService.category}
          sx={{ backgroundColor: "purple", color: "white" }}
        >
          {isEditing ? "Save Changes" : "Save Service"}
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
            {Object.entries(serviceCategoryStructure).map(([category, subcategories]) => (
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
        <Typography variant="h4">Service Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenServiceDialog(true)}
            sx={{ backgroundColor: "purple", color: "white" }}
          >
            Add Service
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
        <Tab label="All Services" />
        <Tab label={
          <Badge badgeContent={favorites.length} color="error">
            Favorites
          </Badge>
        } />
        <Tab label="Popular Services" />
      </Tabs>

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
                {Object.keys(serviceCategoryStructure).map((cat) => (
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
                {category && serviceCategoryStructure[category]?.map((subcat) => (
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
              max={200000}
              step={5000}
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
                <MenuItem value="durationAsc">Duration (Short to Long)</MenuItem>
                <MenuItem value="durationDesc">Duration (Long to Short)</MenuItem>
              </Select>
            </FormControl>
                    </Grid>
        </Grid>
      </Paper>

      {/* Main Content - Sidebar and Services Grid */}
      <Grid container spacing={3}>
        {/* Sidebar with categories */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Category sx={{ mr: 1 }} /> Categories
            </Typography>
            <Box sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
              {Object.entries(serviceCategoryStructure).map(([categoryName, subcategories]) => (
                <Box key={categoryName} sx={{ mb: 1 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 1,
                      cursor: 'pointer',
                      backgroundColor: expandedCategories[categoryName] ? '#f5f5f5' : 'transparent',
                      borderRadius: 1
                    }}
                    onClick={() => toggleCategory(categoryName)}
                  >
                    <Typography variant="subtitle1">{categoryName}</Typography>
                    {expandedCategories[categoryName] ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                  {expandedCategories[categoryName] && (
                    <Box sx={{ pl: 2 }}>
                      {subcategories.map((subcat) => (
                        <Typography 
                          key={subcat}
                          variant="body2" 
                          sx={{ 
                            p: 1, 
                            cursor: 'pointer',
                            backgroundColor: subcategory === subcat ? '#e0e0e0' : 'transparent',
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: '#f5f5f5'
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
            </Box>
          </Paper>
        </Grid>

        {/* Services Grid */}
        <Grid item xs={12} md={9}>
          {filteredServices.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h6">No services found matching your criteria</Typography>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setCategory('');
                  setSubcategory('');
                  setMinPrice(0);
                  setMaxPrice(200000);
                  setRating(0);
                  setSearchTerm('');
                }}
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredServices.map((service) => (
                <Grid item xs={12} sm={6} lg={4} key={service.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      image={service.image}
                      alt={service.name}
                      sx={{ height: 140, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" component="h3">
                          {service.name}
                        </Typography>
                        <IconButton
                          onClick={() => 
                            favorites.some(fav => fav.id === service.id) 
                              ? handleRemoveFromFavorites(service.id) 
                              : handleAddToFavorites(service)
                          }
                          sx={{ ml: 1 }}
                        >
                          {favorites.some(fav => fav.id === service.id) ? (
                            <Favorite color="error" />
                          ) : (
                            <FavoriteBorder />
                          )}
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {service.provider}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={service.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {service.rating}
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph sx={{ mb: 1 }}>
                        {service.description.length > 100 
                          ? `${service.description.substring(0, 100)}...` 
                          : service.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        <Chip 
                          label={service.category} 
                          size="small" 
                          variant="outlined" 
                        />
                        <Chip 
                          label={service.subcategory} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {service.tags.slice(0, 3).map((tag, index) => (
                          <Chip key={index} label={tag} size="small" />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      <Typography variant="h6" color="primary">
                        UGX {service.price.toLocaleString()}
                      </Typography>
                      <Box>
                        <Button 
                          size="small" 
                          onClick={() => handleViewDetails(service)}
                          sx={{ mr: 1 }}
                        >
                          View
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained"
                          onClick={() => handleEditService(service)}
                          sx={{ backgroundColor: "purple", color: "white" }}
                        >
                          Edit
                        </Button>
                      </Box>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Dialogs */}
      <ServiceDetailsDialog />
      <ServiceFormDialog />
      <ManageCategoriesDialog />

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
    </Box>
  );
};

export default ServicesPage;