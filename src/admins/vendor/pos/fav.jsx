import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CardMedia,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

// Dummy data for Ugandan products
const productData = [
  { id: 1, name: "Fanta", type: "Soft Drink", price: 1500, stock: 50, image: "/assets/fanta.jpg", description: "A popular carbonated soft drink." },
  { id: 2, name: "Mountain Dew", type: "Soft Drink", price: 1500, stock: 30, image: "/assets/dew.jpg", description: "Citrusy and refreshing soft drink." },
  { id: 3, name: "Coca-Cola", type: "Soft Drink", price: 1500, stock: 45, image: "/assets/coca.jpg", description: "Classic soda with a unique taste." },
  { id: 4, name: "Pepsi", type: "Soft Drink", price: 1500, stock: 25, image: "/assets/pepsi.jpg", description: "Sweet carbonated beverage." },
  { id: 5, name: "AFIA JUICE Tropical", type: "Juice", price: 2000, stock: 20, image: "/assets/afia_tropical.jpg", description: "Tropical fruit juice." },
  { id: 6, name: "AFIA JUICE Mango", type: "Juice", price: 2000, stock: 15, image: "/assets/afia-juice-tropical-mango-uganda.jpg", description: "Delicious mango juice." },
  { id: 7, name: "Heineken Beer 330ml", type: "Alcoholic Beverage", price: 5000, stock: 60, image: "/assets/Heineken.png", description: "Premium lager beer." },
  { id: 8, name: "Bell Lager", type: "Alcoholic Beverage", price: 4500, stock: 40, image: "/assets/bell.png", description: "Popular beer in Uganda." },
  { id: 9, name: "Nile Special", type: "Alcoholic Beverage", price: 4700, stock: 35, image: "/assets/nile-special-500ml.png", description: "A flavorful beer from Uganda." },
  { id: 10, name: "Club Pilsner", type: "Alcoholic Beverage", price: 4600, stock: 50, image: "/assets/club.png", description: "Mild and refreshing pilsner." },
  { id: 11, name: "Chocolate Cake", type: "Dessert", price: 3500, stock: 30, image: "/assets/cake.jpg", description: "Rich and decadent chocolate cake." },
  { id: 12, name: "Mandazi", type: "Dessert", price: 4000, stock: 20, image: "/assets/Mandazi-inUganda.jpg", description: "Sweet and creamy cheesecake." },
 
];

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  const handleAddToFavorites = (product) => {
    if (!favorites.some((fav) => fav.id === product.id)) {
      setFavorites([...favorites, product]);
    }
  };

  const handleRemoveFromFavorites = (productId) => {
    setFavorites(favorites.filter((fav) => fav.id !== productId));
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleAddNewProduct = () => {
    
    setOpenDialog(false);
    setSelectedProduct(null);
  };

  const filteredProducts = productData
    .filter((product) => (filterType ? product.type === filterType : true))
    .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((product) => product.price >= minPrice && product.price <= maxPrice);

  return (
    <Box p={3}>
      {/* Page Title */}
      <Typography variant="h4" gutterBottom>
        My Favorite Products
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        This is the page where you can see your favorite products, browse more, and add new ones. Filter products by type, price range, or search for specific items.
      </Typography>

      {/* Filters */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search Products"
            fullWidth
            variant="outlined"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Type"
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Soft Drink">Soft Drink</MenuItem>
              <MenuItem value="Juice">Juice</MenuItem>
              <MenuItem value="Alcoholic Beverage">Alcoholic Beverage</MenuItem>
              <MenuItem value="Dessert">Dessert</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Min Price"
            type="number"
            fullWidth
            variant="outlined"
            onChange={(e) => setMinPrice(Number(e.target.value))}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Max Price"
            type="number"
            fullWidth
            variant="outlined"
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </Grid>
      </Grid>

      {/* Product Grid */}
      <Grid container spacing={2}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                sx={{ height: 150, objectFit: "contain", width: "100%" }}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="textSecondary">{product.type}</Typography>
                <Typography variant="body1">UGX {product.price.toLocaleString()}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  onClick={() => handleAddToFavorites(product)}
                  color={favorites.some((fav) => fav.id === product.id) ? "primary" : "default"}
                >
                  {favorites.some((fav) => fav.id === product.id) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <Button variant="outlined" onClick={() => handleViewDetails(product)}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Favorites List */}
      <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
        My Favorites
      </Typography>
      <Grid container spacing={3}>
        {favorites.length > 0 ? (
          favorites.map((favorite) => (
            <Grid item xs={12} sm={6} md={4} key={favorite.id}>
              <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <CardMedia
                  component="img"
                  image={favorite.image}
                  alt={favorite.name}
                  sx={{ height: 150, objectFit: "contain", width: "100%" }}
                />
                <CardContent>
                  <Typography variant="h6">{favorite.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{favorite.type}</Typography>
                  <Typography variant="body1">UGX {favorite.price.toLocaleString()}</Typography>
                </CardContent>
                <CardActions>
                  <Button variant="outlined" color="error" onClick={() => handleRemoveFromFavorites(favorite.id)}>
                    Remove from Favorites
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            No products in your favorites yet.
          </Typography>
        )}
      </Grid>

      {/* Product Details Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent>
          {selectedProduct && (
            <>
              <Typography variant="h6">{selectedProduct.name}</Typography>
              <Typography variant="body2" color="textSecondary">{selectedProduct.type}</Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Description:</strong> {selectedProduct.description}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Price:</strong> UGX {selectedProduct.price.toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Stock:</strong> {selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : "Out of stock"}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FavoritesPage;
