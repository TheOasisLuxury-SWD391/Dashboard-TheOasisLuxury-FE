import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, Button, DialogActions, TextField } from "@mui/material";
import { toast } from "react-toastify";

const CreateBlogDialog = ({ open, handleClose, setBlogs, blogs }) => {
    const [newBlog, setNewBlog] = useState({
        user_id: localStorage.getItem('user_id'), 
        title: '',
        description_detail: '',
        url_image: '',
    });

    const handleChange = (prop) => (event) => {
        setNewBlog({ ...newBlog, [prop]: event.target.value });
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
                toast.success("Blog added successfully");
                console.log("Blog added successfully");
            } else {
                const errorData = await response.json();
                console.error("Failed to add Blog", errorData);
                toast.error("Failed to add Blog");
            }
        } catch (error) {
            console.error("Error adding Blog:", error);
            toast.error("Failed to add Blog");
        }
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add New Blog</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    id="title"
                    label="Title"
                    type="text"
                    fullWidth
                    value={newBlog.title}
                    onChange={handleChange('title')}
                />
                <TextField
                    margin="dense"
                    id="description_detail"
                    label="Description"
                    type="text"
                    fullWidth
                    value={newBlog.description_detail}
                    onChange={handleChange('description_detail')}
                />
                <TextField
                    margin="dense"
                    id="url_image"
                    label="URL Image"
                    type="text"
                    fullWidth
                    value={newBlog.url_image}
                    onChange={handleChange('url_image')}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleAdd} color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateBlogDialog;
