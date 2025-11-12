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
  TwoWheeler,
  BusinessCenter,
  Security,
  LocationOn,
  Phone,
  Email,
  CalendarToday,
  CreditCard,
  DocumentScanner,
  CloudUpload,
  CheckCircle,
  Error
} from '@mui/icons-material';

const RiderProfilePage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, verified, rejected
  const [uploadProgress, setUploadProgress] = useState({});
  const [profileCompletion, setProfileCompletion] = useState(65);

  // Profile data state
  const [profileData, setProfileData] = useState({
    // Personal Information
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      nationality: 'Ugandan',
      maritalStatus: ''
    },
    
    // Identification
    identification: {
      nationalId: '',
      nationalIdPhoto: null,
      tinNumber: '',
      drivingLicense: '',
      drivingLicensePhoto: null
    },
    
    // Vehicle Information
    vehicleInfo: {
      vehicleType: '', // motorcycle, boda-boda, scooter, bicycle
      make: '',
      model: '',
      year: '',
      licensePlate: '',
      color: '',
      engineNumber: '',
      chasisNumber: '',
      insuranceProvider: '',
      insuranceExpiry: ''
    },
    
    // Contact Information
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
    
    // Banking Information
    bankingInfo: {
      bankName: '',
      accountNumber: '',
      accountName: '',
      branch: ''
    },
    
    // Profile Media
    profileMedia: {
      profilePhoto: null,
      nationalIdFront: null,
      nationalIdBack: null,
      drivingLicenseFront: null,
      drivingLicenseBack: null,
      vehiclePhoto: null
    },
    
    // Preferences
    preferences: {
      notifications: true,
      smsAlerts: true,
      emailUpdates: false,
      autoStartRide: true,
      shareLocation: true
    }
  });

  // Mock initial data
  const initialData = {
    personalInfo: {
      firstName: 'David',
      lastName: 'Kato',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      nationality: 'Ugandan',
      maritalStatus: 'single'
    },
    identification: {
      nationalId: 'CM9141515151515',
      tinNumber: '123456789',
      drivingLicense: 'UB542315678'
    },
    vehicleInfo: {
      vehicleType: 'boda-boda',
      make: 'Bajaj',
      model: 'Boxer',
      year: '2022',
      licensePlate: 'UBA 123A',
      color: 'Red',
      engineNumber: 'BG123456789',
      chasisNumber: 'CH123456789',
      insuranceProvider: 'Liberty Health',
      insuranceExpiry: '2024-12-31'
    },
    contactInfo: {
      phone: '+256712345678',
      email: 'david.kato@example.com',
      address: 'Plot 123, Kampala Road',
      city: 'Kampala',
      district: 'Kampala Central',
      emergencyContact: {
        name: 'Sarah Kato',
        phone: '+256781234567',
        relationship: 'Sister'
      }
    },
    bankingInfo: {
      bankName: 'Centenary Bank',
      accountNumber: '1234567890',
      accountName: 'David Kato',
      branch: 'Kampala Main'
    }
  };

  useEffect(() => {
    // Simulate loading profile data
    setProfileData(initialData);
    calculateProfileCompletion(initialData);
  }, []);

  const vehicleTypes = [
    { value: 'motorcycle', label: '🏍️ Motorcycle', description: 'Standard motorcycle' },
    { value: 'boda-boda', label: '🚲 Boda Boda', description: 'Motorcycle taxi' },
    { value: 'scooter', label: '🛵 Scooter', description: 'Automatic scooter' },
    { value: 'bicycle', label: '🚴 Bicycle', description: 'Pedal bicycle' },
    { value: 'tuk-tuk', label: '🛺 Tuk Tuk', description: 'Three-wheeler' }
  ];

  const banks = [
    'Centenary Bank',
    'Stanbic Bank',
    'Standard Chartered',
    'DFCU Bank',
    'Bank of Africa',
    'Equity Bank',
    'Absa Bank',
    'Opportunity Bank'
  ];

  const districts = [
    'Kampala Central',
    'Kawempe',
    'Makindye',
    'Nakawa',
    'Rubaga',
    'Wakiso',
    'Mukono',
    'Entebbe'
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, nestedField, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedField]: {
          ...prev[section][nestedField],
          [field]: value
        }
      }
    }));
  };

  const handleFileUpload = (section, field, file) => {
    if (file) {
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [field]: 0 }));
      
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev[field] + 10;
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            setProfileData(prevData => ({
              ...prevData,
              profileMedia: {
                ...prevData.profileMedia,
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

    const sections = ['personalInfo', 'identification', 'vehicleInfo', 'contactInfo', 'bankingInfo'];
    
    sections.forEach(section => {
      Object.keys(data[section]).forEach(field => {
        totalFields++;
        if (data[section][field] && data[section][field] !== '') {
          completedFields++;
        }
      });
    });

    const completionPercentage = Math.round((completedFields / totalFields) * 100);
    setProfileCompletion(completionPercentage);
  };

  const handleSaveProfile = () => {
    // Simulate API call to save profile
    console.log('Saving profile:', profileData);
    calculateProfileCompletion(profileData);
    setIsEditing(false);
    
    // Show success message
    alert('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setProfileData(initialData);
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
      case 'verified': return 'Verified';
      case 'rejected': return 'Verification Failed';
      default: return 'Pending Verification';
    }
  };

  const requiredDocuments = [
    { name: 'National ID Front', field: 'nationalIdFront', required: true },
    { name: 'National ID Back', field: 'nationalIdBack', required: true },
    { name: 'Driving License Front', field: 'drivingLicenseFront', required: true },
    { name: 'Driving License Back', field: 'drivingLicenseBack', required: false },
    { name: 'Vehicle Photo', field: 'vehiclePhoto', required: true },
    { name: 'Profile Photo', field: 'profilePhoto', required: true }
  ];

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Rider Profile 👤
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Manage your personal information and verification status
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
                  src={profileData.profileMedia.profilePhoto}
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
                {profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Rider ID: RDR-ENF00124
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

              {/* Quick Stats */}
              <Grid container spacing={1} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="h6" color="primary.main">
                      156
                    </Typography>
                    <Typography variant="caption">Total Rides</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1, textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main">
                      4.8
                    </Typography>
                    <Typography variant="caption">Rating</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Verification Status */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Verification Status</Typography>
              <Stepper orientation="vertical" activeStep={verificationStatus === 'verified' ? 3 : 1}>
                <Step>
                  <StepLabel>Profile Information</StepLabel>
                  <StepContent>
                    <Typography variant="body2">
                      Basic personal details completed
                    </Typography>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Document Upload</StepLabel>
                  <StepContent>
                    <Typography variant="body2">
                      Upload required identification documents
                    </Typography>
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Background Check</StepLabel>
                  <StepContent>
                    <Typography variant="body2">
                      Verification in progress
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
                      {profileData.profileMedia[doc.field] ? (
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
              <Tab icon={<DocumentScanner />} label="Identification" />
              <Tab icon={<TwoWheeler />} label="Vehicle Info" />
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
                    This information helps us verify your identity and provide better services.
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={profileData.personalInfo.firstName}
                        onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={profileData.personalInfo.lastName}
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
                        value={profileData.personalInfo.dateOfBirth}
                        onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={profileData.personalInfo.gender}
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
                          value={profileData.personalInfo.nationality}
                          onChange={(e) => handleInputChange('personalInfo', 'nationality', e.target.value)}
                          label="Nationality"
                        >
                          <MenuItem value="Ugandan">Ugandan</MenuItem>
                          <MenuItem value="Kenyan">Kenyan</MenuItem>
                          <MenuItem value="Tanzanian">Tanzanian</MenuItem>
                          <MenuItem value="Rwandan">Rwandan</MenuItem>
                          <MenuItem value="Burundian">Burundian</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Marital Status</InputLabel>
                        <Select
                          value={profileData.personalInfo.maritalStatus}
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

              {/* Identification Tab */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DocumentScanner /> Identification Documents
                  </Typography>
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    All identification documents must be clear, valid, and match the information provided.
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="National ID Number"
                        value={profileData.identification.nationalId}
                        onChange={(e) => handleInputChange('identification', 'nationalId', e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="TIN Number (Optional)"
                        value={profileData.identification.tinNumber}
                        onChange={(e) => handleInputChange('identification', 'tinNumber', e.target.value)}
                        disabled={!isEditing}
                        helperText="Tax Identification Number"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Driving License Number"
                        value={profileData.identification.drivingLicense}
                        onChange={(e) => handleInputChange('identification', 'drivingLicense', e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>

                    {/* Document Upload Section */}
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        Upload Documents
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Paper
                            sx={{
                              p: 2,
                              textAlign: 'center',
                              border: '2px dashed',
                              borderColor: 'grey.300',
                              cursor: isEditing ? 'pointer' : 'default',
                              '&:hover': isEditing ? { borderColor: 'primary.main' } : {}
                            }}
                            onClick={() => isEditing && document.getElementById('nationalIdFront').click()}
                          >
                            <input
                              id="nationalIdFront"
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) => handleFileUpload('profileMedia', 'nationalIdFront', e.target.files[0])}
                            />
                            <DocumentScanner sx={{ fontSize: 40, color: 'grey.400', mb: 1 }} />
                            <Typography variant="body2">National ID Front</Typography>
                            {uploadProgress.nationalIdFront && (
                              <CircularProgress
                                variant="determinate"
                                value={uploadProgress.nationalIdFront}
                                size={20}
                                sx={{ mt: 1 }}
                              />
                            )}
                          </Paper>
                        </Grid>
                        <Grid item xs={4}>
                          <Paper
                            sx={{
                              p: 2,
                              textAlign: 'center',
                              border: '2px dashed',
                              borderColor: 'grey.300',
                              cursor: isEditing ? 'pointer' : 'default',
                              '&:hover': isEditing ? { borderColor: 'primary.main' } : {}
                            }}
                            onClick={() => isEditing && document.getElementById('nationalIdBack').click()}
                          >
                            <input
                              id="nationalIdBack"
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) => handleFileUpload('profileMedia', 'nationalIdBack', e.target.files[0])}
                            />
                            <DocumentScanner sx={{ fontSize: 40, color: 'grey.400', mb: 1 }} />
                            <Typography variant="body2">National ID Back</Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={4}>
                          <Paper
                            sx={{
                              p: 2,
                              textAlign: 'center',
                              border: '2px dashed',
                              borderColor: 'grey.300',
                              cursor: isEditing ? 'pointer' : 'default',
                              '&:hover': isEditing ? { borderColor: 'primary.main' } : {}
                            }}
                            onClick={() => isEditing && document.getElementById('drivingLicenseFront').click()}
                          >
                            <input
                              id="drivingLicenseFront"
                              type="file"
                              hidden
                              accept="image/*"
                              onChange={(e) => handleFileUpload('profileMedia', 'drivingLicenseFront', e.target.files[0])}
                            />
                            <CreditCard sx={{ fontSize: 40, color: 'grey.400', mb: 1 }} />
                            <Typography variant="body2">Driving License</Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Vehicle Information Tab */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TwoWheeler /> Vehicle Information
                  </Typography>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    Provide accurate details about your vehicle for insurance and verification purposes.
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <FormControl fullWidth disabled={!isEditing}>
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
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="License Plate *"
                        value={profileData.vehicleInfo.licensePlate}
                        onChange={(e) => handleInputChange('vehicleInfo', 'licensePlate', e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Make (Brand)"
                        value={profileData.vehicleInfo.make}
                        onChange={(e) => handleInputChange('vehicleInfo', 'make', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Model"
                        value={profileData.vehicleInfo.model}
                        onChange={(e) => handleInputChange('vehicleInfo', 'model', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Year"
                        type="number"
                        value={profileData.vehicleInfo.year}
                        onChange={(e) => handleInputChange('vehicleInfo', 'year', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Color"
                        value={profileData.vehicleInfo.color}
                        onChange={(e) => handleInputChange('vehicleInfo', 'color', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Engine Number"
                        value={profileData.vehicleInfo.engineNumber}
                        onChange={(e) => handleInputChange('vehicleInfo', 'engineNumber', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Chasis Number"
                        value={profileData.vehicleInfo.chasisNumber}
                        onChange={(e) => handleInputChange('vehicleInfo', 'chasisNumber', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Insurance Provider"
                        value={profileData.vehicleInfo.insuranceProvider}
                        onChange={(e) => handleInputChange('vehicleInfo', 'insuranceProvider', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Insurance Expiry"
                        type="date"
                        value={profileData.vehicleInfo.insuranceExpiry}
                        onChange={(e) => handleInputChange('vehicleInfo', 'insuranceExpiry', e.target.value)}
                        disabled={!isEditing}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>

                    {/* Vehicle Photo Upload */}
                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          border: '2px dashed',
                          borderColor: 'grey.300',
                          cursor: isEditing ? 'pointer' : 'default',
                          '&:hover': isEditing ? { borderColor: 'primary.main' } : {}
                        }}
                        onClick={() => isEditing && document.getElementById('vehiclePhoto').click()}
                      >
                        <input
                          id="vehiclePhoto"
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => handleFileUpload('profileMedia', 'vehiclePhoto', e.target.files[0])}
                        />
                        <TwoWheeler sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                          Upload Vehicle Photo
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Clear photo showing license plate and entire vehicle
                        </Typography>
                        {uploadProgress.vehiclePhoto && (
                          <CircularProgress
                            variant="determinate"
                            value={uploadProgress.vehiclePhoto}
                            sx={{ mt: 2 }}
                          />
                        )}
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Contact Information Tab */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn /> Contact Information
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Phone Number *"
                        value={profileData.contactInfo.phone}
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
                        value={profileData.contactInfo.email}
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
                        value={profileData.contactInfo.address}
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
                        value={profileData.contactInfo.city}
                        onChange={(e) => handleInputChange('contactInfo', 'city', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>District</InputLabel>
                        <Select
                          value={profileData.contactInfo.district}
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
                            value={profileData.contactInfo.emergencyContact.name}
                            onChange={(e) => handleNestedInputChange('contactInfo', 'emergencyContact', 'name', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            value={profileData.contactInfo.emergencyContact.phone}
                            onChange={(e) => handleNestedInputChange('contactInfo', 'emergencyContact', 'phone', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            label="Relationship"
                            value={profileData.contactInfo.emergencyContact.relationship}
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
              {activeTab === 4 && (
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
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Account Number *"
                        value={profileData.bankingInfo.accountNumber}
                        onChange={(e) => handleInputChange('bankingInfo', 'accountNumber', e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Account Name *"
                        value={profileData.bankingInfo.accountName}
                        onChange={(e) => handleInputChange('bankingInfo', 'accountName', e.target.value)}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Branch"
                        value={profileData.bankingInfo.branch}
                        onChange={(e) => handleInputChange('bankingInfo', 'branch', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Preferences Tab */}
              {activeTab === 5 && (
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
                            checked={profileData.preferences.notifications}
                            onChange={(e) => handleInputChange('preferences', 'notifications', e.target.checked)}
                            disabled={!isEditing}
                          />
                        }
                        label="Push Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profileData.preferences.smsAlerts}
                            onChange={(e) => handleInputChange('preferences', 'smsAlerts', e.target.checked)}
                            disabled={!isEditing}
                          />
                        }
                        label="SMS Alerts"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profileData.preferences.emailUpdates}
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
                            checked={profileData.preferences.autoStartRide}
                            onChange={(e) => handleInputChange('preferences', 'autoStartRide', e.target.checked)}
                            disabled={!isEditing}
                          />
                        }
                        label="Auto-start Ride Detection"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={profileData.preferences.shareLocation}
                            onChange={(e) => handleInputChange('preferences', 'shareLocation', e.target.checked)}
                            disabled={!isEditing}
                          />
                        }
                        label="Share Location for Better Matching"
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

export default RiderProfilePage;