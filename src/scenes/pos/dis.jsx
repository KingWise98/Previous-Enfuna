import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Avatar,
  Tooltip,
  useTheme,
  InputAdornment,
  Divider,
  Tabs,
  Tab
} from "@mui/material";
import { 
  AddCircle, 
  Cancel, 
  CheckCircle, 
  Search,
  Refresh,
  Percent,
  LocalOffer,
  Receipt,
  Money,
  Close,
  CalendarToday
} from "@mui/icons-material";

const DiscountsAndPromotionsPage = () => {
  const theme = useTheme();
  const [discounts, setDiscounts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [taxSettings, setTaxSettings] = useState({
    vatRate: 18, // Standard VAT rate for East Africa
    withholdingTax: 6, // Common withholding tax rate
    serviceCharge: 10, // Typical service charge
    exciseDuty: 0 // Varies by product
  });
  const [openDiscountDialog, setOpenDiscountDialog] = useState(false);
  const [openPromotionDialog, setOpenPromotionDialog] = useState(false);
  const [openTaxDialog, setOpenTaxDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newDiscount, setNewDiscount] = useState({
    code: "",
    description: "",
    amount: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "Active",
    taxInclusive: false,
    appliesToVAT: true
  });

  const [newPromotion, setNewPromotion] = useState({
    code: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    status: "Active",
    taxImplications: "Standard"
  });

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API endpoints
        // const discountsRes = await fetch('/api/discounts');
        // const promotionsRes = await fetch('/api/promotions');
        // const taxRes = await fetch('/api/tax-settings');
        
        // setDiscounts(await discountsRes.json());
        // setPromotions(await promotionsRes.json());
        // setTaxSettings(await taxRes.json());
        
        // For now, initialize with empty arrays
        setDiscounts([]);
        setPromotions([]);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNewDiscountChange = (event) => {
    setNewDiscount({ ...newDiscount, [event.target.name]: event.target.value });
  };

  const handleNewPromotionChange = (event) => {
    setNewPromotion({ ...newPromotion, [event.target.name]: event.target.value });
  };

  const handleTaxSettingChange = (event) => {
    setTaxSettings({ ...taxSettings, [event.target.name]: Number(event.target.value) });
  };

  const handleAddNewDiscount = async () => {
    try {
      // TODO: Implement API call to add discount
      // const response = await fetch('/api/discounts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newDiscount)
      // });
      // const createdDiscount = await response.json();
      // setDiscounts([...discounts, createdDiscount]);
      
      // Temporary local state update
      const newDiscountWithId = {
        ...newDiscount,
        id: discounts.length + 1,
        amount: newDiscount.amount.includes('%') ? newDiscount.amount : `${newDiscount.amount}%`
      };
      setDiscounts([...discounts, newDiscountWithId]);
      
      setOpenDiscountDialog(false);
      setNewDiscount({
        code: "",
        description: "",
        amount: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        status: "Active",
        taxInclusive: false,
        appliesToVAT: true
      });
    } catch (error) {
      console.error('Error adding discount:', error);
    }
  };

  const handleAddNewPromotion = async () => {
    try {
      // TODO: Implement API call to add promotion
      // const response = await fetch('/api/promotions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newPromotion)
      // });
      // const createdPromotion = await response.json();
      // setPromotions([...promotions, createdPromotion]);
      
      // Temporary local state update
      const newPromotionWithId = {
        ...newPromotion,
        id: promotions.length + 1
      };
      setPromotions([...promotions, newPromotionWithId]);
      
      setOpenPromotionDialog(false);
      setNewPromotion({
        code: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        status: "Active",
        taxImplications: "Standard"
      });
    } catch (error) {
      console.error('Error adding promotion:', error);
    }
  };

  const handleSaveTaxSettings = async () => {
    try {
      // TODO: Implement API call to save tax settings
      // await fetch('/api/tax-settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(taxSettings)
      // });
      setOpenTaxDialog(false);
    } catch (error) {
      console.error('Error saving tax settings:', error);
    }
  };

  const handleActivateDiscount = (id) => {
    setDiscounts(discounts.map(discount =>
      discount.id === id ? { ...discount, status: "Active" } : discount
    ));
  };

  const handleActivatePromotion = (id) => {
    setPromotions(promotions.map(promo =>
      promo.id === id ? { ...promo, status: "Active" } : promo
    ));
  };

  const handleDeactivateDiscount = (id) => {
    setDiscounts(discounts.map(discount =>
      discount.id === id ? { ...discount, status: "Inactive" } : discount
    ));
  };

  const handleDeactivatePromotion = (id) => {
    setPromotions(promotions.map(promo =>
      promo.id === id ? { ...promo, status: "Inactive" } : promo
    ));
  };

  const filteredDiscounts = discounts.filter(discount =>
    discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discount.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPromotions = promotions.filter(promo =>
    promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === "Active" ? theme.palette.success.main : theme.palette.error.main;
  };

  return (
    <Box p={3}>
      {/* Page Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Pricing Management
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage discounts, promotions and tax settings
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Money />}
            onClick={() => setOpenTaxDialog(true)}
            sx={{ mr: 2 }}
          >
            Tax Settings
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Refresh />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Search and Tabs */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
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
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Discounts" icon={<Percent />} />
        <Tab label="Promotions" icon={<LocalOffer />} />
      </Tabs>

      {/* Discounts Tab */}
      {activeTab === 0 && (
        <>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={() => setOpenDiscountDialog(true)}
            >
              Add Discount
            </Button>
          </Box>
          
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <Typography>Loading discounts...</Typography>
            </Box>
          ) : (
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Tax</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDiscounts.length > 0 ? (
                      filteredDiscounts.map((discount) => (
                        <TableRow key={discount.id} hover>
                          <TableCell>
                            <Chip label={discount.code} color="primary" />
                          </TableCell>
                          <TableCell>{discount.description}</TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="500">
                              {discount.amount}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarToday fontSize="small" />
                              <Typography>{discount.startDate}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarToday fontSize="small" />
                              <Typography>{discount.endDate || '-'}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={discount.taxInclusive ? "Tax Inclusive" : "Tax Exclusive"}
                              size="small"
                              color={discount.taxInclusive ? "success" : "warning"}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={discount.status}
                              size="small"
                              sx={{ 
                                backgroundColor: getStatusColor(discount.status),
                                color: theme.palette.getContrastText(getStatusColor(discount.status))
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" gap={1}>
                              {discount.status === "Inactive" ? (
                                <Tooltip title="Activate">
                                  <IconButton 
                                    color="success" 
                                    onClick={() => handleActivateDiscount(discount.id)}
                                  >
                                    <CheckCircle />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Deactivate">
                                  <IconButton 
                                    color="error" 
                                    onClick={() => handleDeactivateDiscount(discount.id)}
                                  >
                                    <Cancel />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                          <Typography variant="subtitle1">
                            {discounts.length === 0 ? 'No discounts found' : 'No matching discounts found'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}

      {/* Promotions Tab */}
      {activeTab === 1 && (
        <>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={() => setOpenPromotionDialog(true)}
            >
              Add Promotion
            </Button>
          </Box>
          
          {isLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <Typography>Loading promotions...</Typography>
            </Box>
          ) : (
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Tax</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPromotions.length > 0 ? (
                      filteredPromotions.map((promo) => (
                        <TableRow key={promo.id} hover>
                          <TableCell>
                            <Chip label={promo.code} color="secondary" />
                          </TableCell>
                          <TableCell>{promo.description}</TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarToday fontSize="small" />
                              <Typography>{promo.startDate}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <CalendarToday fontSize="small" />
                              <Typography>{promo.endDate || '-'}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={promo.taxImplications}
                              size="small"
                              color="info"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={promo.status}
                              size="small"
                              sx={{ 
                                backgroundColor: getStatusColor(promo.status),
                                color: theme.palette.getContrastText(getStatusColor(promo.status))
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" gap={1}>
                              {promo.status === "Inactive" ? (
                                <Tooltip title="Activate">
                                  <IconButton 
                                    color="success" 
                                    onClick={() => handleActivatePromotion(promo.id)}
                                  >
                                    <CheckCircle />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Deactivate">
                                  <IconButton 
                                    color="error" 
                                    onClick={() => handleDeactivatePromotion(promo.id)}
                                  >
                                    <Cancel />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Typography variant="subtitle1">
                            {promotions.length === 0 ? 'No promotions found' : 'No matching promotions found'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}
        </>
      )}

      {/* Discount Dialog */}
      <Dialog 
        open={openDiscountDialog} 
        onClose={() => setOpenDiscountDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Create New Discount</Typography>
            <IconButton onClick={() => setOpenDiscountDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Discount Code"
                fullWidth
                value={newDiscount.code}
                onChange={handleNewDiscountChange}
                name="code"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Percent />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                value={newDiscount.description}
                onChange={handleNewDiscountChange}
                name="description"
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Discount Amount (%)"
                fullWidth
                value={newDiscount.amount}
                onChange={handleNewDiscountChange}
                name="amount"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newDiscount.status}
                  onChange={handleNewDiscountChange}
                  name="status"
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={newDiscount.startDate}
                onChange={handleNewDiscountChange}
                name="startDate"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={newDiscount.endDate}
                onChange={handleNewDiscountChange}
                name="endDate"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tax Treatment</InputLabel>
                <Select
                  value={newDiscount.taxInclusive ? "Inclusive" : "Exclusive"}
                  onChange={(e) => setNewDiscount({
                    ...newDiscount,
                    taxInclusive: e.target.value === "Inclusive"
                  })}
                  label="Tax Treatment"
                >
                  <MenuItem value="Inclusive">Tax Inclusive</MenuItem>
                  <MenuItem value="Exclusive">Tax Exclusive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Applies to VAT</InputLabel>
                <Select
                  value={newDiscount.appliesToVAT ? "Yes" : "No"}
                  onChange={(e) => setNewDiscount({
                    ...newDiscount,
                    appliesToVAT: e.target.value === "Yes"
                  })}
                  label="Applies to VAT"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={() => setOpenDiscountDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddNewDiscount} 
            variant="contained"
            color="primary"
            disabled={!newDiscount.code || !newDiscount.amount}
          >
            Create Discount
          </Button>
        </DialogActions>
      </Dialog>

      {/* Promotion Dialog */}
      <Dialog 
        open={openPromotionDialog} 
        onClose={() => setOpenPromotionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Create New Promotion</Typography>
            <IconButton onClick={() => setOpenPromotionDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Promotion Code"
                fullWidth
                value={newPromotion.code}
                onChange={handleNewPromotionChange}
                name="code"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalOffer />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                value={newPromotion.description}
                onChange={handleNewPromotionChange}
                name="description"
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={newPromotion.startDate}
                onChange={handleNewPromotionChange}
                name="startDate"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={newPromotion.endDate}
                onChange={handleNewPromotionChange}
                name="endDate"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newPromotion.status}
                  onChange={handleNewPromotionChange}
                  name="status"
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tax Implications</InputLabel>
                <Select
                  value={newPromotion.taxImplications}
                  onChange={handleNewPromotionChange}
                  name="taxImplications"
                  label="Tax Implications"
                >
                  <MenuItem value="Standard">Standard VAT</MenuItem>
                  <MenuItem value="Exempt">VAT Exempt</MenuItem>
                  <MenuItem value="Zero Rated">Zero Rated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={() => setOpenPromotionDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddNewPromotion} 
            variant="contained"
            color="primary"
            disabled={!newPromotion.code || !newPromotion.description}
          >
            Create Promotion
          </Button>
        </DialogActions>
      </Dialog>

      {/* Tax Settings Dialog */}
      <Dialog 
        open={openTaxDialog} 
        onClose={() => setOpenTaxDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">East Africa Tax Settings</Typography>
            <IconButton onClick={() => setOpenTaxDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                VAT & Tax Configuration
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="VAT Rate (%)"
                fullWidth
                value={taxSettings.vatRate}
                onChange={handleTaxSettingChange}
                name="vatRate"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Withholding Tax (%)"
                fullWidth
                value={taxSettings.withholdingTax}
                onChange={handleTaxSettingChange}
                name="withholdingTax"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Service Charge (%)"
                fullWidth
                value={taxSettings.serviceCharge}
                onChange={handleTaxSettingChange}
                name="serviceCharge"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Excise Duty (%)"
                fullWidth
                value={taxSettings.exciseDuty}
                onChange={handleTaxSettingChange}
                name="exciseDuty"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                Note: These settings comply with East African Community (EAC) tax laws
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: `1px solid ${theme.palette.divider}`, p: 2 }}>
          <Button 
            onClick={() => setOpenTaxDialog(false)} 
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveTaxSettings} 
            variant="contained"
            color="primary"
          >
            Save Tax Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DiscountsAndPromotionsPage;