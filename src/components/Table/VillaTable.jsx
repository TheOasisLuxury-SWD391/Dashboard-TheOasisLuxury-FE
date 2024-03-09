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
    TextField,
    Button
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateVillaDialog from '../Popup/CreateVilla';
import EditVillaDialog from '../Popup/EditVilla';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import CreateTimeShareDialog from '../Popup/CreateTimeShare';
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
        address: '',
        area: '',
        status: '',
        fluctuates_price: '',
        stiff_price: '',
        subdivision_name: ''
    });
    const [editVilla, setEditVilla] = useState(null); // State cho dự án đang chỉnh sửa
    const [openEditDialog, setOpenEditDialog] = useState(false); // State để mở và đóng dialog chỉnh sửa
    // const [searchTerm, setSearchTerm] = useState('');
    const [subdivisions, setSubdivisions] = useState([]);


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
                if (Array.isArray(data.result)) {
                    const villasWithDetails = [...data.result]; // Tạo một bản sao của mảng villas
            
                    for (let i = 0; i < villasWithDetails.length; i++) {
                        if (villasWithDetails[i].time_share_id) {
                            console.log('villa.time_share_id', villasWithDetails[i].time_share_id);
                            try {
                                const timeShareResponse = await fetch(`http://localhost:5000/api/v1/timeshares/${villasWithDetails[i].time_share_id}`, {
                                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                    },
                                });
                                if (timeShareResponse.ok) {
                                    const timeShareData = await timeShareResponse.json();
                                    villasWithDetails[i].timeShareDetails = timeShareData; // Cập nhật timeShareDetails vào bản sao
                                } else {
                                    console.error(`Failed to fetch timeshare for villa ${villasWithDetails[i]._id}`);
                                }
                            } catch (error) {
                                console.error(`Error fetching timeshare for villa ${villasWithDetails[i]._id}:`, error);
                            }
                        }
                    }
            
                    setVillas(villasWithDetails); // Cập nhật trạng thái với mảng đã cập nhật
                } else {
                    setVillas([]);
                }
            } else {
                console.error("Failed to fetch villas" + response.status);
            }
        } catch (error) {
            console.error("Error fetching villas:", error);
        }
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
                setVillas(prevVillas => [...prevVillas, addedVilla]);
                console.log("Villa added successfully");
                toast.success("Villa added successfully");
                // Check if time_share_id is created and patch it if needed
                if (addedVilla.time_share_id && newVilla.start_date && newVilla.end_date) {
                    patchTimeShare(addedVilla.time_share_id, newVilla.start_date, newVilla.end_date);
                }
            } else {
                console.error("Failed to add Villa");
                toast.error("Failed to add Villa");
            }
        } catch (error) {
            console.error("Error adding villa:", error);
            toast.error(`Error adding villa: ${error.message}`);
        }
        handleClose();
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
                toast.success("Villa deleted successfully");
            } else {
                // Handle different scenarios for unsuccessful deletion
                if (response.status === 401 || response.status === 403) {
                    console.error("Unauthorized: Check if the provided token is valid.");
                    toast.error("Unauthorized: Check if the provided token is valid.");
                } else {
                    const errorMessage = await response.text();
                    console.error(`Failed to delete villa. Server response: ${errorMessage}`);
                    toast.error(`Failed to delete villa. Server response: ${errorMessage}`);
                }
            }
        } catch (error) {
            console.error("Error deleting villa:", error.message);
            toast.error(`Error deleting villa: ${error.message}`);
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
                const updatedVilla = await response.json();
                fetchVillas();
                console.log("Villa update successfully");
                toast.success("Villa updated successfully");
                // Check if time_share_id exists and patch it if start_date and end_date were updated
                // if (updatedVilla.time_share_id && editVilla.start_date && editVilla.end_date) {
                //     patchTimeShare(updatedVilla.time_share_id, editVilla.start_date, editVilla.end_date);
                // }
                if (updatedVilla.time_share_id) {
                    const timeShareData = {
                        start_date: editVilla.start_date,
                        end_date: editVilla.end_date,
                    };
    
                    const timeShareResponse = await fetch(`http://localhost:5000/api/v1/timeshares/${updatedVilla.time_share_id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify(timeShareData),
                    });
    
                    if (timeShareResponse.ok) {
                        console.log("TimeShare updated successfully");
                        toast.success("TimeShare updated successfully");
                    } else {
                        console.error("Failed to update TimeShare");
                        toast.error("Failed to update TimeShare");
                    }
                }
    
                // Refresh dữ liệu sau khi cập nhật
                fetchVillas();
            } else {
                console.error("Failed to update Villa");
                toast.error("Failed to update Villa");
            }
        } catch (error) {
            console.error("Error updating Villa:", error);
            toast.error(`Error updating Villa: ${error.message}`);
        }
        handleCloseEditDialog();
    };

    const patchTimeShare = async (timeShareId, startDate, endDate) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:5000/api/v1/timeshares/${timeShareId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    start_date: startDate,
                    end_date: endDate,
                }),
            });

            if (response.ok) {
                console.log("TimeShare updated successfully");
                fetchVillas(); // Refresh the villas to show the updated time share data
            } else {
                console.error("Failed to update TimeShare");
                toast.error("Failed to update TimeShare");
            }
        } catch (error) {
            console.error("Error updating TimeShare:", error);
            toast.error(`Error updating TimeShare: ${error.message}`);
        }
    };

    const handleOpenEditDialog = (villa) => {
        const villaToEdit = {
            ...villa,
            start_date: villa.timeShareDetails?.result?.start_date,
            end_date: villa.timeShareDetails?.result?.end_date,
        };
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



    // const handleSearchChange = (event) => {
    //   setSearchTerm(event.target.value);
    // };
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

    const [searchTerm, setSearchTerm] = useState('');
    const filteredVillas = villas.filter(villa =>
        villa.villa_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (

        <Container maxWidth="md" sx={{}}>
            <Typography variant="h6">Villa List</Typography>
            <Box display="flex" justifyContent="flex-start" mb={2} >
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon style={{ color: '#707070' }} />
                            </InputAdornment>
                        ),
                        style: {
                            backgroundColor: 'white',
                            borderRadius: '4px',
                        },
                    }}
                    sx={{ width: '100%' }}
                />

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
                <Paper sx={{ width: '150%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 1200 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Address</TableCell>
                                    <TableCell>Subdivision Name</TableCell>
                                    <TableCell align="center">Area</TableCell>
                                    <TableCell>Start Date</TableCell>
                                    <TableCell>End Date</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell>Fluctuates Price</TableCell>
                                    <TableCell>Stiff Price</TableCell>
                                    <TableCell>Insert Date</TableCell>
                                    <TableCell>Update Date</TableCell>
                                    {/* <TableCell align="right">Chọn khoảng Timeshare</TableCell> */}
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredVillas.map((villa, index) => {
                                    const subdivision = subdivisions.find(p => p._id === villa.subdivision_id);
                                    // console.log('villa?.timeShareDetails?.result?.start_date',villa?.timeShareDetails?.result?.start_date);
                                    return (
                                        <TableRow key={villa._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell align="left" style={{ whiteSpace: 'nowrap' }} >{villa.villa_name || 'N/A'}</TableCell>

                                            <TableCell 
                                                align="left" 
                                                style={{ 
                                                    maxWidth: 150, 
                                                    overflow: 'hidden', 
                                                    textOverflow: 'ellipsis', 
                                                    whiteSpace: 'nowrap' 
                                                }}
                                                title={villa.address}>{villa.address || 'N/A'}</TableCell>
                                            <TableCell key={subdivision?._id} value={subdivision?._id} align="left">{subdivision?.subdivision_name}</TableCell>
                                            {/* <TableCell align="left" style={{ whiteSpace: 'nowrap' }} >{villa.address || 'N/A'}</TableCell> */}
                                            <TableCell 
                                                align="left" 
                                                style={{ 
                                                    maxWidth: 150, 
                                                    overflow: 'hidden', 
                                                    textOverflow: 'ellipsis', 
                                                    whiteSpace: 'nowrap' 
                                                }}
                                                title={villa.area}>
                                                    {villa.area || 'N/A'}
                                            </TableCell>
                                            <TableCell align="left"> 
                                                {villa?.timeShareDetails?.result?.start_date ? new Date(villa?.timeShareDetails?.result?.start_date).toLocaleString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                }) : 'N/A'}
                                            </TableCell>
                                            <TableCell align="left">
                                                {villa?.timeShareDetails?.result?.start_date ? new Date(villa?.timeShareDetails?.result?.end_date).toLocaleString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                }) : 'N/A'}
                                            </TableCell>

                                            <TableCell align="left">
                                                <span className="status" style={makeStyle(villa.status || 'INACTIVE')}>{villa.status || 'INACTIVE'}</span>
                                            </TableCell>
                                            <TableCell align="left">{villa.fluctuates_price || '0'}</TableCell>
                                            <TableCell align="left">{villa.stiff_price || '0'}</TableCell>
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
                                            <TableCell align="center">
                                                <div className="flex">
                                                    <IconButton onClick={() => handleOpenEditDialog(villa)}><EditIcon /></IconButton>
                                                    <IconButton onClick={() => handleDelete(villa._id)}><DeleteIcon /></IconButton>
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
            <ToastContainer />
        </Container>
    );
}