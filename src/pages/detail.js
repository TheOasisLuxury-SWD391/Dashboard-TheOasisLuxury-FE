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
