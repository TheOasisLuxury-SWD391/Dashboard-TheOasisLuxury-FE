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

function EditSubdivisionDialog({ editSubdivision, setEditSubdivision, openEditDialog, handleCloseEditDialog, handleUpdate }) {

    const handleEditChange = (prop) => (event) => {
        setEditSubdivision({ ...editSubdivision, [prop]: event.target.value });
    };

    return (
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
            <DialogTitle>Edit Subdivision</DialogTitle>
            <DialogContent>
                
                <TextField
                    margin="dense"
                    id="name"
                    label="Subdivision Name"
                    type="text"
                    fullWidth
                    value={editSubdivision?.subdivision_name}
                    onChange={handleEditChange('subdivision_name')}
                    size="small"
                />
                <TextField
                 margin="dense"
                 id="location"
                 label="Location"
                 type="text"
                 fullWidth
                    value={editSubdivision?.location}
                    onChange={handleEditChange('location')}
                    size="small"
                />
                <TextField
                 margin="dense"
                 id="insert_date"
                 label="Insert Date"
                    type="date"
                    fullWidth
                    value={editSubdivision?.insert_date}
                    onChange={handleEditChange('insert_date')}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                 margin="dense"
                 id="update_date"
                 label="Update Date"
                    type="date"
                    fullWidth
                    value={editSubdivision?.update_date}
                    onChange={handleEditChange('update_date')}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                />
              
                <FormControl fullWidth margin="dense">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        name="status"
                        value={editSubdivision?.status}
                        onChange={handleEditChange('status')}
                        label="Status"
                    >
                        <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                        <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  id="project_id"
                  label="ProjectId"
                    type="text"
                    value={editSubdivision?.project_id}
                    onChange={handleEditChange('project_id')}
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

export default EditSubdivisionDialog;
