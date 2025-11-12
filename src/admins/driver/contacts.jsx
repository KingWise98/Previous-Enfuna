import React, { useState, useEffect } from 'react';
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
  useTheme
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
  CameraAlt
} from '@mui/icons-material';

const ContactsPage = () => {
  const theme = useTheme();
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API endpoint
        // const response = await fetch('/api/contacts');
        // const data = await response.json();
        // setContacts(data);
        
        // For now, initialize with empty array
        setContacts([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        setIsLoading(false);
        // TODO: Add error handling (show notification to user)
      }
    };
    
    fetchContacts();
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
        // TODO: Implement file upload to server
        // const formData = new FormData();
        // formData.append('avatar', selectedFile);
        // const uploadResponse = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData,
        // });
        // const { url } = await uploadResponse.json();
        // avatarUrl = url;
        
        // For demo purposes, use the preview URL
        avatarUrl = previewImage;
      }

      const contactToSave = {
        ...currentContact,
        avatar: avatarUrl
      };

      if (editMode) {
        if (currentContact.id > contacts.length) {
          // Add new contact
          // TODO: Implement API call to add contact
          // const response = await fetch('/api/contacts', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify(contactToSave),
          // });
          // const newContact = await response.json();
          // setContacts([...contacts, newContact]);
          
          // Temporary local state update
          setContacts([...contacts, contactToSave]);
        } else {
          // Update existing contact
          // TODO: Implement API call to update contact
          // const response = await fetch(`/api/contacts/${currentContact.id}`, {
          //   method: 'PUT',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify(contactToSave),
          // });
          // const updatedContact = await response.json();
          // setContacts(contacts.map(contact => 
          //   contact.id === updatedContact.id ? updatedContact : contact
          // ));
          
          // Temporary local state update
          setContacts(contacts.map(contact => 
            contact.id === contactToSave.id ? contactToSave : contact
          ));
        }
      }
      setOpenDialog(false);
      setPreviewImage(null);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error saving contact:', error);
      // TODO: Add error handling
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      // TODO: Implement API call to delete contact
      // await fetch(`/api/contacts/${id}`, {
      //   method: 'DELETE',
      // });
      // setContacts(contacts.filter(contact => contact.id !== id));
      
      // Temporary local state update
      setContacts(contacts.filter(contact => contact.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
      // TODO: Add error handling
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX'
    }).format(amount);
  };

  return (
    <Box m="20px">
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Contacts Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage your customers, suppliers, and employees
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
        >
          Add Contact
        </Button>
      </Box>

      {/* Search and Filter Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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
          sx={{ width: 400 }}
        />
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterList />
                </InputAdornment>
              }
            >
              <MenuItem value="all">All Contacts</MenuItem>
              <MenuItem value="customer">Customers</MenuItem>
              <MenuItem value="supplier">Suppliers</MenuItem>
              <MenuItem value="employee">Employees</MenuItem>
              <MenuItem value="vip">VIP Customers</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={() => { setSearchTerm(''); setFilter('all'); }}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {/* Loading State */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <Typography>Loading contacts...</Typography>
        </Box>
      ) : (
        /* Contacts Table */
        <Card>
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
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar src={contact.avatar} alt={contact.name}>
                            {contact.name.charAt(0)}
                          </Avatar>
                          <Typography fontWeight="bold">{contact.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                          color={
                            contact.type === 'customer' ? 'primary' :
                            contact.type === 'supplier' ? 'secondary' : 'info'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="column">
                          <Box display="flex" alignItems="center" gap={1}>
                            <Phone fontSize="small" />
                            <Typography variant="body2">{contact.phone}</Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Email fontSize="small" />
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
                            <Loyalty color="primary" />
                            <Typography>{contact.loyaltyPoints} pts</Typography>
                          </Box>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        {contact.lastPurchase || '-'}
                      </TableCell>
                      <TableCell>
                        {contact.type === 'customer' ? formatCurrency(contact.totalSpent) : '-'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={contact.status === 'vip' ? 'VIP' : 
                                contact.status === 'active' ? 'Active' : 'Inactive'}
                          color={
                            contact.status === 'vip' ? 'success' :
                            contact.status === 'active' ? 'primary' : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton size="small" onClick={() => handleOpenViewDialog(contact)}>
                            <Person />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleOpenEditDialog(contact)}>
                            <Edit />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteContact(contact.id)}>
                            <Delete color="error" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      {contacts.length === 0 ? 'No contacts found' : 'No matching contacts found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Contact Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {editMode ? (currentContact?.id > contacts.length ? 'Add New Contact' : 'Edit Contact') : 'Contact Details'}
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {currentContact && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" mb={2} position="relative">
                  <Avatar 
                    src={previewImage || currentContact.avatar} 
                    sx={{ width: 100, height: 100 }}
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
                          color="primary"
                          component="span"
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            right: 'calc(50% - 70px)',
                            backgroundColor: theme.palette.background.paper,
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover
                            }
                          }}
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
                        <Phone />
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
                        <Email />
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
                        <LocationOn />
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
                        <Business />
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
                            <Loyalty />
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
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
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
                        <Typography fontWeight="bold">
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
        <DialogActions>
          {editMode && (
            <>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                variant="contained" 
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