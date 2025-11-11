import React, { useState } from 'react';
import { Box, Typography, Grid, TextField, Button, Switch, FormControlLabel, Divider, IconButton, Paper, Select, MenuItem, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon, Delete as DeleteIcon } from '@mui/icons-material';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    name: '',
    email: '',
    password: '',
    darkMode: false,
    notificationsEnabled: true,
    language: 'English',
    timezone: 'GMT',
    privacyLevel: 'Public',
  });

  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleToggle = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.checked });
  };

  const handleSave = () => {
    // Logic to save settings (e.g., API call)
    console.log("Settings saved:", settings);
  };

  const handleCancel = () => {
    // Reset settings or handle cancel
    console.log("Settings changes discarded.");
  };

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log("Account deleted.");
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 3, fontWeight: 'bold' }}>Settings</Typography>

      {/* Profile Settings */}
      <Paper sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Profile Settings</Typography>
        <TextField
          label="Full Name"
          variant="outlined"
          name="name"
          value={settings.name}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Email"
          variant="outlined"
          name="email"
          value={settings.email}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Password"
          variant="outlined"
          name="password"
          type="password"
          value={settings.password}
          onChange={handleChange}
          fullWidth
          sx={{ marginBottom: 2 }}
        />
      </Paper>

      {/* Theme Settings */}
      <Paper sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Theme Settings</Typography>
        <FormControlLabel
          control={
            <Switch
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleToggle}
              color="primary"
            />
          }
          label="Dark Mode"
        />
      </Paper>

      {/* Notification Settings */}
      <Paper sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Notification Settings</Typography>
        <FormControlLabel
          control={
            <Switch
              name="notificationsEnabled"
              checked={settings.notificationsEnabled}
              onChange={handleToggle}
              color="primary"
            />
          }
          label="Enable Notifications"
        />
      </Paper>

      {/* Privacy Settings */}
      <Paper sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Privacy Settings</Typography>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel>Privacy Level</InputLabel>
          <Select
            name="privacyLevel"
            value={settings.privacyLevel}
            onChange={handleChange}
            label="Privacy Level"
          >
            <MenuItem value="Public">Public</MenuItem>
            <MenuItem value="Private">Private</MenuItem>
            <MenuItem value="Friends Only">Friends Only</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* General Settings */}
      <Paper sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>General Settings</Typography>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                name="language"
                value={settings.language}
                onChange={handleChange}
                label="Language"
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="French">French</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Timezone</InputLabel>
              <Select
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                label="Timezone"
              >
                <MenuItem value="GMT">GMT</MenuItem>
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="EST">EST</MenuItem>
                <MenuItem value="CST">CST</MenuItem>
                <MenuItem value="PST">PST</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Security Settings */}
      <Paper sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Security Settings</Typography>
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{ marginBottom: 2 }}
        >
          Delete Account
        </Button>
      </Paper>

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" sx={{ marginTop: 3 }}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<CancelIcon />}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </Box>

      {/* Confirmation Dialog for Account Deletion */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to permanently delete your account? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsPage;
