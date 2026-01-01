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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress,
  RadioGroup,
  Radio,
  Checkbox,
  Slider,
  FormGroup,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Person,
  CameraAlt,
  Edit,
  Save,
  Cancel,
  Verified,
  DirectionsCar,
  Security,
  LocationOn,
  Phone,
  Email,
  CreditCard,
  DocumentScanner,
  CheckCircle,
  Error,
  Work,
  Group,
  Upload,
  Description,
  ContactPhone,
  Home,
  Payment,
  Notifications,
  Visibility,
  VisibilityOff,
  AutoAwesome,
  VerifiedUser,
  UploadFile,
  DriveEta,
  People,
  Schedule
} from '@mui/icons-material';

const DriverProfilePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [profileCompletion, setProfileCompletion] = useState(85);
  const [showAccountNumber, setShowAccountNumber] = useState(false);

  // Clean, relevant dummy data
  const initialProfileData = {
    personalInfo: {
      firstName: 'Kure',
      lastName: 'Peter',
      dateOfBirth: '1985-08-20',
      gender: 'male',
      nationality: 'Ugandan'
    },
    identification: {
      nationalId: 'CM9141515151515',
      drivingLicense: 'UB542315678',
      licenseClass: 'D',
      licenseExpiry: '2025-12-31'
    },
    professionalInfo: {
      driverType: 'taxi',
      yearsExperience: '8',
      languages: ['English', 'Luganda', 'Swahili'],
      availability: 'full-time',
      preferredAreas: ['Kampala Central', 'Entebbe'],
      hourlyRate: '15000'
    },
    vehicleInfo: {
      vehicleType: 'sedan',
      make: 'Toyota',
      model: 'Noah',
      year: '2020',
      licensePlate: 'UBA 789K',
      seatingCapacity: '7',
      fuelType: 'petrol',
      transmission: 'automatic'
    },
    contactInfo: {
      phone: '+256712345678',
      email: 'kure.peter@enfuna.com',
      address: 'Plot 456, Entebbe Road',
      city: 'Kampala',
      emergencyContact: {
        name: 'Sarafina Vangamoi',
        phone: '+256781234567',
        relationship: 'Wife'
      }
    },
    bankingInfo: {
      bankName: 'Stanbic Bank',
      accountNumber: '9876543210',
      accountName: 'Peter Kure',
      mobileMoney: '+256712345678',
      mobileMoneyProvider: 'mtn'
    },
    preferences: {
      notifications: true,
      smsAlerts: true,
      longTrips: true,
      shortTrips: true,
      nightDriving: false,
      autoAcceptRides: false
    },
    stats: {
      totalRiders: 1247,
      completedTrips: 1230,
      activeHours: 856
    }
  };

  const [profileData, setProfileData] = useState(initialProfileData);

  useEffect(() => {
    calculateProfileCompletion(profileData);
  }, []);

  // Driver-specific options
  const driverTypes = [
    { value: 'taxi', label: '🚗 Taxi Driver' },
    { value: 'boda', label: '🏍️ Boda Rider' },
    { value: 'truck', label: '🚚 Truck Driver' },
    { value: 'delivery', label: '📦 Delivery Driver' }
  ];

  const vehicleTypes = [
    { value: 'sedan', label: '🚗 Sedan' },
    { value: 'suv', label: '🚙 SUV' },
    { value: 'minibus', label: '🚐 Minibus' },
    { value: 'motorcycle', label: '🏍️ Motorcycle' }
  ];

  const fuelTypes = [
    { value: 'petrol', label: '⛽ Petrol' },
    { value: 'diesel', label: '🛢️ Diesel' },
    { value: 'electric', label: '⚡ Electric' }
  ];

  const transmissionTypes = [
    { value: 'manual', label: '🔄 Manual' },
    { value: 'automatic', label: '⚙️ Automatic' }
  ];

  const languages = ['English', 'Luganda', 'Swahili'];

  const banks = ['Stanbic Bank', 'Centenary Bank', 'DFCU Bank', 'Equity Bank'];

  const mobileMoneyProviders = [
    { value: 'mtn', label: 'MTN Mobile Money' },
    { value: 'airtel', label: 'Airtel Money' }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
            setTimeout(() => {
              setUploadProgress(prev => ({ ...prev, [field]: 0 }));
            }, 500);
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
      profileData.professionalInfo?.driverType,
      profileData.vehicleInfo?.vehicleType,
      profileData.vehicleInfo?.licensePlate,
      profileData.contactInfo?.phone,
      profileData.bankingInfo?.bankName,
      profileData.bankingInfo?.accountNumber
    ];

    const missingFields = requiredFields.filter(field => !field);
    
    if (missingFields.length > 0) {
      alert('Please fill in all required fields (marked with *) before saving.');
      return;
    }

    calculateProfileCompletion(profileData);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setProfileData(initialProfileData);
    setIsEditing(false);
  };

  const requiredDocuments = [
    { name: 'National ID', field: 'nationalId', required: true, type: 'image' },
    { name: 'Driving License', field: 'drivingLicense', required: true, type: 'image' },
    { name: 'Vehicle Photo', field: 'vehiclePhoto', required: true, type: 'image' },
    { name: 'Profile Photo', field: 'profilePhoto', required: true, type: 'image' }
  ];

  const tabLabels = [
    { icon: <Person />, label: "Personal" },
    { icon: <Work />, label: "Professional" },
    { icon: <DriveEta />, label: "Vehicle" },
    { icon: <DocumentScanner />, label: "Documents" },
    { icon: <LocationOn />, label: "Contact" },
    { icon: <CreditCard />, label: "Banking" },
    { icon: <Security />, label: "Preferences" }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      pl: { xs: 0, md: 0 }
    }}>
      {/* Main Content Area */}
      <Box sx={{ p: isMobile ? 1 : 2 }}>
        <Card sx={{ 
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <Box sx={{ 
            p: 2, 
            backgroundColor: '#1e40af',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Rider Profile
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Manage your rider account
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {!isEditing ? (
                <Button
                  startIcon={<Edit />}
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    backgroundColor: '#fbbf24',
                    color: '#000',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#f59e0b'
                    }
                  }}
                  size="small"
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
                      borderColor: 'white',
                      color: 'white',
                      '&:hover': {
                        borderColor: '#fbbf24'
                      }
                    }}
                    size="small"
                  >
                    Cancel
                  </Button>
                  <Button
                    startIcon={<Save />}
                    variant="contained"
                    onClick={handleSaveProfile}
                    sx={{
                      backgroundColor: '#fbbf24',
                      color: '#000',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#f59e0b'
                      }
                    }}
                    size="small"
                  >
                    Save
                  </Button>
                </>
              )}
            </Box>
          </Box>

          <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
            <Grid container spacing={2}>
              {/* Left Sidebar - Profile Summary */}
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  {/* Profile Card */}
                  <Card sx={{ border: '1px solid #e2e8f0' }}>
                    <CardContent sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                        <Avatar
                          sx={{ 
                            width: 80, 
                            height: 80, 
                            mx: 'auto', 
                            mb: 2,
                            border: '2px solid #1e40af'
                          }}
                        >
                          <Person sx={{ fontSize: 40 }} />
                        </Avatar>
                        {isEditing && (
                          <IconButton
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              backgroundColor: '#1e40af',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: '#1e3a8a'
                              }
                            }}
                            component="label"
                            size="small"
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

                      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        {profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
                      </Typography>
                      
                      <Chip
                        label={driverTypes.find(d => d.value === profileData.professionalInfo.driverType)?.label}
                        sx={{ 
                          backgroundColor: '#1e40af',
                          color: 'white',
                          fontWeight: 'bold',
                          mb: 1,
                          fontSize: '0.75rem'
                        }}
                      />

                      <Chip
                        icon={<Verified />}
                        label="Verified"
                        color="success"
                        variant="filled"
                        sx={{ mb: 2 }}
                        size="small"
                      />

                      {/* Profile Completion */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption">Profile Completion</Typography>
                          <Typography variant="caption" fontWeight="bold" color="#1e40af">
                            {profileCompletion}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={profileCompletion}
                          sx={{ 
                            height: 4, 
                            borderRadius: 2,
                            backgroundColor: '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: profileCompletion >= 80 ? '#10b981' : '#f59e0b'
                            }
                          }}
                        />
                      </Box>

                      {/* Rider Stats */}
                      <Grid container spacing={1}>
                        <Grid item xs={4}>
                          <Paper sx={{ p: 1, textAlign: 'center', backgroundColor: '#f1f5f9' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                              <People sx={{ color: '#1e40af', fontSize: 14 }} />
                              <Typography variant="body2" fontWeight="bold">
                                {profileData.stats.totalRiders.toLocaleString()}
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Total Riders</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={4}>
                          <Paper sx={{ p: 1, textAlign: 'center', backgroundColor: '#f1f5f9' }}>
                            <Typography variant="body2" fontWeight="bold">
                              {profileData.stats.completedTrips.toLocaleString()}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Trips</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={4}>
                          <Paper sx={{ p: 1, textAlign: 'center', backgroundColor: '#f1f5f9' }}>
                            <Typography variant="body2" fontWeight="bold">
                              {profileData.stats.activeHours}
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>Hours</Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Verification Status */}
                  <Card sx={{ border: '1px solid #e2e8f0' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                        Verification Status
                      </Typography>
                      <Stepper orientation="vertical" activeStep={3} sx={{ '& .MuiStepLabel-label': { fontSize: '0.75rem' } }}>
                        <Step>
                          <StepLabel>Profile Setup</StepLabel>
                        </Step>
                        <Step>
                          <StepLabel>Document Upload</StepLabel>
                        </Step>
                        <Step>
                          <StepLabel>Background Check</StepLabel>
                        </Step>
                        <Step>
                          <StepLabel>Verified</StepLabel>
                        </Step>
                      </Stepper>
                    </CardContent>
                  </Card>
                </Box>
              </Grid>

              {/* Main Content Area */}
              <Grid item xs={12} md={8}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 2
                }}>
                  {/* Tab Navigation */}
                  <Paper sx={{ 
                    p: 0.5, 
                    borderRadius: 1,
                    backgroundColor: '#f1f5f9'
                  }}>
                    <Tabs
                      value={activeTab}
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        minHeight: 40,
                        '& .MuiTab-root': {
                          minHeight: 40,
                          minWidth: 60,
                          fontSize: '0.75rem',
                          '& .MuiSvgIcon-root': {
                            fontSize: 16
                          }
                        }
                      }}
                    >
                      {tabLabels.map((tab, index) => (
                        <Tab 
                          key={index} 
                          icon={tab.icon}
                          label={!isMobile && tab.label}
                          iconPosition="start"
                        />
                      ))}
                    </Tabs>
                  </Paper>

                  {/* Tab Content */}
                  <Box sx={{ minHeight: 300 }}>
                    {/* Personal Information */}
                    {activeTab === 0 && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Personal Information
                        </Typography>
                        
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="First Name *"
                              value={profileData.personalInfo.firstName}
                              onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                              disabled={!isEditing}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Last Name *"
                              value={profileData.personalInfo.lastName}
                              onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                              disabled={!isEditing}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Date of Birth"
                              type="date"
                              value={profileData.personalInfo.dateOfBirth}
                              onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                              disabled={!isEditing}
                              InputLabelProps={{ shrink: true }}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small" disabled={!isEditing}>
                              <InputLabel>Gender</InputLabel>
                              <Select
                                value={profileData.personalInfo.gender}
                                onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                                label="Gender"
                              >
                                <MenuItem value="male">Male</MenuItem>
                                <MenuItem value="female">Female</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Professional Information */}
                    {activeTab === 1 && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Professional Information
                        </Typography>

                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small" disabled={!isEditing}>
                              <InputLabel>Rider Type *</InputLabel>
                              <Select
                                value={profileData.professionalInfo.driverType}
                                onChange={(e) => handleInputChange('professionalInfo', 'driverType', e.target.value)}
                                label="Rider Type *"
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
                              value={profileData.professionalInfo.yearsExperience}
                              onChange={(e) => handleInputChange('professionalInfo', 'yearsExperience', e.target.value)}
                              disabled={!isEditing}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>

                          {/* Languages */}
                          <Grid item xs={12}>
                            <Typography variant="caption" gutterBottom display="block">Languages Spoken</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {languages.map((language) => {
                                const isSelected = profileData.professionalInfo.languages.includes(language);
                                return (
                                  <Chip
                                    key={language}
                                    label={language}
                                    clickable={isEditing}
                                    sx={{
                                      backgroundColor: isSelected ? '#1e40af' : 'transparent',
                                      color: isSelected ? 'white' : '#1e40af',
                                      borderColor: '#1e40af',
                                      '&:hover': isEditing ? {
                                        backgroundColor: '#1e40af',
                                        color: 'white'
                                      } : {}
                                    }}
                                    variant={isSelected ? 'filled' : 'outlined'}
                                    onClick={() => isEditing && handleArrayChange('professionalInfo', 'languages', language)}
                                    size="small"
                                  />
                                );
                              })}
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Vehicle Information */}
                    {activeTab === 2 && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Vehicle Information
                        </Typography>

                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small" disabled={!isEditing}>
                              <InputLabel>Vehicle Type *</InputLabel>
                              <Select
                                value={profileData.vehicleInfo.vehicleType}
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
                              value={profileData.vehicleInfo.licensePlate}
                              onChange={(e) => handleInputChange('vehicleInfo', 'licensePlate', e.target.value)}
                              disabled={!isEditing}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Vehicle Make"
                              value={profileData.vehicleInfo.make}
                              onChange={(e) => handleInputChange('vehicleInfo', 'make', e.target.value)}
                              disabled={!isEditing}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Vehicle Model"
                              value={profileData.vehicleInfo.model}
                              onChange={(e) => handleInputChange('vehicleInfo', 'model', e.target.value)}
                              disabled={!isEditing}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Documents */}
                    {activeTab === 3 && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Documents
                        </Typography>
                        
                        <Grid container spacing={1}>
                          {requiredDocuments.map((doc, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                              <Card sx={{ 
                                border: '1px dashed #cbd5e1',
                                backgroundColor: '#f8fafc',
                                height: '100%'
                              }}>
                                <CardContent sx={{ p: 1.5 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <Description sx={{ color: '#64748b', fontSize: 20 }} />
                                    <Typography variant="caption" fontWeight="bold">
                                      {doc.name}
                                    </Typography>
                                  </Box>
                                  
                                  <Chip
                                    label={doc.required ? 'Required' : 'Optional'}
                                    size="small"
                                    sx={{
                                      backgroundColor: doc.required ? '#fee2e2' : '#fef3c7',
                                      color: doc.required ? '#dc2626' : '#92400e',
                                      mb: 1,
                                      fontSize: '0.65rem'
                                    }}
                                  />
                                  
                                  {uploadProgress[doc.field] > 0 && uploadProgress[doc.field] < 100 ? (
                                    <Box sx={{ mt: 1 }}>
                                      <LinearProgress 
                                        variant="determinate" 
                                        value={uploadProgress[doc.field]} 
                                        sx={{ height: 4, borderRadius: 2 }}
                                      />
                                    </Box>
                                  ) : (
                                    <Button
                                      variant="outlined"
                                      component="label"
                                      size="small"
                                      startIcon={<UploadFile />}
                                      sx={{
                                        mt: 0.5,
                                        width: '100%',
                                        fontSize: '0.75rem'
                                      }}
                                    >
                                      Upload
                                      <input
                                        type="file"
                                        hidden
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileUpload('profileMedia', doc.field, e.target.files[0])}
                                      />
                                    </Button>
                                  )}
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}

                    {/* Contact Information */}
                    {activeTab === 4 && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Contact Information
                        </Typography>

                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Phone Number *"
                              value={profileData.contactInfo.phone}
                              onChange={(e) => handleInputChange('contactInfo', 'phone', e.target.value)}
                              disabled={!isEditing}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Email Address"
                              type="email"
                              value={profileData.contactInfo.email}
                              onChange={(e) => handleInputChange('contactInfo', 'email', e.target.value)}
                              disabled={!isEditing}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Address"
                              value={profileData.contactInfo.address}
                              onChange={(e) => handleInputChange('contactInfo', 'address', e.target.value)}
                              disabled={!isEditing}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Divider sx={{ my: 1 }}>
                              <Typography variant="caption" fontWeight="bold">Emergency Contact</Typography>
                            </Divider>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Contact Name"
                              value={profileData.contactInfo.emergencyContact.name}
                              onChange={(e) => handleNestedInputChange('contactInfo', 'emergencyContact', 'name', e.target.value)}
                              disabled={!isEditing}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Emergency Phone"
                              value={profileData.contactInfo.emergencyContact.phone}
                              onChange={(e) => handleNestedInputChange('contactInfo', 'emergencyContact', 'phone', e.target.value)}
                              disabled={!isEditing}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Banking Information */}
                    {activeTab === 5 && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Banking Information
                        </Typography>

                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small" disabled={!isEditing}>
                              <InputLabel>Bank Name *</InputLabel>
                              <Select
                                value={profileData.bankingInfo.bankName}
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
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Account Number *"
                              type={showAccountNumber ? "text" : "password"}
                              value={profileData.bankingInfo.accountNumber}
                              onChange={(e) => handleInputChange('bankingInfo', 'accountNumber', e.target.value)}
                              disabled={!isEditing}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowAccountNumber(!showAccountNumber)}
                                      edge="end"
                                      size="small"
                                    >
                                      {showAccountNumber ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small" disabled={!isEditing}>
                              <InputLabel>Mobile Money</InputLabel>
                              <Select
                                value={profileData.bankingInfo.mobileMoneyProvider}
                                onChange={(e) => handleInputChange('bankingInfo', 'mobileMoneyProvider', e.target.value)}
                                label="Mobile Money"
                              >
                                {mobileMoneyProviders.map((provider) => (
                                  <MenuItem key={provider.value} value={provider.value}>
                                    {provider.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Mobile Money Number"
                              value={profileData.bankingInfo.mobileMoney}
                              onChange={(e) => handleInputChange('bankingInfo', 'mobileMoney', e.target.value)}
                              disabled={!isEditing}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Preferences */}
                    {activeTab === 6 && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                          Preferences
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Card sx={{ border: '1px solid #e2e8f0' }}>
                              <CardContent>
                                <Typography variant="caption" gutterBottom fontWeight="bold" display="block">
                                  <Notifications sx={{ mr: 1, verticalAlign: 'middle' }} />
                                  Notifications
                                </Typography>
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={profileData.preferences.notifications}
                                        onChange={(e) => handleInputChange('preferences', 'notifications', e.target.checked)}
                                        size="small"
                                        disabled={!isEditing}
                                      />
                                    }
                                    label="Enable Notifications"
                                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
                                  />
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={profileData.preferences.smsAlerts}
                                        onChange={(e) => handleInputChange('preferences', 'smsAlerts', e.target.checked)}
                                        size="small"
                                        disabled={!isEditing}
                                      />
                                    }
                                    label="SMS Alerts"
                                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
                                  />
                                </FormGroup>
                              </CardContent>
                            </Card>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Card sx={{ border: '1px solid #e2e8f0' }}>
                              <CardContent>
                                <Typography variant="caption" gutterBottom fontWeight="bold" display="block">
                                  <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle' }} />
                                  Ride Preferences
                                </Typography>
                                <FormGroup>
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={profileData.preferences.longTrips}
                                        onChange={(e) => handleInputChange('preferences', 'longTrips', e.target.checked)}
                                        size="small"
                                        disabled={!isEditing}
                                      />
                                    }
                                    label="Long Distance Trips"
                                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
                                  />
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={profileData.preferences.nightDriving}
                                        onChange={(e) => handleInputChange('preferences', 'nightDriving', e.target.checked)}
                                        size="small"
                                        disabled={!isEditing}
                                      />
                                    }
                                    label="Night Driving"
                                    sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
                                  />
                                </FormGroup>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DriverProfilePage;