import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Container,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateAccountDialog from '../Popup/CreateAccount';
import EditAccountDialog from '../Popup/EditAccount';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

export default function AccountTable() {
  const [accounts, setAccounts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAccount, setNewAccount] = useState({
    user_name: '',
    role_name: '',
    birthday: '',
    phone_number: '',
    gender:'',
    email: '',
  });
  const [editAccount, setEditAccount] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [accountIdToDelete, setAccountIdToDelete] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/v1/accounts/", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccounts(Array.isArray(data.result) ? data.result : []);
      } else {
        console.error("Failed to fetch accounts" + response.status);
      }
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const handleDelete = async (accountId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("Token is missing. Unable to delete account.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/v1/accounts/${accountId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchAccounts();
        toast.success("Account deleted successfully");
      } else {
        if (response.status === 401 || response.status === 403) {
          console.error("Unauthorized: Check if the provided token is valid.");
          toast.error("Deleting the Admin account is not allowed");
        } else {
          const errorMessage = await response.text();
          console.error(`Failed to delete Account. Server response: ${errorMessage}`);
          toast.error("Failed to delete Account.")
        }
      }
    } catch (error) {
      console.error("Error deleting account:", error.message);
      toast.error("Error deleting account")
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const accountData = { ...editAccount };
      delete accountData._id;

      const response = await fetch(`http://localhost:5000/api/v1/accounts/${editAccount._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(accountData),
      });

      if (response.ok) {
        fetchAccounts();
        toast.success("Account updated successfully");
      } else {
        console.error("Failed to update Account");
        toast.error("Failed to update Account");
      }
    } catch (error) {
      console.error("Error updating Account:", error);
      toast.error("Error updating Account");
    }
    handleCloseEditDialog();
  };

  const handleOpenEditDialog = (account) => {
    setEditAccount(account);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditAccount(null);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

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
        setAccounts([...accounts, addedAccount]);
        toast.success("Account added successfully");
      } else {
        console.error("Failed to add Account");
        toast.error("Failed to add Account");
      }
    } catch (error) {
      console.error("Error adding Account:", error);
      toast.error("Error adding Account:");
    }
    handleClose();
  };

  const handleOpenConfirmDelete = (accountId) => {
    setAccountIdToDelete(accountId);
    setConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDelete(false);
  };

  const handleDeleteClick = (accountId) => {
    handleOpenConfirmDelete(accountId);
  };

  const filteredAccounts = accounts.filter(account =>
    account.full_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    account.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    account.user_name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <Container maxWidth="md">
      <Typography variant="h6">Account List</Typography>
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          InputProps={{
            style: { 
              backgroundColor: 'white', 
              borderRadius: '4px', 
            },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: '#707070' }} /> 
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ 
            style: { color: '#707070' } 
          }}
          fullWidth
          size="medium"
          style={{ marginBottom: '16px' }} 
        />

        <Tooltip title="Add New Account">
          <IconButton color="primary" onClick={handleClickOpen}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <CreateAccountDialog
        open={openDialog}
        handleClose={handleClose}
        handleAccountAdd={handleAdd} />
      
      <EditAccountDialog
        editAccount={editAccount}
        setEditAccount={setEditAccount}
        openEditDialog={openEditDialog}
        handleCloseEditDialog={handleCloseEditDialog}
        handleUpdate={handleUpdate} />

      <Dialog
        open={confirmDelete}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc muốn xóa không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {
            handleDelete(accountIdToDelete);
            handleCloseConfirmDelete();
          }} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ padding: '8px', width: '100%' }}>
        <Paper sx={{ width: '150%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>BirthDay</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(filteredAccounts) && filteredAccounts.map((account, index) => (
                  <TableRow key={account._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>{account.full_name || 'N/A'}</TableCell>
                    <TableCell align="left">
                      {account.birthday
                        ? new Date(account.birthday).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="left">{account.phone_number || 'N/A'}</TableCell>
                    <TableCell align="left">{account.gender || 'N/A'}</TableCell>
                    <TableCell align="left">{account.email || 'N/A'}</TableCell>
                    <TableCell align="left">{account.user_name || 'N/A'}</TableCell>
                    <TableCell align="left">{account.role_name || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <div className="flex">
                        <IconButton onClick={() => handleOpenEditDialog(account)}><EditIcon /></IconButton>
                        <IconButton onClick={() => handleDeleteClick(account._id)}><DeleteIcon /></IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
      <ToastContainer />
    </Container>
  );
}
