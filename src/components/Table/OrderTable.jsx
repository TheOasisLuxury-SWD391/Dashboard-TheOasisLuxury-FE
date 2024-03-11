import React from 'react';
import { useState, useEffect } from "react";
import {
  IconButton,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  TableHead,
  TableRow,
  Tooltip,
  Container,
  Box,
  Typography,
  DialogContentText,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

export default function OrderTable() {
  const makeStyle = (status) => {
    if (status === 'SUCCESS') {
      return {
        background: 'rgb(145 254 159 / 47%)',
        color: 'green',
      };
    } else if (status === 'CANCELLED') {
      return {
        background: '#ffadad8f',
        color: 'red',
      };
    } else if (status === 'PENDING') {
      return {
        background: 'yellow',
        color: 'black',
      };
    } else if (status === 'CONFIRMED') {
      return {
        background: 'orange',
        color: 'black',
      };
    } else if (status === 'COMPLETED') {
      return {
        background: 'green',
        color: 'black',
      };
    }
  };

  const [orders, setOrders] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [accountIdToDelete, setAccountIdToDelete] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false); // Define openEditDialog state here
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/v1/orders/", {
        headers: {
          'Authorization': `Bearer ${token}`, // Thêm token vào header
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('data', data);
        setOrders(Array.isArray(data.result) ? data.result : []);
      } else {
        console.error("Failed to fetch orders" + response.status);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const filteredOrders = orders.filter(order =>
    (typeof order.order_name === 'string' && order.order_name.toLowerCase().includes(searchKeyword.toLowerCase())) ||
    (typeof order.price === 'string' && order.price.toLowerCase().includes(searchKeyword.toLowerCase()))
  );

  const handleDetailsClick = (orderId) => {
    // Use the navigate function to navigate to the details page
    navigate(`${orderId}`);
  };

  const handleOpenEditDialog = (order) => {
    setEditOrder(order);
    setOpenEditDialog(true);
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

  const handleDelete = async (orderId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("Token is missing. Unable to delete order.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchOrders();
        console.log("order deleted successfully");
        toast.success("order deleted successfully");
      } else {

        if (response.status === 401 || response.status === 403) {
          console.error("Unauthorized: Check if the provided token is valid.");
        } else {

          const errorMessage = await response.text();
          console.error(`Failed to delete order. Server response: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error("Error deleting order:", error.message);
      toast.error("Error deleting order");
    }
  };

  return (
    <Container maxWidth="md" sx={{}} className=''>
      <Typography variant="h6">Order List</Typography>
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
      </Box>
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
        <Paper sx={{ width: '130%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>StartDate</TableCell>
                  <TableCell>EndDate</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell align="center">Invoice ID</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Detail</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(filteredOrders) && filteredOrders.map((order, index) => (
                  <TableRow key={order._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell 
                    style={{
                      maxWidth: 150,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={order.order_name || 'N/A'}
                    align="left" >{order.order_name || 'N/A'}</TableCell>

                    <TableCell align="left">
                      {order.start_date
                        ? new Date(order.start_date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="left">
                      {order.end_date
                        ? new Date(order.end_date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="left">{order.price || 'N/A'}</TableCell>
                    <TableCell align="left">{order.invoice_id || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <span className="status" style={makeStyle(order.status || 'INACTIVE')}>{order.status || 'INACTIVE'}</span>
                    </TableCell>
                    <TableCell align="left">{order.description || ''}</TableCell>
                    <TableCell align="center">
                      <Button onClick={() => handleDetailsClick(order._id)}>
                        Detail
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex">
                        <IconButton onClick={() => handleDeleteClick(order._id)}><DeleteIcon /></IconButton>
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
