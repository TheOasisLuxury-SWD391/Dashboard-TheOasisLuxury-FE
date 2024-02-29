// CreateProjectDialog.js

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

const CreateAccountDialog = ({ open, handleClose, handleInputChange, setAccounts, accounts }) => {
    const [newAccount, setNewAccount] = useState({
        user_name: '',
        full_name:'',
        role_name: '',
        birthday: '',
        phone_number: '',
        gender:'',
        email: '',
    });

    const handleChange = (prop) => (event) => {
        setNewAccount({ ...newAccount, [prop]: event.target.value });
    };

    const handleAdd = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/v1/accounts/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newAccount),
            });
    
            if (response.ok) {
                const addedAccount = await response.json();
                setAccounts([...accounts, addedAccount]); // Update the state
                console.log("Account added successfully");
                toast.success("Account added successfully");
            } else {
                const errorData = await response.json();
                console.error("Failed to add Account", errorData);
                toast.error("Failed to add Account");
            }
        } catch (error) {
            console.error("Error adding Account:", error);
            toast.success("Account added successfully");
        }
        handleClose();
    };
    

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add New Account</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    id="user_name"
                    label="User Name"
                    type="text"
                    fullWidth
                    value={newAccount.user_name}
                    onChange={handleChange('user_name')}
                />
                <TextField
                    margin="dense"
                    id="full_name"
                    label="Name"
                    type="text"
                    fullWidth
                    value={newAccount.full_name}
                    onChange={handleChange('full_name')}
                />
               <TextField
                    margin="dense"
                    id="birthday"
                    label="Birthday"
                    type="date"
                    fullWidth
                    value={newAccount.birthday}
                    onChange={handleChange('birthday')}
                />
                <TextField
                    margin="dense"
                    id="phone_number"
                    label="Phone"
                    type="text"
                    fullWidth
                    value={newAccount.phone_number}
                    onChange={handleChange('phone_number')}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel id="gender-label">Gender</InputLabel>
                    <Select
                        labelId="gender-label"
                        id="gender"
                        name="gender"
                        value={newAccount.gender}
                        onChange={handleChange('gender')}
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
                    value={newAccount.email}
                    onChange={handleChange('email')}
                />
                 <FormControl fullWidth margin="dense">
                    <InputLabel id="rolename-label">Role</InputLabel>
                    <Select
                        labelId="rolename-label"
                        id="rolename"
                        name="rolename"
                        value={newAccount.role_name}
                        onChange={handleChange('role_name')}
                        label="Role"
                    >
                        <MenuItem value="STAFF">STAFF</MenuItem>
                        <MenuItem value="USER">USER</MenuItem>
                    </Select>
                </FormControl>
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

export default CreateAccountDialog;
