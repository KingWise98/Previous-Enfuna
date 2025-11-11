import React, { useState } from 'react';
import {
  Box, Grid, Typography, Button, Card, CardContent,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, 
  TextField, MenuItem, Select, InputLabel, FormControl, Snackbar
} from '@mui/material';
import { FilterList, FileCopy, PictureAsPdf, Add, Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material';

const InventoryPage = () => {
  const [inventoryData, setInventoryData] = useState([
    { id: 1, name: 'Laptop', category: 'Electronics', quantity: 10, price: 1200, supplier: 'TechHub', status: 'Available' },
    { id: 2, name: 'Phone', category: 'Electronics', quantity: 25, price: 800, supplier: 'MobileWorld', status: 'Available' },
    { id: 3, name: 'Tablet', category: 'Electronics', quantity: 15, price: 500, supplier: 'GizmoStore', status: 'Low Stock' },
    { id: 4, name: 'Headphones', category: 'Accessories', quantity: 50, price: 50, supplier: 'SoundTech', status: 'Available' },
    { id: 5, name: 'Keyboard', category: 'Accessories', quantity: 30, price: 25, supplier: 'GearUp', status: 'Out of Stock' },
  ]);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const handleFilterDialogOpen = () => setOpenFilterDialog(true);
  const handleFilterDialogClose = () => setOpenFilterDialog(false);

  const handleEditDialogOpen = (product) => {
    setEditedProduct(product);
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setEditedProduct(null);
    setOpenEditDialog(false);
  };

  const handleSnackBarClose = () => setSnackBarOpen(false);

  const handleEditProduct = () => {
    setInventoryData((prevData) =>
      prevData.map((item) =>
        item.id === editedProduct.id ? editedProduct : item
      )
    );
    setSnackBarOpen(true);
    handleEditDialogClose();
  };

  const handleStatusChange = (event) => setFilterStatus(event.target.value);
  const handleCategoryChange = (event) => setFilterCategory(event.target.value);

  const handleDeleteProduct = (id) => {
    setInventoryData(inventoryData.filter((item) => item.id !== id));
    setSnackBarOpen(true);
  };

  const handleHideProduct = (id) => {
    setInventoryData(inventoryData.map((item) =>
      item.id === id ? { ...item, isVisible: !item.isVisible } : item
    ));
    setSnackBarOpen(true);
  };

  const filteredInventoryData = inventoryData.filter((product) => {
    return (
      (filterCategory === 'All' || product.category === filterCategory) &&
      (filterStatus === 'All' || product.status === filterStatus)
    );
  });

  const handleExport = (format) => {
    console.log(`Exporting data as ${format}`);
    // Implement export logic for CSV or PDF here
  };

  const handlePageChange = (event, newPage) => setPage(newPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'green';
      case 'Low Stock':
        return 'orange';
      case 'Out of Stock':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>

      {/* Inventory Summary Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Products</Typography>
              <Typography variant="h4">{inventoryData.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Available Products</Typography>
              <Typography variant="h4">
                {inventoryData.filter((product) => product.status === 'Available').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Out of Stock</Typography>
              <Typography variant="h4">
                {inventoryData.filter((product) => product.status === 'Out of Stock').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Actions */}
      <Box sx={{ marginY: 2 }}>
        <Button variant="contained" onClick={handleFilterDialogOpen} startIcon={<FilterList />}>
          Filter Inventory
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleExport('CSV')}
          startIcon={<FileCopy />}
          sx={{ marginLeft: 2, color: 'white', backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
        >
          Export as CSV
        </Button>
        <Button
          variant="outlined"
          onClick={() => handleExport('PDF')}
          startIcon={<PictureAsPdf />}
          sx={{ marginLeft: 2, color: 'white', backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
        >
          Export as PDF
        </Button>
        <Button
          variant="contained"
          onClick={() => handleEditDialogOpen({ id: 0, name: '', category: '', quantity: 0, price: 0, supplier: '', status: '' })}
          startIcon={<Add />}
          sx={{ marginLeft: 2 }}
        >
          Add Product
        </Button>
      </Box>

      {/* Inventory Table */}
      <TableContainer sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventoryData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.supplier}</TableCell>
                <TableCell>
                  <Button
                    sx={{ backgroundColor: getStatusColor(product.status), color: 'white', '&:hover': { backgroundColor: getStatusColor(product.status) } }}
                    disabled
                  >
                    {product.status}
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditDialogOpen(product)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDeleteProduct(product.id)}><Delete /></IconButton>
                  <IconButton onClick={() => handleHideProduct(product.id)}>
                    {product.isVisible === false ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredInventoryData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
      />

      {/* Filter Dialog */}
      <Dialog open={openFilterDialog} onClose={handleFilterDialogClose}>
        <DialogTitle>Filter Inventory</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filterCategory}
              onChange={handleCategoryChange}
              label="Category"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Accessories">Accessories</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginTop: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleFilterDialogClose} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            label="Product Name"
            fullWidth
            value={editedProduct?.name || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Category"
            fullWidth
            value={editedProduct?.category || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={editedProduct?.quantity || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, quantity: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={editedProduct?.price || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Supplier"
            fullWidth
            value={editedProduct?.supplier || ''}
            onChange={(e) => setEditedProduct({ ...editedProduct, supplier: e.target.value })}
            sx={{ marginBottom: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={editedProduct?.status || ''}
              onChange={(e) => setEditedProduct({ ...editedProduct, status: e.target.value })}
              label="Status"
            >
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Low Stock">Low Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditProduct} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={handleSnackBarClose}
        message="Action completed successfully!"
      />
    </Box>
  );
};

export default InventoryPage;
