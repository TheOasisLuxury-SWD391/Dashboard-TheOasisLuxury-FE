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
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import DetailsIcon from '@mui/icons-material/Details';
import axios from 'axios';
export default function ContractTable() {

  const [contracts, setContracts] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [accountIdToDelete, setAccountIdToDelete] = useState(null);
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const userId = localStorage.getItem("user_id");
  const accessToken = localStorage.getItem("token");
  console.log('role', role);


  useEffect(() => {
    if (userId && accessToken) {
      axios.get(`http://localhost:5000/api/v1/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }).then((res) => {
        console.log("role", role);
        const userRole = res.data.user.role_name;
        setRole(userRole);
      }).catch((err) => {
        console.error(err);
      });
    }
  }, [userId, accessToken]);


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

    } else if (status === 'PENDING') {
      return {
        background: 'yellow',
        color: 'black',
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
  const handleDelete = async (contractId) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error("Token is missing. Unable to delete contract.");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/v1/users/contracts/${contractId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchContracts();
        console.log("Contract deleted successfully");
        toast.success("Contract deleted successfully");
      } else {

        if (response.status === 401 || response.status === 403) {
          console.error("Unauthorized: Check if the provided token is valid.");
        } else {

          const errorMessage = await response.text();
          console.error(`Failed to delete Contract. Server response: ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error("Error deleting order:", error.message);
      toast.error("Error deleting order");
    }
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
                  <TableCell>InsertDate</TableCell>
                  <TableCell>UpdateDate</TableCell>
                  {/* <TableCell>Deflag</TableCell> */}

                  <TableCell align="center">Signature</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Details</TableCell>
                  {role === 'ADMIN' && (
                    <TableCell align="center">Actions</TableCell>
                  )}
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
                      {/* <TableCell align="left">{contract.deflag || 'false'}</TableCell> */}

                      <TableCell align="left">{contract.sign_contract ? 'Đã Ký' : 'Chưa Ký' || 'false'}</TableCell>
                      <TableCell align="center">
                        <span className="status" style={makeStyle(contract.status || '')}>{contract.status || ''}</span>
                      </TableCell>
                      <TableCell align="center">
                        <div className="flex">
                          <Button onClick={() => handleDetailsClick(contract._id)}>
                            Detail
                          </Button>

                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div className="flex">
                          {role === 'ADMIN' && (
                            <IconButton onClick={() => handleDeleteClick(contract._id)}><DeleteIcon /></IconButton>
                          )}
                        </div>
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
