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
  Avatar,
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Snackbar
} from '@mui/material';
import {
  DirectionsCar,
  AirportShuttle,
  LocalTaxi,
  Business,
  Person,
  AccessTime,
  Numbers,
  LocationOn,
  EventAvailable,
  ExitToApp,
  PlayArrow,
  Close,
  CheckCircle,
  Schedule,
  Group,
  Notifications,
  NotificationsActive,
  QrCode2,
  Share
} from '@mui/icons-material';

const QueuePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [activeQueue, setActiveQueue] = useState(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [selectedQueueType, setSelectedQueueType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock queue data
  const [queues, setQueues] = useState({
    airport: {
      name: 'Entebbe Airport Taxi Queue',
      location: 'International Arrivals, Gate 3',
      currentPosition: 1,
      totalDrivers: 24,
      avgWaitTime: '15-25 min',
      status: 'active',
      drivers: [
        { id: 1, name: 'John M.', position: 1, waitTime: '2 min', status: 'boarding', vehicle: 'Toyota Premio', plate: 'UAB 123A' },
        { id: 2, name: 'Sarah K.', position: 2, waitTime: '5 min', status: 'waiting', vehicle: 'Honda Fit', plate: 'UAE 456B' },
        { id: 3, name: 'Mike T.', position: 3, waitTime: '8 min', status: 'waiting', vehicle: 'Toyota RAV4', plate: 'UAF 789C' },
        { id: 4, name: 'David L.', position: 4, waitTime: '11 min', status: 'waiting', vehicle: 'Nissan X-Trail', plate: 'UAG 012D' },
        { id: 5, name: 'Grace N.', position: 5, waitTime: '14 min', status: 'waiting', vehicle: 'Mazda Demio', plate: 'UAH 345E' }
      ]
    },
    taxiStage: {
      name: 'Kampala City Taxi Stage',
      location: 'City Square, Nakasero',
      currentPosition: 1,
      totalDrivers: 18,
      avgWaitTime: '8-15 min',
      status: 'active',
      drivers: [
        { id: 1, name: 'Robert K.', position: 1, waitTime: '1 min', status: 'boarding', vehicle: 'Toyota Wish', plate: 'UAA 111A' },
        { id: 2, name: 'Alice J.', position: 2, waitTime: '4 min', status: 'waiting', vehicle: 'Honda Civic', plate: 'UAB 222B' },
        { id: 3, name: 'Peter M.', position: 3, waitTime: '7 min', status: 'waiting', vehicle: 'Toyota Fielder', plate: 'UAC 333C' }
      ]
    },
    company: {
      name: 'Corporate Dispatch Queue',
      location: 'Industrial Area Hub',
      currentPosition: 1,
      totalDrivers: 12,
      avgWaitTime: '20-30 min',
      status: 'active',
      drivers: [
        { id: 1, name: 'Business Driver', position: 1, waitTime: '3 min', status: 'assigned', vehicle: 'Toyota Hiace', plate: 'UAD 444D' },
        { id: 2, name: 'Executive Car', position: 2, waitTime: '10 min', status: 'waiting', vehicle: 'Mercedes Benz', plate: 'UAE 555E' }
      ]
    }
  });

  const [userQueue, setUserQueue] = useState(null);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const joinQueue = (queueType) => {
    const queue = queues[queueType];
    const newPosition = queue.totalDrivers + 1;
    
    const newDriver = {
      id: Date.now(),
      name: 'You',
      position: newPosition,
      waitTime: 'Just joined',
      status: 'waiting',
      vehicle: 'Your Vehicle',
      plate: 'YOUR PLATE',
      isUser: true
    };

    // Update queue
    const updatedQueue = {
      ...queue,
      totalDrivers: newPosition,
      drivers: [...queue.drivers, newDriver]
    };

    setQueues(prev => ({
      ...prev,
      [queueType]: updatedQueue
    }));

    // Set user's queue
    setUserQueue({
      type: queueType,
      position: newPosition,
      joinTime: new Date(),
      queue: updatedQueue
    });

    setShowJoinDialog(false);
    setSelectedQueueType('');
    showSnackbar(`Joined ${queue.name}! Your position: #${newPosition}`);
  };

  const leaveQueue = () => {
    if (!userQueue) return;

    const queueType = userQueue.type;
    const queue = queues[queueType];
    
    // Remove user from drivers list
    const updatedDrivers = queue.drivers.filter(driver => !driver.isUser);
    
    // Update positions for remaining drivers
    const driversWithUpdatedPositions = updatedDrivers.map((driver, index) => ({
      ...driver,
      position: index + 1
    }));

    const updatedQueue = {
      ...queue,
      totalDrivers: driversWithUpdatedPositions.length,
      drivers: driversWithUpdatedPositions
    };

    setQueues(prev => ({
      ...prev,
      [queueType]: updatedQueue
    }));

    setUserQueue(null);
    showSnackbar('Left the queue successfully');
  };

  // Simulate queue movement
  useEffect(() => {
    if (!userQueue) return;

    const interval = setInterval(() => {
      setQueues(prev => {
        const queueType = userQueue.type;
        const currentQueue = prev[queueType];
        
        if (currentQueue.drivers.length === 0) return prev;

        // Move the first driver to assigned/boarding
        const updatedDrivers = currentQueue.drivers.map((driver, index) => {
          if (index === 0) {
            return {
              ...driver,
              status: driver.status === 'boarding' ? 'assigned' : 'boarding',
              waitTime: 'Now'
            };
          } else if (index === 1 && driver.status === 'waiting') {
            return {
              ...driver,
              status: 'boarding',
              waitTime: 'Now'
            };
          }
          return driver;
        });

        // Remove assigned driver after some time
        if (updatedDrivers[0]?.status === 'assigned') {
          setTimeout(() => {
            setQueues(prev => {
              const current = prev[queueType];
              return {
                ...prev,
                [queueType]: {
                  ...current,
                  drivers: current.drivers.filter((_, idx) => idx !== 0),
                  totalDrivers: current.totalDrivers - 1
                }
              };
            });

            // Update user position
            setUserQueue(prev => prev && ({
              ...prev,
              position: Math.max(1, prev.position - 1)
            }));
          }, 5000);
        }

        return {
          ...prev,
          [queueType]: {
            ...currentQueue,
            drivers: updatedDrivers
          }
        };
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [userQueue]);

  const getQueueIcon = (type) => {
    switch (type) {
      case 'airport': return <AirportShuttle />;
      case 'taxiStage': return <LocalTaxi />;
      case 'company': return <Business />;
      default: return <DirectionsCar />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'success';
      case 'boarding': return 'warning';
      case 'waiting': return 'info';
      default: return 'default';
    }
  };

  const QueueCard = ({ queue, type }) => (
    <Card elevation={3} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            {getQueueIcon(type)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {queue.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
              {queue.location}
            </Typography>
          </Box>
          <Chip 
            label={queue.status} 
            color={queue.status === 'active' ? 'success' : 'default'}
            size="small"
          />
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {queue.totalDrivers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                In Queue
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="secondary">
                {queue.avgWaitTime}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Avg Wait
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 1, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="success.main">
                {queue.drivers.filter(d => d.status === 'assigned').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Button
          variant={userQueue?.type === type ? "outlined" : "contained"}
          color={userQueue?.type === type ? "secondary" : "primary"}
          fullWidth
          startIcon={userQueue?.type === type ? <ExitToApp /> : <EventAvailable />}
          onClick={userQueue?.type === type ? leaveQueue : () => {
            setSelectedQueueType(type);
            setShowJoinDialog(true);
          }}
          disabled={userQueue && userQueue.type !== type}
        >
          {userQueue?.type === type ? 'Leave Queue' : 'Join Queue'}
        </Button>
      </CardContent>
    </Card>
  );

  const UserQueueStatus = () => {
    if (!userQueue) return null;

    const queue = userQueue.queue;
    const userDriver = queue.drivers.find(driver => driver.isUser);
    const position = userDriver?.position || userQueue.position;
    const estimatedWait = Math.max(0, position - 1) * 3; // 3 minutes per position

    return (
      <Card elevation={3} sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold" color="primary">
                Your Queue Status
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {queue.name}
              </Typography>
            </Box>
            <Chip 
              icon={<Numbers />}
              label={`Position #${position}`}
              color="primary"
              variant="filled"
            />
          </Box>

          <LinearProgress 
            variant="determinate" 
            value={((queue.totalDrivers - position) / queue.totalDrivers) * 100}
            sx={{ height: 8, borderRadius: 4, mb: 2 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  #{position}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Current Position
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  {estimatedWait} min
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Est. Wait Time
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  {queue.totalDrivers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total in Queue
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Share />}
              fullWidth
            >
              Share Status
            </Button>
            <Button
              variant="outlined"
              startIcon={<QrCode2 />}
              fullWidth
            >
              Show QR
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const QueueLiveView = () => {
    if (!userQueue) return null;

    const queue = userQueue.queue;
    const currentBoarding = queue.drivers.find(d => d.status === 'boarding');
    const nextInLine = queue.drivers.find(d => d.position === 2);

    return (
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <NotificationsActive color="info" sx={{ mr: 1 }} />
            Live Queue Updates
          </Typography>

          <Stepper orientation="vertical" sx={{ mb: 2 }}>
            <Step active={true}>
              <StepLabel>
                <Typography fontWeight="bold">Now Boarding</Typography>
              </StepLabel>
              <StepContent>
                {currentBoarding ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography fontWeight="500">
                        {currentBoarding.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {currentBoarding.vehicle} • {currentBoarding.plate}
                      </Typography>
                    </Box>
                    <Chip label="BOARDING" color="warning" size="small" />
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Waiting for next passenger...
                  </Typography>
                )}
              </StepContent>
            </Step>

            <Step active={true}>
              <StepLabel>
                <Typography fontWeight="bold">Next Up</Typography>
              </StepLabel>
              <StepContent>
                {nextInLine ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography fontWeight="500">
                        {nextInLine.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {nextInLine.vehicle} • {nextInLine.plate}
                      </Typography>
                    </Box>
                    <Chip label="PREPARING" color="info" size="small" />
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No one in next position
                  </Typography>
                )}
              </StepContent>
            </Step>
          </Stepper>
        </CardContent>
      </Card>
    );
  };

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
              Queue Management 🚗
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
            Driver Queue System
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join queues at airports, taxi stages, and company dispatch centers
          </Typography>
        </Box>

        {/* User Queue Status */}
        <UserQueueStatus />

        {/* Live Queue Updates */}
        <QueueLiveView />

        {/* Available Queues */}
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Group sx={{ mr: 1 }} />
              Available Queues
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose a queue to join and start receiving ride assignments
            </Typography>

            <QueueCard queue={queues.airport} type="airport" />
            <QueueCard queue={queues.taxiStage} type="taxiStage" />
            <QueueCard queue={queues.company} type="company" />
          </CardContent>
        </Card>

        {/* Queue Details Table */}
        {userQueue && (
          <Card elevation={2} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Queue Details - {userQueue.queue.name}
              </Typography>
              <List>
                {userQueue.queue.drivers.slice(0, 10).map((driver) => (
                  <ListItem 
                    key={driver.id}
                    divider
                    sx={{
                      backgroundColor: driver.isUser ? 'primary.50' : 'transparent',
                      border: driver.isUser ? '2px solid' : 'none',
                      borderColor: 'primary.main',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemIcon>
                      <Badge
                        badgeContent={driver.position}
                        color={
                          driver.status === 'assigned' ? 'success' :
                          driver.status === 'boarding' ? 'warning' : 'primary'
                        }
                      >
                        <Avatar sx={{ bgcolor: driver.isUser ? 'primary.main' : 'grey.400' }}>
                          <Person />
                        </Avatar>
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography fontWeight={driver.isUser ? "bold" : "normal"}>
                            {driver.name}
                          </Typography>
                          <Chip 
                            label={driver.status}
                            color={getStatusColor(driver.status)}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="caption">
                            {driver.vehicle} • {driver.plate}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {driver.waitTime}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Join Queue Dialog */}
      <Dialog 
        open={showJoinDialog} 
        onClose={() => setShowJoinDialog(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          Join Queue
        </DialogTitle>
        <DialogContent>
          {selectedQueueType && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                {getQueueIcon(selectedQueueType)}
              </Avatar>
              <Typography variant="h6" gutterBottom>
                {queues[selectedQueueType].name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {queues[selectedQueueType].location}
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Estimated wait time: <strong>{queues[selectedQueueType].avgWaitTime}</strong>
                </Typography>
                <Typography variant="body2">
                  Current queue length: <strong>{queues[selectedQueueType].totalDrivers} drivers</strong>
                </Typography>
              </Alert>

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                  <AccessTime color="primary" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Avg. Wait
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {queues[selectedQueueType].avgWaitTime}
                  </Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                  <Group color="secondary" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    In Queue
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {queues[selectedQueueType].totalDrivers}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowJoinDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => joinQueue(selectedQueueType)}
            startIcon={<EventAvailable />}
          >
            Confirm Join
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default QueuePage;