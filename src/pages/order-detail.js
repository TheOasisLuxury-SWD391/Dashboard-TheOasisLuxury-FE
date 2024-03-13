import React, { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom'; 
import {
  Paper,
  Box,
  Typography,
  Grid,
  Button
} from '@mui/material';
import { toast } from 'react-toastify';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate(); 

  const [orderDetails, setOrderDetails] = useState(null);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    console.log('order ID:', orderId);
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data);
        } else {
          console.error('Failed to fetch contract details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching contract details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);



const handlePaid = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        status: 'COMPLETED',
        price: orderDetails.price, 
        order_name: orderDetails.order_name 
      })
    });
    if (response.ok) {
      console.log('Order marked as PAID successfully.');
      toast.success('Order marked as PAID successfully.');
      navigate('/order');
    } else {
      console.error('Failed to mark order as PAID:', response.status);
      toast.error('Failed to mark order as PAID');
    }
  } catch (error) {
    console.error('Error marking order as PAID:', error);
    toast.error('Error marking order as PAID');
  }
};


const handleCancelled = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        status: 'CANCELLED',
        price: orderDetails.price, 
        order_name: orderDetails.order_name 
      })
    });
    if (response.ok) {
      console.log('Order cancelled successfully.');
      toast.success('Order cancelled successfully.');
      navigate('/order');
    } else {
      console.error('Failed to cancel order:', response.status);
      toast.error('Failed to cancel order');
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    toast.error('Error cancelling order');
  }
};


  return (
    <Box className='mt-40 ml-40'>
      <Paper elevation={3} style={{ padding: '8px' }}>
        <Typography variant="h4" gutterBottom>
          Order Details
        </Typography>
   
        {orderDetails ? (
          <div>
            <Typography variant="h6" gutterBottom>
              Order Name: {orderDetails.order_name}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Invoice ID: {orderDetails.invoice_id}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Buyer's Name: {orderDetails.user.full_name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Insert Date: {new Date(orderDetails.insert_date).toLocaleString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Update Date: {new Date(orderDetails.update_date).toLocaleString()}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Price: {orderDetails.price}
            </Typography>
            <Box mt={8}>
              <Grid container spacing={8}> 
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handlePaid}>PAID</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={handleCancelled}>CANCELLED</Button>
                </Grid>
              </Grid>
            </Box>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Paper>
    </Box>
  );
};

export default OrderDetailsPage;
