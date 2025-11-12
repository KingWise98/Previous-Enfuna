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
  Paper
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
  PhoneIphone
} from '@mui/icons-material';

const RewardsDashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const riderStats = {
    score: 78,
    level: 'Gold',
    nextLevel: 'Platinum',
    progress: 78,
    ridesThisWeek: 52,
    consistency: 95,
    totalEarnings: 285000
  };

  const availableRewards = [
    {
      id: 1,
      title: 'Fuel Discount',
      description: '15% off at Shell stations',
      points: 100,
      icon: '⛽',
      color: 'warning',
      claimed: false
    },
    {
      id: 2,
      title: 'Free Airtime',
      description: 'UGX 2,000 airtime bonus',
      points: 50,
      icon: '📞',
      color: 'info',
      claimed: true
    },
    {
      id: 3,
      title: 'Safety Kit',
      description: 'Reflective jacket + helmet',
      points: 200,
      icon: '🛡️',
      color: 'success',
      claimed: false
    },
    {
      id: 4,
      title: 'Maintenance',
      description: 'Free bike service',
      points: 150,
      icon: '🔧',
      color: 'secondary',
      claimed: false
    }
  ];

  const loanOffers = [
    {
      id: 1,
      amount: 500000,
      term: '30 days',
      interest: '5%',
      status: 'eligible',
      description: 'Quick cash for emergencies'
    },
    {
      id: 2,
      amount: 1000000,
      term: '90 days',
      interest: '8%',
      status: 'eligible',
      description: 'Business expansion loan'
    },
    {
      id: 3,
      amount: 2000000,
      term: '180 days',
      interest: '12%',
      status: 'pending',
      description: 'Vehicle upgrade loan'
    }
  ];

  const achievements = [
    { id: 1, title: 'First 10 Rides', achieved: true, points: 50 },
    { id: 2, title: 'Weekly Consistency', achieved: true, points: 100 },
    { id: 3, title: 'Fuel Logger', achieved: false, points: 75 },
    { id: 4, title: 'Safety First', achieved: true, points: 80 },
    { id: 5, title: 'Earnings Master', achieved: false, points: 150 }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleClaimReward = (rewardId) => {
    // Handle reward claiming logic
    alert(`Reward claimed! You'll receive instructions shortly.`);
  };

  const handleApplyLoan = (loanId) => {
    // Handle loan application logic
    alert('Loan application started! Complete your details.');
  };

  return (
    <Box sx={{ p: 2, maxWidth: 400, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Rewards & Benefits 🎁
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Earn points, unlock rewards, and access financial services
        </Typography>
      </Box>

      {/* Rider Level Card */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Chip 
                label={riderStats.level} 
                color="primary" 
                sx={{ bgcolor: 'white', color: 'black', fontWeight: 'bold' }}
              />
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                Level {riderStats.score}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Next: {riderStats.nextLevel} at 100 points
              </Typography>
            </Box>
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <EmojiEvents sx={{ fontSize: 40 }} />
            </Avatar>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={riderStats.progress} 
            sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.3)' }}
          />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <DirectionsBike color="primary" />
            <Typography variant="h6" fontWeight="bold">
              {riderStats.ridesThisWeek}
            </Typography>
            <Typography variant="caption">Rides/Week</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <TrendingUp color="success" />
            <Typography variant="h6" fontWeight="bold">
              {riderStats.consistency}%
            </Typography>
            <Typography variant="caption">Consistency</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <LocalAtm color="warning" />
            <Typography variant="h6" fontWeight="bold">
              UGX {(riderStats.totalEarnings / 1000).toFixed(0)}K
            </Typography>
            <Typography variant="caption">Earnings</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Rewards" icon={<CardGiftcard />} />
          <Tab label="Loans" icon={<LocalAtm />} />
          <Tab label="Achievements" icon={<EmojiEvents />} />
        </Tabs>

        <CardContent>
          {/* Rewards Tab */}
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Available Rewards
              </Typography>
              <List>
                {availableRewards.map((reward, index) => (
                  <React.Fragment key={reward.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: `${reward.color}.100` }}>
                          <Typography variant="h6">{reward.icon}</Typography>
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">{reward.title}</Typography>
                            <Chip 
                              label={`${reward.points} pts`} 
                              size="small" 
                              color="primary"
                            />
                          </Box>
                        }
                        secondary={reward.description}
                      />
                      <Button
                        variant={reward.claimed ? "outlined" : "contained"}
                        size="small"
                        disabled={reward.claimed}
                        onClick={() => handleClaimReward(reward.id)}
                      >
                        {reward.claimed ? 'Claimed' : 'Claim'}
                      </Button>
                    </ListItem>
                    {index < availableRewards.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}

          {/* Loans Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Loan Offers
              </Typography>
              <List>
                {loanOffers.map((loan, index) => (
                  <React.Fragment key={loan.id}>
                    <ListItem>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: loan.status === 'eligible' ? 'success.100' : 'grey.100' }}>
                          <LocalAtm color={loan.status === 'eligible' ? 'success' : 'disabled'} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">
                              UGX {loan.amount.toLocaleString()}
                            </Typography>
                            <Chip 
                              label={loan.status} 
                              size="small" 
                              color={loan.status === 'eligible' ? 'success' : 'default'}
                            />
                          </Box>
                        }
                        secondary={`${loan.term} • ${loan.interest} interest • ${loan.description}`}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        disabled={loan.status !== 'eligible'}
                        onClick={() => handleApplyLoan(loan.id)}
                      >
                        Apply
                      </Button>
                    </ListItem>
                    {index < loanOffers.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}

          {/* Achievements Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Your Achievements
              </Typography>
              <List>
                {achievements.map((achievement, index) => (
                  <React.Fragment key={achievement.id}>
                    <ListItem>
                      <ListItemIcon>
                        {achievement.achieved ? (
                          <CheckCircle color="success" />
                        ) : (
                          <Lock color="disabled" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={achievement.title}
                        secondary={`${achievement.points} points`}
                      />
                      <Chip 
                        icon={achievement.achieved ? <Star /> : <Bolt />}
                        label={achievement.achieved ? 'Earned' : 'Locked'}
                        color={achievement.achieved ? 'success' : 'default'}
                        variant={achievement.achieved ? 'filled' : 'outlined'}
                      />
                    </ListItem>
                    {index < achievements.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Benefits Summary */}
      <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Your Benefits Status
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Security sx={{ fontSize: 40, opacity: 0.8 }} />
                <Typography variant="body2">SOS Protection</Typography>
                <Chip label="Active" size="small" sx={{ bgcolor: 'white', color: 'black', mt: 1 }} />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Discount sx={{ fontSize: 40, opacity: 0.8 }} />
                <Typography variant="body2">Partner Discounts</Typography>
                <Chip label="5 Active" size="small" sx={{ bgcolor: 'white', color: 'black', mt: 1 }} />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<PhoneIphone />}
          fullWidth
        >
          Contact Support
        </Button>
        <Button
          variant="contained"
          startIcon={<TrendingUp />}
          fullWidth
        >
          Improve Score
        </Button>
      </Box>
    </Box>
  );
};

export default RewardsDashboard;