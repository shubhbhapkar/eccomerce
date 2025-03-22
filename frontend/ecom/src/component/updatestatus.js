import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const UpdateStatusModal = ({ orderId, onClose, showModal }) => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // STATUS_CHOICES
  const STATUS_CHOICES = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'SHIPPED', label: 'Shipped' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  // Handle status change
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  // Handle form submission (sending the request)
  const handleSubmit = async () => {
    if (status) {
      setLoading(true);
      try {
        await axios.patch(`http://127.0.0.1:8000/user/orderstatus/${orderId}/`, { status }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        alert('Order status updated successfully!');
        setLoading(false);
        onClose(); // Close modal after success
      } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status.');
        setLoading(false);
      }
    } else {
      alert('Please select a status.');
    }
  };

  return (
    <Modal show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Order Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="statusSelect">
            <Form.Label>Select Status</Form.Label>
            <Form.Control as="select" value={status} onChange={handleStatusChange}>
              <option value="">Select a Status</option>
              {STATUS_CHOICES.map((statusOption) => (
                <option key={statusOption.value} value={statusOption.value}>
                  {statusOption.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateStatusModal;
