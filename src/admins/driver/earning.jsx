import React, { useState, useEffect } from 'react';
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
  InputLabel
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
  StarBorder
} from '@mui/icons-material';

const EarningsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
      return <TrendingUp color="success" />;
    } else if (trend < 0) {
      return <TrendingDown color="error" />;
    }
    return <TrendingUp color="action" />;
  };

  const renderStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score / 100);
    const halfStar = score % 100 >= 50;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} sx={{ color: '#FFD700' }} />);
      } else if (i === fullStars && halfStar) {
        stars.push(<StarHalf key={i} sx={{ color: '#FFD700' }} />);
      } else {
        stars.push(<StarBorder key={i} sx={{ color: '#FFD700' }} />);
      }
    }
    return stars;
  };

  const DailySummary = () => (
    <Grid container spacing={3}>
      {/* Key Metrics */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Today's Summary - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', 'day': 'numeric' })}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.50' }}>
                  <MonetizationOn color="primary" sx={{ mb: 1 }} />
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(earningsData.daily.total)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Earnings
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.50' }}>
                  <LocalAtm color="secondary" sx={{ mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {earningsData.daily.trips} Trips
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.50' }}>
                  <AccessTime color="success" sx={{ mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {earningsData.daily.onlineHours}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Online Time
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'info.50' }}>
                  <AccountBalanceWallet color="info" sx={{ mb: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
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
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
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
                    <TableRow key={index}>
                      <TableCell>{period.time}</TableCell>
                      <TableCell align="right">{period.trips}</TableCell>
                      <TableCell align="right">{formatCurrency(period.amount)}</TableCell>
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
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Payment Methods
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <LocalAtm color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Cash Payments"
                  secondary={formatCurrency(earningsData.daily.cashEarnings)}
                />
                <Chip label={`${Math.round((earningsData.daily.cashEarnings / earningsData.daily.total) * 100)}%`} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CreditScore color="secondary" />
                </ListItemIcon>
                <ListItemText
                  primary="Digital Payments"
                  secondary={formatCurrency(earningsData.daily.digitalEarnings)}
                />
                <Chip label={`${Math.round((earningsData.daily.digitalEarnings / earningsData.daily.total) * 100)}%`} />
              </ListItem>
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2">Bonuses</Typography>
              <Typography variant="body2" color="success.main">
                +{formatCurrency(earningsData.daily.bonuses)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">Deductions</Typography>
              <Typography variant="body2" color="error.main">
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
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Weekly Summary - {earningsData.weekly.period}
              </Typography>
              <Chip 
                icon={getTrendIcon(earningsData.weekly.trend)} 
                label={`${earningsData.weekly.trend}% from last week`} 
                color={earningsData.weekly.trend > 0 ? "success" : "error"}
              />
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {formatCurrency(earningsData.weekly.total)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Weekly Earnings
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold">
                    {earningsData.weekly.trips}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Trips
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold">
                    {earningsData.weekly.onlineHours}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Online Hours
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight="bold">
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
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daily Performance
            </Typography>
            <Grid container spacing={2}>
              {earningsData.weekly.days.map((day, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" fontWeight="bold" color="text.secondary">
                      {day.day}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
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

      {/* Weekly Chart Visualization */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Earnings Trend
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 1, mt: 3 }}>
              {earningsData.weekly.days.map((day, index) => {
                const maxAmount = Math.max(...earningsData.weekly.days.map(d => d.amount));
                const height = (day.amount / maxAmount) * 150;
                return (
                  <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ mb: 1 }}>
                      {formatCurrency(day.amount)}
                    </Typography>
                    <Paper
                      sx={{
                        width: '80%',
                        height: height,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: 1
                      }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {day.day}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const MonthlyIncome = () => (
    <Grid container spacing={3}>
      {/* Monthly Overview */}
      <Grid item xs={12}>
        <Card elevation={3}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Monthly Income - {earningsData.monthly.period}
              </Typography>
              <Chip 
                icon={getTrendIcon(earningsData.monthly.trend)} 
                label={`${earningsData.monthly.trend}% from last month`} 
                color={earningsData.monthly.trend > 0 ? "success" : "error"}
              />
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.50' }}>
                  <Typography variant="h3" fontWeight="bold" color="primary">
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
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight="bold">
                        {earningsData.monthly.trips}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Trips
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h5" fontWeight="bold">
                        {earningsData.monthly.onlineHours}h
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Online Hours
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">
                        {formatCurrency(earningsData.monthly.averageWeekly)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg. Weekly
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" fontWeight="bold">
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
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Weekly Breakdown
            </Typography>
            <List>
              {earningsData.monthly.weeks.map((week, index) => (
                <ListItem key={index} divider>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Typography variant="body2" fontWeight="bold">
                        W{index + 1}
                      </Typography>
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={week.week}
                    secondary={`${week.trips} trips completed`}
                  />
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" fontWeight="bold">
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
        <Card elevation={3}>
          <CardContent sx={{ textAlign: 'center', p: 4 }}>
            <CreditScore sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {loanScore.score}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              {loanScore.level} Credit Score
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              {renderStars(loanScore.score)}
            </Box>
            
            <LinearProgress 
              variant="determinate" 
              value={loanScore.eligibility} 
              sx={{ height: 10, borderRadius: 5, mb: 3 }}
              color="success"
            />
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Eligibility Score: {loanScore.eligibility}%
            </Typography>
          </CardContent>
        </Card>

        {/* Loan Offers */}
        <Card sx={{ mt: 3 }} elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Available Loan Offers
            </Typography>
            <List>
              <ListItem divider>
                <ListItemIcon>
                  <Savings color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Quick Cash Advance"
                  secondary={`Up to ${formatCurrency(loanScore.maxAmount)}`}
                />
                <Chip label={`${loanScore.interestRate}% APR`} color="primary" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <RequestQuote color="info" />
                </ListItemIcon>
                <ListItemText
                  primary="Vehicle Upgrade Loan"
                  secondary="Up to UGX 5,000,000"
                />
                <Chip label="14.5% APR" color="secondary" />
              </ListItem>
            </List>
            <Button variant="contained" fullWidth sx={{ mt: 2 }}>
              View All Loan Offers
            </Button>
          </CardContent>
        </Card>
      </Grid>

      {/* Score Factors */}
      <Grid item xs={12} md={6}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Score Factors
            </Typography>
            <List>
              {loanScore.factors.map((factor, index) => (
                <ListItem key={index} divider>
                  <ListItemIcon>
                    <Avatar sx={{ 
                      bgcolor: factor.impact === 'positive' ? 'success.main' : 
                              factor.impact === 'negative' ? 'error.main' : 'warning.main',
                      width: 32, height: 32
                    }}>
                      <ShowChart fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={factor.factor}
                    secondary={`Impact: ${factor.weight}%`}
                  />
                  <Chip 
                    label={factor.impact} 
                    color={factor.impact === 'positive' ? 'success' : 
                           factor.impact === 'negative' ? 'error' : 'warning'}
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
            <Typography variant="h6" gutterBottom>
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
      backgroundColor: 'background.default',
      pb: 3
    }}>
      {/* Mobile Header */}
      {isMobile && (
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
              Earnings & Reports 💰
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: isMobile ? 'center' : 'left' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight="bold" 
            gutterBottom
            color="primary"
          >
            Earnings & Reports
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your earnings, analyze performance, and check loan eligibility
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <AccountBalanceWallet color="primary" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  {formatCurrency(3250000)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Earnings
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <EmojiEvents color="secondary" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  {loanScore.score}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Loan Score
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ReceiptLong color="success" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  597
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Trips
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <TrendingUp color="warning" sx={{ mb: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  +8.3%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Growth Rate
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Card elevation={3}>
          <CardContent sx={{ p: 0 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': { minHeight: 64 }
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