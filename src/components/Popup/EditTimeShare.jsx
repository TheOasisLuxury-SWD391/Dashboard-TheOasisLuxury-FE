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

function EditTimeShareDialog({ editTimeShare, setEditTimeShare, openEditDialog, handleCloseEditDialog, handleUpdate }) {

    const handleEditChange = (prop) => (event) => {
        setEditTimeShare({ ...editTimeShare, [prop]: event.target.value });
    };

    return (
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
            <DialogTitle>Edit TimeShare</DialogTitle>
            <DialogContent>

                <TextField
                    margin="dense"
                    id="time_share_name"
                    label="Time Share Name"
                    type="text"
                    fullWidth
                    value={editTimeShare?.time_share_name}
                    onChange={handleEditChange('time_share_name')}
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
                    value={editTimeShare?.start_date || ''}
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
                    value={editTimeShare?.end_date || ''}
                    onChange={handleEditChange('end_date')}
                />
                <TextField
                    margin="dense"
                    id="time_share_type"
                    label="time_share_type"
                    type="number"
                    fullWidth
                    value={editTimeShare?.time_share_type}
                    onChange={handleEditChange('time_share_type')}
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

export default EditTimeShareDialog;
