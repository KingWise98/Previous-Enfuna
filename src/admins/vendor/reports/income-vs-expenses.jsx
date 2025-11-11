import React from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { CompareArrows, GridOn, PictureAsPdf, Print } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample comparison data
const comparisonData = [
  { month: 'Jan', income: 5000000, expenses: 3500000 },
  { month: 'Feb', income: 6000000, expenses: 4000000 },
  { month: 'Mar', income: 5500000, expenses: 3800000 },
];

export default function IncomeVsExpensesPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Income vs Expenses</Typography>
      
      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#4CAF50', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Income</Typography>
              <Typography variant="h4">UGX 16,500,000</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#F44336', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Expenses</Typography>
              <Typography variant="h4">UGX 11,300,000</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ bgcolor: '#2196F3', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Net Profit</Typography>
              <Typography variant="h4">UGX 5,200,000</Typography>
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

      {/* Comparison Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Monthly Comparison</Typography>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`UGX ${value.toLocaleString()}`, 'Amount']} />
              <Legend />
              <Bar dataKey="income" fill="#4CAF50" name="Income" />
              <Bar dataKey="expenses" fill="#F44336" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}