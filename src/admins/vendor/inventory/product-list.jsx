import { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit, Delete, VisibilityOff, CloudUpload, GetApp, Close, PictureAsPdf } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const ProductListPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDarkMode = theme.palette.mode === "dark";

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    image: null,
    imageFile: null,
    name: "",
    code: "",
    category: "",
    brand: "",
    price: "",
    unit: "",
    quantity: "",
  });

  const [error, setError] = useState("");

  // Handle text field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Drag and drop or file selection for image
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData({
        ...formData,
        image: URL.createObjectURL(file),
        imageFile: file,
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 1,
  });

  // Remove selected image
  const removeImage = () => {
    setFormData({ ...formData, image: null, imageFile: null });
  };

  const handleCreateProduct = () => {
    // Check if required fields are filled
    const requiredFields = ['name', 'code', 'category', 'brand', 'price', 'unit', 'quantity'];
    const isMissingField = requiredFields.some(field => !formData[field]);
    
    if (isMissingField || !formData.image) {
      setError("Please fill in all fields and upload an image before submitting.");
      return;
    }

    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...formData
    };

    setProducts([...products, newProduct]);
    setFormData({
      image: null,
      imageFile: null,
      name: "",
      code: "",
      category: "",
      brand: "",
      price: "",
      unit: "",
      quantity: "",
    });
    setError("");
  };

  const handleDelete = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleHide = (id) => {
    alert(`Product with ID ${id} is now hidden`);
  };

  // Generate PDF
  const handleDownloadPDF = () => {
    if (products.length === 0) {
      alert("No products to export");
      return;
    }
    
    const doc = new jsPDF();
    doc.text("Product List", 10, 10);
    autoTable(doc, {
      head: [["Name", "Code", "Category", "Brand", "Price (UGX)", "Unit", "Quantity"]],
      body: products.map(({ name, code, category, brand, price, unit, quantity }) => [
        name,
        code,
        category,
        brand,
        price,
        unit,
        quantity,
      ]),
    });
    doc.save("Product_List.pdf");
  };

  // Generate Excel
  const handleDownloadExcel = () => {
    if (products.length === 0) {
      alert("No products to export");
      return;
    }
    
    // Remove image fields before exporting to Excel
    const productsForExport = products.map(({ image, imageFile, ...rest }) => rest);
    
    const worksheet = XLSX.utils.json_to_sheet(productsForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "Product_List.xlsx");
  };

  const columns = [
    {
      field: "image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) =>
        params.value ? (
          <img 
            src={params.value} 
            alt="Product" 
            style={{ 
              width: 50, 
              height: 50, 
              borderRadius: 5,
              objectFit: 'cover' 
            }} 
          />
        ) : (
          "No Image"
        ),
    },
    { field: "name", headerName: "Name", flex: 1.5 },
    { field: "code", headerName: "Code", flex: 1 },
    { field: "category", headerName: "Category", flex: 1 },
    { field: "brand", headerName: "Brand", flex: 1 },
    { 
      field: "price", 
      headerName: "Price (UGX)", 
      flex: 1,
      valueFormatter: (params) => `UGX ${params.value}`
    },
    { field: "unit", headerName: "Unit", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton color="warning" onClick={() => handleHide(params.row.id)}>
            <VisibilityOff />
          </IconButton>
          <IconButton color="primary">
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Typography variant="h4" fontWeight="bold">
        Product List
      </Typography>

      {/* Create Product Form */}
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        mt={3}
        sx={{ backgroundColor: colors.primary[400], p: 3, borderRadius: 2 }}
      >
        <Typography variant="h6">Create Product</Typography>

        {/* Drag and Drop Image Upload */}
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed gray",
            padding: "20px",
            textAlign: "center",
            cursor: "pointer",
            borderRadius: "5px",
            backgroundColor: colors.primary[300],
          }}
        >
          <input {...getInputProps()} />
          <Typography sx={{ color: isDarkMode ? "white" : "black" }}>
            {formData.image ? "Image Selected" : "Drag & drop an image here, or click to select one"}
          </Typography>

          {formData.image && (
            <Box mt={1} display="flex" alignItems="center" gap={1}>
              <img 
                src={formData.image} 
                alt="Preview" 
                style={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: 5,
                  objectFit: 'cover'
                }} 
              />
              <IconButton color="error" onClick={removeImage}>
                <Close />
              </IconButton>
            </Box>
          )}
        </Box>

        {/* Text Fields */}
        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={2}>
          <Box gridColumn="span 1">
            <TextField
              fullWidth
              variant="outlined"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Box>
          <Box gridColumn="span 1">
            <TextField
              fullWidth
              variant="outlined"
              label="Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
            />
          </Box>
          <Box gridColumn="span 1">
            <TextField
              fullWidth
              variant="outlined"
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </Box>
          <Box gridColumn="span 1">
            <TextField
              fullWidth
              variant="outlined"
              label="Brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            />
          </Box>
          <Box gridColumn="span 1">
            <TextField
              fullWidth
              variant="outlined"
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </Box>
          <Box gridColumn="span 1">
            <TextField
              fullWidth
              variant="outlined"
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            />
          </Box>
          <Box gridColumn="span 1">
            <TextField
              fullWidth
              variant="outlined"
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
            />
          </Box>
        </Box>

        {error && (
          <Typography color="error" mt={1}>
            {error}
          </Typography>
        )}

        <Button variant="contained" color="primary" onClick={handleCreateProduct}>
          Create Product
        </Button>
      </Box>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button variant="contained" color="secondary" startIcon={<CloudUpload />}>
          Import Products
        </Button>
        <Box>
          <Button variant="contained" color="error" startIcon={<PictureAsPdf />} onClick={handleDownloadPDF} sx={{ ml: 2 }}>
            Download PDF
          </Button>
          <Button variant="contained" color="success" startIcon={<GetApp />} onClick={handleDownloadExcel} sx={{ ml: 2 }}>
            Download Excel
          </Button>
        </Box>
      </Box>

      {/* Product Table */}
      <Box mt={4} sx={{ height: "60vh", width: '100%' }}>
        <DataGrid 
          rows={products} 
          columns={columns} 
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default ProductListPage;