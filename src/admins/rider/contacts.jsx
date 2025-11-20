import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Phone,
  Email,
  LocationOn,
  Person,
  Business,
  FilterList,
  Refresh,
  Close,
  CheckCircle,
  Star,
  Loyalty,
  CameraAlt,
  ArrowBack
} from '@mui/icons-material';

const ContactsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockContacts = [
      {
        id: 1,
        name: "Peter Kure",
        type: "customer",
        phone: "+256 712 345 678",
        email: "kure@email.com",
        location: "Kampala, Uganda",
        business: "Kure's Car Wash",
        loyaltyPoints: 1250,
        lastPurchase: "2024-01-15",
        totalSpent: 450000,
        status: "vip",
        avatar: ""
      },
     
    ];

    setContacts(mockContacts);
    setIsLoading(false);
  }, []);

  // Handle file selection for profile picture
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter contacts based on search and filter criteria
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.business && contact.business.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || 
      (filter === 'customer' && contact.type === 'customer') ||
      (filter === 'supplier' && contact.type === 'supplier') ||
      (filter === 'employee' && contact.type === 'employee') ||
      (filter === 'vip' && contact.status === 'vip') ||
      (filter === 'inactive' && contact.status === 'inactive');
    
    return matchesSearch && matchesFilter;
  });

  const handleOpenAddDialog = () => {
    setCurrentContact({
      id: contacts.length + 1,
      name: "",
      type: "customer",
      phone: "",
      email: "",
      location: "",
      business: "",
      loyaltyPoints: 0,
      lastPurchase: null,
      totalSpent: 0,
      status: "active",
      avatar: ""
    });
    setPreviewImage(null);
    setSelectedFile(null);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (contact) => {
    setCurrentContact(contact);
    setPreviewImage(contact.avatar || null);
    setSelectedFile(null);
    setEditMode(true);
    setOpenDialog(true);
  };

  const handleOpenViewDialog = (contact) => {
    setCurrentContact(contact);
    setEditMode(false);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleSaveContact = async () => {
    try {
      let avatarUrl = currentContact.avatar;
      
      // Upload new profile picture if selected
      if (selectedFile) {
        avatarUrl = previewImage;
      }

      const contactToSave = {
        ...currentContact,
        avatar: avatarUrl
      };

      if (currentContact.id > contacts.length) {
        // Add new contact
        setContacts([...contacts, contactToSave]);
      } else {
        // Update existing contact
        setContacts(contacts.map(contact => 
          contact.id === contactToSave.id ? contactToSave : contact
        ));
      }
      setOpenDialog(false);
      setPreviewImage(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const formatCurrency = (amount) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'customer': return '#0025DD';
      case 'supplier': return '#FFEC01';
      case 'employee': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'vip': return '#FFEC01';
      case 'active': return '#10B981';
      case 'inactive': return '#EF4444';
      default: return '#6B7280';
    }
  };

  // Mobile Contact List View
  const MobileContactList = () => (
    <List>
      {filteredContacts.map((contact) => (
        <Card key={contact.id} sx={{ mb: 2, border: `1px solid #e2e8f0` }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  src={contact.avatar} 
                  sx={{ 
                    width: 50, 
                    height: 50,
                    backgroundColor: getTypeColor(contact.type)
                  }}
                >
                  {contact.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {contact.name}
                  </Typography>
                  <Chip
                    label={contact.type}
                    size="small"
                    sx={{
                      backgroundColor: `${getTypeColor(contact.type)}20`,
                      color: getTypeColor(contact.type),
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              </Box>
              <Chip
                label={contact.status === 'vip' ? 'VIP' : contact.status}
                size="small"
                sx={{
                  backgroundColor: `${getStatusColor(contact.status)}20`,
                  color: getStatusColor(contact.status),
                  fontWeight: 'bold'
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Phone sx={{ fontSize: 16, color: '#0025DD' }} />
                <Typography variant="body2">{contact.phone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Email sx={{ fontSize: 16, color: '#0025DD' }} />
                <Typography variant="body2">{contact.email}</Typography>
              </Box>
              {contact.business && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business sx={{ fontSize: 16, color: '#0025DD' }} />
                  <Typography variant="body2">{contact.business}</Typography>
                </Box>
              )}
            </Box>

            {contact.type === 'customer' && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Loyalty Points
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="#0025DD">
                    {contact.loyaltyPoints} pts
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total Spent
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="#10B981">
                    {formatCurrency(contact.totalSpent)}
                  </Typography>
                </Box>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                size="small"
                sx={{ color: '#0025DD' }}
                onClick={() => handleOpenViewDialog(contact)}
              >
                View
              </Button>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleOpenEditDialog(contact)}
                  sx={{ color: '#0025DD' }}
                >
                  <Edit />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleDeleteContact(contact.id)}
                  sx={{ color: '#EF4444' }}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </List>
  );

  // Desktop Table View
  const DesktopContactTable = () => (
    <Card sx={{ 
      borderRadius: 3,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Contact</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>Business</TableCell>
              <TableCell>Loyalty</TableCell>
              <TableCell>Last Purchase</TableCell>
              <TableCell>Total Spent</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar 
                      src={contact.avatar} 
                      sx={{ backgroundColor: getTypeColor(contact.type) }}
                    >
                      {contact.name.charAt(0)}
                    </Avatar>
                    <Typography fontWeight="bold">{contact.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={contact.type}
                    sx={{
                      backgroundColor: `${getTypeColor(contact.type)}20`,
                      color: getTypeColor(contact.type),
                      fontWeight: 'bold'
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" flexDirection="column">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Phone fontSize="small" sx={{ color: '#0025DD' }} />
                      <Typography variant="body2">{contact.phone}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Email fontSize="small" sx={{ color: '#0025DD' }} />
                      <Typography variant="body2">{contact.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {contact.business || '-'}
                </TableCell>
                <TableCell>
                  {contact.type === 'customer' ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Loyalty sx={{ color: '#0025DD' }} />
                      <Typography>{contact.loyaltyPoints} pts</Typography>
                    </Box>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {contact.lastPurchase || '-'}
                </TableCell>
                <TableCell>
                  {contact.type === 'customer' ? (
                    <Typography fontWeight="bold" color="#10B981">
                      {formatCurrency(contact.totalSpent)}
                    </Typography>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={contact.status === 'vip' ? 'VIP' : contact.status}
                    sx={{
                      backgroundColor: `${getStatusColor(contact.status)}20`,
                      color: getStatusColor(contact.status),
                      fontWeight: 'bold'
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenViewDialog(contact)}
                      sx={{ color: '#0025DD' }}
                    >
                      <Person />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenEditDialog(contact)}
                      sx={{ color: '#0025DD' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteContact(contact.id)}
                      sx={{ color: '#EF4444' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc'
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
            Contacts
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#FFEC01',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#E6D401'
              }
            }}
            startIcon={<Add />}
            onClick={handleOpenAddDialog}
          >
            Add Contact
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        {/* Search and Filter Bar */}
        <Card sx={{ 
          mb: 3,
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  variant="outlined"
                  placeholder="Search contacts..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    value={filter}
                    label="Filter"
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Contacts</MenuItem>
                    <MenuItem value="customer">Customers</MenuItem>
                    <MenuItem value="supplier">Suppliers</MenuItem>
                    <MenuItem value="employee">Employees</MenuItem>
                    <MenuItem value="vip">VIP Customers</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Box display="flex" justifyContent={isMobile ? 'flex-start' : 'flex-end'}>
                  <IconButton 
                    onClick={() => { setSearchTerm(''); setFilter('all'); }}
                    sx={{ color: '#0025DD' }}
                  >
                    <Refresh />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <Typography>Loading contacts...</Typography>
          </Box>
        ) : filteredContacts.length === 0 ? (
          <Card sx={{ 
            textAlign: 'center', 
            p: 4,
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {contacts.length === 0 ? 'No contacts found' : 'No matching contacts found'}
            </Typography>
            <Button 
              variant="contained"
              sx={{
                backgroundColor: '#0025DD',
                mt: 2
              }}
              startIcon={<Add />}
              onClick={handleOpenAddDialog}
            >
              Add Your First Contact
            </Button>
          </Card>
        ) : (
          /* Contacts List/Table */
          isMobile ? <MobileContactList /> : <DesktopContactTable />
        )}
      </Box>

      {/* Contact Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ backgroundColor: '#0025DD', color: 'white' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              {editMode ? (currentContact?.id > contacts.length ? 'Add New Contact' : 'Edit Contact') : 'Contact Details'}
            </Typography>
            <IconButton onClick={handleCloseDialog} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 3 }}>
          {currentContact && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" mb={2} position="relative">
                  <Avatar 
                    src={previewImage || currentContact.avatar} 
                    sx={{ 
                      width: 100, 
                      height: 100,
                      backgroundColor: getTypeColor(currentContact.type)
                    }}
                  >
                    {currentContact.name?.charAt(0)}
                  </Avatar>
                  {editMode && (
                    <>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="avatar-upload"
                        type="file"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="avatar-upload">
                        <IconButton 
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 'calc(50% - 70px)',
                            backgroundColor: '#0025DD',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: '#001FB8'
                            }
                          }}
                          component="span"
                        >
                          <CameraAlt />
                        </IconButton>
                      </label>
                    </>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={currentContact.name || ''}
                  onChange={(e) => setCurrentContact({...currentContact, name: e.target.value})}
                  disabled={!editMode}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Contact Type</InputLabel>
                  <Select
                    value={currentContact.type || 'customer'}
                    label="Contact Type"
                    onChange={(e) => setCurrentContact({...currentContact, type: e.target.value})}
                    disabled={!editMode}
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="supplier">Supplier</MenuItem>
                    <MenuItem value="employee">Employee</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={currentContact.phone || ''}
                  onChange={(e) => setCurrentContact({...currentContact, phone: e.target.value})}
                  disabled={!editMode}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: '#0025DD' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  label="Email"
                  fullWidth
                  value={currentContact.email || ''}
                  onChange={(e) => setCurrentContact({...currentContact, email: e.target.value})}
                  disabled={!editMode}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#0025DD' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Location"
                  fullWidth
                  value={currentContact.location || ''}
                  onChange={(e) => setCurrentContact({...currentContact, location: e.target.value})}
                  disabled={!editMode}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: '#0025DD' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Business Name"
                  fullWidth
                  value={currentContact.business || ''}
                  onChange={(e) => setCurrentContact({...currentContact, business: e.target.value})}
                  disabled={!editMode}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business sx={{ color: '#0025DD' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              {currentContact.type === 'customer' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Loyalty Points"
                      fullWidth
                      type="number"
                      value={currentContact.loyaltyPoints || 0}
                      onChange={(e) => setCurrentContact({...currentContact, loyaltyPoints: parseInt(e.target.value) || 0})}
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Loyalty sx={{ color: '#0025DD' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={currentContact.status || 'active'}
                        label="Status"
                        onChange={(e) => setCurrentContact({...currentContact, status: e.target.value})}
                        disabled={!editMode}
                      >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="vip">VIP</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
              
              {!editMode && currentContact.type === 'customer' && (
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ borderColor: '#0025DD20' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom color="#0025DD">
                        Purchase History
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Last Purchase:</Typography>
                        <Typography fontWeight="bold">
                          {currentContact.lastPurchase || 'No purchases yet'}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography>Total Spent:</Typography>
                        <Typography fontWeight="bold" color="#10B981">
                          {formatCurrency(currentContact.totalSpent || 0)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          {editMode && (
            <>
              <Button 
                onClick={handleCloseDialog}
                sx={{ color: '#0025DD' }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained"
                sx={{
                  backgroundColor: '#0025DD',
                  '&:hover': {
                    backgroundColor: '#001FB8'
                  }
                }}
                onClick={handleSaveContact}
                startIcon={<CheckCircle />}
              >
                Save Contact
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactsPage;