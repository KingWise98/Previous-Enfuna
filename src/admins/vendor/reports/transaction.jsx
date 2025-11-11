import React, { useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TextField, InputAdornment, IconButton, Chip
} from '@mui/material';
import { Receipt, GridOn, PictureAsPdf, Print, Search, FilterList } from '@mui/icons-material';

// Sample transaction data
const transactions = [
  { id: 1, date: '2023-10-01', description: 'Product Sale', amount: 1500000, type: 'income', category: 'Sales' },
  { id: 2, date: '2023-10-02', description: 'Office Rent', amount: 500000, type: 'expense', category: 'Rent' },
  { id: 3, date: '2023-10-03', description: 'Utility Bill', amount: 200000, type: 'expense', category: 'Utilities' },
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(transaction =>
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Transactions</Typography>
      
      {/* Search and Filter Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
              >
                Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Export Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button variant="contained" startIcon={<GridOn />} sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}>
          Export to Excel
        </Button>
        <Button variant="contained" startIcon={<PictureAsPdf />} sx={{ bgcolor: '#F44336', '&:hover': { bgcolor: '#D32F2F' } }}>
          Export to PDF
        </Button>
        <Button variant="contained" startIcon={<Print />} sx={{ bgcolor: '#2196F3', '&:hover': { bgcolor: '#1976D2' } }}>
          Print Report
        </Button>
      </Box>

      {/* Transactions Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>All Transactions</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Amount (UGX)</TableCell>
                  <TableCell>Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell align="right" sx={{ color: row.type === 'income' ? '#4CAF50' : '#F44336' }}>
                      {row.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.type === 'income' ? 'Income' : 'Expense'}
                        color={row.type === 'income' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}