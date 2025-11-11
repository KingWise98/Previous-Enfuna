import React from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { MoneyOff, GridOn, PictureAsPdf, Print } from '@mui/icons-material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample expense data
const expenseData = [
  { name: 'Salaries', value: 3000000 },
  { name: 'Rent', value: 1500000 },
  { name: 'Utilities', value: 500000 },
  { name: 'Supplies', value: 800000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ExpensePage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Expense Dashboard</Typography>
      
      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#F44336', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Expenses</Typography>
              <Typography variant="h4">UGX 5,800,000</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#FF9800', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">This Month</Typography>
              <Typography variant="h4">UGX 1,200,000</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#9C27B0', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Largest Category</Typography>
              <Typography variant="h4">Salaries</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#607D8B', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Avg. Daily</Typography>
              <Typography variant="h4">UGX 193,333</Typography>
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

      {/* Expense Breakdown Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Expense Breakdown</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`UGX ${value.toLocaleString()}`, 'Amount']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}