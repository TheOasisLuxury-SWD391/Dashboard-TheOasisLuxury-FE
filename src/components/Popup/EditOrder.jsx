import React from 'react';
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

function EditOrderDialog({ editOrder, setEditOrder, openEditDialog, handleCloseEditDialog, handleUpdate }) {

    const handleEditChange = (prop) => (event) => {
        setEditOrder({ ...editOrder, [prop]: event.target.value });
    };

    return (
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogContent>
                
                <TextField
                    margin="dense"
                    id="name"
                    label="Order Name"
                    type="text"
                    fullWidth
                    value={editOrder?.order_name}
                    onChange={handleEditChange('order_name')}
                    size="small"
                />
                <TextField
                 margin="dense"
                 id="price"
                 label="Price"
                 type="text"
                 fullWidth
                    value={editOrder?.price}
                    onChange={handleEditChange('price')}
                    size="small"
                />
              
              
                <FormControl fullWidth margin="dense">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        name="status"
                        value={editOrder?.status}
                        onChange={handleEditChange('status')}
                        label="Status"
                    >
                        <MenuItem value="PENDING">PENDING</MenuItem>
                        <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                        <MenuItem value="SUCCESS">SUCCESS</MenuItem>
                    </Select>
                </FormControl>
               
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseEditDialog}>Cancel</Button>
                <Button onClick={handleUpdate}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditOrderDialog;
