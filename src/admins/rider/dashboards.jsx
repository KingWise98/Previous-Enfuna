import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  IconButton,
  LinearProgress
} from '@mui/material';
import {
  DirectionsCar,
  AccountBalanceWallet,
  Payment,
  Receipt,
  TrendingUp,
  TrendingDown,
  Add,
  Visibility,
  Schedule,
  CheckCircle,
  LocalGasStation,
  CarRepair,
  Fastfood,
  MoreVert,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';

const DashboardPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalEarnings: 254000,
    todayEarnings: 45000,
    totalTrips: 34,
    todayTrips: 3,
    netEarnings: 189000,
    totalExpenses: 65000,
    activeHours: '4h 30m'
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      type: 'earning',
      amount: 15000,
      description: 'Trip to Garden City',
      time: '2:30 PM',
      status: 'completed'
    },
    {
      id: 2,
      type: 'expense',
      amount: 25000,
      description: 'Fuel Refill',
      time: '1:15 PM',
      status: 'completed'
    },
    {
      id: 3,
      type: 'earning',
      amount: 12000,
      description: 'Trip to Makerere',
      time: '11:45 AM',
      status: 'completed'
    },
    {
      id: 4,
      type: 'earning',
      amount: 18000,
      description: 'Airport Transfer',
      time: '9:30 AM',
      status: 'completed'
    }
  ]);

  const [expenseCategories, setExpenseCategories] = useState([
    { name: 'Fuel', amount: 35000, percentage: 54, icon: <LocalGasStation />, color: '#FF6B6B' },
    { name: 'Maintenance', amount: 15000, percentage: 23, icon: <CarRepair />, color: '#4ECDC4' },
    { name: 'Food', amount: 8000, percentage: 12, icon: <Fastfood />, color: '#45B7D1' },
    { name: 'Other', amount: 7000, percentage: 11, icon: <Receipt />, color: '#96CEB4' }
  ]);

  const quickActions = [
    {
      title: 'Start Ride',
      subtitle: 'Begin a new trip',
      icon: <DirectionsCar sx={{ fontSize: 30 }} />,
      color: '#0025DD',
      action: () => navigate('/rider/ride')
    },
    {
      title: 'Add Expense',
      subtitle: 'Record spending',
      icon: <Add sx={{ fontSize: 30 }} />,
      color: '#FF6B6B',
      action: () => navigate('/rider/expense')
    },
    {
      title: 'View Payments',
      subtitle: 'See your earnings',
      icon: <Payment sx={{ fontSize: 30 }} />,
      color: '#4ECDC4',
      action: () => navigate('/rider/payment')
    },
    {
      title: 'My Earnings',
      subtitle: 'Financial summary',
      icon: <AccountBalanceWallet sx={{ fontSize: 30 }} />,
      color: '#FFEC01',
      textColor: '#000',
      action: () => navigate('/rider/earning')
    }
  ];

  // Handle navigation for recent activities if needed
  const handleActivityClick = (activity) => {
    if (activity.type === 'earning') {
      navigate('/rider/earning');
    } else if (activity.type === 'expense') {
      navigate('/rider/expense');
    }
  };

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
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ENFUNA Rider
          </Typography>
          <Chip 
            icon={<Schedule />}
            label={`Active ${stats.activeHours}`}
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
        {/* Financial Summary Cards - TOP SECTION */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Total Earnings */}
          <Grid item xs={12} sm={6} lg={3}>
            <Card 
              sx={{ 
                background: 'linear-gradient(135deg, #0025DD 0%, #001FB8 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0, 37, 221, 0.2)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 37, 221, 0.3)'
                }
              }}
              onClick={() => navigate('/rider/earning')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <AccountBalanceWallet sx={{ fontSize: 40, opacity: 0.8 }} />
                  <TrendingUp sx={{ fontSize: 20 }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                  UGX {stats.totalEarnings.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Earnings
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ArrowUpward sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption">
                    UGX {stats.todayEarnings.toLocaleString()} today
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Today's Earnings */}
          <Grid item xs={12} sm={6} lg={3}>
            <Card 
              sx={{ 
                backgroundColor: 'white',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                }
              }}
              onClick={() => navigate('/rider/earning')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Receipt sx={{ fontSize: 40, color: '#0025DD' }} />
                  <TrendingUp sx={{ fontSize: 20, color: '#10B981' }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="#0025DD" sx={{ mb: 1 }}>
                  UGX {stats.todayEarnings.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today's Earnings
                </Typography>
                <Typography variant="caption" color="#10B981" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ArrowUpward sx={{ fontSize: 16, mr: 0.5 }} />
                  {stats.todayTrips} trips completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Net Earnings */}
          <Grid item xs={12} sm={6} lg={3}>
            <Card 
              sx={{ 
                backgroundColor: 'white',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                }
              }}
              onClick={() => navigate('/rider/earning')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <AccountBalanceWallet sx={{ fontSize: 40, color: '#10B981' }} />
                  <TrendingUp sx={{ fontSize: 20, color: '#10B981' }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="#10B981" sx={{ mb: 1 }}>
                  UGX {stats.netEarnings.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Net Earnings
                </Typography>
                <Typography variant="caption" color="#10B981" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  After expenses
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Total Expenses */}
          <Grid item xs={12} sm={6} lg={3}>
            <Card 
              sx={{ 
                backgroundColor: 'white',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                }
              }}
              onClick={() => navigate('/rider/expense')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Receipt sx={{ fontSize: 40, color: '#FF6B6B' }} />
                  <TrendingDown sx={{ fontSize: 20, color: '#EF4444' }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" color="#FF6B6B" sx={{ mb: 1 }}>
                  UGX {stats.totalExpenses.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Expenses
                </Typography>
                <Typography variant="caption" color="#EF4444" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <ArrowDownward sx={{ fontSize: 16, mr: 0.5 }} />
                  This month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Left Column - Quick Actions & Recent Activity */}
          <Grid item xs={12} lg={8}>
            {/* Quick Actions */}
            <Card sx={{ 
              mb: 3, 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="#0025DD" gutterBottom>
                  Quick Actions
                </Typography>
                <Grid container spacing={2}>
                  {quickActions.map((action, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Paper 
                        sx={{ 
                          p: 2, 
                          textAlign: 'center',
                          borderRadius: 2,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          backgroundColor: action.color,
                          color: action.textColor || 'white',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                          }
                        }}
                        onClick={action.action}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          mb: 1 
                        }}>
                          {action.icon}
                        </Box>
                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                          {action.title}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          {action.subtitle}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" color="#0025DD">
                    Recent Activity
                  </Typography>
                  <IconButton size="small" onClick={() => navigate('/rider/earning')}>
                    <Visibility />
                  </IconButton>
                </Box>
                <List>
                  {recentActivities.map((activity, index) => (
                    <ListItem 
                      key={activity.id} 
                      divider={index < recentActivities.length - 1}
                      sx={{ 
                        px: 0,
                        cursor: 'pointer',
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                          backgroundColor: '#f8fafc'
                        }
                      }}
                      onClick={() => handleActivityClick(activity)}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ 
                          bgcolor: activity.type === 'earning' ? '#10B98120' : '#FF6B6B20',
                          color: activity.type === 'earning' ? '#10B981' : '#FF6B6B'
                        }}>
                          {activity.type === 'earning' ? <TrendingUp /> : <TrendingDown />}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight="500">
                            {activity.description}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        }
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography 
                          variant="body2" 
                          fontWeight="bold"
                          color={activity.type === 'earning' ? '#10B981' : '#FF6B6B'}
                        >
                          {activity.type === 'earning' ? '+' : '-'}UGX {activity.amount.toLocaleString()}
                        </Typography>
                        <Chip 
                          label={activity.status}
                          size="small"
                          sx={{ 
                            backgroundColor: activity.status === 'completed' ? '#10B98120' : '#FFEC01',
                            color: activity.status === 'completed' ? '#10B981' : '#000',
                            fontSize: '0.7rem',
                            height: 20
                          }}
                        />
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    size="small"
                    sx={{
                      borderColor: '#0025DD',
                      color: '#0025DD',
                      '&:hover': {
                        borderColor: '#001FB8',
                        backgroundColor: '#0025DD10'
                      }
                    }}
                    onClick={() => navigate('/rider/earning')}
                  >
                    View All Activity
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column - Expense Breakdown & Performance */}
          <Grid item xs={12} lg={4}>
            {/* Expense Breakdown */}
            <Card 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                }
              }}
              onClick={() => navigate('/rider/expense')}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" color="#0025DD">
                    Expense Breakdown
                  </Typography>
                  <IconButton size="small">
                    <Visibility />
                  </IconButton>
                </Box>
                <Box sx={{ mb: 2 }}>
                  {expenseCategories.map((category, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ color: category.color }}>
                            {category.icon}
                          </Box>
                          <Typography variant="body2" fontWeight="500">
                            {category.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold" color="#0025DD">
                          UGX {category.amount.toLocaleString()}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={category.percentage}
                        sx={{ 
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: '#e2e8f0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: category.color,
                            borderRadius: 3
                          }
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {category.percentage}% of total
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="#0025DD" gutterBottom>
                  Performance
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Total Trips</TableCell>
                        <TableCell sx={{ border: 'none', fontWeight: 'bold', color: '#0025DD', textAlign: 'right' }}>
                          {stats.totalTrips}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Today's Trips</TableCell>
                        <TableCell sx={{ border: 'none', fontWeight: 'bold', color: '#0025DD', textAlign: 'right' }}>
                          {stats.todayTrips}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Active Hours</TableCell>
                        <TableCell sx={{ border: 'none', fontWeight: 'bold', color: '#0025DD', textAlign: 'right' }}>
                          {stats.activeHours}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ border: 'none', fontWeight: 'bold' }}>Success Rate</TableCell>
                        <TableCell sx={{ border: 'none', fontWeight: 'bold', color: '#10B981', textAlign: 'right' }}>
                          94%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#0025DD10', borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight="bold" color="#0025DD" gutterBottom>
                    Weekly Goal
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={75}
                    sx={{ 
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#e2e8f0',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#0025DD',
                        borderRadius: 4
                      }
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    75% completed • 3 days left
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;