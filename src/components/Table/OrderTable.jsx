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



export default function OrderTable() {

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


  

  return (

    <Container maxWidth="md" sx={{}}>
      <Typography variant="h6">Order List</Typography>
      <Box display="flex" justifyContent="flex-start" mb={2}>

      </Box>
     
      <div style={{ padding: '8px', width: '100%' }}>
        <Paper sx={{ width: '140%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>StartDate</TableCell>
                  <TableCell>EndDate</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Invoice ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Description</TableCell>
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
                    <TableCell align="left">{order.status || 'N/A'}</TableCell>
                    <TableCell align="left">{order.description || ''}</TableCell>
                    
                  
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
