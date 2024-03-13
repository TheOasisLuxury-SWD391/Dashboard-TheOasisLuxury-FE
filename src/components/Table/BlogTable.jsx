import React, { useState, useEffect } from 'react';
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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CreateBlogDialog from '../Popup/CreateBlog';
import axios from 'axios';
export default function BlogTable() {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [blogs, setBlogs] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [accountIdToDelete, setAccountIdToDelete] = useState(null);
    const [newBlog, setNewBlog] = useState({
        user_id: '',
        title:'',
        description_detail:''
    });
    const [editBlog, setEditBlog] = useState(null);
    const [role, setRole] = useState("");
    const userId = localStorage.getItem("user_id");
    const accessToken = localStorage.getItem("token");
    console.log('role',role);
  
  
    useEffect(() => {
      if (userId && accessToken) { 
        axios.get(`http://localhost:5000/api/v1/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }).then((res) => {
          console.log("role",role);
          const userRole = res.data.user.role_name;
          setRole(userRole);
          console.log('Login successful');
          toast.success("Login successful");
        }).catch((err) => {
          console.error(err);
          toast.error("Login failed");
        });
      }
    }, [userId, accessToken]); 
    
    
    const handleOpenEditDialog = (blog) => {
        setEditBlog(blog);
        setOpenEditDialog(true);
      };
    
      const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setEditBlog(null);
      };
    
      const handleClickOpen = () => {
        setOpenDialog(true);
      };
    
      const handleClose = () => {
        setOpenDialog(false);
      };
    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch("http://localhost:5000/api/v1/users/get/blogPosts", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Fetched blogs:', data);
                setBlogs(Array.isArray(data.result) ? data.result : []);
            } else {
                console.error("Failed to fetch Blogs", response.status);
            }
        } catch (error) {
            console.error("Error fetching Blogs:", error);
        }
    };
    const handleAdd = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/v1/users/create-blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newBlog),
            });
    
            if (response.ok) {
                const addedBlog = await response.json();
                setBlogs([...blogs, addedBlog]); // Update the state
                console.log("Blog added successfully");
                toast.success("Blog added successfully");
            } else {
                const errorData = await response.json();
                console.error("Failed to add Blog", errorData);
                toast.error("Failed to add Blog");
            }
        } catch (error) {
            console.error("Error adding Blog:", error);
            toast.success("Blog added successfully");
        }
        handleClose();
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

    const handleDelete = async (blogId) => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                console.error("Token is missing. Unable to delete user.");
                return;
            }

            const response = await fetch(`http://localhost:5000/api/v1/users/blogPosts/${blogId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                fetchBlogs();
                console.log("blog deleted successfully");
                toast.success("blog deleted successfully");
            } else {
                if (response.status === 401 || response.status === 403) {
                    console.error("Unauthorized: Check if the provided token is valid.");
                } else {
                    const errorMessage = await response.text();
                    console.error(`Failed to delete blog. Server response: ${errorMessage}`);
                }
            }
        } catch (error) {
            console.error("Error deleting blog:", error.message);
            toast.error("Error deleting blog");
        }
    };
    const filteredBlogs = blogs.filter(blog =>
        (typeof blog.title === 'string' && blog.title.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
      const [currentPage, setCurrentPage] = useState(1);
      const [itemsPerPage, setItemsPerPage] = useState(5); 
    
    const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
    
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
            <Typography variant="h6">Blog List</Typography>
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
            <Tooltip title="Add New Account">
          <IconButton color="primary" onClick={handleClickOpen}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      

      <CreateBlogDialog
        open={openDialog}
        handleClose={handleClose}
        handleAccountAdd={handleAdd} />
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
                                    <TableCell>Title</TableCell>
                                    <TableCell align="center">Image</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>InsertDate</TableCell>
                                    <TableCell>UpdateDate</TableCell>
                                    <TableCell>Deflag</TableCell>
                                    {role === 'STAFF' && (
                                    <TableCell>Action</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(currentItems) && currentItems.map((blog, index) => (
                                    <TableRow key={blog._id}>
                                        <TableCell>{startNumber + index}</TableCell>
                                        <TableCell align="left">{blog.title || 'N/A'}</TableCell>
                                        <TableCell align="left">
                                            <img 
                                                style={{
                                                    width: '100%', // Ensure the image takes full width
                                                    height: '150px', // Maintain aspect ratio
                                                    objectFit: 'cover',
                                                    margin:'10px'
                                                }}
                                                src={blog.url_image}/>
                                        </TableCell>
                                        <TableCell align="left">{blog.description_detail || 'N/A'}</TableCell>
                                        <TableCell align="left">
                                            {blog.insert_date
                                                ? new Date(blog.insert_date).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell align="left">
                                            {blog.update_date
                                                ? new Date(blog.update_date).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell align="left">{blog.deflag || 'false'}</TableCell>
                                        {role === 'STAFF' && (
                                            <TableCell align="center">
                                                <div className="flex">
                                                    <IconButton onClick={() => handleDeleteClick(blog._id)}><DeleteIcon /></IconButton>
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
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
