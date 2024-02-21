import React from 'react';
import { useState, useEffect } from "react";
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
  Typography
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateAccountDialog from '../Popup/CreateAccount';
import EditAccountDialog from '../Popup/EditAccount';


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
  const [editAccount, setEditAccount] = useState(null); // State cho dự án đang chỉnh sửa
  const [openEditDialog, setOpenEditDialog] = useState(false); // State để mở và đóng dialog chỉnh sửa

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      const response = await fetch("http://localhost:5000/api/v1/accounts/", {
        headers: {
          'Authorization': `Bearer ${token}`, // Thêm token vào header
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('data', data);
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
        console.log("Account deleted successfully");
      } else {

        if (response.status === 401 || response.status === 403) {
          console.error("Unauthorized: Check if the provided token is valid.");
        } else {

          const errorMessage = await response.text();
          console.error(`Failed to delete Account. Server response: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error("Error deleting account:", error.message);
    }
  };


  const handleUpdate = async () => {
    console.log('editAccount', editAccount);
    try {
      const token = localStorage.getItem('token');

      const accountData = { ...editAccount };
      delete accountData._id;
      debugger;

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
        console.log("Account update successfully");
      } else {
        console.error("Failed to update Account");
      }
    } catch (error) {
      console.error("Error updating Account:", error);
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
        setAccounts([...accounts, addedAccount]); // Update the state
        console.log("Account added successfully");
      } else {
        console.error("Failed to add Account");
      }
    } catch (error) {
      console.error("Error adding Account:", error);
    }
    handleClose();
  };

  return (

    <Container maxWidth="md" sx={{}}>
      <Typography variant="h6">Account List</Typography>
      <Box display="flex" justifyContent="flex-start" mb={2}>
        <Tooltip title="Add New Account">
          <IconButton color="primary" onClick={handleClickOpen}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>

      </Box>
      <CreateAccountDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        handleAccountAdd={handleAdd} />
      <EditAccountDialog
        editAccount={editAccount}
        setEditAccount={setEditAccount}
        openEditDialog={openEditDialog}
        handleCloseEditDialog={handleCloseEditDialog}
        handleUpdate={handleUpdate} />
      <div style={{ padding: '8px', width: '100%' }}>
        <Paper sx={{ width: '140%', overflow: 'hidden' }}>

          <TableContainer>
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
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(accounts) && accounts.map((account, index) => (
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
                        <IconButton onClick={() => handleDelete(account._id)}><DeleteIcon /></IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Paper>
      </div>
    </Container>
  );
}
