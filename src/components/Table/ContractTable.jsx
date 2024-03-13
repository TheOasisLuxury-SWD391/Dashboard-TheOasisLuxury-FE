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
  Button,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import DetailsIcon from '@mui/icons-material/Details';
export default function ContractTable() {

  const [contracts, setContracts] = useState([]);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/v1/users/new/getContracts", {
        headers: {
          'Authorization': `Bearer ${token}`, // Thêm token vào header
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('data', data);
        setContracts(Array.isArray(data.result) ? data.result : []);
      } else {
        console.error("Failed to fetch contracts" + response.status);
      }
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  const makeStyle = (status) => {
    if (status === 'APPROVED') {
      return {
        background: 'rgb(145 254 159 / 47%)',
        color: 'green',
      };
    } else if (status === 'REJECTED') {
      return {
        background: '#ffadad8f',
        color: 'red',
      };


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

  const filteredContracts = contracts.filter(contract =>
    (typeof contract.contract_name === 'string' && contract.contract_name.toLowerCase().includes(searchKeyword.toLowerCase()))
  );
  const handleDetailsClick = (contractId) => {
    // Use the navigate function to navigate to the details page
    navigate(`/details/${contractId}`);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); 

const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredContracts.slice(indexOfFirstItem, indexOfLastItem);

const handleNextPage = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

const handlePrevPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

const goToPage = (page) => {
  setCurrentPage(page);
};
const startNumber = (currentPage - 1) * itemsPerPage + 1;
  return (

    <Container maxWidth="md" sx={{}} className=''>
      <Typography variant="h6">Contract List</Typography>
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
        <Paper sx={{ width: '130%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>InsertDate</TableCell>
                  <TableCell>UpdateDate</TableCell>
                  <TableCell>Deflag</TableCell>

                  <TableCell align="center">Signature</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(currentItems) && currentItems.map((contract, index) => {
                  return (
                    <TableRow key={contract._id}>
                       <TableCell>{startNumber + index}</TableCell>
                      <TableCell align="left" style={{ whiteSpace: 'nowrap' }}>{contract.contract_name || 'N/A'}</TableCell>
                      <TableCell align="left">
                        {contract.insert_date
                          ? new Date(contract.insert_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                          : 'N/A'}
                      </TableCell>
                      <TableCell align="left">
                        {contract.update_date
                          ? new Date(contract.update_date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                          : 'N/A'}
                      </TableCell>
                      <TableCell align="left">{contract.deflag || 'false'}</TableCell>

                      <TableCell align="left">{contract.sign_contract || 'false'}</TableCell>
                      <TableCell align="center">
                        <span className="status" style={makeStyle(contract.status || '')}>{contract.status || ''}</span>
                      </TableCell>
                      <TableCell align="center">
                        <Button onClick={() => handleDetailsClick(contract._id)}>
                          Detail
                        </Button>
                      </TableCell>

                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

        </Paper>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</Button>
        {Array.from({ length: totalPages }).map((_, index) => (
          <Button key={index} onClick={() => goToPage(index + 1)}>{index + 1}</Button>
        ))}
        <Button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
      </div>
      <ToastContainer />
    </Container>
  );
}
