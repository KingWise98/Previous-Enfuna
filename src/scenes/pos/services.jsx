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
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Radio,
  RadioGroup,
  FormLabel
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
  Edit,
  Close,
  Schedule,
  People,
  LocalOffer,
  Star,
  StarHalf,
  StarBorder,
  Restaurant,
  ShoppingCart,
  LocalHospital,
  Spa,
  LocalGroceryStore,
  Event,
  MeetingRoom,
  RoomService,
  Inventory,
  CardGiftcard,
  LocalPharmacy,
  CalendarToday,
  Receipt,
  MonetizationOn,
  Chair,
  Hotel,
  Fastfood,
  LocalBar,
  LocalDining,
  KingBed,
  RoomPreferences,
  Store,
  MedicalServices,
  ContentCut,
  ShoppingBag,
  LocalFlorist,
  ConfirmationNumber,
  Place
} from "@mui/icons-material";
import { Work } from "@mui/icons-material";

// Enhanced service category structure with all new types
const serviceCategoryStructure = {
  "Web Development": ["Websites", "Development", "Tech", "Online"],
  "Beauty & Wellness": ["Hair Salon", "Spa", "Nails", "Massage"],
  "Home Services": ["Cleaning", "Plumbing", "Electrical", "Handyman"],
  "Professional Services": ["Legal", "Accounting", "Consulting", "Therapy"],
  "Health & Fitness": ["Personal Training", "Yoga", "Physical Therapy", "Nutrition"],
  "Automotive": ["Car Wash", "Mechanic", "Detailing", "Towing"],
  "Hospitality": ["Restaurant", "Bar", "Hotel", "Cafe"],
  "Retail": ["Clothing", "Electronics", "Home Goods", "Specialty"],
  "Healthcare": ["Pharmacy", "Clinic", "Dental", "Optometry"],
  "Salons & Spas": ["Hair", "Nails", "Skin Care", "Massage"],
  "Grocery Stores": ["Supermarket", "Specialty Foods", "Bakery", "Butcher"],
  "Event Management": ["Concerts", "Conferences", "Weddings", "Private Parties"]
};

const ServicesPage = () => {
  // State management
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000000);
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
    imagePreview: "",
    serviceType: "standard",
    hospitalityType: "",
    menuItems: [],
    tableManagement: {
      totalTables: 0,
      availableTables: 0,
      tableLayout: ""
    },
    roomManagement: {
      totalRooms: 0,
      availableRooms: 0,
      roomTypes: [],
      amenities: []
    },
    inventory: {
      stock: 0,
      lowStockAlert: 5,
      sku: ""
    },
    loyaltyProgram: {
      points: 0,
      discountEligible: false
    },
    healthcareType: "",
    patientManagement: {
      acceptsInsurance: false,
      insuranceProviders: []
    },
    prescriptionManagement: false,
    salonType: "",
    appointmentSettings: {
      advanceBooking: 1,
      cancellationPolicy: "24 hours"
    },
    staffAssignable: false,
    inventoryManagement: {
      perishableTracking: false,
      weightBasedPricing: false
    },
    deliveryOptions: {
      available: false,
      minOrder: 0
    },
    eventType: "",
    venueManagement: {
      capacity: 0,
      indoor: false,
      outdoor: false
    },
    ticketManagement: {
      required: false,
      capacity: 0
    }
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
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    price: "",
    category: ""
  });
  const [newRoomType, setNewRoomType] = useState("");
  const [newAmenity, setNewAmenity] = useState("");
  const [newInsuranceProvider, setNewInsuranceProvider] = useState("");

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
        (service.tags && service.tags.some(tag => tag.toLowerCase().includes(term))))
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
      imagePreview: "",
      serviceType: "standard",
      hospitalityType: "",
      menuItems: [],
      tableManagement: {
        totalTables: 0,
        availableTables: 0,
        tableLayout: ""
      },
      roomManagement: {
        totalRooms: 0,
        availableRooms: 0,
        roomTypes: [],
        amenities: []
      },
      inventory: {
        stock: 0,
        lowStockAlert: 5,
        sku: ""
      },
      loyaltyProgram: {
        points: 0,
        discountEligible: false
      },
      healthcareType: "",
      patientManagement: {
        acceptsInsurance: false,
        insuranceProviders: []
      },
      prescriptionManagement: false,
      salonType: "",
      appointmentSettings: {
        advanceBooking: 1,
        cancellationPolicy: "24 hours"
      },
      staffAssignable: false,
      inventoryManagement: {
        perishableTracking: false,
        weightBasedPricing: false
      },
      deliveryOptions: {
        available: false,
        minOrder: 0
      },
      eventType: "",
      venueManagement: {
        capacity: 0,
        indoor: false,
        outdoor: false
      },
      ticketManagement: {
        required: false,
        capacity: 0
      }
    });
    setIsEditing(false);
    setEditingServiceId(null);
    setNewMenuItem({
      name: "",
      price: "",
      category: ""
    });
    setNewRoomType("");
    setNewAmenity("");
    setNewInsuranceProvider("");
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
      price: newService.price ? Number(newService.price) : null,
      duration: newService.duration ? Number(newService.duration) : null,
      rating: Number(newService.rating),
      providerRating: Number(newService.providerRating),
      maxParticipants: newService.maxParticipants ? Number(newService.maxParticipants) : null,
      image: newService.imagePreview || "/assets/default-service.png",
      tags: newService.tags,
      menuItems: newService.menuItems.map(item => ({
        ...item,
        price: Number(item.price)
      })),
      tableManagement: {
        ...newService.tableManagement,
        totalTables: Number(newService.tableManagement.totalTables),
        availableTables: Number(newService.tableManagement.availableTables)
      },
      roomManagement: {
        ...newService.roomManagement,
        totalRooms: Number(newService.roomManagement.totalRooms),
        availableRooms: Number(newService.roomManagement.availableRooms)
      },
      inventory: {
        ...newService.inventory,
        stock: Number(newService.inventory.stock),
        lowStockAlert: Number(newService.inventory.lowStockAlert)
      },
      loyaltyProgram: {
        ...newService.loyaltyProgram,
        points: Number(newService.loyaltyProgram.points)
      },
      deliveryOptions: {
        ...newService.deliveryOptions,
        minOrder: Number(newService.deliveryOptions.minOrder)
      },
      venueManagement: {
        ...newService.venueManagement,
        capacity: Number(newService.venueManagement.capacity)
      },
      ticketManagement: {
        ...newService.ticketManagement,
        capacity: Number(newService.ticketManagement.capacity)
      }
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
      imagePreview: service.image,
      serviceType: service.serviceType || "standard",
      hospitalityType: service.hospitalityType || "",
      menuItems: service.menuItems || [],
      tableManagement: service.tableManagement || {
        totalTables: 0,
        availableTables: 0,
        tableLayout: ""
      },
      roomManagement: service.roomManagement || {
        totalRooms: 0,
        availableRooms: 0,
        roomTypes: [],
        amenities: []
      },
      inventory: service.inventory || {
        stock: 0,
        lowStockAlert: 5,
        sku: ""
      },
      loyaltyProgram: service.loyaltyProgram || {
        points: 0,
        discountEligible: false
      },
      healthcareType: service.healthcareType || "",
      patientManagement: service.patientManagement || {
        acceptsInsurance: false,
        insuranceProviders: []
      },
      prescriptionManagement: service.prescriptionManagement || false,
      salonType: service.salonType || "",
      appointmentSettings: service.appointmentSettings || {
        advanceBooking: 1,
        cancellationPolicy: "24 hours"
      },
      staffAssignable: service.staffAssignable || false,
      inventoryManagement: service.inventoryManagement || {
        perishableTracking: false,
        weightBasedPricing: false
      },
      deliveryOptions: service.deliveryOptions || {
        available: false,
        minOrder: 0
      },
      eventType: service.eventType || "",
      venueManagement: service.venueManagement || {
        capacity: 0,
        indoor: false,
        outdoor: false
      },
      ticketManagement: service.ticketManagement || {
        required: false,
        capacity: 0
      }
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
          price: newService.price ? Number(newService.price) : null,
          duration: newService.duration ? Number(newService.duration) : null,
          rating: Number(newService.rating),
          provider: newService.provider,
          providerRating: Number(newService.providerRating),
          available: newService.available,
          description: newService.description,
          requiresAppointment: newService.requiresAppointment,
          maxParticipants: newService.maxParticipants ? Number(newService.maxParticipants) : null,
          tags: newService.tags,
          image: newService.imagePreview || service.image,
          serviceType: newService.serviceType,
          hospitalityType: newService.hospitalityType,
          menuItems: newService.menuItems.map(item => ({
            ...item,
            price: Number(item.price)
          })),
          tableManagement: {
            ...newService.tableManagement,
            totalTables: Number(newService.tableManagement.totalTables),
            availableTables: Number(newService.tableManagement.availableTables)
          },
          roomManagement: {
            ...newService.roomManagement,
            totalRooms: Number(newService.roomManagement.totalRooms),
            availableRooms: Number(newService.roomManagement.availableRooms)
          },
          inventory: {
            ...newService.inventory,
            stock: Number(newService.inventory.stock),
            lowStockAlert: Number(newService.inventory.lowStockAlert)
          },
          loyaltyProgram: {
            ...newService.loyaltyProgram,
            points: Number(newService.loyaltyProgram.points)
          },
          healthcareType: newService.healthcareType,
          patientManagement: newService.patientManagement,
          prescriptionManagement: newService.prescriptionManagement,
          salonType: newService.salonType,
          appointmentSettings: newService.appointmentSettings,
          staffAssignable: newService.staffAssignable,
          inventoryManagement: newService.inventoryManagement,
          deliveryOptions: {
            ...newService.deliveryOptions,
            minOrder: Number(newService.deliveryOptions.minOrder)
          },
          eventType: newService.eventType,
          venueManagement: {
            ...newService.venueManagement,
            capacity: Number(newService.venueManagement.capacity)
          },
          ticketManagement: {
            ...newService.ticketManagement,
            capacity: Number(newService.ticketManagement.capacity)
          }
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
        sortedServices.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "priceDesc":
        sortedServices.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "ratingAsc":
        sortedServices.sort((a, b) => a.rating - b.rating);
        break;
      case "ratingDesc":
        sortedServices.sort((a, b) => b.rating - a.rating);
        break;
      case "durationAsc":
        sortedServices.sort((a, b) => (a.duration || 0) - (b.duration || 0));
        break;
      case "durationDesc":
        sortedServices.sort((a, b) => (b.duration || 0) - (a.duration || 0));
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

  // Add a menu item to the new service
  const handleAddMenuItem = () => {
    if (newMenuItem.name && newMenuItem.price && newMenuItem.category) {
      setNewService(prev => ({
        ...prev,
        menuItems: [...prev.menuItems, {
          id: prev.menuItems.length + 1,
          name: newMenuItem.name,
          price: newMenuItem.price,
          category: newMenuItem.category
        }]
      }));
      setNewMenuItem({
        name: "",
        price: "",
        category: ""
      });
    }
  };

  // Remove a menu item from the new service
  const handleRemoveMenuItem = (id) => {
    setNewService(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter(item => item.id !== id)
    }));
  };

  // Add a room type to the new service
  const handleAddRoomType = () => {
    if (newRoomType) {
      setNewService(prev => ({
        ...prev,
        roomManagement: {
          ...prev.roomManagement,
          roomTypes: [...prev.roomManagement.roomTypes, newRoomType]
        }
      }));
      setNewRoomType("");
    }
  };

  // Remove a room type from the new service
  const handleRemoveRoomType = (roomType) => {
    setNewService(prev => ({
      ...prev,
      roomManagement: {
        ...prev.roomManagement,
        roomTypes: prev.roomManagement.roomTypes.filter(rt => rt !== roomType)
      }
    }));
  };

  // Add an amenity to the new service
  const handleAddAmenity = () => {
    if (newAmenity) {
      setNewService(prev => ({
        ...prev,
        roomManagement: {
          ...prev.roomManagement,
          amenities: [...prev.roomManagement.amenities, newAmenity]
        }
      }));
      setNewAmenity("");
    }
  };

  // Remove an amenity from the new service
  const handleRemoveAmenity = (amenity) => {
    setNewService(prev => ({
      ...prev,
      roomManagement: {
        ...prev.roomManagement,
        amenities: prev.roomManagement.amenities.filter(a => a !== amenity)
      }
    }));
  };

  // Add an insurance provider to the new service
  const handleAddInsuranceProvider = () => {
    if (newInsuranceProvider) {
      setNewService(prev => ({
        ...prev,
        patientManagement: {
          ...prev.patientManagement,
          insuranceProviders: [...prev.patientManagement.insuranceProviders, newInsuranceProvider]
        }
      }));
      setNewInsuranceProvider("");
    }
  };

  // Remove an insurance provider from the new service
  const handleRemoveInsuranceProvider = (provider) => {
    setNewService(prev => ({
      ...prev,
      patientManagement: {
        ...prev.patientManagement,
        insuranceProviders: prev.patientManagement.insuranceProviders.filter(ip => ip !== provider)
      }
    }));
  };

  // Get icon for service category
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Hospitality":
        return <Restaurant />;
      case "Retail":
        return <ShoppingCart />;
      case "Healthcare":
        return <LocalHospital />;
      case "Salons & Spas":
        return <Spa />;
      case "Grocery Stores":
        return <LocalGroceryStore />;
      case "Event Management":
        return <Event />;
      case "Web Development":
        return <Work />;
      case "Beauty & Wellness":
        return <Spa />;
      case "Home Services":
        return <MeetingRoom />;
      case "Professional Services":
        return <Work />;
      case "Health & Fitness":
        return <LocalHospital />;
      case "Automotive":
        return <LocalOffer />;
      default:
        return <Work />;
    }
  };

  // Get icon for hospitality type
  const getHospitalityIcon = (type) => {
    switch (type) {
      case "restaurant":
        return <Restaurant />;
      case "bar":
        return <LocalBar />;
      case "hotel":
        return <Hotel />;
      case "cafe":
        return <LocalDining />;
      default:
        return <RoomService />;
    }
  };

  // Get icon for healthcare type
  const getHealthcareIcon = (type) => {
    switch (type) {
      case "pharmacy":
        return <LocalPharmacy />;
      case "clinic":
        return <MedicalServices />;
      case "dental":
        return <MedicalServices />;
      case "optometry":
        return <MedicalServices />;
      default:
        return <LocalHospital />;
    }
  };

  // Get icon for salon type
  const getSalonIcon = (type) => {
    switch (type) {
      case "hair":
        return <ContentCut />;
      case "nails":
        return <Spa />;
      case "skin care":
        return <Spa />;
      case "massage":
        return <Spa />;
      default:
        return <Spa />;
    }
  };

  // Get icon for event type
  const getEventIcon = (type) => {
    switch (type) {
      case "concert":
        return <ConfirmationNumber />;
      case "conference":
        return <Work />;
      case "wedding":
        return <LocalFlorist />;
      case "private party":
        return <Event />;
      default:
        return <Event />;
    }
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
          <Box display="flex" alignItems="center">
            {selectedService?.serviceType === "hospitality" && getHospitalityIcon(selectedService?.hospitalityType)}
            {selectedService?.serviceType === "healthcare" && getHealthcareIcon(selectedService?.healthcareType)}
            {selectedService?.serviceType === "salon" && getSalonIcon(selectedService?.salonType)}
            {selectedService?.serviceType === "event" && getEventIcon(selectedService?.eventType)}
            <Typography variant="h6" sx={{ ml: 1 }}>{selectedService?.name}</Typography>
          </Box>
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
              {selectedService?.price && (
                <Box>
                  <Typography variant="body1">
                    <strong>Price:</strong>
                  </Typography>
                  <Typography variant="h4" color="primary">
                    UGX {selectedService?.price?.toLocaleString()}
                  </Typography>
                </Box>
              )}
              
              {selectedService?.duration && (
                <Box>
                  <Typography variant="body1">
                    <strong>Duration:</strong>
                  </Typography>
                  <Typography variant="h6">
                    {Math.floor(selectedService?.duration / 60)}h {selectedService?.duration % 60}m
                  </Typography>
                </Box>
              )}
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
            
            {/* Hospitality Specific Details */}
            {selectedService?.serviceType === "hospitality" && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Hospitality Details</Typography>
                {selectedService?.hospitalityType === "restaurant" && (
                  <>
                    <Typography variant="body1">
                      <strong>Menu Items:</strong>
                    </Typography>
                    <TableContainer component={Paper} sx={{ mt: 1 }}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Price (UGX)</TableCell>
                            <TableCell>Category</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedService?.menuItems?.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.name}</TableCell>
                              <TableCell align="right">{item.price?.toLocaleString()}</TableCell>
                              <TableCell>{item.category}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      <strong>Table Management:</strong>
                    </Typography>
                    <Typography variant="body2">
                      Total Tables: {selectedService?.tableManagement?.totalTables}
                    </Typography>
                    <Typography variant="body2">
                      Available Tables: {selectedService?.tableManagement?.availableTables}
                    </Typography>
                  </>
                )}
                
                {selectedService?.hospitalityType === "hotel" && (
                  <>
                    <Typography variant="body1">
                      <strong>Room Management:</strong>
                    </Typography>
                    <Typography variant="body2">
                      Total Rooms: {selectedService?.roomManagement?.totalRooms}
                    </Typography>
                    <Typography variant="body2">
                      Available Rooms: {selectedService?.roomManagement?.availableRooms}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Room Types:</strong> {selectedService?.roomManagement?.roomTypes?.join(", ")}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Amenities:</strong> {selectedService?.roomManagement?.amenities?.join(", ")}
                    </Typography>
                  </>
                )}
              </Box>
            )}
            
            {/* Retail Specific Details */}
            {selectedService?.serviceType === "retail" && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Retail Details</Typography>
                <Typography variant="body1">
                  <strong>Inventory:</strong>
                </Typography>
                <Typography variant="body2">
                  Stock: {selectedService?.inventory?.stock}
                </Typography>
                <Typography variant="body2">
                  Low Stock Alert: {selectedService?.inventory?.lowStockAlert}
                </Typography>
                <Typography variant="body2">
                  SKU: {selectedService?.inventory?.sku}
                </Typography>
                
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Loyalty Program:</strong>
                </Typography>
                <Typography variant="body2">
                  Points: {selectedService?.loyaltyProgram?.points}
                </Typography>
                <Typography variant="body2">
                  Discount Eligible: {selectedService?.loyaltyProgram?.discountEligible ? "Yes" : "No"}
                </Typography>
              </Box>
            )}
            
            {/* Healthcare Specific Details */}
            {selectedService?.serviceType === "healthcare" && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Healthcare Details</Typography>
                <Typography variant="body1">
                  <strong>Patient Management:</strong>
                </Typography>
                <Typography variant="body2">
                  Accepts Insurance: {selectedService?.patientManagement?.acceptsInsurance ? "Yes" : "No"}
                </Typography>
                {selectedService?.patientManagement?.insuranceProviders?.length > 0 && (
                  <Typography variant="body2">
                    Insurance Providers: {selectedService?.patientManagement?.insuranceProviders?.join(", ")}
                  </Typography>
                )}
                
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Prescription Management:</strong> {selectedService?.prescriptionManagement ? "Yes" : "No"}
                </Typography>
              </Box>
            )}
            
            {/* Salon & Spa Specific Details */}
            {selectedService?.serviceType === "salon" && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Salon & Spa Details</Typography>
                <Typography variant="body1">
                  <strong>Appointment Settings:</strong>
                </Typography>
                <Typography variant="body2">
                  Advance Booking: {selectedService?.appointmentSettings?.advanceBooking} days
                </Typography>
                <Typography variant="body2">
                  Cancellation Policy: {selectedService?.appointmentSettings?.cancellationPolicy}
                </Typography>
                
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Staff Assignable:</strong> {selectedService?.staffAssignable ? "Yes" : "No"}
                </Typography>
              </Box>
            )}
            
            {/* Grocery Specific Details */}
            {selectedService?.serviceType === "grocery" && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Grocery Details</Typography>
                <Typography variant="body1">
                  <strong>Inventory Management:</strong>
                </Typography>
                <Typography variant="body2">
                  Perishable Tracking: {selectedService?.inventoryManagement?.perishableTracking ? "Yes" : "No"}
                </Typography>
                <Typography variant="body2">
                  Weight Based Pricing: {selectedService?.inventoryManagement?.weightBasedPricing ? "Yes" : "No"}
                </Typography>
                
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Delivery Options:</strong>
                </Typography>
                <Typography variant="body2">
                  Available: {selectedService?.deliveryOptions?.available ? "Yes" : "No"}
                </Typography>
                {selectedService?.deliveryOptions?.available && (
                  <Typography variant="body2">
                    Minimum Order: UGX {selectedService?.deliveryOptions?.minOrder?.toLocaleString()}
                  </Typography>
                )}
              </Box>
            )}
            
            {/* Event Management Specific Details */}
            {selectedService?.serviceType === "event" && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Event Details</Typography>
                <Typography variant="body1">
                  <strong>Venue Management:</strong>
                </Typography>
                <Typography variant="body2">
                  Capacity: {selectedService?.venueManagement?.capacity}
                </Typography>
                <Typography variant="body2">
                  Indoor: {selectedService?.venueManagement?.indoor ? "Yes" : "No"}
                </Typography>
                <Typography variant="body2">
                  Outdoor: {selectedService?.venueManagement?.outdoor ? "Yes" : "No"}
                </Typography>
                
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Ticket Management:</strong>
                </Typography>
                <Typography variant="body2">
                  Required: {selectedService?.ticketManagement?.required ? "Yes" : "No"}
                </Typography>
                {selectedService?.ticketManagement?.required && (
                  <Typography variant="body2">
                    Capacity: {selectedService?.ticketManagement?.capacity}
                  </Typography>
                )}
              </Box>
            )}
            
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
  const ServiceFormDialog = () => {
    const [formErrors, setFormErrors] = useState({
      name: false,
      category: false,
      subcategory: false,
      provider: false
    });

    const validateForm = () => {
      const errors = {
        name: !newService.name,
        category: !newService.category,
        subcategory: !newService.subcategory,
        provider: !newService.provider
      };
      setFormErrors(errors);
      return !Object.values(errors).some(error => error);
    };

    const handleFieldChange = (field, value) => {
      setNewService(prev => ({ ...prev, [field]: value }));
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: false }));
      }
    };

    const handleSave = () => {
      if (validateForm()) {
        if (isEditing) {
          handleSaveEditedService();
        } else {
          handleAddService();
        }
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
            {isEditing ? "Edit Service" : "Add New Service"}
            <IconButton onClick={handleDialogClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Service Type</FormLabel>
                <RadioGroup
                  row
                  value={newService.serviceType}
                  onChange={(e) => handleFieldChange('serviceType', e.target.value)}
                >
                  <FormControlLabel value="standard" control={<Radio />} label="Standard" />
                  <FormControlLabel value="hospitality" control={<Radio />} label="Hospitality" />
                  <FormControlLabel value="retail" control={<Radio />} label="Retail" />
                  <FormControlLabel value="healthcare" control={<Radio />} label="Healthcare" />
                  <FormControlLabel value="salon" control={<Radio />} label="Salon & Spa" />
                  <FormControlLabel value="grocery" control={<Radio />} label="Grocery" />
                  <FormControlLabel value="event" control={<Radio />} label="Event" />
                </RadioGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Service Name"
                value={newService.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={formErrors.name}
                helperText={formErrors.name ? "Service name is required" : ""}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formErrors.category}>
                <InputLabel>Category *</InputLabel>
                <Select
                  value={newService.category}
                  onChange={(e) => {
                    handleFieldChange('category', e.target.value);
                    handleFieldChange('subcategory', "");
                  }}
                  label="Category *"
                >
                  <MenuItem value=""><em>Select Category</em></MenuItem>
                  {Object.keys(serviceCategoryStructure).map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
                {formErrors.category && (
                  <Typography variant="caption" color="error">Category is required</Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formErrors.subcategory}>
                <InputLabel>Subcategory *</InputLabel>
                <Select
                  value={newService.subcategory}
                  onChange={(e) => handleFieldChange('subcategory', e.target.value)}
                  label="Subcategory *"
                  disabled={!newService.category}
                >
                  <MenuItem value=""><em>Select Subcategory</em></MenuItem>
                  {newService.category && serviceCategoryStructure[newService.category]?.map((subcat) => (
                    <MenuItem key={subcat} value={subcat}>{subcat}</MenuItem>
                  ))}
                </Select>
                {formErrors.subcategory && (
                  <Typography variant="caption" color="error">Subcategory is required</Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Provider/Company *"
                value={newService.provider}
                onChange={(e) => handleFieldChange('provider', e.target.value)}
                error={formErrors.provider}
                helperText={formErrors.provider ? "Provider is required" : ""}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Provider Rating (0-5)"
                type="number"
                inputProps={{ min: 0, max: 5, step: 0.1 }}
                value={newService.providerRating}
                onChange={(e) => handleFieldChange('providerRating', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (UGX)"
                type="number"
                value={newService.price}
                onChange={(e) => handleFieldChange('price', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={newService.duration}
                onChange={(e) => handleFieldChange('duration', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={newService.description}
                onChange={(e) => handleFieldChange('description', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body2">Service Rating</Typography>
              <Rating
                value={newService.rating}
                onChange={(e, newValue) => handleFieldChange('rating', newValue)}
                precision={0.5}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newService.available}
                    onChange={(e) => handleFieldChange('available', e.target.checked)}
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
                    onChange={(e) => handleFieldChange('requiresAppointment', e.target.checked)}
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
                onChange={(e) => handleFieldChange('maxParticipants', e.target.value)}
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
            
            {/* Hospitality Specific Fields */}
            {newService.serviceType === "hospitality" && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Hospitality Settings</Typography>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Hospitality Type</InputLabel>
                    <Select
                      value={newService.hospitalityType}
                      onChange={(e) => handleFieldChange('hospitalityType', e.target.value)}
                      label="Hospitality Type"
                    >
                      <MenuItem value="restaurant">Restaurant</MenuItem>
                      <MenuItem value="bar">Bar</MenuItem>
                      <MenuItem value="hotel">Hotel</MenuItem>
                      <MenuItem value="cafe">Cafe</MenuItem>
                    </Select>
                  </FormControl>
                  
                  {newService.hospitalityType === "restaurant" && (
                    <>
                      <Typography variant="body1" gutterBottom>Menu Items</Typography>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            fullWidth
                            label="Item Name"
                            value={newMenuItem.name}
                            onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Price (UGX)"
                            type="number"
                            value={newMenuItem.price}
                            onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <TextField
                            fullWidth
                            label="Category"
                            value={newMenuItem.category}
                            onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value})}
                          />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <Button 
                            variant="contained" 
                            onClick={handleAddMenuItem}
                            disabled={!newMenuItem.name || !newMenuItem.price || !newMenuItem.category}
                            sx={{ height: '100%', width: '100%' }}
                          >
                            Add
                          </Button>
                        </Grid>
                      </Grid>
                      
                      {newService.menuItems.length > 0 && (
                        <TableContainer component={Paper} sx={{ mb: 2 }}>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {newService.menuItems.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell align="right">{item.price}</TableCell>
                                  <TableCell>{item.category}</TableCell>
                                  <TableCell>
                                    <IconButton size="small" onClick={() => handleRemoveMenuItem(item.id)}>
                                      <Close />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                      
                      <Typography variant="body1" gutterBottom>Table Management</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Total Tables"
                            type="number"
                            value={newService.tableManagement.totalTables}
                            onChange={(e) => setNewService({
                              ...newService,
                              tableManagement: {
                                ...newService.tableManagement,
                                totalTables: e.target.value
                              }
                            })}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Available Tables"
                            type="number"
                            value={newService.tableManagement.availableTables}
                            onChange={(e) => setNewService({
                              ...newService,
                              tableManagement: {
                                ...newService.tableManagement,
                                availableTables: e.target.value
                              }
                            })}
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}
                  
                  {newService.hospitalityType === "hotel" && (
                    <>
                      <Typography variant="body1" gutterBottom>Room Management</Typography>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Total Rooms"
                            type="number"
                            value={newService.roomManagement.totalRooms}
                            onChange={(e) => setNewService({
                              ...newService,
                              roomManagement: {
                                ...newService.roomManagement,
                                totalRooms: e.target.value
                              }
                            })}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Available Rooms"
                            type="number"
                            value={newService.roomManagement.availableRooms}
                            onChange={(e) => setNewService({
                              ...newService,
                              roomManagement: {
                                ...newService.roomManagement,
                                availableRooms: e.target.value
                              }
                            })}
                          />
                        </Grid>
                      </Grid>
                      
                      <Typography variant="body1" gutterBottom>Room Types</Typography>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} sm={10}>
                          <TextField
                            fullWidth
                            label="Add Room Type"
                            value={newRoomType}
                            onChange={(e) => setNewRoomType(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Button 
                            variant="contained" 
                            onClick={handleAddRoomType}
                            disabled={!newRoomType}
                            sx={{ height: '100%', width: '100%' }}
                          >
                            Add
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {newService.roomManagement.roomTypes.map((type, index) => (
                              <Chip
                                key={index}
                                label={type}
                                onDelete={() => handleRemoveRoomType(type)}
                              />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Typography variant="body1" gutterBottom>Amenities</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={10}>
                          <TextField
                            fullWidth
                            label="Add Amenity"
                            value={newAmenity}
                            onChange={(e) => setNewAmenity(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Button 
                            variant="contained" 
                            onClick={handleAddAmenity}
                            disabled={!newAmenity}
                            sx={{ height: '100%', width: '100%' }}
                          >
                            Add
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {newService.roomManagement.amenities.map((amenity, index) => (
                              <Chip
                                key={index}
                                label={amenity}
                                onDelete={() => handleRemoveAmenity(amenity)}
                              />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Paper>
              </Grid>
            )}
            
            {/* Retail Specific Fields */}
            {newService.serviceType === "retail" && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Retail Settings</Typography>
                  
                  <Typography variant="body1" gutterBottom>Inventory Management</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Stock Quantity"
                        type="number"
                        value={newService.inventory.stock}
                        onChange={(e) => setNewService({
                          ...newService,
                          inventory: {
                            ...newService.inventory,
                            stock: e.target.value
                          }
                        })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Low Stock Alert"
                        type="number"
                        value={newService.inventory.lowStockAlert}
                        onChange={(e) => setNewService({
                          ...newService,
                          inventory: {
                            ...newService.inventory,
                            lowStockAlert: e.target.value
                          }
                        })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="SKU (Stock Keeping Unit)"
                        value={newService.inventory.sku}
                        onChange={(e) => setNewService({
                          ...newService,
                          inventory: {
                            ...newService.inventory,
                            sku: e.target.value
                          }
                        })}
                      />
                    </Grid>
                  </Grid>
                  
                  <Typography variant="body1" gutterBottom>Loyalty Program</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Points Awarded"
                        type="number"
                        value={newService.loyaltyProgram.points}
                        onChange={(e) => setNewService({
                          ...newService,
                          loyaltyProgram: {
                            ...newService.loyaltyProgram,
                            points: e.target.value
                          }
                        })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={newService.loyaltyProgram.discountEligible}
                            onChange={(e) => setNewService({
                              ...newService,
                              loyaltyProgram: {
                                ...newService.loyaltyProgram,
                                discountEligible: e.target.checked
                              }
                            })}
                            color="primary"
                          />
                        }
                        label="Discount Eligible"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}
            
            {/* Healthcare Specific Fields */}
            {newService.serviceType === "healthcare" && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Healthcare Settings</Typography>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Healthcare Type</InputLabel>
                    <Select
                      value={newService.healthcareType}
                      onChange={(e) => handleFieldChange('healthcareType', e.target.value)}
                      label="Healthcare Type"
                    >
                      <MenuItem value="pharmacy">Pharmacy</MenuItem>
                      <MenuItem value="clinic">Clinic</MenuItem>
                      <MenuItem value="dental">Dental</MenuItem>
                      <MenuItem value="optometry">Optometry</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Typography variant="body1" gutterBottom>Patient Management</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={newService.patientManagement.acceptsInsurance}
                            onChange={(e) => setNewService({
                              ...newService,
                              patientManagement: {
                                ...newService.patientManagement,
                                acceptsInsurance: e.target.checked
                              }
                            })}
                            color="primary"
                          />
                        }
                        label="Accepts Insurance"
                      />
                    </Grid>
                    
                    {newService.patientManagement.acceptsInsurance && (
                      <>
                        <Grid item xs={12} sm={10}>
                          <TextField
                            fullWidth
                            label="Add Insurance Provider"
                            value={newInsuranceProvider}
                            onChange={(e) => setNewInsuranceProvider(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Button 
                            variant="contained" 
                            onClick={handleAddInsuranceProvider}
                            disabled={!newInsuranceProvider}
                            sx={{ height: '100%', width: '100%' }}
                          >
                            Add
                          </Button>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {newService.patientManagement.insuranceProviders.map((provider, index) => (
                              <Chip
                                key={index}
                                label={provider}
                                onDelete={() => handleRemoveInsuranceProvider(provider)}
                              />
                            ))}
                          </Box>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  
                  <Typography variant="body1" gutterBottom>Prescription Management</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newService.prescriptionManagement}
                        onChange={(e) => setNewService({
                          ...newService,
                          prescriptionManagement: e.target.checked
                        })}
                        color="primary"
                      />
                    }
                    label="Prescription Management Enabled"
                  />
                </Paper>
              </Grid>
            )}
            
            {/* Salon & Spa Specific Fields */}
            {newService.serviceType === "salon" && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Salon & Spa Settings</Typography>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Salon Type</InputLabel>
                    <Select
                      value={newService.salonType}
                      onChange={(e) => handleFieldChange('salonType', e.target.value)}
                      label="Salon Type"
                    >
                      <MenuItem value="hair">Hair</MenuItem>
                      <MenuItem value="nails">Nails</MenuItem>
                      <MenuItem value="skin care">Skin Care</MenuItem>
                      <MenuItem value="massage">Massage</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Typography variant="body1" gutterBottom>Appointment Settings</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Advance Booking (days)"
                        type="number"
                        value={newService.appointmentSettings.advanceBooking}
                        onChange={(e) => setNewService({
                          ...newService,
                          appointmentSettings: {
                            ...newService.appointmentSettings,
                            advanceBooking: e.target.value
                          }
                        })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Cancellation Policy"
                        value={newService.appointmentSettings.cancellationPolicy}
                        onChange={(e) => setNewService({
                          ...newService,
                          appointmentSettings: {
                            ...newService.appointmentSettings,
                            cancellationPolicy: e.target.value
                          }
                        })}
                      />
                    </Grid>
                  </Grid>
                  
                  <Typography variant="body1" gutterBottom>Staff Assignment</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={newService.staffAssignable}
                        onChange={(e) => setNewService({
                          ...newService,
                          staffAssignable: e.target.checked
                        })}
                        color="primary"
                      />
                    }
                    label="Staff Assignable"
                  />
                </Paper>
              </Grid>
            )}
            
            {/* Grocery Specific Fields */}
            {newService.serviceType === "grocery" && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Grocery Settings</Typography>
                  
                  <Typography variant="body1" gutterBottom>Inventory Management</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={newService.inventoryManagement.perishableTracking}
                            onChange={(e) => setNewService({
                              ...newService,
                              inventoryManagement: {
                                ...newService.inventoryManagement,
                                perishableTracking: e.target.checked
                              }
                            })}
                            color="primary"
                          />
                        }
                        label="Perishable Tracking"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={newService.inventoryManagement.weightBasedPricing}
                            onChange={(e) => setNewService({
                              ...newService,
                              inventoryManagement: {
                                ...newService.inventoryManagement,
                                weightBasedPricing: e.target.checked
                              }
                            })}
                            color="primary"
                          />
                        }
                        label="Weight Based Pricing"
                      />
                    </Grid>
                  </Grid>
                  
                  <Typography variant="body1" gutterBottom>Delivery Options</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={newService.deliveryOptions.available}
                            onChange={(e) => setNewService({
                              ...newService,
                              deliveryOptions: {
                                ...newService.deliveryOptions,
                                available: e.target.checked
                              }
                            })}
                            color="primary"
                          />
                        }
                        label="Delivery Available"
                      />
                    </Grid>
                    {newService.deliveryOptions.available && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Minimum Order (UGX)"
                          type="number"
                          value={newService.deliveryOptions.minOrder}
                          onChange={(e) => setNewService({
                            ...newService,
                            deliveryOptions: {
                              ...newService.deliveryOptions,
                              minOrder: e.target.value
                            }
                          })}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            )}
            
            {/* Event Management Specific Fields */}
            {newService.serviceType === "event" && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Event Management Settings</Typography>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Event Type</InputLabel>
                    <Select
                      value={newService.eventType}
                      onChange={(e) => handleFieldChange('eventType', e.target.value)}
                      label="Event Type"
                    >
                      <MenuItem value="concert">Concert</MenuItem>
                      <MenuItem value="conference">Conference</MenuItem>
                      <MenuItem value="wedding">Wedding</MenuItem>
                      <MenuItem value="private party">Private Party</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Typography variant="body1" gutterBottom>Venue Management</Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Venue Capacity"
                        type="number"
                        value={newService.venueManagement.capacity}
                        onChange={(e) => setNewService({
                          ...newService,
                          venueManagement: {
                            ...newService.venueManagement,
                            capacity: e.target.value
                          }
                        })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={newService.venueManagement.indoor}
                            onChange={(e) => setNewService({
                              ...newService,
                              venueManagement: {
                                ...newService.venueManagement,
                                indoor: e.target.checked
                              }
                            })}
                            color="primary"
                          />
                        }
                        label="Indoor"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={newService.venueManagement.outdoor}
                            onChange={(e) => setNewService({
                              ...newService,
                              venueManagement: {
                                ...newService.venueManagement,
                                outdoor: e.target.checked
                              }
                            })}
                            color="primary"
                          />
                        }
                        label="Outdoor"
                      />
                    </Grid>
                  </Grid>
                  
                  <Typography variant="body1" gutterBottom>Ticket Management</Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={newService.ticketManagement.required}
                            onChange={(e) => setNewService({
                              ...newService,
                              ticketManagement: {
                                ...newService.ticketManagement,
                                required: e.target.checked
                              }
                            })}
                            color="primary"
                          />
                        }
                        label="Ticket Required"
                      />
                    </Grid>
                    {newService.ticketManagement.required && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Ticket Capacity"
                          type="number"
                          value={newService.ticketManagement.capacity}
                          onChange={(e) => setNewService({
                            ...newService,
                            ticketManagement: {
                              ...newService.ticketManagement,
                              capacity: e.target.value
                            }
                          })}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            )}
            
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
            onClick={handleSave}
            sx={{ backgroundColor: "purple", color: "white" }}
          >
            {isEditing ? "Save Changes" : "Save Service"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Manage Categories Dialog
  const ManageCategoriesDialog = () => {
    const [categoryError, setCategoryError] = useState(false);

    const handleSaveCategory = () => {
      if (!newCategory.name) {
        setCategoryError(true);
        return;
      }
      handleAddCategory();
    };

    return (
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
                label="Category Name *"
                value={newCategory.name}
                onChange={(e) => {
                  setNewCategory({...newCategory, name: e.target.value});
                  if (categoryError) setCategoryError(false);
                }}
                error={categoryError}
                helperText={categoryError ? "Category name is required" : ""}
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
            onClick={handleSaveCategory}
            sx={{ backgroundColor: "purple", color: "white" }}
          >
            Save Category
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Page Title and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Service Management</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setOpenServiceDialog(true);
              setIsEditing(false);
            }}
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
              max={2000000}
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
                    <Box display="flex" alignItems="center">
                      {getCategoryIcon(categoryName)}
                      <Typography variant="subtitle1" sx={{ ml: 1 }}>{categoryName}</Typography>
                    </Box>
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
                  setMaxPrice(2000000);
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
                          icon={getCategoryIcon(service.category)}
                        />
                        <Chip 
                          label={service.subcategory} 
                          size="small" 
                          variant="outlined" 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {service.tags?.slice(0, 3).map((tag, index) => (
                          <Chip key={index} label={tag} size="small" />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                      {service.price && (
                        <Typography variant="h6" color="primary">
                          UGX {service.price.toLocaleString()}
                        </Typography>
                      )}
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