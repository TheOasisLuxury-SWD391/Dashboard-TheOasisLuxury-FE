// BasicTable.jsx
import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from 'react-router-dom';
import "./Table.css";

const makeStyle = (status) => {
  if (status === 'SUCCESS') {
    return {
      background: 'rgb(145 254 159 / 47%)',
      color: 'green',
    };
  } else if (status === 'CANCELLED') {
    return {
      background: '#ffadad8f',
      color: 'red',
    };
  } else if (status === 'PENDING') {
    return {
      background: 'yellow',
      color: 'black',
    };
  } else if (status === 'CONFIRMED') {
    return {
      background: 'orange',
      color: 'black',
    };
  } else if (status === 'COMPLETED') {
    return {
      background: 'green',
      color: 'black',
    };
  }
};
const BasicTable = () => {
  const [orders, setOrders] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/v1/orders/", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('data', data);
        setOrders(Array.isArray(data.result) ? data.result : []);
      } else {
        console.error("Failed to fetch orders" + response.status);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };


  return (
    <div className="Table ml-20">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Orders</h3>
        {!showAll && orders.length > 5 && (
          <Link to="/orders" className="show-all-link">Show All</Link>
        )}

      </div>
      <TableContainer
        component={Paper}
        style={{ boxShadow: "0px 13px 20px 0px #80808029" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>StartDate</TableCell>
              <TableCell>EndDate</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="center">Invoice ID</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.slice(0, showAll ? orders.length : 5).map((order, index) => (
              <TableRow key={order._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell
                  style={{
                    maxWidth: 150,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={order.order_name || 'N/A'}
                  align="left" >{order.order_name || 'N/A'}</TableCell>

                <TableCell align="left">
                  {order.start_date
                    ? new Date(order.start_date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                    : 'N/A'}
                </TableCell>
                <TableCell align="left">
                  {order.end_date
                    ? new Date(order.end_date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })
                    : 'N/A'}
                </TableCell>
                <TableCell align="left">{order.price || 'N/A'}</TableCell>
                <TableCell align="left">{order.invoice_id || 'N/A'}</TableCell>
                <TableCell align="center">
                  <span className="status" style={makeStyle(order.status || 'INACTIVE')}>{order.status || 'INACTIVE'}</span>
                </TableCell>
                <TableCell align="left">{order.description || ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BasicTable;
