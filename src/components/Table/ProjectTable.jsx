import * as React from "react";
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
  TextField,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  DialogContentText,
  Typography
} from "@mui/material";
import "./Table.css";
import EditProjectDialog from "../Popup/EditProject";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState, useEffect } from "react";
import CreateProjectDialog from "../Popup/CreateProject";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import "./Table.css"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import SearchIcon from '@mui/icons-material/Search';
export default function ProjectTable() {

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

  const [projects, setProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    project_name: '',
    start_date: '',
    end_date: '',
    description: '',
    status: '',
  });
  const [editProject, setEditProject] = useState(null); // State cho dự án đang chỉnh sửa
  const [openEditDialog, setOpenEditDialog] = useState(false); // State để mở và đóng dialog chỉnh sửa
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [accountIdToDelete, setAccountIdToDelete] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token'); // Lấy token từ localStorage
      const response = await fetch("http://localhost:5000/api/v1/projects/", {
        headers: {
          'Authorization': `Bearer ${token}`, // Thêm token vào header
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('data', data);
        setProjects(Array.isArray(data.result) ? data.result : []);
      } else {
        console.error("Failed to fetch projects" + response.status);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`, // Thêm token vào header
        },
      });
      if (response.ok) {
        // Update the projects list after deletion
        fetchProjects();
        console.log("Project deleted successfully");
        toast.success("Project deleted successfully");
      } else {
        console.error("Failed to delete project");
        toast.error("Failed to delete project")
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };


  const handleUpdate = async () => {
    console.log('editProject', editProject);
    try {
      const token = localStorage.getItem('token');
      // Tạo một bản sao của editProject và xóa trường '_id' => Tránh bị thay đổi _id vì trong môngDB ko cho phép thay đổi _id
      const projectData = { ...editProject };
      delete projectData._id;


      const response = await fetch(`http://localhost:5000/api/v1/projects/${editProject._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });
      if (response.ok) {
        // Update the projects list after deletion
        fetchProjects();
        console.log("Project update successfully");
        toast.success("Project update successfully")
      } else {
        console.error("Failed to update project");
        toast.error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
    handleCloseEditDialog();
  };

  const handleOpenEditDialog = (project) => {
    setEditProject(project);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditProject(null);
  };


  const handleChange = (prop) => (event) => {
    setNewProject({ ...newProject, [prop]: event.target.value });
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleClickOpen = () => {
    setOpenDialog(true);
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

  const handleAdd = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/v1/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newProject), // Send the new project data
      });

      if (response.ok) {
        const addedProject = await response.json();
        setProjects([...projects, addedProject]); // Update the state
        console.log("Project added successfully");
        toast.success("Project added successfully");
      } else {
        console.error("Failed to add project");
        toast.error("Failed to add project");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      toast.success("Error adding project");
    }
    handleClose();
  };
  const [searchKeyword, setSearchKeyword] = useState('');
  const filteredProjects = projects.filter(project =>
    project.project_name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    project.description.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  return (
    <Container maxWidth="md" className="">
      {/* <h3>Project List</h3> */}
      <Typography variant="h6">Project List</Typography>
      <Box display="flex" justifyContent="flex-start" mb={2} >
      <TextField
  label="Search"
  variant="outlined"
  value={searchKeyword}
  onChange={(e) => setSearchKeyword(e.target.value)}
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

        <Tooltip title="Add New Project">
          <IconButton color="primary" onClick={handleClickOpen}>
            <AddCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      </Box>
      {/* Dialog Tạo mới dự án */}
      <CreateProjectDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        handleProjectAdd={handleAdd}
      />
      {/* Dialog chỉnh sửa dự án */}
      <EditProjectDialog
        editProject={editProject}
        setEditProject={setEditProject}
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
      {/* Table Projects list */}
      <div style={{ padding: '12px', width: '100%' }}>
        <Paper sx={{ width: '150%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell align="left">Project Name</TableCell>
                  <TableCell align="left" className="whitespace-nowrap">Start Date</TableCell>
                  <TableCell align="left" className="whitespace-nowrap">End Date</TableCell>
                  <TableCell align="left">Description</TableCell>
                  {/* <TableCell align="left">Projects</TableCell> */}
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody style={{ color: "white" }}>
              {Array.isArray(filteredProjects) && filteredProjects.map((project, index) => (
                  <TableRow key={project._id}>
                    <TableCell>{index + 1}</TableCell>
                    {/* <TableCell component="th" scope="row">
                    {project._id || 'N/A'}
                  </TableCell> */}
                    <TableCell align="left">{project.project_name || 'N/A'}</TableCell>
                    <TableCell align="left" className="whitespace-nowrap">{project.start_date || 'N/A'}</TableCell>
                    <TableCell align="left" className="whitespace-nowrap">{project.end_date || 'N/A'}</TableCell>
                    <TableCell align="left">{project.description || 'N/A'}</TableCell>
                    {/* <TableCell align="left">{project.Projects || 'N/A'}</TableCell> */}
                    <TableCell align="center">
                      <span className="status" style={makeStyle(project.status || 'INACTIVE')}>{project.status || 'INACTIVE'}</span>
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex">
                      <IconButton onClick={() => handleOpenEditDialog(project)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDeleteClick(project._id)}><DeleteIcon /></IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </TableContainer>
        </Paper>
      </div>
      <ToastContainer/>
    </Container>
  );
}
