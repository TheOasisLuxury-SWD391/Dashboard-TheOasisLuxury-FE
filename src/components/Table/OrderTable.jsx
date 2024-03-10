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
  Typography,
  Button
} from '@mui/material';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
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

  const [searchKeyword, setSearchKeyword] = useState('');
  <Box display="flex" justifyContent="flex-end" mb={2}>
    <TextField
      label="Search"
      variant="outlined"
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
    />
  </Box>

  const filteredOrders = orders.filter(order =>
    (typeof order.order_name === 'string' && order.order_name.toLowerCase().includes(searchKeyword.toLowerCase())) ||
    (typeof order.price === 'string' && order.price.toLowerCase().includes(searchKeyword.toLowerCase()))
  );
  
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
                  <TableCell>Action</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(filteredOrders) && filteredOrders.map((order, index) => (
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
                    <TableCell align="left"><Button>ĐÃ THANH TOÁN</Button></TableCell>
                   

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
