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
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  StepContent
} from '@mui/material';
import {
  Business,
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
  Store,
  AccountBalance,
  Gavel,
  Assignment,
  DocumentScanner,
  QrCode2,
  Payment
} from '@mui/icons-material';

const MerchantProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState('');

  // Merchant data
  const [merchant, setMerchant] = useState({
    id: 'MER001',
    businessName: 'Kampala Fresh Groceries Ltd',
    tradingName: 'Fresh Mart Supermarket',
    businessType: 'retail',
    registrationNumber: '800100123456',
    tinNumber: '1012345678',
    businessAddress: 'Plot 123, Kampala Road, Kampala',
    physicalAddress: 'Shop 45, Garden City Mall, Kampala',
    contactPerson: 'John Mugisha',
    phone: '+256712345678',
    email: 'john@freshmart.ug',
    website: 'www.freshmart.ug',
    
    // Legal Compliance
    compliance: {
      businessRegistration: {
        verified: true,
        expiry: '2025-12-31',
        document: 'certificate_of_incorporation.pdf',
        status: 'valid'
      },
      tradingLicense: {
        verified: true,
        expiry: '2024-12-31',
        document: 'trading_license_2024.pdf',
        status: 'valid'
      },
      tinCertificate: {
        verified: true,
        expiry: 'permanent',
        document: 'tin_certificate.pdf',
        status: 'valid'
      },
      kyc: {
        verified: true,
        completed: true,
        level: 'enhanced',
        lastVerified: '2024-01-10'
      },
      nationalId: {
        verified: true,
        document: 'national_id_front_back.pdf',
        status: 'valid'
      },
      ugrsCertificate: {
        verified: true,
        expiry: '2025-12-31',
        document: 'ugrs_certificate.pdf',
        status: 'valid'
      },
      localAuthorityLicense: {
        verified: true,
        expiry: '2024-12-31',
        document: 'kcca_business_license.pdf',
        status: 'valid'
      }
    },
    
    // Business Performance
    performance: {
      monthlyRevenue: 12500000,
      averageTransaction: 45000,
      customerCount: 1250,
      transactionVolume: 278,
      rating: 4.5
    },
    
    // Payment Information
    payment: {
      bankName: 'Stanbic Bank Uganda',
      accountNumber: '9030012345678',
      accountName: 'Kampala Fresh Groceries Ltd',
      mobileMoney: {
        mtn: '+256712345678',
        airtel: '+256782345678'
      }
    },
    
    status: 'active',
    registrationDate: '2022-03-15',
    lastActivity: '2024-01-15T14:30:00'
  });

  const complianceRequirements = [
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
      authority: 'Kampala Capital City Authority (KCCA)',
      requirement: 'Mandatory',
      frequency: 'Annual Renewal',
      penalty: 'UGX 300,000 + closure'
    },
    {
      id: 3,
      name: 'TIN Certificate',
      authority: 'Uganda Revenue Authority (URA)',
      requirement: 'Mandatory',
      frequency: 'Permanent (Update on changes)',
      penalty: 'UGX 400,000 + interest'
    },
    {
      id: 4,
      name: 'National ID Verification',
      authority: 'National Identification Authority',
      requirement: 'Mandatory',
      frequency: 'Once (Update on renewal)',
      penalty: 'Account suspension'
    },
    {
      id: 5,
      name: 'KYC Compliance',
      authority: 'Financial Intelligence Authority',
      requirement: 'Mandatory',
      frequency: 'Continuous monitoring',
      penalty: 'UGX 10,000,000 + license revocation'
    }
  ];

  const handleDocumentUpload = (documentType) => {
    setUploadingDoc(documentType);
    setShowDocumentUpload(true);
  };

  const calculateComplianceScore = () => {
    const totalDocs = Object.keys(merchant.compliance).length;
    const validDocs = Object.values(merchant.compliance).filter(doc => doc.verified).length;
    return (validDocs / totalDocs) * 100;
  };

  const complianceScore = calculateComplianceScore();

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Business Profile
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Business account management and compliance monitoring
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
          {/* Business Profile Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                  <Business />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {merchant.businessName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {merchant.tradingName}
                  </Typography>
                  <Chip 
                    label={merchant.status.toUpperCase()} 
                    color={merchant.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Quick Stats */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Monthly Revenue</Typography>
                  <Typography variant="h6" color="primary.main">
                    UGX {merchant.performance.monthlyRevenue.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Customers</Typography>
                  <Typography variant="h6">
                    {merchant.performance.customerCount}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Rating</Typography>
                  <Typography variant="h6">
                    ⭐ {merchant.performance.rating}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Transactions</Typography>
                  <Typography variant="h6">
                    {merchant.performance.transactionVolume}
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
                onClick={() => setShowKYCModal(true)}
              >
                View Compliance Details
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Button fullWidth startIcon={<Upload />} sx={{ mb: 1 }}>
                Upload Document
              </Button>
              <Button fullWidth startIcon={<History />} sx={{ mb: 1 }}>
                Transaction History
              </Button>
              <Button fullWidth startIcon={<Payment />}>
                Payment Settings
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={8}>
          <Card>
            <CardContent>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                <Tab icon={<Business />} label="Business Info" />
                <Tab icon={<Gavel />} label="Legal Compliance" />
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
                        <Typography variant="body1" fontWeight="500">{merchant.businessName}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Trading Name</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.tradingName}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Business Type</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.businessType}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Registration Number</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.registrationNumber}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">TIN Number</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.tinNumber}</Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="h6" gutterBottom>Contact Information</Typography>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Contact Person</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.contactPerson}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Phone Number</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.phone}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Email Address</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.email}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Website</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.website}</Typography>
                      </Box>
                    </Paper>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Address Information</Typography>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Business Address</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.businessAddress}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Physical Address</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.physicalAddress}</Typography>
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
                        {Object.entries(merchant.compliance).map(([key, doc]) => (
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

                  <Typography variant="h6" gutterBottom>Ugandan Legal Requirements</Typography>
                  <List>
                    {complianceRequirements.map((req) => (
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
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Money color="primary" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="primary.main">
                        UGX {merchant.performance.monthlyRevenue.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">Monthly Revenue</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <TrendingUp color="success" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="success.main">
                        {merchant.performance.transactionVolume}
                      </Typography>
                      <Typography variant="body2">Monthly Transactions</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <Person color="info" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="info.main">
                        {merchant.performance.customerCount}
                      </Typography>
                      <Typography variant="body2">Active Customers</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                      <LocalAtm color="warning" sx={{ fontSize: 40, mb: 1 }} />
                      <Typography variant="h4" color="warning.main">
                        UGX {merchant.performance.averageTransaction.toLocaleString()}
                      </Typography>
                      <Typography variant="body2">Average Transaction</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              )}

              {activeTab === 3 && (
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Typography variant="h6" gutterBottom>Bank Account Details</Typography>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Bank Name</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.payment.bankName}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Account Number</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.payment.accountNumber}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Account Name</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.payment.accountName}</Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="h6" gutterBottom>Mobile Money Accounts</Typography>
                    <Paper sx={{ p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">MTN Mobile Money</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.payment.mobileMoney.mtn}</Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="textSecondary">Airtel Money</Typography>
                        <Typography variant="body1" fontWeight="500">{merchant.payment.mobileMoney.airtel}</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* KYC Compliance Modal */}
      <Dialog open={showKYCModal} onClose={() => setShowKYCModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5">KYC Compliance Status</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stepper activeStep={merchant.compliance.kyc.completed ? 3 : 1} orientation="vertical">
            <Step>
              <StepLabel>Business Registration</StepLabel>
              <StepContent>
                <Typography>Company registered with URSB</Typography>
                <Chip label="Completed" color="success" />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Tax Registration</StepLabel>
              <StepContent>
                <Typography>TIN registered with URA</Typography>
                <Chip label="Completed" color="success" />
              </StepContent>
            </Step>
            <Step>
              <StepLabel>KYC Verification</StepLabel>
              <StepContent>
                <Typography>Enhanced due diligence completed</Typography>
                <Chip label="Level 3 Verified" color="success" />
              </StepContent>
            </Step>
          </Stepper>
          
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Merchant is fully compliant with Ugandan business regulations and KYC requirements.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowKYCModal(false)}>Close</Button>
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

export default MerchantProfile;