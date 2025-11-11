import React from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { TrendingUp, GridOn, PictureAsPdf, Print } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample income data
const incomeData = [
  { name: 'Sales', amount: 5000000 },
  { name: 'Services', amount: 2000000 },
  { name: 'Investments', amount: 1000000 },
];

const recentTransactions = [
  { id: 1, date: '2023-10-01', source: 'Product Sales', amount: 1500000 },
  { id: 2, date: '2023-10-02', source: 'Consulting', amount: 500000 },
  { id: 3, date: '2023-10-03', source: 'Interest', amount: 200000 },
];

export default function IncomePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Income Dashboard</Typography>
      
      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#4CAF50', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Income</Typography>
              <Typography variant="h4">UGX 7,700,000</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#2196F3', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">This Month</Typography>
              <Typography variant="h4">UGX 2,200,000</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#FF9800', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Avg. Daily</Typography>
              <Typography variant="h4">UGX 256,667</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#9C27B0', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Top Source</Typography>
              <Typography variant="h4">Sales</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

      {/* Income by Category Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Income by Category</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incomeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`UGX ${value.toLocaleString()}`, 'Amount']} />
              <Legend />
              <Bar dataKey="amount" fill="#8884d8" name="Income (UGX)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recent Income Transactions</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell align="right">Amount (UGX)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentTransactions.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.source}</TableCell>
                    <TableCell align="right">{row.amount.toLocaleString()}</TableCell>
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