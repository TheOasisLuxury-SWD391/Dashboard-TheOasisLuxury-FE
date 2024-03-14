import React, { useEffect, useState } from 'react';
import { TableCell, TableRow, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const TimeShareRow = ({ timeshare, level = 0, index }) => {
    const [open, setOpen] = useState(false);
    const [editTimeShare, setEditTimeShare] = useState(null); // State cho dự án đang chỉnh sửa
    const [openEditDialog, setOpenEditDialog] = useState(false); // State để mở và đóng dialog chỉnh sửa
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [accountIdToDelete, setAccountIdToDelete] = useState(null);
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

    const hasChildren = timeshare.time_share_child && timeshare.time_share_child.length > 0;
    const makeStyle = (status) => {
        // if (status === 'TRUE') {
        //     return {
        //         background: 'rgb(145 254 159 / 47%)',
        //         color: 'green',
        //     }
        // }
        // else if (status === 'FALSE') {
        //     return {
        //         background: '#ffadad8f',
        //         color: 'red',
        //     }
        // }
    }
    const handleOpenEditDialog = (timeshare) => {
        setEditTimeShare(timeshare);
        setOpenEditDialog(true);
    };
    const handleDeleteClick = (accountId) => {
        handleOpenConfirmDelete(accountId);
    };
    const handleOpenConfirmDelete = (accountId) => {
        setAccountIdToDelete(accountId);
        setConfirmDelete(true);
    };
    return (
        <>
            <TableRow key={timeshare._id} sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>{index}</TableCell>
                <TableCell component="th" scope="row" style={{ paddingLeft: `${level * 20}px` }}>
                    {hasChildren ? (
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    ) : (
                        <span style={{ marginLeft: 48 }}></span>
                    )}
                    {timeshare.time_share_name}
                </TableCell>
                {/* Render other cells here */}
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
                    <span className="deflag" style={makeStyle(timeshare.deflag  || 'FALSE')}>{timeshare.deflag ? 'Đã có người mua' : 'Còn trống' || 'FALSE'}</span>
                </TableCell>
                {/* <TableCell align="center">{timeshare.time_share_type || '0'}</TableCell> */}
                {role === 'ADMIN' && (
                    <TableCell align="center">
                        <div className="flex">
                            <IconButton onClick={() => handleOpenEditDialog(timeshare)}><EditIcon/></IconButton>
                            <IconButton onClick={() => handleDeleteClick(timeshare._id)}><DeleteIcon /></IconButton>
                        </div>
                    </TableCell>
                )} 
            </TableRow>
            {hasChildren && open &&
                timeshare.time_share_child.map((child) => (
                    <TimeShareRow timeshare={child} level={level + 1} key={child._id} />
                ))
            }
        </>
    );
};
export default TimeShareRow;
