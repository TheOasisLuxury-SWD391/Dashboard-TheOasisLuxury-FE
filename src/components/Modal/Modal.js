import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ConfirmDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Bạn chắc chắn huỷ Order này?</DialogTitle>
      <DialogContent>
        {/* Thêm nội dung cho dialog nếu cần */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          No
        </Button>
        <Button onClick={onConfirm} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
