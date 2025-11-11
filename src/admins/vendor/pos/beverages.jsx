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

// Dummy beverage data
const beveragesData = [
  
  { id: 1, name: "Fanta", type: "Soft Drink", price: 1500, stock: 50, image: "/assets/fanta.jpg" },
  { id: 2, name: "Mountain Dew", type: "Soft Drink", price: 1500, stock: 30, image: "/assets/dew.jpg" },
  { id: 3, name: "Coca-Cola", type: "Soft Drink", price: 1500, stock: 45, image: "/assets/coca.jpg" },
  { id: 4, name: "Pepsi", type: "Soft Drink", price: 1500, stock: 25, image: "/assets/pepsi.jpg" },
  { id: 5, name: "AFIA JUICE Tropical", type: "Juice", price: 2000, stock: 20, image: "/assets/afia_tropical.jpg" },
  { id: 6, name: "AFIA JUICE Mango", type: "Juice", price: 2000, stock: 15, image: "/assets/afia-juice-tropical-mango-uganda.jpg" },
  { id: 7, name: "Heineken Beer 330ml", type: "Alcoholic Beverage", price: 5000, stock: 60, image: "/assets/Heineken.png" },
  { id: 8, name: "Bell Lager", type: "Alcoholic Beverage", price: 4500, stock: 40, image: "/assets/bell.png" },
  { id: 9, name: "Nile Special", type: "Alcoholic Beverage", price: 4700, stock: 35, image: "/assets/nile-special-500ml.png" },
  { id: 10, name: "Club Pilsner", type: "Alcoholic Beverage", price: 4600, stock: 50, image: "/assets/club.png" },
  { id: 11, name: "Tusker Lite", type: "Alcoholic Beverage", price: 4800, stock: 30, image: "/assets/Tusker-Lite.png" },
  { id: 12, name: "Redds Vodka Lemon", type: "Alcoholic Beverage", price: 5000, stock: 25, image: "/assets/redd-s_vodka_lemoncl.jpg" },
  { id: 13, name: "Mirinda Fruity", type: "Soft Drink", price: 1500, stock: 40, image: "/assets/mirinda.png" },
  { id: 14, name: "Sprite", type: "Soft Drink", price: 1500, stock: 35, image: "/assets/Sprite.png" },
  { id: 15, name: "Krest Bitter Lemon", type: "Soft Drink", price: 1500, stock: 20, image: "/assets/krest.jpg" },
  { id: 16, name: "Minute Maid Apple", type: "Juice", price: 2000, stock: 25, image: "/assets/maid2.jpg" },
  { id: 17, name: "Minute Maid Orange", type: "Juice", price: 2000, stock: 30, image: "/assets/maid1.png" },
  { id: 18, name: "Novida Pineapple", type: "Soft Drink", price: 1500, stock: 45, image: "/assets/novida.jpg" },
  { id: 19, name: "Novida Apple", type: "Soft Drink", price: 1500, stock: 50, image: "/assets/Novida_apple.jpg" },
  { id: 20, name: "Uganda Waragi", type: "Alcoholic Beverage", price: 6000, stock: 20, image: "/assets/Waragi-OriginalLarge.jpg" },
  
  // Hot Drinks
  { id: 21, name: "Black Coffee", type: "Hot Drink", price: 3000, stock: 40, image: "/assets/Black+coffee+glass+cup.png" },
  { id: 22, name: "Espresso", type: "Hot Drink", price: 4000, stock: 30, image: "/assets/espresso.jpg" },
  { id: 23, name: "Cappuccino", type: "Hot Drink", price: 5000, stock: 35, image: "/assets/cappuccino.jpg" },
  { id: 24, name: "Latte", type: "Hot Drink", price: 5500, stock: 20, image: "/assets/latte.jpg" },
  { id: 25, name: "Masala Tea", type: "Hot Drink", price: 3500, stock: 25, image: "/assets/Chai_Masala_Tea_1200x1200.jpg" },
  { id: 26, name: "Hot Chocolate", type: "Hot Drink", price: 4000, stock: 30, image: "/assets/hot.jpg" },
  { id: 27, name: "Hot Milk", type: "Hot Drink", price: 4000, stock: 10, image: "/assets/milk.jpg" },
  { id: 28, name: "Splash Mango", type: "Juice", price: 2000, stock: 80, image: "/assets/splash.jpg" },
  
];

const BeveragesPage = () => {
  const [beverages, setBeverages] = useState(beveragesData);
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newBeverage, setNewBeverage] = useState({
    name: "",
    type: "Soft Drink",
    price: "",
    stock: "",
    image: "",
  });

  // Handle adding new beverage
  const handleAddBeverage = () => {
    if (newBeverage.name && newBeverage.price && newBeverage.stock && newBeverage.image) {
      setBeverages([
        ...beverages,
        {
          id: beverages.length + 1,
          name: newBeverage.name,
          type: newBeverage.type,
          price: Number(newBeverage.price),
          stock: Number(newBeverage.stock),
          image: newBeverage.image,
        },
      ]);
      setOpenDialog(false);
      setNewBeverage({ name: "", type: "Soft Drink", price: "", stock: "", image: "" });
    }
  };

  // Handle filter change
  const handleFilterChange = (event) => setFilter(event.target.value);

  // Handle search input change
  const handleSearchChange = (event) => setSearchTerm(event.target.value.toLowerCase());

  // Add to Cart
  const handleAddToCart = (bev) => {
    if (bev.stock > 0) {
      setCart((prevCart) => [...prevCart, bev]);
      handleStockUpdate(bev.id, -1);
    }
  };

  // Remove from Cart
  const handleRemoveFromCart = (index, bev) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
    handleStockUpdate(bev.id, 1); // Restore stock
  };

  // Handle stock updates
  const handleStockUpdate = (id, increment) => {
    setBeverages((prevBeverages) =>
      prevBeverages.map((bev) =>
        bev.id === id ? { ...bev, stock: Math.max(bev.stock + increment, 0) } : bev
      )
    );
  };

  // Calculate total price of items in the cart
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  // Handle new beverage input change
  const handleNewBeverageChange = (e) => {
    setNewBeverage({ ...newBeverage, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBeverage({ ...newBeverage, image: URL.createObjectURL(file) });
    }
  };

  // Filtered beverage list
  const filteredBeverages = beverages.filter(
    (bev) =>
      (filter === "All" || bev.type === filter) &&
      bev.name.toLowerCase().includes(searchTerm)
  );

  return (
    <Box p={3}>
      {/* Page Title & Cart Icon */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Beverages Management</Typography>
        <IconButton>
          <Badge badgeContent={cart.length} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Box>

      {/* Search and Filter Section */}
      <Box display="flex" justifyContent="space-between" mb={2} flexWrap="wrap">
        <TextField
          label="Search Beverages"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ flex: 1, minWidth: "200px", mr: 2 }}
        />
        <Select value={filter} onChange={handleFilterChange} sx={{ minWidth: "200px" }}>
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Soft Drink">Soft Drinks</MenuItem>
          <MenuItem value="Juice">Juices</MenuItem>
          <MenuItem value="Alcoholic Beverage">Alcoholic Beverages</MenuItem>
          <MenuItem value="Hot Drink">Hot Drinks</MenuItem>
        </Select>
      </Box>

      {/* Add Beverage Button */}
      <Button
        variant="contained"
        sx={{ backgroundColor: "purple", color: "white", mb: 2 }}
        onClick={() => setOpenDialog(true)}
      >
        Add Beverage
      </Button>

      {/* Beverage Cards Grid */}
      <Grid container spacing={2}>
        {filteredBeverages.map((bev) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={bev.id}>
            <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardMedia
                component="img"
                image={bev.image}
                alt={bev.name}
                sx={{ height: 150, objectFit: "contain", width: "100%" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{bev.name}</Typography>
                <Typography>Type: {bev.type}</Typography>
                <Typography>Price: UGX {bev.price.toLocaleString()}</Typography>
                <Typography>Stock: {bev.stock}</Typography>
              </CardContent>
              <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button size="small" variant="contained" color="success" onClick={() => handleStockUpdate(bev.id, 1)}>
                  Add Stock
                </Button>
                <Button size="small" variant="contained" color="error" onClick={() => handleStockUpdate(bev.id, -1)} disabled={bev.stock === 0}>
                  Reduce Stock
                </Button>
                <Button size="small" variant="contained" color="primary" onClick={() => handleAddToCart(bev)} disabled={bev.stock === 0}>
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

      {/* Add Beverage Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Beverage</DialogTitle>
        <DialogContent>
          <TextField
            label="Beverage Name"
            fullWidth
            value={newBeverage.name}
            onChange={handleNewBeverageChange}
            name="name"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Price (UGX)"
            type="number"
            fullWidth
            value={newBeverage.price}
            onChange={handleNewBeverageChange}
            name="price"
            sx={{ mb: 2 }}
          />
          <TextField
            label="Stock"
            type="number"
            fullWidth
            value={newBeverage.stock}
            onChange={handleNewBeverageChange}
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
          <Button onClick={handleAddBeverage} color="primary">Add Beverage</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BeveragesPage;
