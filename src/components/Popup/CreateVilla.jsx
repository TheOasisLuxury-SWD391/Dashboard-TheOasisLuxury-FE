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

const CreateVillaDialog = ({ open, handleClose, setVillas, villas }) => {
    const [newVilla, setNewVilla] = useState({
        villa_name: '',
        insert_date: '',
        update_date: '',
        address: '',
        area: '',
        status: '',
        fluctuates_price: '',
        stiff_price: '',
    });

    const handleChange = (prop) => (event) => {
        setNewVilla({ ...newVilla, [prop]: event.target.value });
    };

    const handleAdd = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/v1/villas/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newVilla),
            });

            if (response.ok) {
                const addedVilla = await response.json();
                setVillas([...villas, addedVilla]); 
                console.log("Villa added successfully");
            } else {
                console.error("Failed to add Villa");
            }
        } catch (error) {
            console.error("Error adding villa:", error);
        }
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add New Villa</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="villa_name"
                    label="Villa Name"
                    type="text"
                    fullWidth
                    value={newVilla.villa_name}
                    onChange={handleChange('villa_name')}
                />

                <TextField
                    margin="dense"
                    id="insert_date"
                    label="InsertDate"
                    type="date"
                    fullWidth
                    value={newVilla.insert_date}
                    onChange={handleChange('insert_date')}
                />
                <TextField
                    margin="dense"
                    id="update_date"
                    label="UpdateDate"
                    type="date"
                    fullWidth
                    value={newVilla.update_date}
                    onChange={handleChange('update_date')}
                />
                <TextField
                    margin="dense"
                    id="address"
                    label="address"
                    type="text"
                    fullWidth
                    value={newVilla.address}
                    onChange={handleChange('address')}
                />
                <TextField
                    margin="dense"
                    id="area"
                    label="area"
                    type="text"
                    fullWidth
                    value={newVilla.area}
                    onChange={handleChange('area')}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        name="status"
                        value={newVilla.status}
                        onChange={handleChange('status')}
                        label="Status"
                    >
                        <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                        <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    id="fluctuates_price"
                    label="Fluctuates Price"
                    type="number"
                    fullWidth
                    value={newVilla.fluctuates_price}
                    onChange={handleChange('fluctuates_price')}
                />
                <TextField
                    margin="dense"
                    id="stiff_price"
                    label="Stiff Price"
                    type="number"
                    fullWidth
                    value={newVilla.stiff_price}
                    onChange={handleChange('stiff_price')}
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

export default CreateVillaDialog;
