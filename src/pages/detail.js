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

const DetailsPage = () => {
  const { contractId } = useParams();
  const navigate = useNavigate(); 

  const [contractDetails, setContractDetails] = useState(null);
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    console.log('Contract ID:', contractId);
    const fetchContractDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/v1/users/contracts/${contractId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Thêm token vào header
          },
        });
        if (response.ok) {
          const data = await response.json();
          setContractDetails(data);
        } else {
          console.error('Failed to fetch contract details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching contract details:', error);
      }
    };

    fetchContractDetails();
  }, [contractId]);

  useEffect(() => {
    if (contractDetails) {
      const insertDate = new Date(contractDetails.insert_date);
      const expiryDate = new Date(insertDate.getTime() + 24 * 60 * 60 * 1000);
      const updateCountdown = () => {
        const now = new Date();
        const timeLeft = expiryDate - now;

        if (timeLeft <= 0) {
          // Khi thời gian đếm ngược kết thúc
          setCountdown('Expired');
          if (!contractDetails.sign_contract) {
            handleAutoReject();
          }
        } else {
          // Cập nhật đồng hồ đếm ngược
          setCountdown(new Date(timeLeft).toISOString().substr(11, 8));
        }
      };

      updateCountdown();
      const intervalId = setInterval(updateCountdown, 1000);

      return () => clearInterval(intervalId);
    }
  }, [contractDetails]);

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/users/confirm-contract/${contractId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: 'APPROVED' }) 
      });
      if (response.ok) {
        console.log('Contract confirmed successfully.');
        navigate('/contracts');
        toast.success('Contract confirmed successfully');
     
      } else {
        console.error('Failed to confirm contract:', response.status);
        toast.error('Failed to confirm contract:');
      }
    } catch (error) {
      console.error('Error confirming contract:', error);
      toast.error('Error confirming contract');
    }
  };

  const handleAutoReject = async () => {
    try {
      const token = localStorage.getItem('token');
      // Cập nhật trạng thái của hợp đồng thành 'REJECTED'
      const contractResponse = await fetch(`http://localhost:5000/api/v1/users/confirm-contract/${contractId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: 'REJECTED' })
      });
  
      if (contractResponse.ok) {
        console.log('Contract auto-rejected successfully.');
  
        // Cập nhật trạng thái của đơn hàng liên quan thành 'CANCELLED'
        if (contractDetails.order_id) {
          const orderResponse = await fetch(`http://localhost:5000/api/v1/orders/${contractDetails.order_id}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`, 
              'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ status: 'CANCELLED' })
          });
  
          if (orderResponse.ok) {
            console.log('Order status updated to CANCELLED.');
          } else {
            console.error('Failed to update order status:', orderResponse.status);
          }
        }
      } else {
        console.error('Failed to auto-reject contract:', contractResponse.status);
      }
    } catch (error) {
      console.error('Error during auto-reject process:', error);
    }
  };
  

  const handleReject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/users/confirm-contract/${contractId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ status: 'REJECTED' })
      });
      if (response.ok) {
        console.log('Contract rejected successfully.');
        navigate('/contracts');
        toast.success('Contract rejected successfully.');
      } else {
        console.error('Failed to reject contract:', response.status);
        toast.error('Failed to reject contract:')
      }
    } catch (error) {
      console.error('Error rejecting contract:', error);
      toast.error('Failed to reject contract:')
    }
  };

  return (
    <Box className='mt-40 ml-40'>
      <Paper elevation={3} style={{ padding: '8px' }}>
        <Typography variant="h4" gutterBottom>
          Contract Details
        </Typography>
        <div> Thời hạn ký hợp đồng này sau:  {countdown && <p>Time left: {countdown}</p>}</div>
        {contractDetails ? (
          <div>
            <Typography variant="h6" gutterBottom>
              Contract Name: {contractDetails.contract_name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Insert Date: {new Date(contractDetails.insert_date).toLocaleString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Sign Contract: {contractDetails.sign_contract ? 'true' : 'false'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Update Date: {new Date(contractDetails.update_date).toLocaleString()}
            </Typography>
            <img src={contractDetails.url_image}/>
            <Box mt={8}>
              <Grid container spacing={8}> 
                <Grid item>
                  <Button variant="contained" color="primary" onClick={handleConfirm}>APPROVED</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary" onClick={handleReject}>REJECTED</Button>
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

export default DetailsPage;
