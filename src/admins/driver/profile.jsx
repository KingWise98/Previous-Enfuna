import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  AppBar,
  Toolbar,
  Drawer,
  ListItemButton
} from '@mui/material';
import {
  Person,
  CameraAlt,
  Edit,
  Save,
  Cancel,
  Verified,
  Warning,
  DirectionsCar,
  BusinessCenter,
  Security,
  LocationOn,
  Phone,
  Email,
  CreditCard,
  DocumentScanner,
  CheckCircle,
  Error,
  LocalShipping,
  AirportShuttle,
  School,
  MedicalServices,
  Work,
  Star,
  AccountBalance,
  Receipt,
  Menu,
  Dashboard,
  Queue,
  History,
  Payments,
  Settings
} from '@mui/icons-material';

const DriverProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [uploadProgress, setUploadProgress] = useState({});
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Initialize with proper empty state for drivers
  const initialProfileData = {
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: 'Ugandan',
      maritalStatus: ''
    },
    identification: {
      nationalId: '',
      tinNumber: '',
      drivingLicense: '',
      licenseClass: '',
      licenseExpiry: '',
      passportNumber: '',
      workPermit: ''
    },
    professionalInfo: {
      driverType: '',
      yearsExperience: '',
      languages: [],
      specialCertifications: [],
      availability: 'full-time',
      preferredAreas: [],
      hourlyRate: '',
      isInsured: false
    },
    vehicleInfo: {
      vehicleType: '',
      make: '',
      model: '',
      year: '',
      licensePlate: '',
      color: '',
      engineNumber: '',
      chasisNumber: '',
      seatingCapacity: '',
      fuelType: '',
      transmission: '',
      insuranceProvider: '',
      insuranceExpiry: '',
      roadWorthyExpiry: '',
      lastServiceDate: ''
    },
    contactInfo: {
      phone: '',
      email: '',
      address: '',
      city: '',
      district: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: ''
      }
    },
    bankingInfo: {
      bankName: '',
      accountNumber: '',
      accountName: '',
      branch: '',
      mobileMoney: ''
    },
    profileMedia: {
      profilePhoto: null,
      nationalIdFront: null,
      nationalIdBack: null,
      drivingLicenseFront: null,
      drivingLicenseBack: null,
      vehiclePhoto: null,
      insuranceCertificate: null,
      roadWorthyCertificate: null
    },
    preferences: {
      notifications: true,
      smsAlerts: true,
      emailUpdates: false,
      autoAcceptRides: false,
      shareLocation: true,
      longTrips: true,
      shortTrips: true,
      nightDriving: false
    },
    ratings: {
      averageRating: 0,
      totalRides: 0,
      completedRides: 0,
      cancellationRate: 0
    }
  };

  const [profileData, setProfileData] = useState(initialProfileData);

  // Mock initial data for drivers
  const mockData = {
    personalInfo: {
      firstName: 'Emma',
      lastName: 'Vangamoi',
      dateOfBirth: '1985-08-20',
      gender: 'male',
      nationality: 'Ugandan',
      maritalStatus: 'married'
    },
    identification: {
      nationalId: 'CM9141515151515',
      tinNumber: '123456789',
      drivingLicense: 'UB542315678',
      licenseClass: 'D',
      licenseExpiry: '2025-12-31',
      passportNumber: '',
      workPermit: ''
    },
    professionalInfo: {
      driverType: 'taxi',
      yearsExperience: '8',
      languages: ['English', 'Luganda', 'Swahili'],
      specialCertifications: ['defensive_driving', 'first_aid'],
      availability: 'full-time',
      preferredAreas: ['Kampala Central', 'Entebbe', 'Jinja Road'],
      hourlyRate: '15000',
      isInsured: true
    },
    vehicleInfo: {
      vehicleType: 'sedan',
      make: 'Toyota',
      model: 'Noah',
      year: '2020',
      licensePlate: 'UBA 789K',
      color: 'White',
      engineNumber: 'T123456789',
      chasisNumber: 'CH123456789',
      seatingCapacity: '7',
      fuelType: 'petrol',
      transmission: 'automatic',
      insuranceProvider: 'Liberty Health',
      insuranceExpiry: '2024-12-31',
      roadWorthyExpiry: '2024-06-30',
      lastServiceDate: '2024-01-10'
    },
    contactInfo: {
      phone: '+256712345678',
      email: 'emma.van@enfuna.com',
      address: 'Plot 456, Entebbe Road',
      city: 'Kampala',
      district: 'Kawempe',
      emergencyContact: {
        name: 'Sarafina Vangamoi',
        phone: '+256781234567',
        relationship: 'Wife'
      }
    },
    bankingInfo: {
      bankName: 'Stanbic Bank',
      accountNumber: '9876543210',
      accountName: 'Emma Vangamoi',
      branch: 'Kampala Main',
      mobileMoney: '+256712345678'
    },
    preferences: {
      notifications: true,
      smsAlerts: true,
      emailUpdates: false,
      autoAcceptRides: false,
      shareLocation: true,
      longTrips: true,
      shortTrips: true,
      nightDriving: true
    },
    ratings: {
      averageRating: 4.7,
      totalRides: 1247,
      completedRides: 1230,
      cancellationRate: 1.4
    }
  };

  useEffect(() => {
    setProfileData(mockData);
    calculateProfileCompletion(mockData);
  }, []);

  // Driver-specific options
  const driverTypes = [
    { value: 'taxi', label: '🚕 Taxi Driver', description: 'Passenger transportation' },
    { value: 'truck', label: '🚚 Truck Driver', description: 'Goods and logistics' },
    { value: 'bus', label: '🚌 Bus Driver', description: 'Public transportation' },
    { value: 'private', label: '🚗 Private Driver', description: 'Executive and private services' },
    { value: 'delivery', label: '📦 Delivery Driver', description: 'Package and food delivery' }
  ];

  const vehicleTypes = [
    { value: 'sedan', label: '🚗 Sedan', capacity: '4-5 passengers' },
    { value: 'suv', label: '🚙 SUV', capacity: '5-7 passengers' },
    { value: 'minibus', label: '🚐 Minibus', capacity: '12-15 passengers' },
    { value: 'bus', label: '🚌 Bus', capacity: '25+ passengers' },
    { value: 'van', label: '🚐 Van', capacity: '8-12 passengers' }
  ];

  const licenseClasses = [
    { value: 'B', label: 'Class B - Light Vehicles', description: 'Cars up to 3500kg' },
    { value: 'C', label: 'Class C - Medium Trucks', description: 'Trucks 3500kg - 16000kg' },
    { value: 'D', label: 'Class D - Heavy Trucks', description: 'Trucks over 16000kg' },
    { value: 'E', label: 'Class E - Buses', description: 'Buses and coaches' }
  ];

  const fuelTypes = [
    { value: 'petrol', label: '⛽ Petrol' },
    { value: 'diesel', label: '🛢️ Diesel' },
    { value: 'electric', label: '⚡ Electric' },
    { value: 'hybrid', label: '🔋 Hybrid' }
  ];

  const transmissionTypes = [
    { value: 'manual', label: '🔄 Manual' },
    { value: 'automatic', label: '⚙️ Automatic' }
  ];

  const certifications = [
    { value: 'defensive_driving', label: '🛡️ Defensive Driving' },
    { value: 'first_aid', label: '🩹 First Aid Certified' },
    { value: 'advanced_driving', label: '🎯 Advanced Driving' }
  ];

  const languages = [
    'English', 'Luganda', 'Swahili', 'Luo', 'Runyankole'
  ];

  const banks = [
    'Centenary Bank', 'Stanbic Bank', 'Standard Chartered', 'DFCU Bank',
    'Bank of Africa', 'Equity Bank', 'Absa Bank'
  ];

  const districts = [
    'Kampala Central', 'Kawempe', 'Makindye', 'Nakawa', 'Rubaga',
    'Wakiso', 'Mukono', 'Entebbe', 'Jinja'
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, nestedField, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [nestedField]: {
          ...(prev[section]?.[nestedField] || {}),
          [field]: value
        }
      }
    }));
  };

  const handleArrayChange = (section, field, value) => {
    setProfileData(prev => {
      const currentArray = prev[section]?.[field] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];

      return {
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [field]: newArray
        }
      };
    });
  };

  const handleFileUpload = (section, field, file) => {
    if (file) {
      setUploadProgress(prev => ({ ...prev, [field]: 0 }));
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev[field] + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            setProfileData(prevData => ({
              ...prevData,
              [section]: {
                ...(prevData[section] || {}),
                [field]: URL.createObjectURL(file)
              }
            }));
            return { ...prev, [field]: 100 };
          }
          return { ...prev, [field]: newProgress };
        });
      }, 100);
    }
  };

  const calculateProfileCompletion = (data) => {
    let completedFields = 0;
    let totalFields = 0;

    const sections = ['personalInfo', 'identification', 'professionalInfo', 'vehicleInfo', 'contactInfo', 'bankingInfo'];
    
    sections.forEach(section => {
      if (data[section]) {
        Object.keys(data[section]).forEach(field => {
          totalFields++;
          const value = data[section][field];
          if (value !== null && value !== undefined && value !== '') {
            if (Array.isArray(value)) {
              if (value.length > 0) completedFields++;
            } else if (typeof value === 'object') {
              const hasNestedValues = Object.values(value).some(nestedValue => 
                nestedValue !== null && nestedValue !== undefined && nestedValue !== ''
              );
              if (hasNestedValues) completedFields++;
            } else {
              completedFields++;
            }
          }
        });
      }
    });

    const completionPercentage = Math.round((completedFields / totalFields) * 100);
    setProfileCompletion(completionPercentage);
  };

  const handleSaveProfile = () => {
    const requiredFields = [
      profileData.personalInfo?.firstName,
      profileData.personalInfo?.lastName,
      profileData.identification?.nationalId,
      profileData.identification?.drivingLicense,
      profileData.identification?.licenseClass,
      profileData.professionalInfo?.driverType,
      profileData.vehicleInfo?.vehicleType,
      profileData.vehicleInfo?.licensePlate,
      profileData.contactInfo?.phone,
      profileData.bankingInfo?.bankName,
      profileData.bankingInfo?.accountNumber,
      profileData.bankingInfo?.accountName
    ];

    const missingFields = requiredFields.filter(field => !field);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields (marked with *) before saving.');
      return;
    }

    calculateProfileCompletion(profileData);
    setIsEditing(false);
    alert('Driver profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setProfileData(mockData);
    setIsEditing(false);
  };

  const getVerificationStatusColor = () => {
    switch (verificationStatus) {
      case 'verified': return 'success';
      case 'rejected': return 'error';
      default: return 'warning';
    }
  };

  const getVerificationStatusText = () => {
    switch (verificationStatus) {
      case 'verified': return 'Verified Driver';
      case 'rejected': return 'Verification Failed';
      default: return 'Pending Verification';
    }
  };

  const requiredDocuments = [
    { name: 'National ID Front', field: 'nationalIdFront', required: true },
    { name: 'National ID Back', field: 'nationalIdBack', required: true },
    { name: 'Driving License Front', field: 'drivingLicenseFront', required: true },
    { name: 'Driving License Back', field: 'drivingLicenseBack', required: true },
    { name: 'Vehicle Photo', field: 'vehiclePhoto', required: true },
    { name: 'Profile Photo', field: 'profilePhoto', required: true },
    { name: 'Insurance Certificate', field: 'insuranceCertificate', required: true }
  ];

  // Safe value getters with fallbacks
  const getProfilePhoto = () => profileData.profileMedia?.profilePhoto || null;
  const getPersonalInfo = (field) => profileData.personalInfo?.[field] || '';
  const getIdentification = (field) => profileData.identification?.[field] || '';
  const getProfessionalInfo = (field) => profileData.professionalInfo?.[field] || '';
  const getVehicleInfo = (field) => profileData.vehicleInfo?.[field] || '';
  const getContactInfo = (field) => profileData.contactInfo?.[field] || '';
  const getBankingInfo = (field) => profileData.bankingInfo?.[field] || '';
  const getEmergencyContact = (field) => profileData.contactInfo?.emergencyContact?.[field] || '';
  const getPreference = (field) => profileData.preferences?.[field] || false;
  const getRating = (field) => profileData.ratings?.[field] || 0;

  const tabLabels = [
    { icon: <Person />, label: "Personal Info" },
    { icon: <Work />, label: "Professional Info" },
    { icon: <DirectionsCar />, label: "Vehicle Info" },
    { icon: <DocumentScanner />, label: "Documents" },
    { icon: <LocationOn />, label: "Contact Info" },
    { icon: <CreditCard />, label: "Banking Info" },
    { icon: <Security />, label: "Preferences" }
  ];

  // Mobile Navigation Drawer
  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: '#0025DD',
          color: 'white',
          width: 280
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#FFEC01' }}>
          ENFUNA DRIVER
        </Typography>
        <List>
          {tabLabels.map((tab, index) => (
            <ListItemButton
              key={index}
              onClick={() => handleTabChange(null, index)}
              sx={{
                backgroundColor: activeTab === index ? '#FFEC01' : 'transparent',
                color: activeTab === index ? '#000' : 'white',
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  backgroundColor: activeTab === index ? '#FFEC01' : '#001FB8'
                }
              }}
            >
              <ListItemIcon sx={{ color: activeTab === index ? '#000' : '#FFEC01' }}>
                {tab.icon}
              </ListItemIcon>
              <ListItemText primary={tab.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Header */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#0025DD',
          background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              sx={{ color: '#FFEC01', mr: 2 }}
              onClick={() => setMobileDrawerOpen(true)}
            >
              <Menu />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#FFEC01' }}>
            ENFUNA DRIVER
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
            {!isEditing ? (
              <Button
                startIcon={<Edit />}
                variant="contained"
                onClick={() => setIsEditing(true)}
                sx={{
                  backgroundColor: '#FFEC01',
                  color: '#000',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#E6D401'
                  }
                }}
                size={isMobile ? "small" : "medium"}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  startIcon={<Cancel />}
                  variant="outlined"
                  onClick={handleCancelEdit}
                  sx={{
                    borderColor: '#FFEC01',
                    color: '#FFEC01',
                    '&:hover': {
                      borderColor: '#E6D401',
                      backgroundColor: '#FFEC0110'
                    }
                  }}
                  size={isMobile ? "small" : "medium"}
                >
                  Cancel
                </Button>
                <Button
                  startIcon={<Save />}
                  variant="contained"
                  onClick={handleSaveProfile}
                  sx={{
                    backgroundColor: '#FFEC01',
                    color: '#000',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#E6D401'
                    }
                  }}
                  size={isMobile ? "small" : "medium"}
                >
                  Save
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <MobileDrawer />

      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Grid container spacing={3}>
          {/* Left Sidebar - Profile Summary */}
          <Grid item xs={12} md={4}>
            {/* Profile Card */}
            <Card sx={{ mb: 3, border: `2px solid #0025DD` }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                  <Avatar
                    src={getProfilePhoto()}
                    sx={{ 
                      width: isMobile ? 80 : 120, 
                      height: isMobile ? 80 : 120, 
                      mx: 'auto', 
                      mb: 2,
                      border: `3px solid #0025DD`
                    }}
                  >
                    <Person sx={{ fontSize: isMobile ? 40 : 60 }} />
                  </Avatar>
                  {isEditing && (
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        backgroundColor: '#0025DD',
                        color: '#FFEC01',
                        '&:hover': {
                          backgroundColor: '#001FB8'
                        }
                      }}
                      component="label"
                      size={isMobile ? "small" : "medium"}
                    >
                      <CameraAlt />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleFileUpload('profileMedia', 'profilePhoto', e.target.files[0])}
                      />
                    </IconButton>
                  )}
                </Box>

                <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" gutterBottom color="#0025DD">
                  {getPersonalInfo('firstName')} {getPersonalInfo('lastName')}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Driver ID: DRV-ENF00567
                </Typography>
                <Chip
                  label={driverTypes.find(d => d.value === getProfessionalInfo('driverType'))?.label}
                  sx={{ 
                    backgroundColor: '#0025DD',
                    color: 'white',
                    fontWeight: 'bold',
                    mb: 2 
                  }}
                />

                <Chip
                  icon={verificationStatus === 'verified' ? <Verified /> : <Warning />}
                  label={getVerificationStatusText()}
                  color={getVerificationStatusColor()}
                  variant={verificationStatus === 'verified' ? 'filled' : 'outlined'}
                  sx={{ mb: 2 }}
                />

                {/* Profile Completion */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Profile Completion</Typography>
                    <Typography variant="body2" fontWeight="bold" color="#0025DD">
                      {profileCompletion}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={profileCompletion}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: '#0025DD20',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: profileCompletion >= 80 ? '#0025DD' : 
                                       profileCompletion >= 50 ? '#FFEC01' : '#FF4444'
                      }
                    }}
                  />
                </Box>

                {/* Driver Stats */}
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <Star sx={{ color: '#FFEC01', fontSize: 16 }} />
                        <Typography variant="h6" color="#0025DD" fontWeight="bold">
                          {getRating('averageRating')}
                        </Typography>
                      </Box>
                      <Typography variant="caption">Rating</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                      <Typography variant="h6" color="#0025DD" fontWeight="bold">
                        {getRating('totalRides')}
                      </Typography>
                      <Typography variant="caption">Total Rides</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                      <Typography variant="h6" color="#0025DD" fontWeight="bold">
                        {getRating('completedRides')}
                      </Typography>
                      <Typography variant="caption">Completed</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                      <Typography variant="h6" color="#0025DD" fontWeight="bold">
                        {getRating('cancellationRate')}%
                      </Typography>
                      <Typography variant="caption">Cancel Rate</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card sx={{ mb: 3, border: `1px solid #0025DD20` }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="#0025DD" fontWeight="bold">
                  Verification Status
                </Typography>
                <Stepper orientation="vertical" activeStep={verificationStatus === 'verified' ? 4 : 1}>
                  <Step>
                    <StepLabel>Basic Information</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Professional Details</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Document Verification</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Background Check</StepLabel>
                  </Step>
                  <Step>
                    <StepLabel>Account Activated</StepLabel>
                  </Step>
                </Stepper>
              </CardContent>
            </Card>

            {/* Required Documents */}
            <Card sx={{ border: `1px solid #0025DD20` }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="#0025DD" fontWeight="bold">
                  Required Documents
                </Typography>
                <List dense>
                  {requiredDocuments.map((doc, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {profileData.profileMedia?.[doc.field] ? (
                          <CheckCircle sx={{ color: '#0025DD' }} />
                        ) : (
                          <Error color={doc.required ? 'error' : 'disabled'} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={doc.name}
                        secondary={doc.required ? 'Required' : 'Optional'}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content Area */}
          <Grid item xs={12} md={8}>
            <Card sx={{ border: `1px solid #0025DD20` }}>
              {!isMobile && (
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                      color: '#0025DD',
                      fontWeight: 'bold'
                    },
                    '& .Mui-selected': {
                      color: '#0025DD'
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#0025DD'
                    }
                  }}
                >
                  {tabLabels.map((tab, index) => (
                    <Tab key={index} icon={tab.icon} label={tab.label} />
                  ))}
                </Tabs>
              )}

              <CardContent sx={{ minHeight: 500, p: isMobile ? 2 : 4 }}>
                {/* Personal Information Tab */}
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0025DD' }}>
                      <Person /> Personal Information
                    </Typography>
                    <Alert severity="info" sx={{ mb: 3, backgroundColor: '#0025DD10' }}>
                      This information helps us verify your identity and ensure passenger safety.
                    </Alert>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name *"
                          value={getPersonalInfo('firstName')}
                          onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                          disabled={!isEditing}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Last Name *"
                          value={getPersonalInfo('lastName')}
                          onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                          disabled={!isEditing}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Date of Birth"
                          type="date"
                          value={getPersonalInfo('dateOfBirth')}
                          onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                          disabled={!isEditing}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth disabled={!isEditing}>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            value={getPersonalInfo('gender')}
                            onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                            label="Gender"
                          >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Professional Information Tab */}
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0025DD' }}>
                      <Work /> Professional Information
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth disabled={!isEditing}>
                          <InputLabel>Driver Type *</InputLabel>
                          <Select
                            value={getProfessionalInfo('driverType')}
                            onChange={(e) => handleInputChange('professionalInfo', 'driverType', e.target.value)}
                            label="Driver Type *"
                          >
                            {driverTypes.map((type) => (
                              <MenuItem key={type.value} value={type.value}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Years of Experience"
                          type="number"
                          value={getProfessionalInfo('yearsExperience')}
                          onChange={(e) => handleInputChange('professionalInfo', 'yearsExperience', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Grid>

                      {/* Languages */}
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom color="#0025DD">Languages Spoken</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {languages.map((language) => {
                            const isSelected = getProfessionalInfo('languages').includes(language);
                            return (
                              <Chip
                                key={language}
                                label={language}
                                clickable={isEditing}
                                sx={{
                                  backgroundColor: isSelected ? '#0025DD' : 'transparent',
                                  color: isSelected ? 'white' : '#0025DD',
                                  borderColor: '#0025DD',
                                  '&:hover': isEditing ? {
                                    backgroundColor: '#0025DD',
                                    color: 'white'
                                  } : {}
                                }}
                                variant={isSelected ? 'filled' : 'outlined'}
                                onClick={() => isEditing && handleArrayChange('professionalInfo', 'languages', language)}
                              />
                            );
                          })}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Vehicle Information Tab */}
                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0025DD' }}>
                      <DirectionsCar /> Vehicle Information
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth disabled={!isEditing}>
                          <InputLabel>Vehicle Type *</InputLabel>
                          <Select
                            value={getVehicleInfo('vehicleType')}
                            onChange={(e) => handleInputChange('vehicleInfo', 'vehicleType', e.target.value)}
                            label="Vehicle Type *"
                          >
                            {vehicleTypes.map((type) => (
                              <MenuItem key={type.value} value={type.value}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="License Plate *"
                          value={getVehicleInfo('licensePlate')}
                          onChange={(e) => handleInputChange('vehicleInfo', 'licensePlate', e.target.value)}
                          disabled={!isEditing}
                          required
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* Add other tabs with similar responsive structure... */}
                
                {activeTab >= 3 && (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="#0025DD" gutterBottom>
                      {tabLabels[activeTab]?.label} Content
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      This section is under development and will be available soon.
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DriverProfilePage;