import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tab,
  Tabs,
  Badge,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  EmojiEvents,
  LocalAtm,
  Security,
  TrendingUp,
  Discount,
  CardGiftcard,
  CheckCircle,
  Lock,
  Star,
  Bolt,
  DirectionsBike,
  LocalGasStation,
  PhoneIphone,
  BusinessCenter,
  AccountBalance,
  Timeline,
  ExpandMore,
  ArrowForward,
  Redeem,
  Payment,
  History,
  Download
} from '@mui/icons-material';

const RewardsDashboardDesktop = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [showLoanDialog, setShowLoanDialog] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [claimDialog, setClaimDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  const riderStats = {
    score: 78,
    level: 'Gold',
    nextLevel: 'Platinum',
    progress: 78,
    ridesThisWeek: 52,
    consistency: 95,
    totalEarnings: 285000,
    points: 450,
    rank: 'Top 15%'
  };

  const availableRewards = [
    {
      id: 1,
      title: 'Fuel Discount Voucher',
      description: 'Get 15% off on fuel purchases at participating Shell stations',
      points: 100,
      icon: '⛽',
      color: 'warning',
      claimed: false,
      validity: '30 days',
      category: 'fuel',
      partners: ['Shell', 'Total', 'Kobil']
    },
    {
      id: 2,
      title: 'Airtime Bonus',
      description: 'UGX 2,000 airtime credit for MTN or Airtel',
      points: 50,
      icon: '📞',
      color: 'info',
      claimed: true,
      validity: '7 days',
      category: 'communication'
    },
    {
      id: 3,
      title: 'Safety Gear Package',
      description: 'Premium reflective jacket + certified helmet',
      points: 200,
      icon: '🛡️',
      color: 'success',
      claimed: false,
      validity: 'Claim in-store',
      category: 'safety'
    },
    {
      id: 4,
      title: 'Free Bike Service',
      description: 'Comprehensive maintenance service at partner garages',
      points: 150,
      icon: '🔧',
      color: 'secondary',
      claimed: false,
      validity: '60 days',
      category: 'maintenance'
    },
    {
      id: 5,
      title: 'Insurance Discount',
      description: '20% off on comprehensive insurance package',
      points: 180,
      icon: '📄',
      color: 'primary',
      claimed: false,
      validity: '90 days',
      category: 'insurance'
    }
  ];

  const loanOffers = [
    {
      id: 1,
      amount: 500000,
      term: '30 days',
      interest: '5%',
      status: 'eligible',
      description: 'Quick cash for emergencies and small expenses',
      monthlyPayment: 175000,
      processingFee: 5000,
      requirements: ['Active rider', 'Minimum 20 rides/week', 'Good repayment history']
    },
    {
      id: 2,
      amount: 1000000,
      term: '90 days',
      interest: '8%',
      status: 'eligible',
      description: 'Business expansion and equipment upgrade',
      monthlyPayment: 360000,
      processingFee: 10000,
      requirements: ['Gold tier or above', 'Consistent 3-month history', 'Valid ID']
    },
    {
      id: 3,
      amount: 2000000,
      term: '180 days',
      interest: '12%',
      status: 'pending',
      description: 'Major vehicle upgrade or personal investment',
      monthlyPayment: 373333,
      processingFee: 20000,
      requirements: ['Platinum tier', '6-month consistent history', 'Collateral']
    }
  ];

  const achievements = [
    { 
      id: 1, 
      title: 'First 10 Rides', 
      achieved: true, 
      points: 50,
      description: 'Complete your first 10 rides in the system',
      icon: '🚀'
    },
    { 
      id: 2, 
      title: 'Weekly Consistency Champion', 
      achieved: true, 
      points: 100,
      description: 'Maintain 40+ rides for 4 consecutive weeks',
      icon: '📅'
    },
    { 
      id: 3, 
      title: 'Fuel Efficiency Expert', 
      achieved: false, 
      points: 75,
      description: 'Log fuel expenses for 3 consecutive weeks',
      icon: '⛽'
    },
    { 
      id: 4, 
      title: 'Safety First Advocate', 
      achieved: true, 
      points: 80,
      description: 'Complete safety training and use SOS feature',
      icon: '🛡️'
    },
    { 
      id: 5, 
      title: 'Earnings Master', 
      achieved: false, 
      points: 150,
      description: 'Reach UGX 1,000,000 in total earnings',
      icon: '💰'
    },
    { 
      id: 6, 
      title: 'Customer Favorite', 
      achieved: false, 
      points: 120,
      description: 'Maintain 4.8+ rating for 50 rides',
      icon: '⭐'
    }
  ];

  const benefits = [
    {
      category: 'Financial',
      items: [
        { name: 'Quick Loan Access', status: 'Active', description: 'Pre-approved loans up to UGX 500,000' },
        { name: 'Savings Program', status: 'Active', description: 'Auto-save 5% of daily earnings' },
        { name: 'Investment Opportunities', status: 'Coming Soon', description: 'Access to rider investment funds' }
      ]
    },
    {
      category: 'Insurance & Safety',
      items: [
        { name: 'SOS Protection', status: 'Active', description: '24/7 emergency response' },
        { name: 'Accident Insurance', status: 'Active', description: 'UGX 500,000 coverage' },
        { name: 'Medical Cover', status: 'Pending', description: 'Health insurance for riders' }
      ]
    },
    {
      category: 'Business Support',
      items: [
        { name: 'Partner Discounts', status: 'Active', description: '5 active discount partnerships' },
        { name: 'Business Training', status: 'Available', description: 'Financial literacy courses' },
        { name: 'Market Insights', status: 'Active', description: 'Weekly performance analytics' }
      ]
    }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleClaimReward = (reward) => {
    setSelectedReward(reward);
    setClaimDialog(true);
  };

  const handleConfirmClaim = () => {
    // Handle reward claiming logic
    alert(`🎉 ${selectedReward.title} claimed successfully! You will receive instructions via SMS.`);
    setClaimDialog(false);
    setSelectedReward(null);
  };

  const handleApplyLoan = (loan) => {
    setSelectedLoan(loan);
    setShowLoanDialog(true);
  };

  const handleLoanApplication = () => {
    // Handle loan application logic
    alert(`✅ Loan application for UGX ${selectedLoan.amount.toLocaleString()} submitted! You will be contacted within 24 hours.`);
    setShowLoanDialog(false);
    setSelectedLoan(null);
  };

  const [loanApplication, setLoanApplication] = useState({
    step: 0,
    personalInfo: {},
    employmentInfo: {},
    loanDetails: {}
  });

  const loanSteps = [
    'Loan Selection',
    'Personal Information',
    'Employment Details',
    'Review & Submit'
  ];

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Rewards & Financial Services 🎁
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Unlock benefits, access loans, and grow your business
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button startIcon={<Download />} variant="outlined">
            Export Statements
          </Button>
          <Button startIcon={<History />} variant="outlined">
            Transaction History
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Sidebar - Profile & Quick Stats */}
        <Grid item xs={3}>
          {/* Rider Level Card */}
          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Chip 
                    label={riderStats.level} 
                    sx={{ 
                      bgcolor: 'white', 
                      color: 'black', 
                      fontWeight: 'bold',
                      mb: 1
                    }}
                  />
                  <Typography variant="h3" fontWeight="bold">
                    {riderStats.score}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Rider Score
                  </Typography>
                </Box>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <EmojiEvents sx={{ fontSize: 40 }} />
                </Avatar>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Progress to {riderStats.nextLevel}</Typography>
                  <Typography variant="body2" fontWeight="bold">{riderStats.progress}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={riderStats.progress} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4, 
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'white'
                    }
                  }}
                />
              </Box>

              <Grid container spacing={1} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Typography variant="h6" fontWeight="bold">
                      {riderStats.points}
                    </Typography>
                    <Typography variant="caption">Points</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.2)' }}>
                    <Typography variant="h6" fontWeight="bold">
                      {riderStats.rank}
                    </Typography>
                    <Typography variant="caption">Rank</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Points Breakdown */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Points Breakdown</Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Ride Completion"
                    secondary="+5 points per ride"
                  />
                  <Chip label="260" size="small" color="primary" />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Expense Logging"
                    secondary="+2 points per expense"
                  />
                  <Chip label="80" size="small" color="success" />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Weekly Consistency"
                    secondary="+50 points per week"
                  />
                  <Chip label="100" size="small" color="warning" />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Achievements"
                    secondary="Bonus points"
                  />
                  <Chip label="10" size="small" color="info" />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Quick Benefits Overview */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Active Benefits</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Chip icon={<Security />} label="SOS Protection" color="success" variant="outlined" />
                <Chip icon={<LocalAtm />} label="Loan Access" color="primary" variant="outlined" />
                <Chip icon={<Discount />} label="5 Partner Discounts" color="secondary" variant="outlined" />
                <Chip icon={<BusinessCenter />} label="Business Insights" color="info" variant="outlined" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={6}>
          <Card sx={{ mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Rewards Marketplace" icon={<CardGiftcard />} />
              <Tab label="Loan Offers" icon={<LocalAtm />} />
              <Tab label="Achievements" icon={<EmojiEvents />} />
              <Tab label="Benefits" icon={<TrendingUp />} />
            </Tabs>

            <CardContent sx={{ minHeight: 500 }}>
              {/* Rewards Marketplace */}
              {activeTab === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">Available Rewards</Typography>
                    <Typography variant="body1" color="primary" fontWeight="bold">
                      Your Points: {riderStats.points}
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {availableRewards.map((reward) => (
                      <Grid item xs={6} key={reward.id}>
                        <Card 
                          variant={reward.claimed ? "outlined" : "elevation"}
                          sx={{ 
                            height: '100%',
                            opacity: reward.claimed ? 0.7 : 1
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Avatar sx={{ bgcolor: `${reward.color}.100`, width: 50, height: 50 }}>
                                <Typography variant="h6">{reward.icon}</Typography>
                              </Avatar>
                              <Chip 
                                label={`${reward.points} pts`} 
                                size="small" 
                                color="primary"
                              />
                            </Box>
                            
                            <Typography variant="h6" gutterBottom>
                              {reward.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" paragraph>
                              {reward.description}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="caption" color="textSecondary">
                                Valid: {reward.validity}
                              </Typography>
                              {reward.partners && (
                                <Chip label={`${reward.partners.length} partners`} size="small" />
                              )}
                            </Box>

                            <Button
                              variant={reward.claimed ? "outlined" : "contained"}
                              fullWidth
                              disabled={reward.claimed || riderStats.points < reward.points}
                              startIcon={reward.claimed ? <CheckCircle /> : <Redeem />}
                              onClick={() => handleClaimReward(reward)}
                            >
                              {reward.claimed ? 'Claimed' : 'Claim Reward'}
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Loan Offers */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="h5" gutterBottom>Loan Offers</Typography>
                  <Typography variant="body1" color="textSecondary" paragraph>
                    Pre-approved loan offers based on your riding history and performance
                  </Typography>
                  
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Loan Amount</TableCell>
                          <TableCell>Term</TableCell>
                          <TableCell>Interest Rate</TableCell>
                          <TableCell>Monthly Payment</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loanOffers.map((loan) => (
                          <TableRow key={loan.id} hover>
                            <TableCell>
                              <Typography variant="h6" color="primary.main">
                                UGX {loan.amount.toLocaleString()}
                              </Typography>
                            </TableCell>
                            <TableCell>{loan.term}</TableCell>
                            <TableCell>
                              <Chip label={loan.interest} color="primary" size="small" />
                            </TableCell>
                            <TableCell>
                              UGX {loan.monthlyPayment.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={loan.status} 
                                color={loan.status === 'eligible' ? 'success' : 'default'}
                                variant={loan.status === 'eligible' ? 'filled' : 'outlined'}
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                size="small"
                                disabled={loan.status !== 'eligible'}
                                onClick={() => handleApplyLoan(loan)}
                                startIcon={<ArrowForward />}
                              >
                                Apply
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Achievements */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" gutterBottom>Your Achievements</Typography>
                  <Grid container spacing={2}>
                    {achievements.map((achievement) => (
                      <Grid item xs={6} key={achievement.id}>
                        <Card 
                          sx={{ 
                            bgcolor: achievement.achieved ? 'success.50' : 'grey.50',
                            border: achievement.achieved ? `2px solid ${theme.palette.success.main}` : '1px solid',
                            borderColor: achievement.achieved ? 'success.main' : 'divider'
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Avatar sx={{ bgcolor: achievement.achieved ? 'success.main' : 'grey.400' }}>
                                <Typography>{achievement.icon}</Typography>
                              </Avatar>
                              <Box>
                                <Typography variant="h6">{achievement.title}</Typography>
                                <Chip 
                                  label={`${achievement.points} pts`} 
                                  size="small" 
                                  color={achievement.achieved ? "success" : "default"}
                                />
                              </Box>
                            </Box>
                            <Typography variant="body2" color="textSecondary" paragraph>
                              {achievement.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {achievement.achieved ? (
                                <CheckCircle color="success" />
                              ) : (
                                <Lock color="disabled" />
                              )}
                              <Typography variant="caption">
                                {achievement.achieved ? 'Achieved' : 'Locked'}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Benefits */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h5" gutterBottom>Your Benefits</Typography>
                  {benefits.map((benefitCategory, index) => (
                    <Accordion key={index} defaultExpanded={index === 0}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="h6">{benefitCategory.category}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <List>
                          {benefitCategory.items.map((item, itemIndex) => (
                            <ListItem key={itemIndex}>
                              <ListItemIcon>
                                <Avatar sx={{ 
                                  bgcolor: item.status === 'Active' ? 'success.main' : 
                                           item.status === 'Pending' ? 'warning.main' : 'info.main',
                                  width: 32, 
                                  height: 32 
                                }}>
                                  {item.status === 'Active' ? <CheckCircle /> : 
                                   item.status === 'Pending' ? <Timeline /> : <BusinessCenter />}
                                </Avatar>
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {item.name}
                                    <Chip 
                                      label={item.status} 
                                      size="small"
                                      color={
                                        item.status === 'Active' ? 'success' :
                                        item.status === 'Pending' ? 'warning' : 'info'
                                      }
                                    />
                                  </Box>
                                }
                                secondary={item.description}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Sidebar - Financial Overview & Quick Access */}
        <Grid item xs={3}>
          {/* Financial Snapshot */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Financial Snapshot</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Total Earnings</Typography>
                <Typography variant="h5" color="success.main" fontWeight="bold">
                  UGX {riderStats.totalEarnings.toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Available for Loans</Typography>
                <Typography variant="h6" color="primary.main">
                  UGX 500,000
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Credit Score</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ flexGrow: 1, height: 8 }}
                  />
                  <Typography variant="body2" fontWeight="bold">750</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Loan Application */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Loan Application</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Get instant pre-approval for emergency funds
              </Typography>
              <Button 
                variant="contained" 
                fullWidth 
                startIcon={<LocalAtm />}
                onClick={() => handleApplyLoan(loanOffers[0])}
              >
                Apply for Quick Loan
              </Button>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                Funds disbursed within 2 hours of approval
              </Typography>
            </CardContent>
          </Card>

          {/* Reward Categories */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Reward Categories</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button 
                  startIcon={<LocalGasStation />} 
                  variant="outlined" 
                  fullWidth 
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Fuel & Maintenance
                </Button>
                <Button 
                  startIcon={<Security />} 
                  variant="outlined" 
                  fullWidth 
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Safety Gear
                </Button>
                <Button 
                  startIcon={<PhoneIphone />} 
                  variant="outlined" 
                  fullWidth 
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Communication
                </Button>
                <Button 
                  startIcon={<AccountBalance />} 
                  variant="outlined" 
                  fullWidth 
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Financial Services
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Loan Application Dialog */}
      <Dialog 
        open={showLoanDialog} 
        onClose={() => setShowLoanDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Loan Application</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedLoan && (
            <Box>
              <Stepper activeStep={loanApplication.step} orientation="vertical">
                <Step>
                  <StepLabel>Loan Selection</StepLabel>
                  <StepContent>
                    <Card sx={{ p: 2, bgcolor: 'primary.50' }}>
                      <Typography variant="h6" gutterBottom>
                        Selected Loan: UGX {selectedLoan.amount.toLocaleString()}
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2">Term: {selectedLoan.term}</Typography>
                          <Typography variant="body2">Interest: {selectedLoan.interest}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2">
                            Monthly: UGX {selectedLoan.monthlyPayment.toLocaleString()}
                          </Typography>
                          <Typography variant="body2">
                            Fee: UGX {selectedLoan.processingFee.toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Card>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => setLoanApplication(prev => ({ ...prev, step: 1 }))}
                      >
                        Continue to Application
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
                
                <Step>
                  <StepLabel>Requirements Check</StepLabel>
                  <StepContent>
                    <Typography variant="body1" gutterBottom>
                      Please ensure you meet the following requirements:
                    </Typography>
                    <List>
                      {selectedLoan.requirements.map((req, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText primary={req} />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleLoanApplication}
                      >
                        Confirm & Submit Application
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              </Stepper>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Reward Claim Dialog */}
      <Dialog 
        open={claimDialog} 
        onClose={() => setClaimDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Claim Reward</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedReward && (
            <Box textAlign="center" py={2}>
              <Avatar sx={{ 
                bgcolor: `${selectedReward.color}.100`, 
                width: 80, 
                height: 80, 
                mx: 'auto', 
                mb: 2 
              }}>
                <Typography variant="h4">{selectedReward.icon}</Typography>
              </Avatar>
              
              <Typography variant="h6" gutterBottom>
                {selectedReward.title}
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {selectedReward.description}
              </Typography>
              
              <Box sx={{ 
                p: 2, 
                bgcolor: 'grey.50', 
                borderRadius: 1,
                mb: 2 
              }}>
                <Typography variant="body2">
                  <strong>Points Required:</strong> {selectedReward.points}
                </Typography>
                <Typography variant="body2">
                  <strong>Validity:</strong> {selectedReward.validity}
                </Typography>
                {selectedReward.partners && (
                  <Typography variant="body2">
                    <strong>Partners:</strong> {selectedReward.partners.join(', ')}
                  </Typography>
                )}
              </Box>
              
              <Typography variant="body2" color="textSecondary">
                This reward will be deducted from your available points balance.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setClaimDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmClaim}
            startIcon={<Redeem />}
          >
            Confirm Claim ({selectedReward?.points} pts)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RewardsDashboardDesktop;