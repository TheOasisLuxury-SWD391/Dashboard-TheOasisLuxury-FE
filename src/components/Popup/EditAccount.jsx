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

function EditAccountDialog({ editAccount, setEditAccount, openEditDialog, handleCloseEditDialog, handleUpdate }) {

    const handleEditChange = (prop) => (event) => {
        setEditAccount({ ...editAccount, [prop]: event.target.value });
    };

    return (
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    id="user_name"
                    label="User Name"
                    type="text"
                    fullWidth
                    value={editAccount?.user_name}
                    onChange={handleEditChange('user_name')}
                />
               
                <TextField
                    margin="dense"
                    id="birthday"
                    label="Birthday"
                    type="date"
                    fullWidth
                    value={editAccount?.birthday}
                    onChange={handleEditChange('birthday')}
                />
                <TextField
                    margin="dense"
                    id="phone_number"
                    label="Phone"
                    type="text"
                    fullWidth
                    value={editAccount?.phone_number}
                    onChange={handleEditChange('phone_number')}
                />
                 <FormControl fullWidth margin="dense">
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                        labelId="gender-label"
                        id="gender"
                        name="gender"
                        value={editAccount?.gender}
                        onChange={handleEditChange('gender')}
                        label="Gender"
                    >
                        <MenuItem value="OTHER">OTHER</MenuItem>
                        <MenuItem value="MALE">MALE</MenuItem> 
                        <MenuItem value="FEMALE">FEMALE</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    id="email"
                    label="Email"
                    type="text"
                    fullWidth
                    value={editAccount?.email}
                    onChange={handleEditChange('email')}
                />
                 <FormControl fullWidth margin="dense">
                    <InputLabel id="rolename-label">Role</InputLabel>
                    <Select
                        labelId="rolename-label"
                        id="rolename"
                        name="rolename"
                        value={editAccount?.role_name}
                        onChange={handleEditChange('role_name')}
                        label="Role"
                    >
                        <MenuItem value="STAFF">STAFF</MenuItem>
                        <MenuItem value="USER">USER</MenuItem>
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

export default EditAccountDialog;
