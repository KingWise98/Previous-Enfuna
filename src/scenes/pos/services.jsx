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
  createTheme,
  Container,
  FormHelperText,
  Chip,
  CardActions,
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
  Edit,
  Delete,
  Schedule,
  BookOnline,
} from "@mui/icons-material"

const serviceDetails = {
  "Restaurant & Food Service": {
    "Fine Dining": {
      "Tasting Menu": {
        description: "Multi-course culinary experience featuring seasonal ingredients and chef's specialties",
        industryStandards: "7-12 courses, wine pairings available, 2-3 hour dining experience",
        features: ["Advance reservations required", "Dietary restrictions accommodated", "Sommelier service"],
        bookingEnabled: true,
        image: "/fine-dining-restaurant.png",
      },
      "Wine Pairing": {
        description: "Expert sommelier-selected wines paired with each course of your meal",
        industryStandards: "3-8 wine selections, educational tasting notes, premium glassware",
        features: ["Sommelier consultation", "Educational experience", "Premium wine selection"],
        bookingEnabled: true,
        image: "/wine-pairing.png",
      },
      "Private Dining": {
        description: "Exclusive dining experience in a private setting for special occasions",
        industryStandards: "2-20 guests, customized menu, dedicated service staff",
        features: ["Customizable menu", "Private room", "Dedicated server", "Special occasion setup"],
        bookingEnabled: true,
        image: "/private-dining.png",
      },
    },
    "Casual Dining": {
      "Family Style": {
        description: "Comfortable dining experience perfect for families and groups",
        industryStandards: "Shared portions, kid-friendly options, relaxed atmosphere",
        features: ["Kids menu available", "High chairs provided", "Group seating", "Quick service"],
        bookingEnabled: true,
        image: "/family-dining.png",
      },
    },
  },
  "Healthcare & Medical": {
    "Primary Care": {
      "Family Medicine": {
        description: "Comprehensive healthcare for patients of all ages and medical conditions",
        industryStandards: "Board-certified physicians, preventive care, chronic disease management",
        features: ["Same-day appointments", "Telehealth available", "Electronic health records", "Insurance accepted"],
        bookingEnabled: true,
        image: "/family-medicine.png",
      },
      Pediatrics: {
        description: "Specialized medical care for infants, children, and adolescents",
        industryStandards: "Board-certified pediatricians, immunizations, growth monitoring",
        features: ["Well-child visits", "Immunization schedules", "Developmental screenings", "Parent education"],
        bookingEnabled: true,
        image: "/pediatrics.png",
      },
    },
    "Specialty Care": {
      Cardiology: {
        description: "Expert diagnosis and treatment of heart and cardiovascular conditions",
        industryStandards: "Board-certified cardiologists, advanced diagnostics, treatment plans",
        features: ["EKG testing", "Stress tests", "Echocardiograms", "Cardiac catheterization"],
        bookingEnabled: true,
        image: "/cardiology.png",
      },
    },
  },
  "Beauty & Wellness": {
    "Hair Services": {
      Haircuts: {
        description: "Professional hair cutting and styling services for all hair types",
        industryStandards: "Licensed stylists, consultation included, styling products used",
        features: ["Style consultation", "Wash and blow-dry included", "Product recommendations", "Styling tips"],
        bookingEnabled: true,
        image: "/hair-salon-styling.png",
      },
      Coloring: {
        description: "Expert hair coloring services including highlights, lowlights, and full color",
        industryStandards: "Professional color products, strand testing, color protection",
        features: ["Color consultation", "Strand test", "Toner application", "Color maintenance advice"],
        bookingEnabled: true,
        image: "/hair-coloring.png",
      },
    },
    "Spa Services": {
      "Massage Therapy": {
        description: "Therapeutic massage services for relaxation and muscle tension relief",
        industryStandards: "Licensed massage therapists, various techniques, clean facilities",
        features: ["Multiple massage types", "Aromatherapy options", "Hot stone available", "Couples massage"],
        bookingEnabled: true,
        image: "/massage-therapy.png",
      },
    },
  },
  "Retail & Shopping": {
    "Clothing & Fashion": {
      "Women's Apparel": {
        description: "Trendy and classic women's clothing for all occasions and sizes",
        industryStandards: "Size inclusive, seasonal collections, quality fabrics",
        features: ["Personal styling", "Fitting rooms", "Alteration services", "Return policy"],
        bookingEnabled: false,
        image: "/womens-apparel.png",
      },
    },
    Electronics: {
      Smartphones: {
        description: "Latest smartphone models with accessories and technical support",
        industryStandards: "Authorized retailer, warranty coverage, technical support",
        features: ["Device setup", "Data transfer", "Screen protection", "Extended warranty"],
        bookingEnabled: false,
        image: "/smartphones.png",
      },
    },
  },
  "Professional Services": {
    "Legal Services": {
      "Family Law": {
        description: "Legal representation for divorce, custody, and family-related matters",
        industryStandards: "Licensed attorneys, confidential consultations, court representation",
        features: ["Free consultation", "Payment plans", "Court representation", "Document preparation"],
        bookingEnabled: true,
        image: "/family-law.png",
      },
    },
    "Financial Services": {
      "Tax Preparation": {
        description: "Professional tax preparation and filing services for individuals and businesses",
        industryStandards: "Certified tax preparers, accuracy guarantee, audit support",
        features: ["Maximum refund guarantee", "Audit protection", "Electronic filing", "Year-round support"],
        bookingEnabled: true,
        image: "/tax-preparation.png",
      },
    },
  },
  "Home Services": {
    "Maintenance & Repair": {
      Plumbing: {
        description: "Professional plumbing services for repairs, installations, and maintenance",
        industryStandards: "Licensed plumbers, emergency service, warranty on work",
        features: ["24/7 emergency service", "Free estimates", "Licensed and insured", "Warranty included"],
        bookingEnabled: true,
        image: "/plumbing-service.png",
      },
    },
    "Cleaning Services": {
      "House Cleaning": {
        description: "Professional residential cleaning services for homes and apartments",
        industryStandards: "Bonded and insured, eco-friendly products, quality guarantee",
        features: [
          "Flexible scheduling",
          "Eco-friendly products",
          "Satisfaction guarantee",
          "Background-checked staff",
        ],
        bookingEnabled: true,
        image: "/house-cleaning.png",
      },
    },
  },
}

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
  const [openSubcategoryDialog, setOpenSubcategoryDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingSubcategory, setEditingSubcategory] = useState(null)

  const [serviceForm, setServiceForm] = useState({
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
    features: [],
    industryStandards: "",
    bookingEnabled: false,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState(null)

  const [dynamicCategories, setDynamicCategories] = useState({})

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
    setServiceForm((prev) => ({
      ...prev,
      category: "",
      subcategory: "",
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
    const baseCategories = industryStandards[selectedBusinessType]?.categories || {}
    const dynamicCats = dynamicCategories[selectedBusinessType] || {}
    return { ...baseCategories, ...dynamicCats }
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
        subcategory: "Haircuts",
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
        features: ["Style consultation", "Wash and blow-dry included", "Product recommendations", "Styling tips"],
        industryStandards: "Licensed stylists, consultation included, styling products used",
        bookingEnabled: true,
      },
      {
        id: 2,
        name: "Fine Dining Experience",
        category: "Restaurant & Food Service",
        subcategory: "Tasting Menu",
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
        features: ["Advance reservations required", "Dietary restrictions accommodated", "Sommelier service"],
        industryStandards: "7-12 courses, wine pairings available, 2-3 hour dining experience",
        bookingEnabled: true,
      },
    ]
    setServices(sampleServices)
  }, [])

  // Event handlers
  const getServiceDetails = (category, subcategory) => {
    const businessTypeDetails = serviceDetails[selectedBusinessType]
    if (businessTypeDetails && businessTypeDetails[category] && businessTypeDetails[category][subcategory]) {
      return businessTypeDetails[category][subcategory]
    }
    return null
  }

  const handleServiceFormChange = (field, value) => {
    setServiceForm((prev) => {
      const updated = { ...prev, [field]: value }

      // Auto-populate service details when category and subcategory are selected
      if ((field === "category" || field === "subcategory") && updated.category && updated.subcategory) {
        const details = getServiceDetails(updated.category, updated.subcategory)
        if (details) {
          updated.description = details.description
          updated.industryStandards = details.industryStandards
          updated.features = details.features || []
          updated.bookingEnabled = details.bookingEnabled
          updated.imagePreview = details.image
        }
      }

      return updated
    })
  }

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      const currentCategories = getCurrentCategories()
      const updatedCategories = {
        ...currentCategories,
        [newCategory.name]: newCategory.subcategories,
      }

      setDynamicCategories((prev) => ({
        ...prev,
        [selectedBusinessType]: updatedCategories,
      }))

      setSnackbar({
        open: true,
        message: "Category added successfully!",
        severity: "success",
      })

      setNewCategory({ name: "", subcategories: [] })
      setOpenCategoryDialog(false)
    }
  }

  const handleEditCategory = (categoryName) => {
    const currentCategories = getCurrentCategories()
    setNewCategory({
      name: categoryName,
      subcategories: [...(currentCategories[categoryName] || [])],
    })
    setEditingCategory(categoryName)
    setOpenCategoryDialog(true)
  }

  const handleUpdateCategory = () => {
    if (newCategory.name.trim() && editingCategory) {
      const currentCategories = getCurrentCategories()
      const updatedCategories = { ...currentCategories }

      // Remove old category if name changed
      if (editingCategory !== newCategory.name) {
        delete updatedCategories[editingCategory]
      }

      updatedCategories[newCategory.name] = newCategory.subcategories

      setDynamicCategories((prev) => ({
        ...prev,
        [selectedBusinessType]: updatedCategories,
      }))

      setSnackbar({
        open: true,
        message: "Category updated successfully!",
        severity: "success",
      })

      setNewCategory({ name: "", subcategories: [] })
      setEditingCategory(null)
      setOpenCategoryDialog(false)
    }
  }

  const handleDeleteCategory = (categoryName) => {
    const currentCategories = getCurrentCategories()
    const updatedCategories = { ...currentCategories }
    delete updatedCategories[categoryName]

    setDynamicCategories((prev) => ({
      ...prev,
      [selectedBusinessType]: updatedCategories,
    }))

    setSnackbar({
      open: true,
      message: "Category deleted successfully!",
      severity: "success",
    })
  }

  const handleAddSubcategory = () => {
    if (newSubcategory.trim() && !newCategory.subcategories.includes(newSubcategory)) {
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

  const handleAddService = () => {
    if (serviceForm.name.trim() && serviceForm.category && serviceForm.subcategory && serviceForm.provider.trim()) {
      const newService = {
        id: Date.now(),
        ...serviceForm,
        price: Number.parseFloat(serviceForm.price) || 0,
        duration: Number.parseInt(serviceForm.duration) || 0,
        maxParticipants: Number.parseInt(serviceForm.maxParticipants) || 1,
      }

      setServices((prev) => [...prev, newService])
      setSnackbar({
        open: true,
        message: "Service added successfully!",
        severity: "success",
      })

      handleDialogClose()
    }
  }

  const handleEditService = (service) => {
    setServiceForm({
      name: service.name,
      category: service.category,
      subcategory: service.subcategory,
      price: service.price.toString(),
      duration: service.duration.toString(),
      rating: service.rating,
      provider: service.provider,
      providerRating: service.providerRating,
      available: service.available,
      description: service.description || "",
      requiresAppointment: service.requiresAppointment,
      maxParticipants: service.maxParticipants?.toString() || "",
      tags: service.tags || [],
      image: service.image,
      imagePreview: service.imagePreview || "",
      features: service.features || [],
      industryStandards: service.industryStandards || "",
      bookingEnabled: service.bookingEnabled || false,
    })
    setIsEditing(true)
    setEditingServiceId(service.id)
    setOpenServiceDialog(true)
  }

  const handleSaveEditedService = () => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === editingServiceId
          ? {
              ...service,
              ...serviceForm,
              price: Number.parseFloat(serviceForm.price) || 0,
              duration: Number.parseInt(serviceForm.duration) || 0,
              maxParticipants: Number.parseInt(serviceForm.maxParticipants) || 1,
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
    setOpenSubcategoryDialog(false)
    setSelectedService(null)
    setIsEditing(false)
    setEditingServiceId(null)
    setEditingCategory(null)
    setEditingSubcategory(null)
    setServiceForm({
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
      features: [],
      industryStandards: "",
      bookingEnabled: false,
    })
    setNewCategory({ name: "", subcategories: [] })
    setNewSubcategory("")
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

  const handleAddTag = () => {
    if (newTag && !serviceForm.tags.includes(newTag)) {
      setServiceForm((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setServiceForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setServiceForm((prev) => ({
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
      setServiceForm((prev) => ({
        ...prev,
        menuItems: [...prev.menuItems, { ...newMenuItem, id: Date.now() }],
      }))
      setNewMenuItem({ name: "", price: "", category: "" })
    }
  }

  const handleRemoveMenuItem = (itemId) => {
    setServiceForm((prev) => ({
      ...prev,
      menuItems: prev.menuItems.filter((item) => item.id !== itemId),
    }))
  }

  // Room type management
  const handleAddRoomType = () => {
    if (newRoomType && !serviceForm.roomManagement.roomTypes.includes(newRoomType)) {
      setServiceForm((prev) => ({
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
    setServiceForm((prev) => ({
      ...prev,
      roomManagement: {
        ...prev.roomManagement,
        roomTypes: prev.roomManagement.roomTypes.filter((type) => type !== roomType),
      },
    }))
  }

  // Amenity management
  const handleAddAmenity = () => {
    if (newAmenity && !serviceForm.roomManagement.amenities.includes(newAmenity)) {
      setServiceForm((prev) => ({
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
    setServiceForm((prev) => ({
      ...prev,
      roomManagement: {
        ...prev.roomManagement,
        amenities: prev.roomManagement.amenities.filter((a) => a !== amenity),
      },
    }))
  }

  // Insurance provider management
  const handleAddInsuranceProvider = () => {
    if (newInsuranceProvider && !serviceForm.patientManagement.insuranceProviders.includes(newInsuranceProvider)) {
      setServiceForm((prev) => ({
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
    setServiceForm((prev) => ({
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

  const ServiceCard = ({ service }) => (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2 }}>
      {service.imagePreview && (
        <Box sx={{ height: 200, overflow: "hidden" }}>
          <img
            src={service.imagePreview || "/placeholder.svg"}
            alt={service.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", flex: 1 }}>
            {service.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
            <Star sx={{ color: "#FFD700", fontSize: 20 }} />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {service.rating || "New"}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {service.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Industry Standards:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {service.industryStandards}
          </Typography>
        </Box>

        {service.features && service.features.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Features:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {service.features.slice(0, 3).map((feature, index) => (
                <Chip key={index} label={feature} size="small" variant="outlined" sx={{ fontSize: "0.75rem" }} />
              ))}
              {service.features.length > 3 && (
                <Chip
                  label={`+${service.features.length - 3} more`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem" }}
                />
              )}
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
            ${service.price}
          </Typography>
          {service.duration && (
            <Typography variant="body2" color="text.secondary">
              {service.duration} min
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <Chip label={service.category} size="small" color="primary" variant="outlined" />
          <Chip label={service.subcategory} size="small" color="secondary" variant="outlined" />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Provider: {service.provider}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {service.requiresAppointment && (
            <Chip label="Appointment Required" size="small" icon={<Schedule />} variant="outlined" />
          )}
          {service.bookingEnabled && (
            <Chip label="Online Booking" size="small" icon={<BookOnline />} color="success" variant="outlined" />
          )}
        </Box>
      </CardContent>
      <CardActions sx={{ p: 3, pt: 0 }}>
        <Box sx={{ display: "flex", gap: 1, width: "100%" }}>
          {service.bookingEnabled && (
            <Button
              variant="contained"
              fullWidth
              startIcon={<BookOnline />}
              sx={{
                bgcolor: industryStandards[selectedBusinessType]?.primaryColor || "#3F51B5",
                "&:hover": { bgcolor: industryStandards[selectedBusinessType]?.secondaryColor || "#2196F3" },
              }}
            >
              Book Now
            </Button>
          )}
          <IconButton onClick={() => handleEditService(service)} color="primary">
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDeleteService(service.id)} color="error">
            <Delete />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
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
        name: !serviceForm.name.trim(),
        category: !serviceForm.category,
        subcategory: !serviceForm.subcategory,
        provider: !serviceForm.provider.trim(),
      }
      setFormErrors(errors)
      return !Object.values(errors).some((error) => error)
    }

    const handleSubmit = () => {
      if (!validateForm()) {
        setSnackbar({
          open: true,
          message: "Please fill in all required fields",
          severity: "error",
        })
        return
      }

      const newService = {
        id: isEditing ? editingServiceId : Date.now(),
        ...serviceForm,
        price: Number.parseFloat(serviceForm.price) || 0,
        maxParticipants: Number.parseInt(serviceForm.maxParticipants) || 1,
        serviceType: getDefaultServiceType(selectedBusinessType),
      }

      if (isEditing) {
        setServices((prev) => prev.map((service) => (service.id === editingServiceId ? newService : service)))
        setSnackbar({
          open: true,
          message: "Service updated successfully!",
          severity: "success",
        })
      } else {
        setServices((prev) => [...prev, newService])
        setSnackbar({
          open: true,
          message: "Service added successfully!",
          severity: "success",
        })
      }

      handleCloseServiceDialog()
    }

    const handleCloseServiceDialog = () => {
      setOpenServiceDialog(false)
      setIsEditing(false)
      setEditingServiceId(null)
      setServiceForm({
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
        features: [],
        industryStandards: "",
        bookingEnabled: false,
      })
      setFormErrors({})
    }

    return (
      <Dialog open={openServiceDialog} onClose={handleCloseServiceDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
            {isEditing ? "Edit Service" : "Add New Service"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isEditing ? "Update service information" : "Create a new service offering for your business"}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Service Name"
                value={serviceForm.name}
                onChange={(e) => handleServiceFormChange("name", e.target.value)}
                error={formErrors.name}
                helperText={formErrors.name ? "Service name is required" : "Enter a descriptive service name"}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Provider/Business Name"
                value={serviceForm.provider}
                onChange={(e) => handleServiceFormChange("provider", e.target.value)}
                error={formErrors.provider}
                helperText={formErrors.provider ? "Provider name is required" : "Your business or provider name"}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formErrors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={serviceForm.category}
                  onChange={(e) => handleServiceFormChange("category", e.target.value)}
                  label="Category"
                >
                  {Object.keys(getCurrentCategories()).map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {formErrors.category ? "Category is required" : "Select the main service category"}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={formErrors.subcategory} disabled={!serviceForm.category}>
                <InputLabel>Subcategory</InputLabel>
                <Select
                  value={serviceForm.subcategory}
                  onChange={(e) => handleServiceFormChange("subcategory", e.target.value)}
                  label="Subcategory"
                >
                  {serviceForm.category &&
                    getCurrentCategories()[serviceForm.category]?.map((subcat) => (
                      <MenuItem key={subcat} value={subcat}>
                        {subcat}
                      </MenuItem>
                    ))}
                </Select>
                <FormHelperText>
                  {formErrors.subcategory ? "Subcategory is required" : "Select a specific service type"}
                </FormHelperText>
              </FormControl>
            </Grid>

            {/* Service Details */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "primary.main", mt: 2 }}>
                Service Details
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={serviceForm.description}
                onChange={(e) => handleServiceFormChange("description", e.target.value)}
                multiline
                rows={3}
                helperText="Detailed description of your service offering"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Industry Standards"
                value={serviceForm.industryStandards}
                onChange={(e) => handleServiceFormChange("industryStandards", e.target.value)}
                multiline
                rows={2}
                helperText="Industry standards and certifications for this service"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={serviceForm.price}
                onChange={(e) => handleServiceFormChange("price", e.target.value)}
                helperText="Service price in your currency"
                variant="outlined"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={serviceForm.duration}
                onChange={(e) => handleServiceFormChange("duration", e.target.value)}
                helperText="Estimated service duration"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Max Participants"
                type="number"
                value={serviceForm.maxParticipants}
                onChange={(e) => handleServiceFormChange("maxParticipants", e.target.value)}
                helperText="Maximum number of participants"
                variant="outlined"
              />
            </Grid>

            {/* Service Features */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "primary.main", mt: 2 }}>
                Service Features
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {serviceForm.features.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    onDelete={() => {
                      const newFeatures = serviceForm.features.filter((_, i) => i !== index)
                      handleServiceFormChange("features", newFeatures)
                    }}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <TextField
                fullWidth
                label="Add Feature"
                placeholder="Type a feature and press Enter"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    const newFeatures = [...serviceForm.features, e.target.value.trim()]
                    handleServiceFormChange("features", newFeatures)
                    e.target.value = ""
                  }
                }}
                helperText="Press Enter to add features (e.g., 'Free consultation', 'Satisfaction guarantee')"
                variant="outlined"
              />
            </Grid>

            {/* Service Options */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "primary.main", mt: 2 }}>
                Service Options
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={serviceForm.requiresAppointment}
                    onChange={(e) => handleServiceFormChange("requiresAppointment", e.target.checked)}
                  />
                }
                label="Requires Appointment"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={serviceForm.bookingEnabled}
                    onChange={(e) => handleServiceFormChange("bookingEnabled", e.target.checked)}
                  />
                }
                label="Online Booking Available"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={serviceForm.available}
                    onChange={(e) => handleServiceFormChange("available", e.target.checked)}
                  />
                }
                label="Currently Available"
              />
            </Grid>

            {/* Image Preview */}
            {serviceForm.imagePreview && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "primary.main", mt: 2 }}>
                  Service Image
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <img
                    src={serviceForm.imagePreview || "/placeholder.svg"}
                    alt="Service preview"
                    style={{
                      maxWidth: "300px",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseServiceDialog} size="large">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="large"
            sx={{
              bgcolor: industryStandards[selectedBusinessType]?.primaryColor || "#3F51B5",
              "&:hover": { bgcolor: industryStandards[selectedBusinessType]?.secondaryColor || "#2196F3" },
            }}
          >
            {isEditing ? "Update Service" : "Add Service"}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const CategoryManagementDialog = () => (
    <Dialog
      open={openCategoryDialog}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 10,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {editingCategory ? "Edit Category" : "Add New Category"}
          </Typography>
          <IconButton onClick={handleDialogClose} size="large">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {editingCategory
            ? "Update the category name and manage its subcategories"
            : `Create a new category for your ${selectedBusinessType.toLowerCase()} business`}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Category Name"
              value={newCategory.name}
              onChange={(e) => setNewCategory((prev) => ({ ...prev, name: e.target.value }))}
              variant="outlined"
              placeholder="e.g., Hair Services, Main Courses, Consultations"
              helperText="Enter a descriptive name for this category"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Subcategories
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label="Add Subcategory"
                value={newSubcategory}
                onChange={(e) => setNewSubcategory(e.target.value)}
                variant="outlined"
                placeholder="e.g., Hair Cuts, Appetizers, General Checkup"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddSubcategory()
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={handleAddSubcategory}
                disabled={!newSubcategory.trim()}
                sx={{ minWidth: 100 }}
              >
                Add
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {newCategory.subcategories.map((subcat, index) => (
                <Paper
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1,
                    bgcolor: "grey.100",
                  }}
                >
                  <Typography variant="body2">{subcat}</Typography>
                  <IconButton size="small" onClick={() => handleRemoveSubcategory(subcat)}>
                    <Close fontSize="small" />
                  </IconButton>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={handleDialogClose} size="large" sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
          disabled={!newCategory.name.trim()}
          size="large"
          sx={{
            minWidth: 140,
            bgcolor: industryStandards[selectedBusinessType]?.primaryColor || "#3F51B5",
            "&:hover": {
              bgcolor: industryStandards[selectedBusinessType]?.secondaryColor || "#2196F3",
            },
          }}
        >
          {editingCategory ? "Update Category" : "Add Category"}
        </Button>
      </DialogActions>
    </Dialog>
  )

  const currentTheme = createBusinessTheme(selectedBusinessType)

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <BusinessTypeSelector />

      {selectedBusinessType && (
        <>
          {/* Business Type Header */}
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
                    Professional Service Management System
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

          {/* Services Grid */}
          <Grid container spacing={3}>
            {filteredServices.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <ServiceCard service={service} />
              </Grid>
            ))}
          </Grid>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenServiceDialog(true)}
              size="large"
              sx={{
                bgcolor: industryStandards[selectedBusinessType]?.primaryColor || "#3F51B5",
                "&:hover": { bgcolor: industryStandards[selectedBusinessType]?.secondaryColor || "#2196F3" },
              }}
            >
              Add New Service
            </Button>
            <Button
              variant="outlined"
              startIcon={<Category />}
              onClick={() => setOpenCategoryDialog(true)}
              size="large"
            >
              Manage Categories
            </Button>
          </Box>

          <ServiceFormDialog />
          {/* Other dialogs... */}
        </>
      )}

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default ServicesPage
