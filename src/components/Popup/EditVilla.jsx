import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    DialogActions,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

function EditVillaDialog({ editVilla, setEditVilla, openEditDialog, handleCloseEditDialog, handleUpdate }) {
    const [subdivisions, setSubdivisions] = useState([]);


    const handleEditChange = (prop) => (event) => {
        let value = event.target.value;

        // Convert value to number if the property is 'fluctuates_price' or 'stiff_price'
        if (prop === 'fluctuates_price' || prop === 'stiff_price') {
            value = parseFloat(value);
        }
        setEditVilla({ ...editVilla, [prop]: value });

    };


    useEffect(() => {
        fetchSubdivisions();
    }, []);

    const fetchSubdivisions = async () => {
        try {

            const token = localStorage.getItem('token'); // Lấy token từ localStorage


            const response = await fetch("http://localhost:5000/api/v1/subdivisions/", {
                headers: {
                    'Authorization': `Bearer ${token}`, // Thêm token vào header
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('data', data);
                setSubdivisions(Array.isArray(data.result) ? data.result : []);
            } else {
                console.error("Failed to fetch subdivisions" + response.status);
            }
        } catch (error) {
            console.error("Error fetching subdivisions:", error);
        }
    };

    return (
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
            <DialogTitle>Edit Villa</DialogTitle>
            <DialogContent>

                <TextField
                    margin="dense"
                    id="villa_name"
                    label="Villa Name"
                    type="text"
                    fullWidth
                    value={editVilla?.villa_name}
                    onChange={handleEditChange('villa_name')}
                    size="small"
                />
                <TextField
                    margin="dense"
                    id="start_date"
                    label="Start Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={editVilla?.start_date || ''}
                    onChange={handleEditChange('start_date')}
                />

                <TextField
                    margin="dense"
                    id="end_date"
                    label="End Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={editVilla?.end_date || ''}
                    onChange={handleEditChange('end_date')}
                />


                <TextField
                    margin="dense"
                    id="address"
                    label="address"
                    type="text"
                    fullWidth
                    value={editVilla?.address}
                    onChange={handleEditChange('address')}
                    size="small"
                />
                <TextField
                    margin="dense"
                    id="area"
                    label="Area"
                    type="text"
                    value={editVilla?.area}
                    onChange={handleEditChange('area')}
                    size="small"
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        name="status"
                        value={editVilla?.status}
                        onChange={handleEditChange('status')}
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
                    value={editVilla?.fluctuates_price}
                    onChange={handleEditChange('fluctuates_price')}
                />
                <TextField
                    margin="dense"
                    id="stiff_price"
                    label="Stiff Price"
                    type="number"
                    fullWidth
                    value={editVilla?.stiff_price}
                    onChange={handleEditChange('stiff_price')}
                />
                 <TextField
                    margin="dense"
                    id="url_image"
                    label="Image"
                    type="text"
                    fullWidth
                    value={editVilla?.url_image}
                    onChange={handleEditChange('url_image')}
                    size="small"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseEditDialog}>Cancel</Button>
                <Button onClick={handleUpdate}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditVillaDialog;
