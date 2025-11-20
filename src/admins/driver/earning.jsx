import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Avatar,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  TrendingDown,
  CalendarToday,
  AccessTime,
  DateRange,
  MonetizationOn,
  LocalAtm,
  CreditScore,
  Savings,
  RequestQuote,
  ShowChart,
  ReceiptLong,
  EmojiEvents,
  Star,
  StarHalf,
  StarBorder,
  ArrowBack,
  Visibility
} from '@mui/icons-material';

const EarningsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data for earnings
  const [earningsData, setEarningsData] = useState({
    daily: {
      date: '2024-01-15',
      total: 125000,
      trips: 18,
      onlineHours: 8.5,
      cashEarnings: 85000,
      digitalEarnings: 40000,
      bonuses: 5000,
      deductions: 5000,
      breakdown: [
        { time: '06:00-09:00', amount: 45000, trips: 6 },
        { time: '09:00-12:00', amount: 35000, trips: 5 },
        { time: '12:00-15:00', amount: 25000, trips: 4 },
        { time: '15:00-18:00', amount: 20000, trips: 3 }
      ]
    },
    weekly: {
      period: 'Jan 8-14, 2024',
      total: 785000,
      trips: 112,
      onlineHours: 48,
      averageDaily: 112143,
      trend: 12.5,
      days: [
        { day: 'Mon', amount: 105000, trips: 15 },
        { day: 'Tue', amount: 98000, trips: 14 },
        { day: 'Wed', amount: 120000, trips: 17 },
        { day: 'Thu', amount: 115000, trips: 16 },
        { day: 'Fri', amount: 145000, trips: 21 },
        { day: 'Sat', amount: 132000, trips: 19 },
        { day: 'Sun', amount: 70000, trips: 10 }
      ]
    },
    monthly: {
      period: 'December 2023',
      total: 3250000,
      trips: 465,
      onlineHours: 210,
      averageWeekly: 812500,
      trend: 8.3,
      weeks: [
        { week: 'Week 1', amount: 780000, trips: 112 },
        { week: 'Week 2', amount: 820000, trips: 117 },
        { week: 'Week 3', amount: 850000, trips: 121 },
        { week: 'Week 4', amount: 800000, trips: 115 }
      ]
    }
  });

  const [loanScore, setLoanScore] = useState({
    score: 745,
    level: 'Excellent',
    maxAmount: 2000000,
    interestRate: 12.5,
    eligibility: 85,
    factors: [
      { factor: 'Consistent Earnings', impact: 'positive', weight: 35 },
      { factor: 'Payment History', impact: 'positive', weight: 25 },
      { factor: 'Trip Completion Rate', impact: 'positive', weight: 20 },
      { factor: 'Account Age', impact: 'neutral', weight: 15 },
      { factor: 'Recent Activity', impact: 'positive', weight: 5 }
    ]
  });

  const formatCurrency = (amount) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) {
      return <TrendingUp sx={{ color: '#10B981' }} />;
    } else if (trend < 0) {
      return <TrendingDown sx={{ color: '#EF4444' }} />;
    }
    return <TrendingUp sx={{ color: '#6B7280' }} />;
  };

  const renderStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score / 100);
    const halfStar = score % 100 >= 50;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} sx={{ color: '#FFEC01' }} />);
      } else if (i === fullStars && halfStar) {
        stars.push(<StarHalf key={i} sx={{ color: '#FFEC01' }} />);
      } else {
        stars.push(<StarBorder key={i} sx={{ color: '#FFEC01' }} />);
      }
    }
    return stars;
  };

  // Financial Summary Cards for Top Section
  const FinancialSummary = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* Total Earnings */}
      <Grid item xs={12} sm={6} lg={3}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 37, 221, 0.2)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <AccountBalanceWallet sx={{ fontSize: 40, opacity: 0.8 }} />
              <TrendingUp sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
              {formatCurrency(3250000)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total Earnings
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
              <Typography variant="caption">
                +8.3% this month
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* This Month */}
      <Grid item xs={12} sm={6} lg={3}>
        <Card sx={{ 
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <MonetizationOn sx={{ fontSize: 40, color: '#0025DD' }} />
              <TrendingUp sx={{ fontSize: 20, color: '#10B981' }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="#0025DD" sx={{ mb: 1 }}>
              {formatCurrency(785000)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This Month
            </Typography>
            <Typography variant="caption" color="#10B981" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              112 trips completed
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Loan Score */}
      <Grid item xs={12} sm={6} lg={3}>
        <Card sx={{ 
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <CreditScore sx={{ fontSize: 40, color: '#10B981' }} />
              <EmojiEvents sx={{ fontSize: 20, color: '#10B981' }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="#10B981" sx={{ mb: 1 }}>
              {loanScore.score}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Loan Score
            </Typography>
            <Box sx={{ display: 'flex', mt: 1 }}>
              {renderStars(loanScore.score)}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Total Trips */}
      <Grid item xs={12} sm={6} lg={3}>
        <Card sx={{ 
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <ReceiptLong sx={{ fontSize: 40, color: '#FF6B6B' }} />
              <TrendingUp sx={{ fontSize: 20, color: '#10B981' }} />
            </Box>
            <Typography variant="h4" fontWeight="bold" color="#FF6B6B" sx={{ mb: 1 }}>
              597
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Trips
            </Typography>
            <Typography variant="caption" color="#10B981" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              94% success rate
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const DailySummary = () => (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={12}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
              Today's Summary - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', 'day': 'numeric' })}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                  <MonetizationOn sx={{ color: '#0025DD', mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold" color="#0025DD">
                    {formatCurrency(earningsData.daily.total)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Earnings
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#FFEC0120' }}>
                  <LocalAtm sx={{ color: '#000', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {earningsData.daily.trips} Trips
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#10B98120' }}>
                  <AccessTime sx={{ color: '#10B981', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="#10B981">
                    {earningsData.daily.onlineHours}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Online Time
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                  <AccountBalanceWallet sx={{ color: '#0025DD', mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="#0025DD">
                    {formatCurrency(earningsData.daily.total / earningsData.daily.trips)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. per Trip
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Earnings Breakdown */}
      <Grid item xs={12} md={8}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
              Earnings Breakdown
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Time Period</TableCell>
                    <TableCell align="right">Trips</TableCell>
                    <TableCell align="right">Earnings</TableCell>
                    <TableCell align="right">Avg. per Trip</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {earningsData.daily.breakdown.map((period, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{period.time}</TableCell>
                      <TableCell align="right">{period.trips}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: '#0025DD' }}>
                        {formatCurrency(period.amount)}
                      </TableCell>
                      <TableCell align="right">{formatCurrency(Math.round(period.amount / period.trips))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>

      {/* Payment Methods */}
      <Grid item xs={12} md={4}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
              Payment Methods
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <LocalAtm sx={{ color: '#0025DD' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Cash Payments"
                  secondary={formatCurrency(earningsData.daily.cashEarnings)}
                />
                <Chip 
                  label={`${Math.round((earningsData.daily.cashEarnings / earningsData.daily.total) * 100)}%`} 
                  sx={{ backgroundColor: '#0025DD', color: 'white' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CreditScore sx={{ color: '#0025DD' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Digital Payments"
                  secondary={formatCurrency(earningsData.daily.digitalEarnings)}
                />
                <Chip 
                  label={`${Math.round((earningsData.daily.digitalEarnings / earningsData.daily.total) * 100)}%`}
                  sx={{ backgroundColor: '#0025DD', color: 'white' }}
                />
              </ListItem>
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Bonuses</Typography>
              <Typography variant="body2" color="#10B981" fontWeight="bold">
                +{formatCurrency(earningsData.daily.bonuses)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">Deductions</Typography>
              <Typography variant="body2" color="#EF4444" fontWeight="bold">
                -{formatCurrency(earningsData.daily.deductions)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const WeeklySummary = () => (
    <Grid container spacing={3}>
      {/* Weekly Overview */}
      <Grid item xs={12}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="#0025DD">
                Weekly Summary - {earningsData.weekly.period}
              </Typography>
              <Chip 
                icon={getTrendIcon(earningsData.weekly.trend)} 
                label={`${earningsData.weekly.trend}% from last week`} 
                sx={{ 
                  backgroundColor: earningsData.weekly.trend > 0 ? '#10B98120' : '#EF444420',
                  color: earningsData.weekly.trend > 0 ? '#10B981' : '#EF4444'
                }}
              />
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                  <Typography variant="h4" fontWeight="bold" color="#0025DD">
                    {formatCurrency(earningsData.weekly.total)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Weekly Earnings
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#FFEC0120' }}>
                  <Typography variant="h5" fontWeight="bold">
                    {earningsData.weekly.trips}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Trips
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#10B98120' }}>
                  <Typography variant="h5" fontWeight="bold" color="#10B981">
                    {earningsData.weekly.onlineHours}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Online Hours
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                  <Typography variant="h5" fontWeight="bold" color="#0025DD">
                    {formatCurrency(earningsData.weekly.averageDaily)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average Daily
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Daily Breakdown */}
      <Grid item xs={12}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
              Daily Performance
            </Typography>
            <Grid container spacing={2}>
              {earningsData.weekly.days.map((day, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                    <Typography variant="body2" fontWeight="bold" color="text.secondary">
                      {day.day}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="#0025DD">
                      {formatCurrency(day.amount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {day.trips} trips
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const MonthlyIncome = () => (
    <Grid container spacing={3}>
      {/* Monthly Overview */}
      <Grid item xs={12}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" color="#0025DD">
                Monthly Income - {earningsData.monthly.period}
              </Typography>
              <Chip 
                icon={getTrendIcon(earningsData.monthly.trend)} 
                label={`${earningsData.monthly.trend}% from last month`} 
                sx={{ 
                  backgroundColor: earningsData.monthly.trend > 0 ? '#10B98120' : '#EF444420',
                  color: earningsData.monthly.trend > 0 ? '#10B981' : '#EF4444'
                }}
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                  <Typography variant="h3" fontWeight="bold" color="#0025DD">
                    {formatCurrency(earningsData.monthly.total)}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Total Monthly Income
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#FFEC0120' }}>
                      <Typography variant="h5" fontWeight="bold">
                        {earningsData.monthly.trips}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Trips
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#10B98120' }}>
                      <Typography variant="h5" fontWeight="bold" color="#10B981">
                        {earningsData.monthly.onlineHours}h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Online Hours
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                      <Typography variant="h6" fontWeight="bold" color="#0025DD">
                        {formatCurrency(earningsData.monthly.averageWeekly)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg. Weekly
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#0025DD10' }}>
                      <Typography variant="h6" fontWeight="bold" color="#0025DD">
                        {formatCurrency(Math.round(earningsData.monthly.total / earningsData.monthly.trips))}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg. per Trip
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Weekly Breakdown */}
      <Grid item xs={12}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
              Weekly Breakdown
            </Typography>
            <List>
              {earningsData.monthly.weeks.map((week, index) => (
                <ListItem key={index} divider>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: '#0025DD' }}>
                      <Typography variant="body2" fontWeight="bold" color="white">
                        W{index + 1}
                      </Typography>
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={week.week}
                    secondary={`${week.trips} trips completed`}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold" color="#0025DD">
                      {formatCurrency(week.amount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.round((week.amount / earningsData.monthly.total) * 100)}% of monthly total
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const LoanScore = () => (
    <Grid container spacing={3}>
      {/* Loan Score Overview */}
      <Grid item xs={12} md={6}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <CreditScore sx={{ fontSize: 60, color: '#0025DD', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom color="#0025DD">
              {loanScore.score}
            </Typography>
            <Typography variant="h6" color="#0025DD" gutterBottom>
              {loanScore.level} Credit Score
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              {renderStars(loanScore.score)}
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={loanScore.eligibility} 
              sx={{ 
                height: 10, 
                borderRadius: 5, 
                mb: 3,
                backgroundColor: '#e2e8f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#0025DD',
                  borderRadius: 5
                }
              }}
            />
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Eligibility Score: {loanScore.eligibility}%
            </Typography>
          </CardContent>
        </Card>

        {/* Loan Offers */}
        <Card sx={{ mt: 3 }} elevation={3}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
              Available Loan Offers
            </Typography>
            <List>
              <ListItem divider>
                <ListItemIcon>
                  <Savings sx={{ color: '#0025DD' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Quick Cash Advance"
                  secondary={`Up to ${formatCurrency(loanScore.maxAmount)}`}
                />
                <Chip label={`${loanScore.interestRate}% APR`} sx={{ backgroundColor: '#0025DD', color: 'white' }} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <RequestQuote sx={{ color: '#0025DD' }} />
                </ListItemIcon>
                <ListItemText
                  primary="Vehicle Upgrade Loan"
                  secondary="Up to UGX 5,000,000"
                />
                <Chip label="14.5% APR" sx={{ backgroundColor: '#FFEC01', color: '#000' }} />
              </ListItem>
            </List>
            <Button 
              variant="contained" 
              fullWidth 
              sx={{ 
                mt: 2,
                backgroundColor: '#0025DD',
                '&:hover': {
                  backgroundColor: '#001FB8'
                }
              }}
            >
              View All Loan Offers
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Score Factors */}
      <Grid item xs={12} md={6}>
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
              Score Factors
            </Typography>
            <List>
              {loanScore.factors.map((factor, index) => (
                <ListItem key={index} divider>
                  <ListItemIcon>
                    <Avatar sx={{ 
                      bgcolor: factor.impact === 'positive' ? '#10B981' : 
                              factor.impact === 'negative' ? '#EF4444' : '#FFEC01',
                      width: 32, 
                      height: 32
                    }}>
                      <ShowChart fontSize="small" sx={{ color: 'white' }} />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={factor.factor}
                    secondary={`Impact: ${factor.weight}%`}
                  />
                  <Chip 
                    label={factor.impact} 
                    sx={{ 
                      backgroundColor: factor.impact === 'positive' ? '#10B98120' : 
                                     factor.impact === 'negative' ? '#EF444420' : '#FFEC01',
                      color: factor.impact === 'positive' ? '#10B981' : 
                            factor.impact === 'negative' ? '#EF4444' : '#000'
                    }}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Tips to Improve */}
        <Card sx={{ mt: 3 }} elevation={3}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="#0025DD">
              💡 Tips to Improve Your Score
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="Maintain consistent daily earnings" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Complete more trips during peak hours" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Keep your cancellation rate below 5%" />
              </ListItem>
              <ListItem>
                <ListItemText primary="Maintain a high customer rating" />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const tabContent = [
    { label: 'Daily Summary', component: <DailySummary /> },
    { label: 'Weekly Summary', component: <WeeklySummary /> },
    { label: 'Monthly Income', component: <MonthlyIncome /> },
    { label: 'Loan Score', component: <LoanScore /> }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      pb: 3
    }}>
      {/* Header */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#0025DD',
          background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)',
          boxShadow: 'none'
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            sx={{ color: 'white', mr: 2 }}
            onClick={() => navigate(-1)}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Earnings & Reports
          </Typography>
          <Chip 
            label="Active Driver" 
            sx={{ 
              backgroundColor: '#FFEC01', 
              color: '#000',
              fontWeight: 'bold'
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {/* Financial Summary Cards */}
        <FinancialSummary />

        {/* Tabs */}
        <Card sx={{ 
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent sx={{ p: 0 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': { 
                  minHeight: 64,
                  color: '#6B7280',
                  '&.Mui-selected': {
                    color: '#0025DD'
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#0025DD'
                }
              }}
            >
              {tabContent.map((tab, index) => (
                <Tab 
                  key={index}
                  icon={
                    index === 0 ? <CalendarToday /> :
                    index === 1 ? <DateRange /> :
                    index === 2 ? <MonetizationOn /> :
                    <CreditScore />
                  }
                  label={tab.label}
                />
              ))}
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {tabContent[activeTab].component}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default EarningsPage;