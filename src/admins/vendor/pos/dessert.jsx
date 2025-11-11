import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  CardMedia,
  Badge,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Input,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteIcon from "@mui/icons-material/Delete";


// Dummy dessert data
const dessertsData = [
  { id: 1, name: "Mandazi Pudding", price: 5500, stock: 20, image: "/assets/Mandazi-inUganda.jpg" },
  { id: 2, name: "Snowman Ice Cream", price: 4500, stock: 30, image: "/assets/ice_cream.jpg" },
  { id: 3, name: "Chocolate Cake", price: 10000, stock: 15, image: "/assets/cake.jpg" },
  { id: 4, name: "Queen Cakes", price: 2500, stock: 25, image: "/assets/queen_cake.jpg" },
  
];

const DessertsPage = () => {
  const [desserts, setDesserts] = useState(dessertsData);
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newDessert, setNewDessert] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
  });

  // Handle adding new dessert
  const handleAddDessert = () => {
    if (newDessert.name && newDessert.price && newDessert.stock && newDessert.image) {
      setDesserts([
        ...desserts,
        {
          id: desserts.length + 1,
          name: newDessert.name,
          price: Number(newDessert.price),
          stock: Number(newDessert.stock),
          image: newDessert.image,
        },
      ]);
      setOpenDialog(false);
      setNewDessert({ name: "", price: "", stock: "", image: "" });
    }
  };

  // Handle filter change
  const handleFilterChange = (event) => setFilter(event.target.value);

  // Handle search input change
  const handleSearchChange = (event) => setSearchTerm(event.target.value.toLowerCase());

  // Add to Cart
  const handleAddToCart = (dessert) => {
    if (dessert.stock > 0) {
      setCart((prevCart) => [...prevCart, dessert]);
      handleStockUpdate(dessert.id, -1);
    }
  };

  // Remove from Cart
  const handleRemoveFromCart = (index, dessert) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    handleStockUpdate(dessert.id, 1); // Restore stock
  };

  // Handle stock updates
  const handleStockUpdate = (id, increment) => {
    setDesserts((prevDesserts) =>
      prevDesserts.map((dessert) =>
        dessert.id === id ? { ...dessert, stock: Math.max(dessert.stock + increment, 0) } : dessert
      )
    );
  };

  // Get total price of items in the cart
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  // Handle new dessert input change
  const handleNewDessertChange = (e) => {
    setNewDessert({ ...newDessert, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDessert({ ...newDessert, image: URL.createObjectURL(file) });
    }
  };

  // Filtered dessert list
  const filteredDesserts = desserts.filter(
    (dessert) =>
      (filter === "All" || dessert.name.toLowerCase().includes(filter)) &&
      dessert.name.toLowerCase().includes(searchTerm)
  );

  return (
    <Box p={3}>
      {/* Page Title & Cart Icon */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Dessert Management</Typography>
        <IconButton>
          <Badge badgeContent={cart.length} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Box>

      {/* Search and Filter Section */}
      <Box display="flex" justifyContent="space-between" mb={2} flexWrap="wrap">
        <TextField
          label="Search Desserts"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flex: 1, minWidth: "200px", mr: 2 }}
        />
        <Select value={filter} onChange={handleFilterChange} sx={{ minWidth: "200px" }}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Chocolate">Chocolate</MenuItem>
          <MenuItem value="Fruit">Fruit</MenuItem>
          <MenuItem value="Ice Cream">Ice Cream</MenuItem>
          <MenuItem value="Cake">Cake</MenuItem>
        </Select>
      </Box>

      {/* Add Dessert Button */}
      <Button
        variant="contained"
        sx={{ backgroundColor: "purple", color: "white", mb: 2 }}
        onClick={() => setOpenDialog(true)}
      >
        Add Dessert
      </Button>

      {/* Dessert Cards Grid */}
      <Grid container spacing={2}>
        {filteredDesserts.map((dessert) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={dessert.id}>
            <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardMedia
                component="img"
                image={dessert.image}
                alt={dessert.name}
                sx={{ height: 150, objectFit: "contain", width: "100%" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{dessert.name}</Typography>
                <Typography>Price: UGX {dessert.price.toLocaleString()}</Typography>
                <Typography>Stock: {dessert.stock}</Typography>
              </CardContent>
              <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button size="small" variant="contained" color="success" onClick={() => handleStockUpdate(dessert.id, 1)}>
                  Add Stock
                </Button>
                <Button size="small" variant="contained" color="error" onClick={() => handleStockUpdate(dessert.id, -1)} disabled={dessert.stock === 0}>
                  Reduce Stock
                </Button>
                <Button size="small" variant="contained" color="primary" onClick={() => handleAddToCart(dessert)} disabled={dessert.stock === 0}>
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cart Section */}
      {cart.length > 0 && (
        <Box mt={4} p={2} border="1px solid #ddd" borderRadius={2}>
          <Typography variant="h5" gutterBottom>Cart</Typography>
          {cart.map((item, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center">
              <Typography>{item.name} - UGX {item.price.toLocaleString()}</Typography>
              <IconButton onClick={() => handleRemoveFromCart(index, item)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Typography variant="h6" mt={2}>Total: UGX {getTotalPrice().toLocaleString()}</Typography>
        </Box>
      )}

      {/* Add Dessert Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Dessert</DialogTitle>
        <DialogContent>
          <TextField
            label="Dessert Name"
            fullWidth
            value={newDessert.name}
            onChange={handleNewDessertChange}
            name="name"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price (UGX)"
            type="number"
            fullWidth
            value={newDessert.price}
            onChange={handleNewDessertChange}
            name="price"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Stock"
            type="number"
            fullWidth
            value={newDessert.stock}
            onChange={handleNewDessertChange}
            name="stock"
            sx={{ mb: 2 }}
          />
          <Input
            type="file"
            onChange={handleImageUpload}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button onClick={handleAddDessert} color="primary">Add Dessert</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DessertsPage;
