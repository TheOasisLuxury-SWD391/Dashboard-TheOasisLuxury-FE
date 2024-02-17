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
  Box
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateSubdivisionDialog from '../Popup/CreateSubdivision';
import EditSubdivisionDialog from '../Popup/EditSubdivision';

export default function SubdivisionTable() {
  const makeStyle = (status) => {
    if (status === 'ACTIVE') {
      return {
        background: 'rgb(145 254 159 / 47%)',
        color: 'green',
      }
    }
    else if (status === 'INACTIVE') {
      return {
        background: '#ffadad8f',
        color: 'red',
      }
    }
  }
  const [subdivisions, setSubdivisions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newSubdivision, setNewSubdivision] = useState({
    name: '',
    location: '',
    insertDate: '',
    updateDate: '',
    quantityVilla: '',
    status: '',
    projectId: '',
  });
  const [editSubdivision, setEditSubdivision] = useState(null); // State cho dự án đang chỉnh sửa
  const [openEditDialog, setOpenEditDialog] = useState(false); // State để mở và đóng dialog chỉnh sửa
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubdivisions();
  }, []);

  const fetchSubdivisions = async () => {
    try {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      const response = await fetch("http://localhost:5000/api/v1/subdivisions/", {
        headers: {
          'Authorization': `Bearer ${token}`, // Thêm token vào header
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('data', data);
        setSubdivisions(Array.isArray(data.result) ? data.result : []);
      } else {
        console.error("Failed to fetch subdivisions" + response.status);
      }
    } catch (error) {
      console.error("Error fetching subdivisions:", error);
    }
  };


  const handleDelete = async (subdivionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/subdivions/${subdivionId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`, // Thêm token vào header
        },
      });
      if (response.ok) {
        fetchSubdivisions(); 
        console.log("Subdivision deleted successfully");
      } else {
        console.error("Failed to delete subdivision");
      }
    } catch (error) {
      console.error("Error deleting subdivision:", error);
    }
  };
  
  const handleUpdate = async () => {
    console.log('editSubdivision', editSubdivision);
    try {
      const token = localStorage.getItem('token');

      const subdivisionData = { ...editSubdivision };
      delete subdivisionData._id;
      debugger;

      const response = await fetch(`http://localhost:5000/api/v1/subdivisions/${editSubdivision._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subdivisionData),
      });
      if (response.ok) {

        fetchSubdivisions();
        console.log("Subdivision update successfully");
      } else {
        console.error("Failed to update Subdivision");
      }
    } catch (error) {
      console.error("Error updating Subdivision:", error);
    }
    handleCloseEditDialog();
  };
  const handleOpenEditDialog = (subdivion) => {
    setEditSubdivision(subdivion);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditSubdivision(null);
  };


  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleChange = (prop) => (event) => {
    setNewSubdivision({ ...newSubdivision, [prop]: event.target.value });
  };

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/subdivisions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newSubdivision),
      });

      if (response.ok) {
        const addedSubdivision = await response.json();
        setSubdivisions([...subdivisions, addedSubdivision]); // Update the state
        console.log("Subdivision added successfully");
      } else {
        console.error("Failed to add Subdivision");
      }
    } catch (error) {
      console.error("Error adding subdivision:", error);
    }
    handleClose();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Tooltip title="Add New Subdivision">
          <IconButton color="primary" onClick={handleClickOpen}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <CreateSubdivisionDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        handleSubdivisionAdd={handleAdd}
      />
      <EditSubdivisionDialog
        editSubdivision={editSubdivision}
        setEditSubdivision={setEditSubdivision}
        openEditDialog={openEditDialog}
        handleCloseEditDialog={handleCloseEditDialog}
        handleUpdate={handleUpdate}
      />
   <div style={{ padding: '24px', width: '100%' }}>
        <Paper sx={{ width: '120%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  {/* <TableCell>ID</TableCell> */}
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Insert Date</TableCell>
                  <TableCell>Update Date</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>ProjectID</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {Array.isArray(subdivisions) && subdivisions.map((subdivision, index) => (
                  <TableRow key={subdivision._id}>
                    <TableCell>{index + 1}</TableCell>
                    {/* <TableCell align="left">{subdivision.subdivionId}</TableCell> */}
                    <TableCell align="left" >{subdivision.subdivision_name || 'N/A'}</TableCell>
                    <TableCell align="left" >{subdivision.location || 'N/A'}</TableCell>
                    <TableCell align="left" >{subdivision.insert_date || 'N/A'}</TableCell>
                    <TableCell align="left" >{subdivision.update_date || 'N/A'}</TableCell>
                    <TableCell align="left">{subdivision.quantityVilla || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <span className="status" style={makeStyle(subdivision.status || 'N/A')}>{subdivision.status || 'N/A'}</span>
                    </TableCell>
                    <TableCell align="left">{subdivision.project_id || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <div className="flex">
                        <IconButton onClick={() => handleOpenEditDialog(subdivision)}><EditIcon /></IconButton>
                        <IconButton onClick={() => handleDelete(subdivision._id)}><DeleteIcon /></IconButton>
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