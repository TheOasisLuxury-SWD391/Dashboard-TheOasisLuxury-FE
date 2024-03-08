import React, { useState , useEffect } from "react";
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
        setEditVilla({ ...editVilla, [prop]: event.target.value });
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
                {/* <FormControl fullWidth margin="dense">
    <InputLabel id="subdivision-label">Subdivision Name</InputLabel>
    <Select
        labelId="subdivision-label"
        id="subdivision_id"
        value={editVilla?.subdivision_id}
        onChange={handleEditChange('subdivision_id')}
        label="Subdivision"
    >
        {Array.isArray(subdivisions) && subdivisions.map((subdivision, index) => (
            <MenuItem key={subdivision?._id} value={subdivision?._id}>
                {subdivision?.subdivision_name} 
            </MenuItem>
        ))}
    </Select>
</FormControl> */}

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
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseEditDialog}>Cancel</Button>
                <Button onClick={handleUpdate}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditVillaDialog;
