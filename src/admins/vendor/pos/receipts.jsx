import React from 'react';
import { Box, Typography, Button, Card, CardContent, DialogActions, CardMedia } from '@mui/material';

const Receipts = ({ receiptData, onClose }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Payment Receipt
        </Typography>
        
        {receiptData.logo && (
          <Box display="flex" justifyContent="center" mb={2}>
            <CardMedia
              component="img"
              image={receiptData.logo}
              alt="Payment Method"
              sx={{ width: 100, objectFit: 'contain' }}
            />
          </Box>
        )}
        
        <Typography variant="subtitle1" gutterBottom>
          Transaction ID: {receiptData.id}
        </Typography>
        
        <Box mt={2} mb={2}>
          <Typography variant="h6">Items Purchased:</Typography>
          {receiptData.items.map((item) => (
            <Box key={item.id} display="flex" justifyContent="space-between" mt={1}>
              <Typography>
                {item.name} (x{item.quantity})
              </Typography>
              <Typography>
                UGX {(item.price * item.quantity).toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
        
        <Box mt={2} borderTop={1} borderColor="divider" pt={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography>Subtotal:</Typography>
            <Typography>UGX {receiptData.amount.toLocaleString()}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography>VAT ({receiptData.vatRate * 100}%):</Typography>
            <Typography>UGX {receiptData.vat.toLocaleString()}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">UGX {receiptData.grandTotal.toLocaleString()}</Typography>
          </Box>
        </Box>
        
        <Box mt={3}>
          <Typography variant="body2" color="textSecondary">
            Payment Method: {receiptData.method === "credit" ? "Credit/Debit Card" : 
                            receiptData.method === "mobile" ? receiptData.provider + " Mobile Money" : 
                            receiptData.method === "thirdParty" ? receiptData.thirdPartyProvider : "Bank Transfer"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Date: {receiptData.date}
          </Typography>
          <Typography variant="body2" color="textSecondary" mt={2}>
            EFRIS Tax Invoice Generated
          </Typography>
        </Box>
      </CardContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        <Button onClick={() => window.print()} color="primary">
          Print Receipt
        </Button>
      </DialogActions>
    </Card>
  );
};

export default Receipts;