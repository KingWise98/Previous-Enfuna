import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
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
  Tabs,
  Tab,
  Badge,
  LinearProgress,
  Tooltip,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Groups,
  AccountBalanceWallet,
  Payment,
  Add,
  CheckCircle,
  Schedule,
  Cancel,
  TrendingUp,
  Security,
  LocalAtm,
  History,
  ExpandMore,
  PersonAdd,
  Share,
  Notifications,
  EmojiEvents,
  Lock,
  GroupWork,
  Savings,
  RequestQuote,
  Balance
} from '@mui/icons-material';

const GroupFundingDashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [createGroupDialog, setCreateGroupDialog] = useState(false);
  const [joinGroupDialog, setJoinGroupDialog] = useState(false);
  const [contributionDialog, setContributionDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    contributionAmount: '',
    frequency: 'weekly',
    maxMembers: 10,
    targetAmount: '',
    isPublic: true
  });

  // Mock data
  const [groups, setGroups] = useState([
    {
      id: 'GRP001',
      name: 'Kampala Vehicle Savers',
      description: 'Weekly savings group for drivers in central Kampala',
      type: 'savings',
      status: 'active',
      members: 8,
      maxMembers: 12,
      contributionAmount: 50000,
      frequency: 'weekly',
      totalPool: 400000,
      nextPayout: '2024-01-22',
      createdBy: 'David Kato',
      createdDate: '2024-01-01',
      rules: {
        lateFee: 5000,
        maxMissedPayments: 2,
        withdrawalNotice: '7 days'
      }
    },
    {
      id: 'GRP002',
      name: 'Emergency Fund Circle',
      description: 'Emergency support fund for unexpected expenses',
      type: 'emergency',
      status: 'active',
      members: 6,
      maxMembers: 10,
      contributionAmount: 20000,
      frequency: 'monthly',
      totalPool: 120000,
      nextPayout: 'Flexible',
      createdBy: 'Maria Nalwoga',
      createdDate: '2024-01-10',
      rules: {
        lateFee: 2000,
        maxMissedPayments: 1,
        withdrawalNotice: '24 hours'
      }
    },
    {
      id: 'GRP003',
      name: 'Bike Upgrade Fund',
      description: 'Saving together for vehicle upgrades and repairs',
      type: 'equipment',
      status: 'pending',
      members: 3,
      maxMembers: 8,
      contributionAmount: 100000,
      frequency: 'monthly',
      totalPool: 300000,
      nextPayout: '2024-03-15',
      createdBy: 'Emma Vangamoi',
      createdDate: '2024-01-12',
      rules: {
        lateFee: 10000,
        maxMissedPayments: 0,
        withdrawalNotice: '30 days'
      }
    }
  ]);

  const [myGroups, setMyGroups] = useState(['GRP001', 'GRP002']);
  const [contributions, setContributions] = useState([
    {
      id: 'CONT001',
      groupId: 'GRP001',
      amount: 50000,
      date: '2024-01-15',
      status: 'completed',
      member: 'David Kato'
    },
    {
      id: 'CONT002',
      groupId: 'GRP001',
      amount: 50000,
      date: '2024-01-08',
      status: 'completed',
      member: 'David Kato'
    },
    {
      id: 'CONT003',
      groupId: 'GRP002',
      amount: 20000,
      date: '2024-01-15',
      status: 'completed',
      member: 'David Kato'
    }
  ]);

  const groupTypes = [
    { value: 'savings', label: '💵 Regular Savings', description: 'Fixed contributions at regular intervals' },
    { value: 'emergency', label: '🚨 Emergency Fund', description: 'For unexpected expenses and emergencies' },
    { value: 'equipment', label: '🏍️ Equipment Fund', description: 'Saving for bike upgrades and repairs' },
    { value: 'investment', label: '📈 Investment Pool', description: 'Group investment opportunities' },
    { value: 'loan', label: '💰 Loan Circle', description: 'Rotating credit among members' }
  ];

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom' }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCreateGroup = () => {
    const group = {
      id: `GRP${Date.now()}`,
      ...newGroup,
      members: 1,
      totalPool: 0,
      status: 'active',
      createdBy: 'David Kato',
      createdDate: new Date().toISOString().split('T')[0],
      rules: {
        lateFee: 5000,
        maxMissedPayments: 2,
        withdrawalNotice: '7 days'
      }
    };

    setGroups(prev => [group, ...prev]);
    setMyGroups(prev => [...prev, group.id]);
    setCreateGroupDialog(false);
    setNewGroup({
      name: '',
      description: '',
      contributionAmount: '',
      frequency: 'weekly',
      maxMembers: 10,
      targetAmount: '',
      isPublic: true
    });

    alert(`🎉 Group "${group.name}" created successfully!`);
  };

  const handleJoinGroup = (groupId) => {
    if (!myGroups.includes(groupId)) {
      setMyGroups(prev => [...prev, groupId]);
      
      // Add sample contribution
      const group = groups.find(g => g.id === groupId);
      const newContribution = {
        id: `CONT${Date.now()}`,
        groupId: groupId,
        amount: group.contributionAmount,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        member: 'David Kato'
      };

      setContributions(prev => [newContribution, ...prev]);
      
      // Update group members count
      setGroups(prev => 
        prev.map(group => 
          group.id === groupId 
            ? { ...group, members: group.members + 1, totalPool: group.totalPool + group.contributionAmount }
            : group
        )
      );

      alert(`✅ Successfully joined "${group.name}"! Your first contribution has been processed.`);
    }
    setJoinGroupDialog(false);
  };

  const handleMakeContribution = (groupId, amount) => {
    const group = groups.find(g => g.id === groupId);
    const newContribution = {
      id: `CONT${Date.now()}`,
      groupId: groupId,
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      member: 'David Kato'
    };

    setContributions(prev => [newContribution, ...prev]);
    
    // Update group pool
    setGroups(prev => 
      prev.map(group => 
        group.id === groupId 
          ? { ...group, totalPool: group.totalPool + amount }
          : group
      )
    );

    setContributionDialog(false);
    alert(`✅ Contribution of UGX ${amount.toLocaleString()} made to ${group.name}`);
  };

  const getGroupTypeColor = (type) => {
    switch (type) {
      case 'savings': return 'primary';
      case 'emergency': return 'error';
      case 'equipment': return 'warning';
      case 'investment': return 'success';
      case 'loan': return 'info';
      default: return 'default';
    }
  };

  const getGroupStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'closed': return 'error';
      default: return 'default';
    }
  };

  const calculateProgress = (group) => {
    return (group.totalPool / (group.contributionAmount * group.maxMembers)) * 100;
  };

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'grey.50' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Group Funding & Savings Circles 👥
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Join forces with other drivers to save, invest, and access group benefits
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            startIcon={<Groups />} 
            variant="outlined"
            onClick={() => setJoinGroupDialog(true)}
          >
            Join Group
          </Button>
          <Button 
            startIcon={<Add />} 
            variant="contained"
            onClick={() => setCreateGroupDialog(true)}
          >
            Create Group
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Sidebar - My Groups & Quick Stats */}
        <Grid item xs={3}>
          {/* My Groups Summary */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>My Groups</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Active Groups</Typography>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {myGroups.length}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Total Contributions</Typography>
                <Typography variant="h5" color="success.main">
                  UGX {contributions.reduce((sum, cont) => sum + cont.amount, 0).toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Next Contribution</Typography>
                <Typography variant="body1" fontWeight="bold">
                  2 days
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Payment />}
                sx={{ mb: 1 }}
                onClick={() => setContributionDialog(true)}
              >
                Make Contribution
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<RequestQuote />}
                sx={{ mb: 1 }}
              >
                Request Withdrawal
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Share />}
              >
                Invite drivers
              </Button>
            </CardContent>
          </Card>

          {/* Group Benefits */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Group Benefits</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'success.100', width: 32, height: 32 }}>
                      <Security color="success" fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Collective Security"
                    secondary="Emergency support from group"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'primary.100', width: 32, height: 32 }}>
                      <TrendingUp color="primary" fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Better Loan Rates"
                    secondary="Group negotiation power"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'warning.100', width: 32, height: 32 }}>
                      <EmojiEvents color="warning" fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Group Rewards"
                    secondary="Collective achievement bonuses"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content Area */}
        <Grid item xs={6}>
          <Card>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="My Groups" icon={<Groups />} />
              <Tab label="All Groups" icon={<GroupWork />} />
              <Tab label="Contributions" icon={<Savings />} />
              <Tab label="Group Analytics" icon={<TrendingUp />} />
            </Tabs>

            <CardContent sx={{ minHeight: 500 }}>
              {/* My Groups */}
              {activeTab === 0 && (
                <Box>
                  <Typography variant="h5" gutterBottom>My Active Groups</Typography>
                  {groups.filter(group => myGroups.includes(group.id)).map((group) => (
                    <Card key={group.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box>
                            <Typography variant="h6">{group.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {group.description}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              label={group.type} 
                              size="small"
                              color={getGroupTypeColor(group.type)}
                            />
                            <Chip 
                              label={group.status} 
                              size="small"
                              color={getGroupStatusColor(group.status)}
                            />
                          </Box>
                        </Box>

                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="textSecondary">Members</Typography>
                            <Typography variant="h6">
                              {group.members}/{group.maxMembers}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="textSecondary">Contribution</Typography>
                            <Typography variant="h6">
                              UGX {group.contributionAmount.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="textSecondary">Total Pool</Typography>
                            <Typography variant="h6" color="success.main">
                              UGX {group.totalPool.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body2" color="textSecondary">Frequency</Typography>
                            <Typography variant="h6">
                              {group.frequency}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">Group Progress</Typography>
                            <Typography variant="body2">
                              {calculateProgress(group).toFixed(1)}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={calculateProgress(group)} 
                            color="primary"
                          />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            variant="contained" 
                            size="small"
                            onClick={() => {
                              setSelectedGroup(group);
                              setContributionDialog(true);
                            }}
                          >
                            Contribute
                          </Button>
                          <Button variant="outlined" size="small">
                            View Details
                          </Button>
                          <Button variant="outlined" size="small">
                            Invite
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}

              {/* All Groups */}
              {activeTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5">Available Groups</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="outlined">
                        All Types
                      </Button>
                      <Button size="small" variant="outlined">
                        Public
                      </Button>
                      <Button size="small" variant="outlined">
                        Private
                      </Button>
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    {groups.map((group) => (
                      <Grid item xs={6} key={group.id}>
                        <Card 
                          sx={{ 
                            height: '100%',
                            border: myGroups.includes(group.id) ? `2px solid ${theme.palette.primary.main}` : '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6">{group.name}</Typography>
                              <Chip 
                                label={group.type} 
                                size="small"
                                color={getGroupTypeColor(group.type)}
                              />
                            </Box>

                            <Typography variant="body2" color="textSecondary" paragraph>
                              {group.description}
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Members</Typography>
                                <Typography variant="body2">
                                  {group.members}/{group.maxMembers}
                                </Typography>
                              </Box>
                              <LinearProgress 
                                variant="determinate" 
                                value={(group.members / group.maxMembers) * 100} 
                                color="primary"
                              />
                            </Box>

                            <Grid container spacing={1} sx={{ mb: 2 }}>
                              <Grid item xs={6}>
                                <Typography variant="body2" color="textSecondary">Contribution</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                  UGX {group.contributionAmount.toLocaleString()}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2" color="textSecondary">Frequency</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                  {group.frequency}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Button
                              variant={myGroups.includes(group.id) ? "outlined" : "contained"}
                              fullWidth
                              disabled={group.status !== 'active' || group.members >= group.maxMembers}
                              onClick={() => myGroups.includes(group.id) ? {} : handleJoinGroup(group.id)}
                              startIcon={myGroups.includes(group.id) ? <CheckCircle /> : <PersonAdd />}
                            >
                              {myGroups.includes(group.id) ? 'Already Member' : 'Join Group'}
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Contributions */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" gutterBottom>Contribution History</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Group</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {contributions.map((contribution) => {
                          const group = groups.find(g => g.id === contribution.groupId);
                          return (
                            <TableRow key={contribution.id} hover>
                              <TableCell>
                                <Typography variant="body2">
                                  {new Date(contribution.date).toLocaleDateString()}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="500">
                                  {group?.name}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" fontWeight="bold" color="success.main">
                                  UGX {contribution.amount.toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={contribution.status} 
                                  size="small"
                                  color={contribution.status === 'completed' ? 'success' : 'warning'}
                                />
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={group?.type} 
                                  size="small"
                                  color={getGroupTypeColor(group?.type)}
                                />
                              </TableCell>
                              <TableCell>
                                <Button size="small">Receipt</Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Group Analytics */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="h5" gutterBottom>Group Analytics</Typography>
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" color="primary" fontWeight="bold">
                          {myGroups.length}
                        </Typography>
                        <Typography variant="body2">Active Groups</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" color="success.main" fontWeight="bold">
                          UGX {contributions.reduce((sum, cont) => sum + cont.amount, 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2">Total Contributions</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={4}>
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="h3" color="warning.main" fontWeight="bold">
                          {groups.filter(g => myGroups.includes(g.id)).reduce((sum, group) => sum + group.members, 0)}
                        </Typography>
                        <Typography variant="body2">Total Members</Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Typography variant="h6" gutterBottom>Group Performance</Typography>
                  {groups.filter(group => myGroups.includes(group.id)).map((group) => (
                    <Accordion key={group.id}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                          <Typography>{group.name}</Typography>
                          <Typography color="success.main">
                            UGX {group.totalPool.toLocaleString()}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Typography variant="body2">Monthly Growth</Typography>
                            <Typography variant="h6" color="success.main">
                              +15%
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2">Member Activity</Typography>
                            <Typography variant="h6" color="primary.main">
                              92%
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="body2">Next Payout</Typography>
                            <Typography variant="h6">
                              {group.nextPayout}
                            </Typography>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Sidebar - Group Insights & Notifications */}
        <Grid item xs={3}>
          {/* Group Insights */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Group Insights</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Most Active Group</Typography>
                <Typography variant="body1" fontWeight="bold">
                  Kampala Vehicle Savers
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Highest Contribution</Typography>
                <Typography variant="body1" fontWeight="bold" color="success.main">
                  UGX 100,000
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">Group Performance</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={85} 
                  color="success"
                  sx={{ mt: 1 }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Group Notifications */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Group Updates</Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'info.100', width: 32, height: 32 }}>
                      <Notifications color="info" fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="New Member Joined"
                    secondary="Maria joined Emergency Fund Circle"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'warning.100', width: 32, height: 32 }}>
                      <Schedule color="warning" fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Contribution Due"
                    secondary="Kampala Vehicle Savers - 2 days left"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Avatar sx={{ bgcolor: 'success.100', width: 32, height: 32 }}>
                      <EmojiEvents color="success" fontSize="small" />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary="Group Milestone"
                    secondary="Bike Upgrade Fund reached 50% target"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Create Group CTA */}
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Groups sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Start Your Own Group
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Create a savings circle with other drivers and achieve your financial goals together
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                onClick={() => setCreateGroupDialog(true)}
              >
                Create Group
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create Group Dialog */}
      <Dialog 
        open={createGroupDialog} 
        onClose={() => setCreateGroupDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Create New Group</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Stepper activeStep={0} sx={{ mb: 3 }}>
            <Step>
              <StepLabel>Group Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Contribution Setup</StepLabel>
            </Step>
            <Step>
              <StepLabel>Rules & Settings</StepLabel>
            </Step>
          </Stepper>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Group Name"
                value={newGroup.name}
                onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Kampala Vehicle Savers"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Group Description"
                multiline
                rows={3}
                value={newGroup.description}
                onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the purpose and goals of your group..."
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Group Type</InputLabel>
                <Select
                  value={newGroup.type}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, type: e.target.value }))}
                  label="Group Type"
                >
                  {groupTypes.map(type => (
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
                label="Maximum Members"
                type="number"
                value={newGroup.maxMembers}
                onChange={(e) => setNewGroup(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Contribution Amount (UGX)"
                type="number"
                value={newGroup.contributionAmount}
                onChange={(e) => setNewGroup(prev => ({ ...prev, contributionAmount: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Contribution Frequency</InputLabel>
                <Select
                  value={newGroup.frequency}
                  onChange={(e) => setNewGroup(prev => ({ ...prev, frequency: e.target.value }))}
                  label="Contribution Frequency"
                >
                  {frequencies.map(freq => (
                    <MenuItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Target Amount (UGX) - Optional"
                type="number"
                value={newGroup.targetAmount}
                onChange={(e) => setNewGroup(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="Leave empty if no specific target"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newGroup.isPublic}
                    onChange={(e) => setNewGroup(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                }
                label="Public Group (Visible to all drivers)"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateGroupDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleCreateGroup}
            disabled={!newGroup.name || !newGroup.contributionAmount}
          >
            Create Group
          </Button>
        </DialogActions>
      </Dialog>

      {/* Join Group Dialog */}
      <Dialog 
        open={joinGroupDialog} 
        onClose={() => setJoinGroupDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Join a Group</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" paragraph>
            Browse available groups and join ones that match your savings goals
          </Typography>
          
          <Grid container spacing={2}>
            {groups
              .filter(group => !myGroups.includes(group.id) && group.status === 'active')
              .map((group) => (
                <Grid item xs={6} key={group.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>{group.name}</Typography>
                      <Typography variant="body2" color="textSecondary" paragraph>
                        {group.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Members</Typography>
                          <Typography variant="body2">
                            {group.members}/{group.maxMembers}
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={(group.members / group.maxMembers) * 100} 
                        />
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Box>
                          <Typography variant="body2">Contribution</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            UGX {group.contributionAmount.toLocaleString()}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2">Frequency</Typography>
                          <Typography variant="body1" fontWeight="bold">
                            {group.frequency}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        disabled={group.members >= group.maxMembers}
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        {group.members >= group.maxMembers ? 'Group Full' : 'Join Group'}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setJoinGroupDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Contribution Dialog */}
      <Dialog 
        open={contributionDialog} 
        onClose={() => setContributionDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5">Make Contribution</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedGroup ? (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedGroup.name}</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Regular contribution amount: UGX {selectedGroup.contributionAmount.toLocaleString()}
              </Typography>

              <TextField
                fullWidth
                label="Contribution Amount (UGX)"
                type="number"
                defaultValue={selectedGroup.contributionAmount}
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>UGX</Typography>
                }}
                sx={{ mb: 2 }}
              />

              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Contribution Details:
                </Typography>
                <Typography variant="body2">
                  • Will be processed immediately
                </Typography>
                <Typography variant="body2">
                  • Added to group pool: UGX {selectedGroup.totalPool.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  • Next contribution due: {selectedGroup.nextPayout}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Group</InputLabel>
                <Select
                  value={''}
                  onChange={(e) => setSelectedGroup(groups.find(g => g.id === e.target.value))}
                  label="Select Group"
                >
                  {groups.filter(group => myGroups.includes(group.id)).map(group => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setContributionDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => selectedGroup && handleMakeContribution(selectedGroup.id, selectedGroup.contributionAmount)}
            disabled={!selectedGroup}
          >
            Make Contribution
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupFundingDashboard;