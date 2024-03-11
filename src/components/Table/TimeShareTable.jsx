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
    DialogTitle,
    DialogContent,
    DialogActions,
    Dialog,
    DialogContentText,
    Button,
    Typography,
    TextField
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateTimeShareDialog from '../Popup/CreateTimeShare';
import EditTimeShareDialog from '../Popup/EditTimeShare';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
export default function TimeShareTable() {
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
    const [timeshares, setTimeShares] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [newTimeShare, setNewTimeShare] = useState({
        time_share_name: '',
        time_share_type: 0,
    });
    const [editTimeShare, setEditTimeShare] = useState(null); // State cho dự án đang chỉnh sửa
    const [openEditDialog, setOpenEditDialog] = useState(false); // State để mở và đóng dialog chỉnh sửa
    // const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [accountIdToDelete, setAccountIdToDelete] = useState(null);
    useEffect(() => {
        fetchTimeShares();
    }, []);

    const fetchTimeShares = async () => {
        try {
            const token = localStorage.getItem('token'); // Lấy token từ localStorage
            const response = await fetch("http://localhost:5000/api/v1/timeshares/", {
                headers: {
                    'Authorization': `Bearer ${token}`, // Thêm token vào header
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('data', data);
                setTimeShares(Array.isArray(data.result) ? data.result : []);
            } else {
                console.error("Failed to fetch TimeShares" + response.status);
            }
        } catch (error) {
            console.error("Error fetching TimeShares:", error);
        }
    };


    const handleDelete = async (timeshareId) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error("Token is missing. Unable to delete timeshare.");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/v1/timeshares/${timeshareId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                fetchTimeShares();
                console.log("TimeShare deleted successfully");
                toast.success("TimeShare deleted successfully");
            } else {

                if (response.status === 401 || response.status === 403) {
                    console.error("Unauthorized: Check if the provided token is valid.");
                } else {

                    const errorMessage = await response.text();
                    console.error(`Failed to delete timeshare. Server response: ${errorMessage}`);
                    toast.error("Failed to delete timeshare")
                }
            }
        } catch (error) {
            console.error("Error deleting timeshare:", error.message);
        }
    };


    const handleUpdate = async () => {
        console.log('edittimeshare', editTimeShare);
        try {
            const token = localStorage.getItem('token');

            const timeshareData = { ...editTimeShare };
            delete timeshareData._id;
            const response = await fetch(`http://localhost:5000/api/v1/timeshares/${editTimeShare._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(timeshareData),
            });
            if (response.ok) {

                fetchTimeShares();
                console.log("TimeShare update successfully");
                toast.success("TimeShare update successfully")
            } else {
                console.error("Failed to update TimeShare");
                toast.error("Failed to update TimeShare")
            }
        } catch (error) {
            console.error("Error updating TimeShare:", error);
            toast.error("Error updating TimeShare")
        }
        handleCloseEditDialog();
    };
    const handleOpenEditDialog = (timeshare) => {
        setEditTimeShare(timeshare);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditTimeShare(null);
    };


    const handleClickOpen = () => {
        setOpenDialog(true);
    };

    const handleClose = () => {
        setOpenDialog(false);
    };
    const handleChange = (prop) => (event) => {
        setNewTimeShare({ ...newTimeShare, [prop]: event.target.value });
    };

    const handleAdd = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/v1/timeshares/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newTimeShare),
            });

            if (response.ok) {
                const addedTimeShare = await response.json();
                setTimeShares([...timeshares, addedTimeShare]);
                console.log("timeshare added successfully");
                toast.success("Timeshare added successfully")
            } else {
                console.error("Failed to add timeshare");
                toast.error("Failed to add timeshare");
            }
        } catch (error) {
            console.error("Error adding timeshare:", error);
            toast.success("Timeshare added successfully");
        }
        handleClose();
    };
    const [searchTerm, setSearchTerm] = useState('');
    const filteredTimeShares = timeshares.filter(timeshare =>
        timeshare.time_share_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

    return (

        <Container maxWidth="md" sx={{}}>
            <Typography variant="h6">Time Share List</Typography>
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
                <Tooltip title="Add New TimeShare">
                    <IconButton color="primary" onClick={handleClickOpen}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Tooltip>

            </Box>
            <CreateTimeShareDialog
                open={openDialog}
                handleClose={() => setOpenDialog(false)}
                handleTimeShareAdd={handleAdd}
            />
            <EditTimeShareDialog
                editTimeShare={editTimeShare}
                setEditTimeShare={setEditTimeShare}
                openEditDialog={openEditDialog}
                handleCloseEditDialog={handleCloseEditDialog}
                handleUpdate={handleUpdate}
            />
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
            <div style={{ padding: '16px', width: '100%' }}>
                <Paper sx={{ width: '130%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>StartDate</TableCell>
                                    <TableCell>EndDate</TableCell>
                                    <TableCell>Deflag</TableCell>
                                    <TableCell align="center">Type</TableCell>

                                    <TableCell align="left">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTimeShares.map((timeshare, index) => (
                                    <TableRow key={timeshare._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell 
                                            align="left"  
                                            style={{
                                                    maxWidth: 150,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            title={timeshare.time_share_name} 
                                        >
                                            {timeshare.time_share_name || 'N/A'}
                                        </TableCell>

                                        <TableCell align="left" >
                                            {timeshare.start_date
                                                ? new Date(timeshare.start_date).toLocaleString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell align="left">
                                            {timeshare.end_date
                                                ? new Date(timeshare.end_date).toLocaleString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })
                                                : 'N/A'}
                                        </TableCell>

                                        <TableCell align="left">
                                            <span className="deflag" style={makeStyle(timeshare.deflag || 'FALSE')}>{timeshare.deflag || 'FALSE'}</span>
                                        </TableCell>
                                        <TableCell align="center">{timeshare.time_share_type || '0'}</TableCell>

                                        <TableCell align="center">
                                            <div className="flex">
                                                <IconButton onClick={() => handleOpenEditDialog(timeshare)}><EditIcon /></IconButton>
                                                <IconButton onClick={() => handleDeleteClick(timeshare._id)}><DeleteIcon /></IconButton>
                                            </div>
                                        </TableCell>
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