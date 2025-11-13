import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  LinearProgress,
  Badge,
  Alert,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Storefront,
  Person,
  Security,
  LocalAtm,
  Receipt,
  TrendingUp,
  Notifications,
  Add,
  Close,
  LocationOn,
  Schedule,
  Money,
  VerifiedUser,
  Warning,
  CheckCircle,
  Cancel,
  Edit,
  Upload,
  Download,
  History,
  Inventory,
  DeliveryDining,
  AccountBalance,
  Gavel,
  Assignment,
  QrCode2,
  Payment,
  TwoWheeler,
  DirectionsCar
} from '@mui/icons-material';

const VendorProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState('');

  // Vendor data
  const [vendor, setVendor] = useState({
    id: 'VEND001',
    businessName: 'Quick Deliveries Uganda',
    tradingName: 'QuickDeliveries',
    vendorType: 'logistics',
    registrationNumber: '800200789012',
    tinNumber: '1023456789',
    businessAddress: 'Plot 456, Bombo Road, Kampala',
    contactPerson: 'Sarah Nalwoga',
    phone: '+256782345678',
    email: 'sarah@quickdeliveries.ug',
    
    // Vehicle Information
    vehicles: [
      {
        id: 'VH001',
        type: 'motorcycle',
        plate: 'UAB 789X',
        model: 'Bajaj Boxer',
        year: 2023,
        insurance: 'valid',
        registration: 'valid'
      },
      {
        id: 'VH002',
        type: 'motorcycle',
        plate: 'UAB 790Y',
        model: 'TVS Star',
        year: 2022,
        insurance: 'valid',
        registration: 'valid'
      }
    ],
    
    // Legal Compliance
    compliance: {
      businessRegistration: {
        verified: true,
        expiry: '2025-12-31',
        document: 'business_registration.pdf',
        status: 'valid'
      },
      tradingLicense: {
        verified: true,
        expiry: '2024-12-31',
        document: 'trading_license.pdf',
        status: 'valid'
      },
      tinCertificate: {
        verified: true,
        expiry: 'permanent',
        document: 'tin_certificate.pdf',
        status: 'valid'
      },
      nationalId: {
        verified: true,
        document: 'national_id.pdf',
        status: 'valid'
      },
      operatorLicense: {
        verified: true,
        expiry: '2024-12-31',
        document: 'transport_operator_license.pdf',
        status: 'valid'
      },
      vehicleInsurance: {
        verified: true,
        expiry: '2024-06-30',
        document: 'vehicle_insurance.pdf',
        status: 'valid'
      },
      kyc: {
        verified: true,
        completed: true,
        level: 'standard',
        lastVerified: '2024-01-08'
      }
    },
    
    // Service Information
    services: ['package_delivery', 'food_delivery', 'document_delivery'],
    serviceAreas: ['Kampala Central', 'Najjera', 'Naalya', 'Buziga'],
    operatingHours: '06:00 - 22:00',
    
    // Performance Metrics
    performance: {
      completedDeliveries: 1250,
      onTimeRate: 94.5,
      customerRating: 4.7,
      monthlyRevenue: 3500000,
      activeRiders: 8
    },
    
    // Payment Information
    payment: {
      bankName: 'Centenary Bank',
      accountNumber: '3012345678901',
      accountName: 'Quick Deliveries Uganda',
      mobileMoney: {
        mtn: '+256782345678',
        airtel: '+256712345678'
      }
    },
    
    status: 'active',
    registrationDate: '2021-08-20',
    lastActivity: '2024-01-15T16:45:00'
  });

  const vendorComplianceRequirements = [
    {
      id: 1,
      name: 'Business Registration Certificate',
      authority: 'Uganda Registration Services Bureau (URSB)',
      requirement: 'Mandatory',
      frequency: 'Annual Renewal',
      penalty: 'UGX 500,000 + suspension'
    },
    {
      id: 2,
      name: 'Trading License',
      authority: 'Local Authority (KCCA/Municipal)',
      requirement: 'Mandatory',
      frequency: 'Annual Renewal',
      penalty: 'UGX 200,000 + closure'
    },
    {
      id: 3,
      name: 'Transport Operator License',
      authority: 'Ministry of Works and Transport',
      requirement: 'Mandatory for logistics',
      frequency: 'Annual Renewal',
      penalty: 'UGX 1,000,000 + operation ban'
    },
    {
      id: 4,
      name: 'Vehicle Insurance',
      authority: 'Insurance Regulatory Authority',
      requirement: 'Mandatory for all vehicles',
      frequency: 'Annual Renewal',
      penalty: 'UGX 500,000 per vehicle'
    },
    {
      id: 5,
      name: 'Rider KYC Compliance',
      authority: 'Financial Intelligence Authority',
      requirement: 'Mandatory for all riders',
      frequency: 'Continuous monitoring',
      penalty: 'UGX 5,000,000 + license revocation'
    }
  ];

  const handleDocumentUpload = (documentType) => {
    setUploadingDoc(documentType);
    setShowDocumentUpload(true);
  };

  const calculateComplianceScore = () => {
    const totalDocs = Object.keys(vendor.compliance).length;
    const validDocs = Object.values(vendor.compliance).filter(doc => doc.verified).length;
    return (validDocs / totalDocs) * 100;
  };

  const complianceScore = calculateComplianceScore();

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            🚚 Vendor Profile
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Logistics and delivery service provider management
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button startIcon={<Download />} variant="outlined">
            Export Documents
          </Button>
          <Button startIcon={<Edit />} variant="contained">
            Edit Profile
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Sidebar - Quick Info */}
        <Grid item xs={4}>
          {/* Vendor Profile Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'secondary.main' }}>
                  <Storefront />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {vendor.businessName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {vendor.tradingName}
                  </Typography>
                  <Chip 
                    label={vendor.status.toUpperCase()} 
                    color={vendor.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Quick Stats */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Deliveries</Typography>
                  <Typography variant="h6" color="primary.main">
                    {vendor.performance.completedDeliveries}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">On-time Rate</Typography>
                  <Typography variant="h6">
                    {vendor.performance.onTimeRate}%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Rating</Typography>
                  <Typography variant="h6">
                    ⭐ {vendor.performance.customerRating}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Active Riders</Typography>
                  <Typography variant="h6">
                    {vendor.performance.activeRiders}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Compliance Score */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Compliance Score</Typography>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={complianceScore} 
                  sx={{ height: 20, borderRadius: 10, mb: 2 }}
                  color={complianceScore >= 80 ? 'success' : complianceScore >= 60 ? 'warning' : 'error'}
                />
                <Typography variant="h4" fontWeight="bold">
                  {complianceScore.toFixed(0)}%
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Overall Compliance Status
                </Typography>
              </Box>
              <Button 
                fullWidth 
                variant="outlined" 
                startIcon={<VerifiedUser />}
                onClick={() => setShowVerificationModal(true)}
              >
                View Verification Status
              </Button>
            </CardContent>
          </Card>

          {/* Service Areas */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Service Areas</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {vendor.serviceAreas.map((area, index) => (
                  <Chip key={index} label={area} size="small" variant="outlined" />
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="textSecondary">
                Operating Hours: {vendor.operatingHours}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={8}>
          <Card>
            <CardContent>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                <Tab icon={<Storefront />} label="Vendor Info" />
                <Tab icon={<Gavel />} label="Legal Compliance" />
                <Tab icon={<Inventory />} label="Vehicles & Fleet" />
                <Tab icon={<TrendingUp />} label="Performance" />
                <Tab icon={<AccountBalance />} label="Banking & Payments" />
              </Tabs>

              {activeTab === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography variant="h6" gutterBottom>Business Information</Typography>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Business Name</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.businessName}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Trading Name</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.tradingName}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Vendor Type</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.vendorType}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Registration Number</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.registrationNumber}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">TIN Number</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.tinNumber}</Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Contact Person</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.contactPerson}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Phone Number</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.phone}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Email Address</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.email}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Business Address</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.businessAddress}</Typography>
                      </Box>
                    </Paper>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Services Offered</Typography>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {vendor.services.map((service, index) => (
                          <Chip 
                            key={index} 
                            label={service.replace('_', ' ').toUpperCase()} 
                            color="primary"
                            size="small"
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {activeTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Legal Compliance Documents</Typography>
                  
                  <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Document Type</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Expiry Date</TableCell>
                          <TableCell>Verification</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(vendor.compliance).map(([key, doc]) => (
                          <TableRow key={key}>
                            <TableCell>
                              <Typography variant="body2" fontWeight="500">
                                {key.split(/(?=[A-Z])/).join(' ').toUpperCase()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={doc.status} 
                                color={doc.verified ? 'success' : 'error'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {doc.expiry === 'permanent' ? 'Permanent' : new Date(doc.expiry).toLocaleDateString()}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {doc.verified ? (
                                <CheckCircle color="success" />
                              ) : (
                                <Warning color="warning" />
                              )}
                            </TableCell>
                            <TableCell>
                              <Button size="small" startIcon={<Download />}>
                                Download
                              </Button>
                              <Button 
                                size="small" 
                                startIcon={<Upload />}
                                onClick={() => handleDocumentUpload(key)}
                              >
                                Update
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant="h6" gutterBottom>Vendor-Specific Legal Requirements</Typography>
                  <List>
                    {vendorComplianceRequirements.map((req) => (
                      <ListItem key={req.id} divider>
                        <ListItemIcon>
                          <Gavel color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={req.name}
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                Authority: {req.authority}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip label={req.requirement} size="small" color="primary" />
                                <Chip label={req.frequency} size="small" variant="outlined" />
                                <Chip label={`Penalty: ${req.penalty}`} size="small" color="error" />
                              </Box>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {activeTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>Vehicle Fleet Management</Typography>
                  
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Vehicle ID</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Plate Number</TableCell>
                          <TableCell>Model</TableCell>
                          <TableCell>Year</TableCell>
                          <TableCell>Insurance</TableCell>
                          <TableCell>Registration</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {vendor.vehicles.map((vehicle) => (
                          <TableRow key={vehicle.id}>
                            <TableCell>{vehicle.id}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {vehicle.type === 'motorcycle' ? <TwoWheeler /> : <DirectionsCar />}
                                {vehicle.type}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontWeight="500">
                                {vehicle.plate}
                              </Typography>
                            </TableCell>
                            <TableCell>{vehicle.model}</TableCell>
                            <TableCell>{vehicle.year}</TableCell>
                            <TableCell>
                              <Chip 
                                label={vehicle.insurance} 
                                color={vehicle.insurance === 'valid' ? 'success' : 'error'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={vehicle.registration} 
                                color={vehicle.registration === 'valid' ? 'success' : 'error'}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Button size="small">View Details</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Button startIcon={<Add />} variant="outlined" sx={{ mt: 2 }}>
                    Add New Vehicle
                  </Button>
                </Box>
              )}

              {activeTab === 3 && (
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <DeliveryDining color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="primary.main">
                        {vendor.performance.completedDeliveries}
                      </Typography>
                      <Typography variant="body2">Completed Deliveries</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Schedule color="success" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="success.main">
                        {vendor.performance.onTimeRate}%
                      </Typography>
                      <Typography variant="body2">On-time Delivery Rate</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <TrendingUp color="info" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="info.main">
                        UGX {vendor.performance.monthlyRevenue.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">Monthly Revenue</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Person color="warning" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="warning.main">
                        {vendor.performance.activeRiders}
                      </Typography>
                      <Typography variant="body2">Active Riders</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {activeTab === 4 && (
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography variant="h6" gutterBottom>Bank Account Details</Typography>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Bank Name</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.payment.bankName}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Account Number</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.payment.accountNumber}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Account Name</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.payment.accountName}</Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="h6" gutterBottom>Mobile Money Accounts</Typography>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">MTN Mobile Money</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.payment.mobileMoney.mtn}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Airtel Money</Typography>
                        <Typography variant="body1" fontWeight="500">{vendor.payment.mobileMoney.airtel}</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Verification Status Modal */}
      <Dialog open={showVerificationModal} onClose={() => setShowVerificationModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5">Vendor Verification Status</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom>Business Verification</Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Business Registration" secondary="Verified with URSB" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Trading License" secondary="Valid until Dec 2024" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Tax Compliance" secondary="TIN registered with URA" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" gutterBottom>Operational Compliance</Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Operator License" secondary="Transport authority approved" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Vehicle Insurance" secondary="All vehicles insured" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Rider KYC" secondary="All riders verified" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
          
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Vendor is fully compliant with Ugandan logistics and transportation regulations.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVerificationModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Document Upload Modal */}
      <Dialog open={showDocumentUpload} onClose={() => setShowDocumentUpload(false)}>
        <DialogTitle>
          <Typography variant="h6">Upload {uploadingDoc} Document</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Please upload the required document for verification.
          </Typography>
          <Button variant="outlined" component="label" fullWidth>
            Select Document
            <input type="file" hidden />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDocumentUpload(false)}>Cancel</Button>
          <Button variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VendorProfile;