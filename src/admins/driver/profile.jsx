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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress
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
  CalendarToday,
  CreditCard,
  DocumentScanner,
  CheckCircle,
  Error,
  ExpandMore,
  LocalShipping,
  AirportShuttle,
  School,
  MedicalServices,
  Work,
  Star,
  AccountBalance,
  Receipt
} from '@mui/icons-material';

const DriverProfilePage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [uploadProgress, setUploadProgress] = useState({});
  const [profileCompletion, setProfileCompletion] = useState(0);

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
      licenseClass: '', // C, D, E, F for different vehicle types
      licenseExpiry: '',
      passportNumber: '',
      workPermit: ''
    },
    professionalInfo: {
      driverType: '', // taxi, truck, bus, private, delivery
      yearsExperience: '',
      languages: [],
      specialCertifications: [], // defensive driving, first aid, etc.
      availability: 'full-time', // full-time, part-time, flexible
      preferredAreas: [],
      hourlyRate: '',
      isInsured: false
    },
    vehicleInfo: {
      vehicleType: '', // sedan, SUV, minibus, truck, motorcycle
      make: '',
      model: '',
      year: '',
      licensePlate: '',
      color: '',
      engineNumber: '',
      chasisNumber: '',
      seatingCapacity: '',
      fuelType: '', // petrol, diesel, electric, hybrid
      transmission: '', // manual, automatic
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
      mobileMoney: '' // For quick payments
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
      accountName: 'James Mugisha',
      branch: 'Kampala Main',
      mobileMoney: '+256712345678'
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
    // Simulate loading profile data
    setProfileData(mockData);
    calculateProfileCompletion(mockData);
  }, []);

  // Driver-specific options
  const driverTypes = [
    { value: 'taxi', label: '🚕 Taxi Driver', description: 'Passenger transportation' },
    { value: 'truck', label: '🚚 Truck Driver', description: 'Goods and logistics' },
    { value: 'bus', label: '🚌 Bus Driver', description: 'Public transportation' },
    { value: 'private', label: '🚗 Private Driver', description: 'Executive and private services' },
    { value: 'delivery', label: '📦 Delivery Driver', description: 'Package and food delivery' },
    { value: 'tour', label: '�️ Tour Driver', description: 'Tourism and sightseeing' },
    { value: 'school', label: '🚸 School Bus Driver', description: 'Student transportation' },
    { value: 'medical', label: '🏥 Medical Transport', description: 'Patient transportation' }
  ];

  const vehicleTypes = [
    { value: 'sedan', label: '🚗 Sedan', capacity: '4-5 passengers' },
    { value: 'suv', label: '🚙 SUV', capacity: '5-7 passengers' },
    { value: 'minibus', label: '🚐 Minibus', capacity: '12-15 passengers' },
    { value: 'bus', label: '🚌 Bus', capacity: '25+ passengers' },
    { value: 'truck', label: '🚚 Truck', capacity: 'Goods transport' },
    { value: 'van', label: '🚐 Van', capacity: '8-12 passengers' },
    { value: 'luxury', label: '💎 Luxury', capacity: '3-4 passengers' },
    { value: 'motorcycle', label: '🏍️ Motorcycle', capacity: '1-2 passengers' }
  ];

  const licenseClasses = [
    { value: 'B', label: 'Class B - Light Vehicles', description: 'Cars up to 3500kg' },
    { value: 'C', label: 'Class C - Medium Trucks', description: 'Trucks 3500kg - 16000kg' },
    { value: 'D', label: 'Class D - Heavy Trucks', description: 'Trucks over 16000kg' },
    { value: 'E', label: 'Class E - Buses', description: 'Buses and coaches' },
    { value: 'F', label: 'Class F - Special Vehicles', description: 'Construction and special vehicles' }
  ];

  const fuelTypes = [
    { value: 'petrol', label: '⛽ Petrol' },
    { value: 'diesel', label: '🛢️ Diesel' },
    { value: 'electric', label: '⚡ Electric' },
    { value: 'hybrid', label: '🔋 Hybrid' },
    { value: 'cng', label: '🔥 CNG' }
  ];

  const transmissionTypes = [
    { value: 'manual', label: '🔄 Manual' },
    { value: 'automatic', label: '⚙️ Automatic' },
    { value: 'semi-automatic', label: '🔀 Semi-Automatic' }
  ];

  const certifications = [
    { value: 'defensive_driving', label: '🛡️ Defensive Driving' },
    { value: 'first_aid', label: '🩹 First Aid Certified' },
    { value: 'hazardous_materials', label: '⚠️ Hazardous Materials' },
    { value: 'passenger_assistance', label: '👥 Passenger Assistance' },
    { value: 'advanced_driving', label: '🎯 Advanced Driving' },
    { value: 'security_training', label: '🔒 Security Training' }
  ];

  const languages = [
    'English', 'Luganda', 'Swahili', 'Luo', 'Runyankole', 
    'Lugbara', 'Ateso', 'Lusoga', 'Runyoro', 'Rukiga', 'French'
  ];

  const banks = [
    'Centenary Bank', 'Stanbic Bank', 'Standard Chartered', 'DFCU Bank',
    'Bank of Africa', 'Equity Bank', 'Absa Bank', 'Opportunity Bank'
  ];

  const districts = [
    'Kampala Central', 'Kawempe', 'Makindye', 'Nakawa', 'Rubaga',
    'Wakiso', 'Mukono', 'Entebbe', 'Jinja', 'Mbale', 'Gulu'
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Safe input change handlers
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

  const handleArrayChange = (section, field, value, operation = 'toggle') => {
    setProfileData(prev => {
      const currentArray = prev[section]?.[field] || [];
      let newArray;

      if (operation === 'toggle') {
        newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
      } else if (operation === 'add') {
        newArray = [...currentArray, value];
      } else if (operation === 'remove') {
        newArray = currentArray.filter(item => item !== value);
      }

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
    // Validate required fields
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

    // Simulate API call to save profile
    console.log('Saving driver profile:', profileData);
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
    { name: 'Insurance Certificate', field: 'insuranceCertificate', required: true },
    { name: 'Road Worthy Certificate', field: 'roadWorthyCertificate', required: true }
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

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Driver Profile 🚗
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Manage your professional driver information and documents
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {!isEditing ? (
            <Button
              startIcon={<Edit />}
              variant="contained"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                startIcon={<Cancel />}
                variant="outlined"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button
                startIcon={<Save />}
                variant="contained"
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            </>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Sidebar - Profile Summary */}
        <Grid item xs={4}>
          {/* Profile Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={getProfilePhoto()}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                >
                  <Person sx={{ fontSize: 60 }} />
                </Avatar>
                {isEditing && (
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                    component="label"
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

              <Typography variant="h5" gutterBottom>
                {getPersonalInfo('firstName')} {getPersonalInfo('lastName')}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Driver ID: DRV-ENF00567
              </Typography>
              <Typography variant="body2" color="primary" fontWeight="bold" gutterBottom>
                {driverTypes.find(d => d.value === getProfessionalInfo('driverType'))?.label}
              </Typography>

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
                  <Typography variant="body2" fontWeight="bold">
                    {profileCompletion}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={profileCompletion}
                  color={profileCompletion >= 80 ? 'success' : profileCompletion >= 50 ? 'warning' : 'error'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              {/* Driver Stats */}
              <Grid container spacing={1} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Star sx={{ color: 'gold', fontSize: 16 }} />
                      <Typography variant="h6" color="warning.main">
                        {getRating('averageRating')}
                      </Typography>
                    </Box>
                    <Typography variant="caption">Rating</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="h6" color="primary.main">
                      {getRating('totalRides')}
                    </Typography>
                    <Typography variant="caption">Total Rides</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main">
                      {getRating('completedRides')}
                    </Typography>
                    <Typography variant="caption">Completed</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="h6" color="error.main">
                      {getRating('cancellationRate')}%
                    </Typography>
                    <Typography variant="caption">Cancel Rate</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Verification Status</Typography>
              <Stepper orientation="vertical" activeStep={verificationStatus === 'verified' ? 4 : 1}>
                <Step>
                  <StepLabel>Basic Information</StepLabel>
                  <StepContent>
                    <Typography variant="body2">
                      Personal and contact details
                    </Typography>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Professional Details</StepLabel>
                  <StepContent>
                    <Typography variant="body2">
                      Driver type and experience
                    </Typography>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Document Verification</StepLabel>
                  <StepContent>
                    <Typography variant="body2">
                      ID, license, and certificates
                    </Typography>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Background Check</StepLabel>
                  <StepContent>
                    <Typography variant="body2">
                      Criminal and driving record
                    </Typography>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Account Activated</StepLabel>
                </Step>
              </Stepper>
            </CardContent>
          </Card>

          {/* Required Documents */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Required Documents</Typography>
              <List dense>
                {requiredDocuments.map((doc, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {profileData.profileMedia?.[doc.field] ? (
                        <CheckCircle color="success" />
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
        <Grid item xs={8}>
          <Card>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<Person />} label="Personal Info" />
              <Tab icon={<Work />} label="Professional Info" />
              <Tab icon={<DirectionsCar />} label="Vehicle Info" />
              <Tab icon={<DocumentScanner />} label="Documents" />
              <Tab icon={<LocationOn />} label="Contact Info" />
              <Tab icon={<CreditCard />} label="Banking Info" />
              <Tab icon={<Security />} label="Preferences" />
            </Tabs>

            <CardContent sx={{ minHeight: 500, p: 4 }}>
              {/* Personal Information Tab */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person /> Personal Information
                  </Typography>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    This information helps us verify your identity and ensure passenger safety.
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="First Name *"
                        value={getPersonalInfo('firstName')}
                        onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Last Name *"
                        value={getPersonalInfo('lastName')}
                        onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Nationality</InputLabel>
                        <Select
                          value={getPersonalInfo('nationality')}
                          onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                          label="Nationality"
                        >
                          <MenuItem value="Ugandan">Ugandan</MenuItem>
                          <MenuItem value="Kenyan">Kenyan</MenuItem>
                          <MenuItem value="Tanzanian">Tanzanian</MenuItem>
                          <MenuItem value="Rwandan">Rwandan</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Marital Status</InputLabel>
                        <Select
                          value={getPersonalInfo('maritalStatus')}
                          onChange={(e) => handleInputChange('personalInfo', 'maritalStatus', e.target.value)}
                          label="Marital Status"
                        >
                          <MenuItem value="single">Single</MenuItem>
                          <MenuItem value="married">Married</MenuItem>
                          <MenuItem value="divorced">Divorced</MenuItem>
                          <MenuItem value="widowed">Widowed</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Professional Information Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Work /> Professional Information
                  </Typography>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Your professional details help us match you with the right opportunities.
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Driver Type *</InputLabel>
                        <Select
                          value={getProfessionalInfo('driverType')}
                          onChange={(e) => handleInputChange('professionalInfo', 'driverType', e.target.value)}
                          label="Driver Type *"
                        >
                          {driverTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              <Box>
                                <Typography>{type.label}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {type.description}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Years of Experience"
                        type="number"
                        value={getProfessionalInfo('yearsExperience')}
                        onChange={(e) => handleInputChange('professionalInfo', 'yearsExperience', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Availability</InputLabel>
                        <Select
                          value={getProfessionalInfo('availability')}
                          onChange={(e) => handleInputChange('professionalInfo', 'availability', e.target.value)}
                          label="Availability"
                        >
                          <MenuItem value="full-time">Full Time</MenuItem>
                          <MenuItem value="part-time">Part Time</MenuItem>
                          <MenuItem value="flexible">Flexible</MenuItem>
                          <MenuItem value="weekends">Weekends Only</MenuItem>
                          <MenuItem value="evenings">Evenings Only</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Hourly Rate (UGX)"
                        type="number"
                        value={getProfessionalInfo('hourlyRate')}
                        onChange={(e) => handleInputChange('professionalInfo', 'hourlyRate', e.target.value)}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Typography sx={{ mr: 1 }}>UGX</Typography>
                        }}
                      />
                    </Grid>

                    {/* Languages */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Languages Spoken</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {languages.map((language) => {
                          const isSelected = getProfessionalInfo('languages').includes(language);
                          return (
                            <Chip
                              key={language}
                              label={language}
                              clickable={isEditing}
                              color={isSelected ? 'primary' : 'default'}
                              variant={isSelected ? 'filled' : 'outlined'}
                              onClick={() => isEditing && handleArrayChange('professionalInfo', 'languages', language)}
                            />
                          );
                        })}
                      </Box>
                    </Grid>

                    {/* Certifications */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Certifications & Training</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {certifications.map((cert) => {
                          const isSelected = getProfessionalInfo('specialCertifications').includes(cert.value);
                          return (
                            <Chip
                              key={cert.value}
                              label={cert.label}
                              clickable={isEditing}
                              color={isSelected ? 'success' : 'default'}
                              variant={isSelected ? 'filled' : 'outlined'}
                              onClick={() => isEditing && handleArrayChange('professionalInfo', 'specialCertifications', cert.value)}
                            />
                          );
                        })}
                      </Box>
                    </Grid>

                    {/* Preferred Areas */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Preferred Service Areas</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {districts.map((district) => {
                          const isSelected = getProfessionalInfo('preferredAreas').includes(district);
                          return (
                            <Chip
                              key={district}
                              label={district}
                              clickable={isEditing}
                              color={isSelected ? 'secondary' : 'default'}
                              variant={isSelected ? 'filled' : 'outlined'}
                              onClick={() => isEditing && handleArrayChange('professionalInfo', 'preferredAreas', district)}
                            />
                          );
                        })}
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={getProfessionalInfo('isInsured')}
                            onChange={(e) => handleInputChange('professionalInfo', 'isInsured', e.target.checked)}
                            disabled={!isEditing}
                          />
                        }
                        label="I have personal accident insurance"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Vehicle Information Tab */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DirectionsCar /> Vehicle Information
                  </Typography>
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    All vehicle information must be accurate and up-to-date for insurance and compliance.
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Vehicle Type *</InputLabel>
                        <Select
                          value={getVehicleInfo('vehicleType')}
                          onChange={(e) => handleInputChange('vehicleInfo', 'vehicleType', e.target.value)}
                          label="Vehicle Type *"
                        >
                          {vehicleTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              <Box>
                                <Typography>{type.label}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                  {type.capacity}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="License Plate *"
                        value={getVehicleInfo('licensePlate')}
                        onChange={(e) => handleInputChange('vehicleInfo', 'licensePlate', e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Make (Brand)"
                        value={getVehicleInfo('make')}
                        onChange={(e) => handleInputChange('vehicleInfo', 'make', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Model"
                        value={getVehicleInfo('model')}
                        onChange={(e) => handleInputChange('vehicleInfo', 'model', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Year"
                        type="number"
                        value={getVehicleInfo('year')}
                        onChange={(e) => handleInputChange('vehicleInfo', 'year', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Color"
                        value={getVehicleInfo('color')}
                        onChange={(e) => handleInputChange('vehicleInfo', 'color', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Fuel Type</InputLabel>
                        <Select
                          value={getVehicleInfo('fuelType')}
                          onChange={(e) => handleInputChange('vehicleInfo', 'fuelType', e.target.value)}
                          label="Fuel Type"
                        >
                          {fuelTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Transmission</InputLabel>
                        <Select
                          value={getVehicleInfo('transmission')}
                          onChange={(e) => handleInputChange('vehicleInfo', 'transmission', e.target.value)}
                          label="Transmission"
                        >
                          {transmissionTypes.map((type) => (
                            <MenuItem key={type.value} value={type.value}>
                              {type.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Seating Capacity"
                        type="number"
                        value={getVehicleInfo('seatingCapacity')}
                        onChange={(e) => handleInputChange('vehicleInfo', 'seatingCapacity', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Engine Number"
                        value={getVehicleInfo('engineNumber')}
                        onChange={(e) => handleInputChange('vehicleInfo', 'engineNumber', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Insurance Provider"
                        value={getVehicleInfo('insuranceProvider')}
                        onChange={(e) => handleInputChange('vehicleInfo', 'insuranceProvider', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Insurance Expiry"
                        type="date"
                        value={getVehicleInfo('insuranceExpiry')}
                        onChange={(e) => handleInputChange('vehicleInfo', 'insuranceExpiry', e.target.value)}
                        disabled={!isEditing}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Road Worthy Expiry"
                        type="date"
                        value={getVehicleInfo('roadWorthyExpiry')}
                        onChange={(e) => handleInputChange('vehicleInfo', 'roadWorthyExpiry', e.target.value)}
                        disabled={!isEditing}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Last Service Date"
                        type="date"
                        value={getVehicleInfo('lastServiceDate')}
                        onChange={(e) => handleInputChange('vehicleInfo', 'lastServiceDate', e.target.value)}
                        disabled={!isEditing}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Documents Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DocumentScanner /> Documents & Certificates
                  </Typography>
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    All documents must be clear, valid, and current. Expired documents will result in account suspension.
                  </Alert>

                  <Grid container spacing={3}>
                    {/* Identification Documents */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Identification</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="National ID Number *"
                            value={getIdentification('nationalId')}
                            onChange={(e) => handleInputChange('identification', 'nationalId', e.target.value)}
                            disabled={!isEditing}
                            required
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="TIN Number (Optional)"
                            value={getIdentification('tinNumber')}
                            onChange={(e) => handleInputChange('identification', 'tinNumber', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Driving License Number *"
                            value={getIdentification('drivingLicense')}
                            onChange={(e) => handleInputChange('identification', 'drivingLicense', e.target.value)}
                            disabled={!isEditing}
                            required
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormControl fullWidth disabled={!isEditing}>
                            <InputLabel>License Class *</InputLabel>
                            <Select
                              value={getIdentification('licenseClass')}
                              onChange={(e) => handleInputChange('identification', 'licenseClass', e.target.value)}
                              label="License Class *"
                            >
                              {licenseClasses.map((license) => (
                                <MenuItem key={license.value} value={license.value}>
                                  <Box>
                                    <Typography>{license.label}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                      {license.description}
                                    </Typography>
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="License Expiry Date"
                            type="date"
                            value={getIdentification('licenseExpiry')}
                            onChange={(e) => handleInputChange('identification', 'licenseExpiry', e.target.value)}
                            disabled={!isEditing}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Document Upload Section */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Upload Documents
                      </Typography>
                      <Grid container spacing={2}>
                        {[
                          { id: 'nationalIdFront', label: 'National ID Front', icon: <DocumentScanner /> },
                          { id: 'nationalIdBack', label: 'National ID Back', icon: <DocumentScanner /> },
                          { id: 'drivingLicenseFront', label: 'Driving License Front', icon: <CreditCard /> },
                          { id: 'drivingLicenseBack', label: 'Driving License Back', icon: <CreditCard /> },
                          { id: 'insuranceCertificate', label: 'Insurance Certificate', icon: <Receipt /> },
                          { id: 'roadWorthyCertificate', label: 'Road Worthy Certificate', icon: <Verified /> }
                        ].map((doc) => (
                          <Grid item xs={4} key={doc.id}>
                            <Paper
                              sx={{
                                p: 2,
                                textAlign: 'center',
                                border: '2px dashed',
                                borderColor: 'grey.300',
                                cursor: isEditing ? 'pointer' : 'default',
                                '&:hover': isEditing ? { borderColor: 'primary.main' } : {}
                              }}
                              onClick={() => isEditing && document.getElementById(doc.id).click()}
                            >
                              <input
                                id={doc.id}
                                type="file"
                                hidden
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileUpload('profileMedia', doc.id, e.target.files[0])}
                              />
                              <Box sx={{ fontSize: 40, color: 'grey.400', mb: 1 }}>
                                {doc.icon}
                              </Box>
                              <Typography variant="body2">{doc.label}</Typography>
                              {uploadProgress[doc.id] && (
                                <CircularProgress
                                  variant="determinate"
                                  value={uploadProgress[doc.id]}
                                  size={20}
                                  sx={{ mt: 1 }}
                                />
                              )}
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Contact Information Tab - Similar to rider profile but kept for consistency */}
              {activeTab === 4 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn /> Contact Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Phone Number *"
                        value={getContactInfo('phone')}
                        onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                        disabled={!isEditing}
                        required
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'grey.400' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={getContactInfo('email')}
                        onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Email sx={{ mr: 1, color: 'grey.400' }} />
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        value={getContactInfo('address')}
                        onChange={(e) => handleInputChange('contactInfo', 'address', e.target.value)}
                        disabled={!isEditing}
                        multiline
                        rows={2}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="City"
                        value={getContactInfo('city')}
                        onChange={(e) => handleInputChange('contactInfo', 'city', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>District</InputLabel>
                        <Select
                          value={getContactInfo('district')}
                          onChange={(e) => handleInputChange('contactInfo', 'district', e.target.value)}
                          label="District"
                        >
                          {districts.map((district) => (
                            <MenuItem key={district} value={district}>
                              {district}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {/* Emergency Contact */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 3 }} />
                      <Typography variant="h6" gutterBottom>
                        Emergency Contact
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Contact Name"
                            value={getEmergencyContact('name')}
                            onChange={(e) => handleNestedInputChange('contactInfo', 'emergencyContact', 'name', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            value={getEmergencyContact('phone')}
                            onChange={(e) => handleNestedInputChange('contactInfo', 'emergencyContact', 'phone', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Relationship"
                            value={getEmergencyContact('relationship')}
                            onChange={(e) => handleNestedInputChange('contactInfo', 'emergencyContact', 'relationship', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Banking Information Tab */}
              {activeTab === 5 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCard /> Banking Information
                  </Typography>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    This information is used for processing your earnings and withdrawals securely.
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Bank Name *</InputLabel>
                        <Select
                          value={getBankingInfo('bankName')}
                          onChange={(e) => handleInputChange('bankingInfo', 'bankName', e.target.value)}
                          label="Bank Name *"
                        >
                          {banks.map((bank) => (
                            <MenuItem key={bank} value={bank}>
                              {bank}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Account Number *"
                        value={getBankingInfo('accountNumber')}
                        onChange={(e) => handleInputChange('bankingInfo', 'accountNumber', e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Account Name *"
                        value={getBankingInfo('accountName')}
                        onChange={(e) => handleInputChange('bankingInfo', 'accountName', e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Branch"
                        value={getBankingInfo('branch')}
                        onChange={(e) => handleInputChange('bankingInfo', 'branch', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Mobile Money Number"
                        value={getBankingInfo('mobileMoney')}
                        onChange={(e) => handleInputChange('bankingInfo', 'mobileMoney', e.target.value)}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: 'grey.400' }} />
                        }}
                        helperText="For quick payments and withdrawals"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Preferences Tab */}
              {activeTab === 6 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Security /> Preferences & Settings
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Notification Preferences
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={getPreference('notifications')}
                            onChange={(e) => handleInputChange('preferences', 'notifications', e.target.checked)}
                            disabled={!isEditing}
                          />
                        }
                        label="Push Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={getPreference('smsAlerts')}
                            onChange={(e) => handleInputChange('preferences', 'smsAlerts', e.target.checked)}
                            disabled={!isEditing}
                          />
                        }
                        label="SMS Alerts"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={getPreference('emailUpdates')}
                            onChange={(e) => handleInputChange('preferences', 'emailUpdates', e.target.checked)}
                            disabled={!isEditing}
                          />
                        }
                        label="Email Updates"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Ride Preferences
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={getPreference('autoAcceptRides')}
                            onChange={(e) => handleInputChange('preferences', 'autoAcceptRides', e.target.checked)}
                            disabled={!isEditing}
                          />
                        }
                        label="Auto-accept Rides"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={getPreference('shareLocation')}
                            onChange={(e) => handleInputChange('preferences', 'shareLocation', e.target.checked)}
                            disabled={!isEditing}
                          />
                        }
                        label="Share Location for Better Matching"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={getPreference('longTrips')}
                            onChange={(e) => handleInputChange('preferences', 'longTrips', e.target.checked)}
                            disabled={!isEditing}
                          />
                        }
                        label="Accept Long Trips (1+ hours)"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={getPreference('shortTrips')}
                            onChange={(e) => handleInputChange('preferences', 'shortTrips', e.target.checked)}
                            disabled={!isEditing}
                          />
                        }
                        label="Accept Short Trips (under 30 mins)"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={getPreference('nightDriving')}
                            onChange={(e) => handleInputChange('preferences', 'nightDriving', e.target.checked)}
                            disabled={!isEditing}
                          />
                        }
                        label="Night Driving (6 PM - 6 AM)"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DriverProfilePage;