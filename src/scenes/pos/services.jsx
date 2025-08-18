"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
  ThemeProvider,
  createTheme,
} from "@mui/material"
import {
  Add,
  Category,
  Star,
  Favorite,
  Visibility,
  Close,
  Restaurant,
  LocalHospital,
  ContentCut,
  ShoppingCart,
  Event,
  Home,
  Business,
  Spa,
  DirectionsCar,
  School,
  FitnessCenter,
  LocalPharmacy,
  Hotel,
  LocalBar,
  LocalCafe,
  Healing,
  Groups,
  MusicNote,
} from "@mui/icons-material"

const industryStandards = {
  "Restaurant & Food Service": {
    icon: <Restaurant />,
    primaryColor: "#FF6B35",
    secondaryColor: "#F7931E",
    categories: {
      "Fine Dining": ["Tasting Menu", "Wine Pairing", "Private Dining", "Chef's Table"],
      "Casual Dining": ["Family Style", "Bar & Grill", "Bistro", "Cafe"],
      "Fast Food": ["Quick Service", "Drive-Through", "Counter Service", "Food Truck"],
      "Specialty Food": ["Pizza", "Sushi", "BBQ", "Bakery", "Ice Cream"],
      Catering: ["Corporate Events", "Weddings", "Private Parties", "Buffet Service"],
      "Bars & Nightlife": ["Sports Bar", "Cocktail Lounge", "Wine Bar", "Nightclub"],
    },
  },
  "Healthcare & Medical": {
    icon: <LocalHospital />,
    primaryColor: "#2E86AB",
    secondaryColor: "#A23B72",
    categories: {
      "Primary Care": ["Family Medicine", "Internal Medicine", "Pediatrics", "Geriatrics"],
      "Specialty Care": ["Cardiology", "Dermatology", "Orthopedics", "Neurology"],
      "Mental Health": ["Psychiatry", "Psychology", "Counseling", "Therapy"],
      "Dental Care": ["General Dentistry", "Orthodontics", "Oral Surgery", "Cosmetic Dentistry"],
      "Vision Care": ["Optometry", "Ophthalmology", "Contact Lenses", "Eye Surgery"],
      Pharmacy: ["Prescription Filling", "Medication Counseling", "Immunizations", "Health Screenings"],
    },
  },
  "Beauty & Wellness": {
    icon: <Spa />,
    primaryColor: "#E91E63",
    secondaryColor: "#FF4081",
    categories: {
      "Hair Services": ["Haircuts", "Coloring", "Styling", "Extensions", "Treatments"],
      "Nail Services": ["Manicures", "Pedicures", "Nail Art", "Gel Polish", "Acrylics"],
      "Skin Care": ["Facials", "Chemical Peels", "Microdermabrasion", "Anti-Aging", "Acne Treatment"],
      "Spa Services": ["Massage Therapy", "Body Wraps", "Aromatherapy", "Hot Stone", "Reflexology"],
      "Aesthetic Services": ["Botox", "Fillers", "Laser Treatments", "IPL", "Body Contouring"],
      Wellness: ["Meditation", "Yoga", "Reiki", "Acupuncture", "Nutrition Counseling"],
    },
  },
  "Retail & Shopping": {
    icon: <ShoppingCart />,
    primaryColor: "#4CAF50",
    secondaryColor: "#8BC34A",
    categories: {
      "Clothing & Fashion": ["Women's Apparel", "Men's Apparel", "Children's Clothing", "Accessories", "Shoes"],
      Electronics: ["Smartphones", "Computers", "Gaming", "Audio/Video", "Smart Home"],
      "Home & Garden": ["Furniture", "Decor", "Appliances", "Tools", "Gardening"],
      "Sports & Recreation": ["Athletic Wear", "Equipment", "Outdoor Gear", "Fitness", "Team Sports"],
      "Books & Media": ["Books", "Music", "Movies", "Games", "Educational Materials"],
      "Specialty Retail": ["Jewelry", "Gifts", "Art & Crafts", "Pet Supplies", "Toys"],
    },
  },
  "Professional Services": {
    icon: <Business />,
    primaryColor: "#3F51B5",
    secondaryColor: "#2196F3",
    categories: {
      "Legal Services": ["Corporate Law", "Family Law", "Criminal Defense", "Real Estate Law", "Personal Injury"],
      "Financial Services": ["Accounting", "Tax Preparation", "Financial Planning", "Insurance", "Banking"],
      Consulting: ["Business Consulting", "IT Consulting", "Marketing", "HR Consulting", "Strategy"],
      "Real Estate": ["Residential Sales", "Commercial Sales", "Property Management", "Appraisals", "Rentals"],
      Insurance: ["Auto Insurance", "Home Insurance", "Life Insurance", "Business Insurance", "Health Insurance"],
      "Marketing & Advertising": ["Digital Marketing", "Print Advertising", "Social Media", "Branding", "PR"],
    },
  },
  "Home Services": {
    icon: <Home />,
    primaryColor: "#FF9800",
    secondaryColor: "#FFC107",
    categories: {
      "Maintenance & Repair": ["Plumbing", "Electrical", "HVAC", "Roofing", "Flooring"],
      "Cleaning Services": ["House Cleaning", "Carpet Cleaning", "Window Cleaning", "Pressure Washing", "Janitorial"],
      Landscaping: ["Lawn Care", "Garden Design", "Tree Service", "Irrigation", "Hardscaping"],
      "Home Improvement": ["Kitchen Remodeling", "Bathroom Remodeling", "Painting", "Flooring", "Roofing"],
      "Security & Safety": ["Security Systems", "Locksmith", "Fire Safety", "Pest Control", "Home Inspection"],
      "Moving & Storage": ["Local Moving", "Long Distance Moving", "Storage Units", "Packing Services", "Delivery"],
    },
  },
  "Automotive Services": {
    icon: <DirectionsCar />,
    primaryColor: "#607D8B",
    secondaryColor: "#9E9E9E",
    categories: {
      "Auto Repair": ["Engine Repair", "Brake Service", "Transmission", "Electrical", "Diagnostics"],
      "Auto Maintenance": ["Oil Changes", "Tire Service", "Battery Service", "Tune-ups", "Inspections"],
      "Auto Detailing": ["Exterior Wash", "Interior Cleaning", "Waxing", "Paint Protection", "Ceramic Coating"],
      "Auto Sales": ["New Car Sales", "Used Car Sales", "Financing", "Trade-ins", "Leasing"],
      "Specialty Services": ["Towing", "Roadside Assistance", "Auto Glass", "Custom Work", "Performance Tuning"],
      "Fleet Services": ["Fleet Maintenance", "Commercial Vehicles", "Truck Repair", "Fleet Management", "Leasing"],
    },
  },
  "Education & Training": {
    icon: <School />,
    primaryColor: "#9C27B0",
    secondaryColor: "#E1BEE7",
    categories: {
      "Academic Education": ["Elementary", "Secondary", "Higher Education", "Vocational Training", "Online Learning"],
      "Professional Training": [
        "Corporate Training",
        "Certification Programs",
        "Skills Development",
        "Leadership Training",
      ],
      "Specialized Learning": ["Language Learning", "Music Lessons", "Art Classes", "Dance Classes", "Sports Training"],
      "Test Preparation": ["SAT/ACT Prep", "Professional Exams", "Language Proficiency", "Entrance Exams"],
      "Tutoring Services": ["Math Tutoring", "Science Tutoring", "Language Arts", "Special Needs", "Group Sessions"],
      "Educational Support": ["Career Counseling", "Academic Planning", "Study Skills", "Learning Disabilities"],
    },
  },
  "Fitness & Recreation": {
    icon: <FitnessCenter />,
    primaryColor: "#FF5722",
    secondaryColor: "#FF8A65",
    categories: {
      "Gym & Fitness": ["Personal Training", "Group Classes", "Weight Training", "Cardio", "Functional Fitness"],
      "Sports Activities": ["Team Sports", "Individual Sports", "Youth Sports", "Adult Leagues", "Tournaments"],
      "Outdoor Recreation": ["Hiking", "Camping", "Water Sports", "Adventure Tours", "Nature Programs"],
      "Wellness Programs": ["Yoga Classes", "Meditation", "Nutrition Counseling", "Stress Management"],
      "Specialized Fitness": [
        "Martial Arts",
        "Dance Fitness",
        "Senior Fitness",
        "Rehabilitation",
        "Athletic Performance",
      ],
      "Recreation Facilities": ["Swimming Pools", "Tennis Courts", "Golf Courses", "Recreation Centers", "Parks"],
    },
  },
  "Entertainment & Events": {
    icon: <Event />,
    primaryColor: "#E91E63",
    secondaryColor: "#F06292",
    categories: {
      "Event Planning": ["Weddings", "Corporate Events", "Birthday Parties", "Conferences", "Trade Shows"],
      "Entertainment Services": ["DJ Services", "Live Music", "Photography", "Videography", "Entertainment Acts"],
      "Venue Services": ["Event Venues", "Catering", "Equipment Rental", "Decoration", "Lighting & Sound"],
      "Recreational Events": ["Sports Events", "Community Events", "Festivals", "Concerts", "Theater Productions"],
      "Specialized Events": ["Cultural Events", "Religious Ceremonies", "Fundraisers", "Product Launches"],
      "Event Support": ["Event Coordination", "Vendor Management", "Logistics", "Security", "Cleanup Services"],
    },
  },
}

const createBusinessTheme = (businessType) => {
  const businessData = industryStandards[businessType]
  if (!businessData) return createTheme()

  return createTheme({
    palette: {
      primary: {
        main: businessData.primaryColor,
      },
      secondary: {
        main: businessData.secondaryColor,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderLeft: `4px solid ${businessData.primaryColor}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          contained: {
            background: `linear-gradient(45deg, ${businessData.primaryColor}, ${businessData.secondaryColor})`,
          },
        },
      },
    },
  })
}

const ServicesPage = () => {
  const [selectedBusinessType, setSelectedBusinessType] = useState("")
  const [showBusinessTypeSelector, setShowBusinessTypeSelector] = useState(true)

  // State management
  const [services, setServices] = useState([])
  const [filteredServices, setFilteredServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [category, setCategory] = useState("")
  const [subcategory, setSubcategory] = useState("")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(2000000)
  const [rating, setRating] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [openServiceDialog, setOpenServiceDialog] = useState(false)
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false)
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
      tableLayout: "",
    },
    roomManagement: {
      totalRooms: 0,
      availableRooms: 0,
      roomTypes: [],
      amenities: [],
    },
    inventory: {
      stock: 0,
      lowStockAlert: 5,
      sku: "",
    },
    loyaltyProgram: {
      points: 0,
      discountEligible: false,
    },
    healthcareType: "",
    patientManagement: {
      acceptsInsurance: false,
      insuranceProviders: [],
    },
    prescriptionManagement: false,
    salonType: "",
    appointmentSettings: {
      advanceBooking: 1,
      cancellationPolicy: "24 hours",
    },
    staffAssignable: false,
    inventoryManagement: {
      perishableTracking: false,
      weightBasedPricing: false,
    },
    deliveryOptions: {
      available: false,
      minOrder: 0,
    },
    eventType: "",
    venueManagement: {
      capacity: 0,
      indoor: false,
      outdoor: false,
    },
    ticketManagement: {
      required: false,
      capacity: 0,
    },
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [newCategory, setNewCategory] = useState({
    name: "",
    subcategories: [],
  })
  const [newSubcategory, setNewSubcategory] = useState("")
  const [favorites, setFavorites] = useState([])
  const [expandedCategories, setExpandedCategories] = useState({})
  const [activeTab, setActiveTab] = useState(0)
  const [newTag, setNewTag] = useState("")
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    price: "",
    category: "",
  })
  const [newRoomType, setNewRoomType] = useState("")
  const [newAmenity, setNewAmenity] = useState("")
  const [newInsuranceProvider, setNewInsuranceProvider] = useState("")

  const handleBusinessTypeSelection = (businessType) => {
    setSelectedBusinessType(businessType)
    setShowBusinessTypeSelector(false)
    // Reset filters and form when business type changes
    setCategory("")
    setSubcategory("")
    setNewService((prev) => ({
      ...prev,
      category: "",
      subcategory: "",
      serviceType: getDefaultServiceType(businessType),
    }))
  }

  const getDefaultServiceType = (businessType) => {
    const serviceTypeMap = {
      "Restaurant & Food Service": "hospitality",
      "Healthcare & Medical": "healthcare",
      "Beauty & Wellness": "salon",
      "Retail & Shopping": "retail",
      "Entertainment & Events": "event",
      "Home Services": "standard",
      "Professional Services": "standard",
      "Automotive Services": "standard",
      "Education & Training": "standard",
      "Fitness & Recreation": "standard",
    }
    return serviceTypeMap[businessType] || "standard"
  }

  const getCurrentCategories = () => {
    if (!selectedBusinessType || !industryStandards[selectedBusinessType]) {
      return {}
    }
    return industryStandards[selectedBusinessType].categories
  }

  // Apply filters whenever filter criteria change
  useEffect(() => {
    let filtered = [...services]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
          service.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter((service) => service.category === category)
    }

    // Filter by subcategory
    if (subcategory) {
      filtered = filtered.filter((service) => service.subcategory === subcategory)
    }

    // Filter by price range
    filtered = filtered.filter((service) => service.price >= minPrice && service.price <= maxPrice)

    // Filter by rating
    if (rating > 0) {
      filtered = filtered.filter((service) => service.rating >= rating)
    }

    // Filter by active tab
    if (activeTab === 1) {
      // Favorites
      filtered = filtered.filter((service) => favorites.includes(service.id))
    } else if (activeTab === 2) {
      // Popular Services
      filtered = filtered.filter((service) => service.rating >= 4.0)
    }

    setFilteredServices(filtered)
  }, [services, searchTerm, category, subcategory, minPrice, maxPrice, rating, activeTab, favorites])

  // Sample data initialization
  useEffect(() => {
    const sampleServices = [
      {
        id: 1,
        name: "Premium Hair Styling",
        category: "Beauty & Wellness",
        subcategory: "Hair Salon",
        price: 150000,
        duration: 120,
        rating: 4.8,
        provider: "Glamour Studio",
        providerRating: 4.9,
        available: true,
        description: "Professional hair styling with premium products and expert stylists.",
        requiresAppointment: true,
        maxParticipants: "1",
        tags: ["Premium", "Styling", "Professional"],
        image: "/hair-salon-styling.png",
        serviceType: "salon",
        salonType: "hair",
        appointmentSettings: {
          advanceBooking: 2,
          cancellationPolicy: "24 hours",
        },
        staffAssignable: true,
      },
      {
        id: 2,
        name: "Fine Dining Experience",
        category: "Hospitality",
        subcategory: "Restaurant",
        price: 250000,
        duration: 180,
        rating: 4.9,
        provider: "Le Gourmet",
        providerRating: 4.8,
        available: true,
        description: "Exquisite fine dining experience with chef's special menu.",
        requiresAppointment: true,
        maxParticipants: "8",
        tags: ["Fine Dining", "Chef Special", "Premium"],
        image: "/fine-dining-restaurant.png",
        serviceType: "hospitality",
        hospitalityType: "restaurant",
        menuItems: [
          { name: "Appetizer Platter", price: "45000", category: "Starters" },
          { name: "Grilled Salmon", price: "85000", category: "Main Course" },
        ],
        tableManagement: {
          totalTables: 20,
          availableTables: 15,
          tableLayout: "Indoor & Outdoor",
        },
      },
    ]
    setServices(sampleServices)
  }, [])

  // Event handlers
  const handleAddService = () => {
    const currentCategories = getCurrentCategories()
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
      serviceType: getDefaultServiceType(selectedBusinessType),
      hospitalityType: "",
      menuItems: [],
      tableManagement: {
        totalTables: 0,
        availableTables: 0,
        tableLayout: "",
      },
      roomManagement: {
        totalRooms: 0,
        availableRooms: 0,
        roomTypes: [],
        amenities: [],
      },
      inventory: {
        stock: 0,
        lowStockAlert: 5,
        sku: "",
      },
      loyaltyProgram: {
        points: 0,
        discountEligible: false,
      },
      healthcareType: "",
      patientManagement: {
        acceptsInsurance: false,
        insuranceProviders: [],
      },
      prescriptionManagement: false,
      salonType: "",
      appointmentSettings: {
        advanceBooking: 1,
        cancellationPolicy: "24 hours",
      },
      staffAssignable: false,
      inventoryManagement: {
        perishableTracking: false,
        weightBasedPricing: false,
      },
      deliveryOptions: {
        available: false,
        minOrder: 0,
      },
      eventType: "",
      venueManagement: {
        capacity: 0,
        indoor: false,
        outdoor: false,
      },
      ticketManagement: {
        required: false,
        capacity: 0,
      },
    })
    setIsEditing(false)
    setOpenServiceDialog(true)
  }

  const handleEditService = (service) => {
    setNewService(service)
    setIsEditing(true)
    setEditingServiceId(service.id)
    setOpenServiceDialog(true)
  }

  const handleSaveEditedService = () => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === editingServiceId
          ? {
              ...newService,
              price: Number.parseFloat(newService.price) || 0,
              duration: Number.parseInt(newService.duration) || 0,
            }
          : service,
      ),
    )
    setSnackbar({
      open: true,
      message: "Service updated successfully!",
      severity: "success",
    })
    handleDialogClose()
  }

  const handleDeleteService = (serviceId) => {
    setServices((prev) => prev.filter((service) => service.id !== serviceId))
    setSnackbar({
      open: true,
      message: "Service deleted successfully!",
      severity: "success",
    })
  }

  const handleDialogClose = () => {
    setOpenServiceDialog(false)
    setOpenCategoryDialog(false)
    setSelectedService(null)
    setIsEditing(false)
    setEditingServiceId(null)
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
        tableLayout: "",
      },
      roomManagement: {
        totalRooms: 0,
        availableRooms: 0,
        roomTypes: [],
        amenities: [],
      },
      inventory: {
        stock: 0,
        lowStockAlert: 5,
        sku: "",
      },
      loyaltyProgram: {
        points: 0,
        discountEligible: false,
      },
      healthcareType: "",
      patientManagement: {
        acceptsInsurance: false,
        insuranceProviders: [],
      },
      prescriptionManagement: false,
      salonType: "",
      appointmentSettings: {
        advanceBooking: 1,
        cancellationPolicy: "24 hours",
      },
      staffAssignable: false,
      inventoryManagement: {
        perishableTracking: false,
        weightBasedPricing: false,
      },
      deliveryOptions: {
        available: false,
        minOrder: 0,
      },
      eventType: "",
      venueManagement: {
        capacity: 0,
        indoor: false,
        outdoor: false,
      },
      ticketManagement: {
        required: false,
        capacity: 0,
      },
    })
    setNewCategory({ name: "", subcategories: [] })
  }

  const handleSort = (event) => {
    const sortBy = event.target.value
    const sortedServices = [...filteredServices]

    switch (sortBy) {
      case "nameAsc":
        sortedServices.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "nameDesc":
        sortedServices.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "priceAsc":
        sortedServices.sort((a, b) => a.price - b.price)
        break
      case "priceDesc":
        sortedServices.sort((a, b) => b.price - a.price)
        break
      case "ratingAsc":
        sortedServices.sort((a, b) => a.rating - b.rating)
        break
      case "ratingDesc":
        sortedServices.sort((a, b) => b.rating - a.rating)
        break
      case "durationAsc":
        sortedServices.sort((a, b) => a.duration - b.duration)
        break
      case "durationDesc":
        sortedServices.sort((a, b) => b.duration - a.duration)
        break
      default:
        break
    }

    setFilteredServices(sortedServices)
  }

  const handleToggleFavorite = (serviceId) => {
    setFavorites((prev) => (prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]))
  }

  const handleAddCategory = () => {
    // This would typically update the serviceCategoryStructure
    // For now, we'll just show a success message
    setSnackbar({
      open: true,
      message: "Category added successfully!",
      severity: "success",
    })
    handleDialogClose()
  }

  const handleAddSubcategory = () => {
    if (newSubcategory && !newCategory.subcategories.includes(newSubcategory)) {
      setNewCategory((prev) => ({
        ...prev,
        subcategories: [...prev.subcategories, newSubcategory],
      }))
      setNewSubcategory("")
    }
  }

  const handleRemoveSubcategory = (subcategoryToRemove) => {
    setNewCategory((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((sub) => sub !== subcategoryToRemove),
    }))
  }

  const handleAddTag = () => {
    if (newTag && !newService.tags.includes(newTag)) {
      setNewService((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setNewService((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewService((prev) => ({
          ...prev,
          image: file,
          imagePreview: e.target.result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }

  const toggleCategoryExpansion = (categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }))
  }

  // Helper functions for icons
  const getHospitalityIcon = (type) => {
    switch (type) {
      case "restaurant":
        return <Restaurant />
      case "bar":
        return <LocalBar />
      case "hotel":
        return <Hotel />
      case "cafe":
        return <LocalCafe />
      default:
        return <Restaurant />
    }
  }

  const getHealthcareIcon = (type) => {
    switch (type) {
      case "pharmacy":
        return <LocalPharmacy />
      case "clinic":
        return <LocalHospital />
      case "dental":
        return <Healing />
      case "optometry":
        return <Visibility />
      default:
        return <LocalHospital />
    }
  }

  const getSalonIcon = (type) => {
    switch (type) {
      case "hair":
        return <ContentCut />
      case "nails":
        return <Star />
      case "spa":
        return <Spa />
      default:
        return <ContentCut />
    }
  }

  const getEventIcon = (type) => {
    switch (type) {
      case "concert":
        return <MusicNote />
      case "conference":
        return <Groups />
      case "wedding":
        return <Favorite />
      case "party":
        return <Event />
      default:
        return <Event />
    }
  }

  // Menu item management
  const handleAddMenuItem = () => {
    if (newMenuItem.name && newMenuItem.price) {
      setNewService((prev) => ({
        ...prev,
        menuItems: [...prev.menuItems, { ...newMenuItem, id: Date.now() }],
      }))
      setNewMenuItem({ name: "", price: "", category: "" })
    }
  }

  const handleRemoveMenuItem = (itemId) => {
    setNewService((prev) => ({
      ...prev,
      menuItems: prev.menuItems.filter((item) => item.id !== itemId),
    }))
  }

  // Room type management
  const handleAddRoomType = () => {
    if (newRoomType && !newService.roomManagement.roomTypes.includes(newRoomType)) {
      setNewService((prev) => ({
        ...prev,
        roomManagement: {
          ...prev.roomManagement,
          roomTypes: [...prev.roomManagement.roomTypes, newRoomType],
        },
      }))
      setNewRoomType("")
    }
  }

  const handleRemoveRoomType = (roomType) => {
    setNewService((prev) => ({
      ...prev,
      roomManagement: {
        ...prev.roomManagement,
        roomTypes: prev.roomManagement.roomTypes.filter((type) => type !== roomType),
      },
    }))
  }

  // Amenity management
  const handleAddAmenity = () => {
    if (newAmenity && !newService.roomManagement.amenities.includes(newAmenity)) {
      setNewService((prev) => ({
        ...prev,
        roomManagement: {
          ...prev.roomManagement,
          amenities: [...prev.roomManagement.amenities, newAmenity],
        },
      }))
      setNewAmenity("")
    }
  }

  const handleRemoveAmenity = (amenity) => {
    setNewService((prev) => ({
      ...prev,
      roomManagement: {
        ...prev.roomManagement,
        amenities: prev.roomManagement.amenities.filter((a) => a !== amenity),
      },
    }))
  }

  // Insurance provider management
  const handleAddInsuranceProvider = () => {
    if (newInsuranceProvider && !newService.patientManagement.insuranceProviders.includes(newInsuranceProvider)) {
      setNewService((prev) => ({
        ...prev,
        patientManagement: {
          ...prev.patientManagement,
          insuranceProviders: [...prev.patientManagement.insuranceProviders, newInsuranceProvider],
        },
      }))
      setNewInsuranceProvider("")
    }
  }

  const handleRemoveInsuranceProvider = (provider) => {
    setNewService((prev) => ({
      ...prev,
      patientManagement: {
        ...prev.patientManagement,
        insuranceProviders: prev.patientManagement.insuranceProviders.filter((p) => p !== provider),
      },
    }))
  }

  const BusinessTypeSelector = () => (
    <Dialog open={showBusinessTypeSelector} maxWidth="lg" fullWidth disableEscapeKeyDown>
      <DialogTitle>
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 1 }}>
          Select Your Business Type
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary">
          Choose the industry that best describes your business to see relevant service categories
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>
          {Object.entries(industryStandards).map(([businessType, data]) => (
            <Grid item xs={12} sm={6} md={4} key={businessType}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                    borderColor: data.primaryColor,
                    borderWidth: 2,
                  },
                  border: "2px solid transparent",
                }}
                onClick={() => handleBusinessTypeSelection(businessType)}
              >
                <CardContent sx={{ textAlign: "center", py: 4, flexGrow: 1 }}>
                  <Box
                    sx={{
                      fontSize: 64,
                      color: data.primaryColor,
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {data.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    {businessType}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {Object.keys(data.categories).length} categories available
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  )

  const ServiceFormDialog = () => {
    const [formErrors, setFormErrors] = useState({
      name: false,
      category: false,
      subcategory: false,
      provider: false,
    })

    const validateForm = () => {
      const errors = {
        name: !newService.name.trim(),
        category: !newService.category,
        subcategory: !newService.subcategory,
        provider: !newService.provider.trim(),
      }
      setFormErrors(errors)
      return !Object.values(errors).some((error) => error)
    }

    const handleFieldChange = (field, value) => {
      setNewService((prev) => ({ ...prev, [field]: value }))
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: false }))
      }
    }

    const handleSave = () => {
      if (validateForm()) {
        if (isEditing) {
          handleSaveEditedService()
        } else {
          handleAddService()
        }
      }
    }

    const currentCategories = getCurrentCategories()

    return (
      <Dialog
        open={openServiceDialog && (isEditing || !selectedService)}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              {industryStandards[selectedBusinessType]?.icon}
              <Typography variant="h6" sx={{ ml: 1 }}>
                {isEditing ? "Edit Service" : `Add New ${selectedBusinessType} Service`}
              </Typography>
            </Box>
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
                label="Service Name"
                value={newService.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                error={formErrors.name}
                helperText={formErrors.name ? "Service name is required" : ""}
                required
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formErrors.category} variant="outlined">
                <InputLabel>Category *</InputLabel>
                <Select
                  value={newService.category}
                  onChange={(e) => {
                    handleFieldChange("category", e.target.value)
                    handleFieldChange("subcategory", "")
                  }}
                  label="Category *"
                >
                  <MenuItem value="">
                    <em>Select Category</em>
                  </MenuItem>
                  {Object.keys(currentCategories).map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.category && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    Category is required
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formErrors.subcategory} variant="outlined">
                <InputLabel>Subcategory *</InputLabel>
                <Select
                  value={newService.subcategory}
                  onChange={(e) => handleFieldChange("subcategory", e.target.value)}
                  label="Subcategory *"
                  disabled={!newService.category}
                >
                  <MenuItem value="">
                    <em>Select Subcategory</em>
                  </MenuItem>
                  {newService.category &&
                    currentCategories[newService.category]?.map((subcat) => (
                      <MenuItem key={subcat} value={subcat}>
                        {subcat}
                      </MenuItem>
                    ))}
                </Select>
                {formErrors.subcategory && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    Subcategory is required
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Service Provider"
                value={newService.provider}
                onChange={(e) => handleFieldChange("provider", e.target.value)}
                error={formErrors.provider}
                helperText={formErrors.provider ? "Provider name is required" : ""}
                required
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price (UGX)"
                type="number"
                value={newService.price}
                onChange={(e) => handleFieldChange("price", e.target.value)}
                variant="outlined"
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newService.description}
                onChange={(e) => handleFieldChange("description", e.target.value)}
                variant="outlined"
                placeholder={`Describe your ${selectedBusinessType.toLowerCase()} service...`}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={newService.duration}
                onChange={(e) => handleFieldChange("duration", e.target.value)}
                variant="outlined"
                InputProps={{
                  inputProps: { min: 1 },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Participants"
                type="number"
                value={newService.maxParticipants}
                onChange={(e) => handleFieldChange("maxParticipants", e.target.value)}
                variant="outlined"
                InputProps={{
                  inputProps: { min: 1 },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newService.available}
                    onChange={(e) => handleFieldChange("available", e.target.checked)}
                  />
                }
                label="Service Available"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newService.requiresAppointment}
                    onChange={(e) => handleFieldChange("requiresAppointment", e.target.checked)}
                  />
                }
                label="Requires Appointment"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleDialogClose} size="large">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} size="large" sx={{ minWidth: 120 }}>
            {isEditing ? "Update Service" : "Add Service"}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const currentTheme = selectedBusinessType ? createBusinessTheme(selectedBusinessType) : createTheme()

  return (
    <ThemeProvider theme={currentTheme}>
      <Box sx={{ padding: 3, minHeight: "100vh", backgroundColor: "background.default" }}>
        {/* Business Type Selector */}
        <BusinessTypeSelector />

        {selectedBusinessType && (
          <Paper
            sx={{
              p: 3,
              mb: 3,
              background: `linear-gradient(135deg, ${industryStandards[selectedBusinessType].primaryColor}, ${industryStandards[selectedBusinessType].secondaryColor})`,
              color: "white",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ fontSize: 48 }}>{industryStandards[selectedBusinessType].icon}</Box>
                <Box sx={{ ml: 3 }}>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {selectedBusinessType}
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Service Management System
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                sx={{
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderColor: "white",
                  },
                }}
                onClick={() => setShowBusinessTypeSelector(true)}
              >
                Change Business Type
              </Button>
            </Box>
          </Paper>
        )}

        {/* Page Title and Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Service Management
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddService}
              disabled={!selectedBusinessType}
              size="large"
            >
              Add Service
            </Button>
            <Button
              variant="outlined"
              startIcon={<Category />}
              onClick={() => setOpenCategoryDialog(true)}
              disabled={!selectedBusinessType}
              size="large"
            >
              Manage Categories
            </Button>
          </Box>
        </Box>

        {/* Service Form Dialog */}
        <ServiceFormDialog />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  )
}

export default ServicesPage
