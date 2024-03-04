import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const CreateTimeShareDialog = ({ open, handleClose, setTimeShares, timeshares }) => {
  const [newTimeShare, setNewTimeShare] = useState({
    time_share_name: '',
    time_share_type: '',
});

  const handleChange = (prop) => (event) => {
    setNewTimeShare({ ...newTimeShare, [prop]: event.target.value });
  };



  const handleAdd = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/timeshares/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newTimeShare), 
      });

      if (response.ok) {
        const addedTimeShare = await response.json();
        setTimeShares([...timeshares, addedTimeShare]); 
        console.log("TimeShare added successfully");
      } else {
        console.error("Failed to add TimeShare");
      }
    } catch (error) {
      console.error("Error adding TimeShare:", error);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add New TimeShare</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Timeshare Name"
          type="text"
          fullWidth
          value={newTimeShare.time_share_name}
          onChange={handleChange('time_share_name')}
        />
     
       
        <TextField
          margin="dense"
          id="time_share_type"
          label="Time share Type"
          type="number"
          fullWidth
          value={newTimeShare.time_share_type}
          onChange={handleChange('time_share_type')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAdd} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default CreateTimeShareDialog;
