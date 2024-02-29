
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
import { toast } from "react-toastify";

const CreateSubdivisionDialog = ({ open, handleClose, setSubdivisions, subdivisions }) => {
  const [newSubdivision, setNewSubdivision] = useState({
    name: '',
    location: '',
    insert_date: '',
    update_date: '',
    quantityVilla: '',
    status: '',
    project_id: '',
  });

  const handleChange = (prop) => (event) => {
    setNewSubdivision({ ...newSubdivision, [prop]: event.target.value });
  };



  const handleAdd = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/subdivisions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newSubdivision), 
      });

      if (response.ok) {
        const addedSubdivision = await response.json();
        setSubdivisions([...subdivisions, addedSubdivision]); 
        console.log("Subdivision added successfully");
        toast.success("Subdivision added successfully");
      } else {
        console.error("Failed to add Subdivision");
        toast.error("Failed to add Subdivision")
      }
    } catch (error) {
      console.error("Error adding subdivision:", error);
      toast.success("Subdivision added successfully");
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Add New Subdivision</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Subdivision Name"
          type="text"
          fullWidth
          value={newSubdivision.subdivision_name}
          onChange={handleChange('subdivision_name')}
        />
        <TextField
          margin="dense"
          id="location"
          label="Location"
          type="text"
          fullWidth
          value={newSubdivision.location}
          onChange={handleChange('location')}
        />
       <TextField
                    margin="dense"
                    id="insert_date"
                    label="InsertDate"
                    type="date"
                    fullWidth
                    value={newSubdivision.insert_date}
                    onChange={handleChange('insert_date')}
                />
        <TextField
                    margin="dense"
                    id="update_date"
                    label="UpdateDate"
                    type="date"
                    fullWidth
                    value={newSubdivision.update_date}
                    onChange={handleChange('update_date')}
                />
        <TextField
          margin="dense"
          id="quantityVilla"
          label="Quantity Villa"
          type="number"
          fullWidth
          value={newSubdivision.quantityVilla}
          onChange={handleChange('quantityVilla')}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="status-label">Status</InputLabel>
          <Select
            labelId="status-label"
            id="status"
            name="status"
            value={newSubdivision.status}
            onChange={handleChange('status')}
            label="Status"
          >
            <MenuItem value="ACTIVE">ACTIVE</MenuItem>
            <MenuItem value="INACTIVE">INACTIVE</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          id="project_id"
          label="project id"
          type="text"
          fullWidth
          value={newSubdivision.project_id}
          onChange={handleChange('project_id')}
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

export default CreateSubdivisionDialog;
