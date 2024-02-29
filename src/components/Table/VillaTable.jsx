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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateVillaDialog from '../Popup/CreateVilla';
import EditVillaDialog from '../Popup/EditVilla';

export default function VillaTable() {
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
    const [villas, setVillas] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newVilla, setNewVilla] = useState({
        villa_name: '',
        insert_date: '',
        update_date: '',
        address: '',
        area: '',
        status: '',
        fluctuates_price: '',
        stiff_price: '',
    });
    const [editVilla, setEditVilla] = useState(null); // State cho dự án đang chỉnh sửa
    const [openEditDialog, setOpenEditDialog] = useState(false); // State để mở và đóng dialog chỉnh sửa
    // const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchVillas();
    }, []);

    const fetchVillas = async () => {
        try {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage
            const response = await fetch("http://localhost:5000/api/v1/villas/", {
                headers: {
                    'Authorization': `Bearer ${token}`, // Thêm token vào header
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('data', data);
                setVillas(Array.isArray(data.result) ? data.result : []);
            } else {
                console.error("Failed to fetch villas" + response.status);
            }
        } catch (error) {
            console.error("Error fetching villas:", error);
        }
    };


    const handleDelete = async (villaId) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error("Token is missing. Unable to delete villa.");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/v1/villas/${villaId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                fetchVillas();
                console.log("Villa deleted successfully");
            } else {

                if (response.status === 401 || response.status === 403) {
                    console.error("Unauthorized: Check if the provided token is valid.");
                } else {

                    const errorMessage = await response.text();
                    console.error(`Failed to delete villa. Server response: ${errorMessage}`);
                }
            }
        } catch (error) {
            console.error("Error deleting villa:", error.message);
        }
    };


    const handleUpdate = async () => {
        console.log('editVilla', editVilla);
        try {
            const token = localStorage.getItem('token');

            const villaData = { ...editVilla };
            delete villaData._id;
             

            const response = await fetch(`http://localhost:5000/api/v1/villas/${editVilla._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(villaData),
            });
            if (response.ok) {

                fetchVillas();
                console.log("Villa update successfully");
            } else {
                console.error("Failed to update Villa");
            }
        } catch (error) {
            console.error("Error updating Villa:", error);
        }
        handleCloseEditDialog();
    };
    const handleOpenEditDialog = (villa) => {
        setEditVilla(villa);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditVilla(null);
    };


    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };
    const handleChange = (prop) => (event) => {
        setNewVilla({ ...newVilla, [prop]: event.target.value });
    };

    const handleAdd = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/v1/villas/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newVilla),
            });

            if (response.ok) {
                const addedVilla = await response.json();
                setVillas([...villas, addedVilla]); 
                console.log("Villa added successfully");
            } else {
                console.error("Failed to add Villa");
            }
        } catch (error) {
            console.error("Error adding villa:", error);
        }
        handleClose();
    };

    // const handleSearchChange = (event) => {
    //   setSearchTerm(event.target.value);
    // };
    return (

        <Container maxWidth="md" sx={{}}>
            <Typography variant="h6">Villa List</Typography>
            <Box display="flex" justifyContent="flex-start" mb={2} >
                <Tooltip title="Add New Villa">
                    <IconButton color="primary" onClick={handleClickOpen}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Tooltip>

            </Box>
            <CreateVillaDialog
                open={openDialog}
                handleClose={() => setOpenDialog(false)}
                handleVillaAdd={handleAdd}
            />
            <EditVillaDialog
                editVilla={editVilla}
                setEditVilla={setEditVilla}
                openEditDialog={openEditDialog}
                handleCloseEditDialog={handleCloseEditDialog}
                handleUpdate={handleUpdate}
            />
            <div style={{ padding: '16px', width: '100%' }}>
                <Paper sx={{ width: '140%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 400 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Insert Date</TableCell>
                                    <TableCell>Update Date</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Area</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Fluctuates Price</TableCell>
                                    <TableCell>Stiff Price</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(villas) && villas.map((villa, index) => (
                                    <TableRow key={villa._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell align="left" style={{ whiteSpace: 'nowrap' }} >{villa.villa_name || 'N/A'}</TableCell>

                                        <TableCell align="left" >
                                            {villa.insert_date
                                                ? new Date(villa.insert_date).toLocaleString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell align="left">
                                            {villa.update_date
                                                ? new Date(villa.update_date).toLocaleString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell align="left" style={{ whiteSpace: 'nowrap' }} >{villa.address || 'N/A'}</TableCell>
                                        <TableCell align="left">{villa.area || 'N/A'}</TableCell>
                                        <TableCell align="left">
                                            <span className="status" style={makeStyle(villa.status || 'INACTIVE')}>{villa.status || 'INACTIVE'}</span>
                                        </TableCell>
                                        <TableCell align="left">{villa.fluctuates_price || 'N/A'}</TableCell>
                                        <TableCell align="left">{villa.stiff_price || 'N/A'}</TableCell>
                                        <TableCell align="center">
                                            <div className="flex">
                                                <IconButton onClick={() => handleOpenEditDialog(villa)}><EditIcon /></IconButton>
                                                <IconButton onClick={() => handleDelete(villa._id)}><DeleteIcon /></IconButton>
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