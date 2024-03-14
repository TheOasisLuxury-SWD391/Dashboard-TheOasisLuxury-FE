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
import CreateTimeShareDialog from '../../Popup/CreateTimeShare';
import EditTimeShareDialog from '../../Popup/EditTimeShare';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import TimeShareRow from './TimeshareTree'
export default function TimeShareTable() {
   
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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
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

    const totalPages = Math.ceil(filteredTimeShares.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTimeShares.slice(indexOfFirstItem, indexOfLastItem);

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
            {role === 'ADMIN' && (
                <CreateTimeShareDialog
                    open={openDialog}
                    handleClose={() => setOpenDialog(false)}
                    handleTimeShareAdd={handleAdd}
                />
            )}
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
                                    {/* <TableCell align="center">Type</TableCell> */}
                                    {role === 'ADMIN' && (
                                        <TableCell align="left">Actions</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentItems.map((timeshare, index) => (
                                    <TimeShareRow timeshare={timeshare} key={timeshare._id} index={index + 1} level={0}/>
                                ))}
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