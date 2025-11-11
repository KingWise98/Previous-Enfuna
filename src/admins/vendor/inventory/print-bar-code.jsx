import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Delete, Print } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const PrintBarcodePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Dummy Data (Ugandan Names & Products)
  const initialProducts = [
    { id: 1, name: "Mukwano Cooking Oil", code: "MK001", quantity: 10 },
    { id: 2, name: "Kakira Sugar", code: "KS002", quantity: 5 },
    { id: 3, name: "Movit Hair Cream", code: "MV003", quantity: 15 },
    { id: 4, name: "Riham Soda", code: "RS004", quantity: 7 },
    { id: 5, name: "Bell Lager", code: "BL005", quantity: 12 },
  ];

  const [warehouse, setWarehouse] = useState("");
  const [product, setProduct] = useState("");
  const [selectedProducts, setSelectedProducts] = useState(initialProducts);
  const [paperSize, setPaperSize] = useState("A4");

  const handleAddProduct = () => {
    if (!product) return alert("Please choose a product.");
    const existingProduct = selectedProducts.find((p) => p.name === product);
    if (!existingProduct) {
      setSelectedProducts([
        ...selectedProducts,
        {
          id: selectedProducts.length + 1,
          name: product,
          code: `P00${selectedProducts.length + 1}`,
          quantity: 1,
        },
      ]);
    }
  };

  const handleDeleteProduct = (id) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== id));
  };

  const handleQuantityChange = (id, newQuantity) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p.id === id ? { ...p, quantity: newQuantity } : p
      )
    );
  };

  const handleCreateBarcode = () => {
    alert("Barcodes created successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    { field: "name", headerName: "Product Name", flex: 1.5 },
    { field: "code", headerName: "Product Code", flex: 1 },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      renderCell: (params) => (
        <Select
          value={params.value}
          onChange={(e) => handleQuantityChange(params.row.id, e.target.value)}
          sx={{ width: 80 }}
        >
          {[...Array(50)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDeleteProduct(params.row.id)}>
          <Delete />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Typography variant="h4" fontWeight="bold">
        Print Barcodes
      </Typography>

      {/* Warehouse & Product Selection */}
      <Box
        display="flex"
        gap={2}
        mt={3}
        sx={{ backgroundColor: colors.primary[400], p: 3, borderRadius: 2 }}
      >
        <FormControl fullWidth>
          <InputLabel>Choose Warehouse</InputLabel>
          <Select value={warehouse} onChange={(e) => setWarehouse(e.target.value)}>
            <MenuItem value="Kampala Warehouse">Kampala Warehouse</MenuItem>
            <MenuItem value="Entebbe Warehouse">Entebbe Warehouse</MenuItem>
            <MenuItem value="Jinja Warehouse">Jinja Warehouse</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Choose Product</InputLabel>
          <Select value={product} onChange={(e) => setProduct(e.target.value)}>
            <MenuItem value="Mukwano Cooking Oil">Mukwano Cooking Oil</MenuItem>
            <MenuItem value="Kakira Sugar">Kakira Sugar</MenuItem>
            <MenuItem value="Movit Hair Cream">Movit Hair Cream</MenuItem>
            <MenuItem value="Riham Soda">Riham Soda</MenuItem>
            <MenuItem value="Bell Lager">Bell Lager</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Box>

      {/* Product Selection Table */}
      <Box mt={4} sx={{ height: "50vh" }}>
        <Typography variant="h6" mb={1}>
          Select Products for Print Barcode
        </Typography>
        <DataGrid
          rows={selectedProducts}
          columns={columns}
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700] },
            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
            "& .MuiDataGrid-footerContainer": { backgroundColor: colors.blueAccent[700] },
          }}
        />
      </Box>

      {/* Paper Size Selection & Buttons */}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Paper Size</InputLabel>
          <Select value={paperSize} onChange={(e) => setPaperSize(e.target.value)}>
            <MenuItem value="A4">A4</MenuItem>
            <MenuItem value="A5">A5</MenuItem>
            <MenuItem value="Letter">Letter</MenuItem>
          </Select>
        </FormControl>

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "purple", color: "white" }}
            onClick={handleCreateBarcode}
          >
            Create Barcode
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "green", color: "white" }}
            startIcon={<Print />}
            onClick={handlePrint}
          >
            Print
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default PrintBarcodePage;
