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
import EditIcon from '@mui/icons-material/Edit';
import EditOrderDialog from '../Popup/EditOrder';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    }
  };
    const [orders, setOrders] = useState([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [editOrder, setEditOrder] = useState(null);
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
  const handleUpdate = async () => {
    console.log('editOrder', editOrder);
    try {
      const token = localStorage.getItem('token');

      const orderData = { ...editOrder };
      delete orderData._id;
      

      const response = await fetch(`http://localhost:5000/api/v1/orders/${editOrder._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      if (response.ok) {

        fetchOrders();
        console.log("Order update successfully");
        toast.success("Order update successfully");
      } else {
        console.error("Failed to update Order");
        toast.error("Failed to update Order");
      }
    } catch (error) {
      console.error("Error updating Order:", error);
      toast.error("Error updating Order:");
    }
    handleCloseEditDialog();
  };
  const handleOpenEditDialog = (order) => {
    setEditOrder(order);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditOrder(null);
  };


  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  

  return (

    <Container maxWidth="md" sx={{}} className='mt-12'>
      <Typography variant="h6">Order List</Typography>
      <Box display="flex" justifyContent="flex-start" mb={2}>

      </Box>
     
      <div style={{ padding: '8px', width: '100%' }}>
        <Paper sx={{ width: '150%', overflow: 'hidden' }}>
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
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(orders) && orders.map((order, index) => (
                  <TableRow key={order._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>{order.order_name || 'N/A'}</TableCell>

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
                        <div className="flex">
                          <IconButton onClick={() => handleOpenEditDialog(order)}><EditIcon /></IconButton>
                          
                        </div>
                      </TableCell>
                  
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

        </Paper>
      </div>
      <ToastContainer/>
    </Container>
  );
}
