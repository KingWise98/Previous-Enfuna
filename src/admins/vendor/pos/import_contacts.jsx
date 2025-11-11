import React, { useState } from "react";
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
  Avatar,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { UploadFile, Delete, CheckCircle, Warning, Close } from "@mui/icons-material";

// Dummy contact data (based on provided names)
const dummyContacts = [
  { id: 1, name: "Nakato Kintu", phone: "+256 752 123456", email: "nakato.kintu@example.com", type: "Customer", status: "success" },
  { id: 2, name: "Mukasa Wasswa", phone: "", email: "mwasswa@suppliers.co.ug", type: "Supplier", status: "error" }, // Missing phone
  { id: 3, name: "Nalwoga Sarah", phone: "+256 701 456789", email: "sarah.nalwoga@example.com", type: "Customer", status: "success" },
  { id: 4, name: "Kirabo Jovia", phone: "+256 772 890345", email: "kirabo.jovia@gmail.com", type: "Customer", status: "success" },
  { id: 5, name: "Ssebunya James", phone: "+256 785 234678", email: "ssebunya.james@workmail.com", type: "Partner", status: "success" },
  { id: 6, name: "Ainembabazi Doreen", phone: "", email: "ainembabazi.doreen@enterprise.com", type: "Supplier", status: "error" }, // Missing phone
];

const ImportContactsPage = () => {
  const [file, setFile] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // Handle file selection
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  // Simulate file processing
  const handleUpload = () => {
    setLoading(true);
    setTimeout(() => {
      setContacts(dummyContacts); // Using dummy data instead of real CSV parsing
      setLoading(false);
      setOpenDialog(true);
    }, 1500);
  };

  // Remove a contact from the preview list
  const handleRemoveContact = (id) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
  };

  // Confirm import action
  const handleConfirmImport = () => {
    console.log("Imported Contacts:", contacts);
    setOpenDialog(false);
  };

  return (
    <Box m="20px">
      {/* Header */}
      <Typography variant="h3" fontWeight="bold">
        Import Contacts
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Upload a CSV file to bulk import contacts
      </Typography>

      {/* File Upload Section */}
      <Box mt={3} p={3} border="1px dashed grey" borderRadius="8px" textAlign="center">
        <Typography variant="h6" mb={2}>
          Upload CSV File
        </Typography>
        <input
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          id="upload-csv"
          onChange={handleFileChange}
        />
        <label htmlFor="upload-csv">
          <Button variant="contained" component="span" startIcon={<UploadFile />}>
            Select File
          </Button>
        </label>
        {file && <Typography mt={2}>{file.name}</Typography>}
        <Button
          variant="contained"
          color="primary"
          disabled={!file || loading}
          sx={{ mt: 2 }}
          onClick={handleUpload}
        >
          {loading ? <CircularProgress size={24} /> : "Upload & Preview"}
        </Button>
      </Box>

      {/* Import Preview Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Preview Imported Contacts</DialogTitle>
        <DialogContent>
          {contacts.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Contact</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar>{contact.name.charAt(0)}</Avatar>
                          <Typography>{contact.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{contact.phone || "-"}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={contact.type}
                          color={contact.type === "Customer" ? "primary" : "secondary"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {contact.status === "success" ? (
                          <Chip label="Valid" color="success" icon={<CheckCircle />} size="small" />
                        ) : (
                          <Chip label="Error" color="error" icon={<Warning />} size="small" />
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleRemoveContact(contact.id)}>
                          <Delete color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography textAlign="center" color="textSecondary">
              No contacts to preview
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<Close />}>
            Cancel
          </Button>
          <Button onClick={handleConfirmImport} color="primary" variant="contained">
            Confirm Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImportContactsPage;
