import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  Box,
  Typography,
  Grid,
  Button,
  Modal
} from '@mui/material';
import { toast } from 'react-toastify';
import ConfirmDialog from '../components/Modal/Modal';
import axios from 'axios';

const formatter = value => `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

function getOrderStatusStyle(status) {
  switch (status) {
    case "PENDING":
      return { backgroundColor: "orange", color: "white" };
    case "CONFIRMED":
      return { backgroundColor: "#007bff", color: "white" };
    case "COMPLETED":
      return { backgroundColor: "#28a745", color: "white" };
    case "CANCELLED":
      return { backgroundColor: "#dc3545", color: "white" };
    default:
      return {};
  }
}


const OrderDetailsPage = ({ value }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [countdown, setCountdown] = useState(null);
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
    console.log('order ID:', orderId);
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data);
        } else {
          console.error('Failed to fetch contract details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching contract details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    console.log('order ID:', orderId);
    const fetchPaymentDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/v1/users/getPayments/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPaymentDetails(data);
        } else {
          console.error('Failed to fetch contract details:', response.status);
        }
      } catch (error) {
        console.error('Error fetching contract details:', error);
      }
    };

    fetchPaymentDetails();
  }, [orderId]);

  const handleConfirm = () => {
    // Xử lý khi người dùng xác nhận
    handleCancelled();
    setOpenDialog(false); // Đóng dialog sau khi xác nhận
  };

  const handleCancel = () => {
    // Xử lý khi người dùng huỷ bỏ
    setOpenDialog(false); // Đóng dialog sau khi huỷ bỏ
  };

  const handleShowDialog = () => {
    setOpenDialog(true); // Mở dialog khi người dùng muốn huỷ hợp đồng
  };



  const handlePaid = async () => {
    try {
      const token = localStorage.getItem('token');

      // Sửa status Payment
      const responsePayment = await fetch(`http://localhost:5000/api/v1/users/confirm-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'PAID',
          order_id: orderId,
          payment_id: paymentDetails._id ,
        })
      });

      if ( responsePayment.ok) {
        console.log('Order marked as PAID successfully.');
        toast.success('Order marked as PAID successfully.');
        navigate('/orders');
      } else {
        console.error('Failed to mark order as PAID:', responsePayment.status);
        toast.error('Failed to mark order as PAID');
      }
    } catch (error) {
      console.error('Error marking order as PAID:', error);
      toast.error('Error marking order as PAID');
    }
  };


  const handleCancelled = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/v1/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'CANCELLED',
          price: orderDetails.price,
          order_name: orderDetails.order_name,
        })
      });
      if (response.ok) {
        console.log('Order cancelled successfully.');
        toast.success('Order cancelled successfully.');
        navigate('/order');
      } else {
        console.error('Failed to cancel order:', response.status);
        toast.error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Error cancelling order');
    }
  };

  const handleBackClick = () => {
    navigate(`/orders`);
  };


  return (
    <div className='mt-36 overflow-y-auto	'>
      <div className='flex justify-between'>
        <h2 className="text-xl font-bold ml-48 mb-10">THÔNG TIN CHI TIẾT ĐƠN HÀNG</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-0 px-4 rounded float-right mr-10 h-10"
          onClick={handleBackClick}
        >
          Back
        </button>
      </div>
      {orderDetails && role ? (

        <div className="p-8 bg-white shadow-md rounded w-3/4 mx-auto ">
          {/* Logo and company info here */}
          {/* <HeaderInvoice /> */}
          <main>
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-cyan-700">HOÁ ĐƠN ĐẶT MUA TIMESHARE VILLA</h2>
            </div>
            <div>

              <div className="mb-8">
                <div className="mb-2">
                  <h1 className='text-center text-lg font-bold'>MÃ HOÁ ĐƠN: {orderDetails.invoice_id}</h1>
                  <h3 className="text-lg font-bold">Thông Tin Người Đặt</h3>
                </div>
                <div className="bg-white p-4 shadow rounded text-base">
                  <div className="mb-2"><strong>Họ tên người mua hàng:</strong> {orderDetails.user.full_name}</div>
                  <div className="mb-2"><strong>Địa chỉ:</strong> {orderDetails.user.place_provide_CCCD}</div>
                  <div className="mb-2"><strong>Email:</strong> {orderDetails.user.email}</div>
                  <div className="mb-2"><strong>Số điện thoại:</strong> {orderDetails.user.phone_number}</div>
                  <div className="mb-2"><strong>Ngày tạo order:</strong> {new Date(orderDetails.insert_date).toLocaleString()}</div>
                </div>
              </div>
              <div className="mb-8">
                <div className="mb-2">
                  <h3 className="text-lg font-bold">Thông Tin Chi Tiết Căn Villa</h3>
                </div>
                <div className="overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="mt-5 border-t border-gray-200">
                      <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-base font-medium text-gray-500">Tên đơn mua Timeshare căn Villa</dt>
                          <dd className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">{orderDetails.order_name} </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-base font-medium text-gray-500">Thời Gian Bắt Đầu</dt>
                          <dd className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">{new Date(orderDetails.start_date).toLocaleString()}</dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                          <dt className="text-base font-medium text-gray-500">Thời Gian Kết Thúc</dt>
                          <dd className="mt-1 text-base text-gray-900 sm:mt-0 sm:col-span-2">{new Date(orderDetails.start_date).toLocaleString()}</dd>
                        </div>
                        {/* Thêm các hàng khác tương tự với thông tin cần thiết */}
                      </dl>
                    </div>
                    <hr />
                    <div className="mt-4">
                      <div className="flex float-right m-4">
                        <div className=" mr-32">
                          {/* <h3 className="text-base leading-6 font-medium text-gray-900">VAT (10%)</h3> */}
                          <h3 className="text-lg leading-6 font-bold text-cyan-700">Tổng Cộng Tiền Thanh Toán</h3>
                        </div>
                        <div className="ml-4 ">
                          {/* <div className="text-base leading-6 font-medium text-gray-90 text-right">VND: 0</div> */}
                          <div className="text-lg leading-6 font-bold text-cyan-700 text-right"> {formatter(orderDetails?.price)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </main>
          <footer className="text-right mt-4">
            <div className="flex justify-end text-xl">
              <p className='m-2'><strong>TRẠNG THÁI ĐƠN HÀNG:</strong></p>
              <p
                className="text-gray-600"
                style={{
                  borderRadius: "5px",
                  padding: "10px",
                  ...getOrderStatusStyle(orderDetails.status),
                }}
              >
                {" "}
                {orderDetails.status === "PENDING" && "ĐANG CHỜ"}
                {orderDetails.status === "CONFIRMED" && "ĐÃ XÁC NHẬN ĐƠN"}
                {orderDetails.status === "COMPLETED" && "ĐÃ HOÀN THÀNH"}
                {orderDetails.status === "CANCELLED" && "ĐÃ HUỶ"}
              </p>
            </div>
            {orderDetails.status === "PENDING" && role === 'ADMIN' && (
              <Box mt={8}>
                <Grid container spacing={8}>
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={handlePaid}>ĐÃ NHẬN ĐƯỢC TIỀN</Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="secondary" onClick={handleShowDialog}>HUỶ ORDER</Button>
                    <ConfirmDialog
                      open={openDialog}
                      onClose={() => setOpenDialog(false)}
                      onConfirm={handleConfirm}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
{/* nếu ỏder có payment là pending */}

            {orderDetails.status === "CONFIRMED" && role === 'ADMIN'  && (
              <Box mt={8}>
                <Grid container spacing={8}>
                  <Grid item>
                    <Button variant="contained" color="primary" onClick={handlePaid}>ĐÃ NHẬN ĐƯỢC TIỀN</Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="secondary" onClick={handleShowDialog}>HUỶ ORDER</Button>
                    <ConfirmDialog
                      open={openDialog}
                      onClose={() => setOpenDialog(false)}
                      onConfirm={handleConfirm}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
{/* nếu ỏder có payment là paid */}

            {orderDetails.status === "COMPLETED" && role === 'ADMIN'  && (
              <Grid container >
                <Button className='mt-4' variant="contained" color="primary" disabled='true' onClick={handlePaid}>ĐÃ NHẬN ĐƯỢC TIỀN</Button>
              </Grid>
            )}
            {orderDetails.status === "CANCELLED" && role === 'ADMIN'  && (
              <Grid container >
                <Button className='mt-4' variant="contained" color="primary" disabled='true' onClick={handlePaid}>ĐÃ HUỶ</Button>
              </Grid>
            )}
          </footer>
        </div>
      ) : (
        <div>Loading...</div> // Hiển thị khi dữ liệu đang được fetch hoặc chưa sẵn sàng
      )}
    </div>
  );
}

export default OrderDetailsPage;
