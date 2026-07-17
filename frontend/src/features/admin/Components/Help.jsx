import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Modal, Input, Form, message, Popconfirm } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { adminGetContactsAsync, adminReplyToContactAsync, adminDeleteContactAsync } from '../adminSlice';

const Help = () => {
  const dispatch = useDispatch();
  const { contactsData, isLoading } = useSelector((state) => state.admin);
  const contacts = contactsData?.contacts || [];

  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyForm] = Form.useForm();

  useEffect(() => {
    dispatch(adminGetContactsAsync());
  }, [dispatch]);

  const showReplyModal = (contact) => {
    setSelectedContact(contact);
    setIsReplyModalVisible(true);
  };

  const handleReplyCancel = () => {
    setIsReplyModalVisible(false);
    setSelectedContact(null);
    replyForm.resetFields();
  };

  const handleReplySubmit = async (values) => {
    if (!selectedContact) return;
    
    try {
      const response = await dispatch(adminReplyToContactAsync({ 
        id: selectedContact._id, 
        replyMessage: values.replyMessage 
      })).unwrap();

      if (response.status) {
        handleReplyCancel();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(adminDeleteContactAsync(id));
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat) => <Tag color="blue">{cat}</Tag>
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: "Status",
      dataIndex: 'isReplied',
      key: 'isReplied',
      render: (isReplied) => (
        <Tag color={isReplied ? 'green' : 'orange'}>
          {isReplied ? 'REPLIED' : 'PENDING'}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button 
            className="btn btn-sm btn-primary" 
            onClick={() => showReplyModal(record)}
            disabled={record.isReplied}
          >
            {record.isReplied ? 'Replied' : 'Reply'}
          </button>
          
          <Popconfirm
            title="Delete this message?"
            description="Are you sure to delete this message? This action cannot be undone."
            onConfirm={() => handleDelete(record._id)}
            okText="Yes, Delete"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <button className="btn btn-sm btn-danger">
              <i className="fas fa-trash"></i>
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="row g-2 my-2 bg-white border rounded p-3">
      <div className="header d-flex justify-content-between align-items-center mb-3">
        <h5 className='h5 fw-bolder mb-0'>Help & Support (Contact Us Queries)</h5>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(adminGetContactsAsync())}>
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      <Table 
        dataSource={contacts} 
        columns={columns} 
        rowKey="_id" 
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={`Reply to ${selectedContact?.name}`}
        open={isReplyModalVisible}
        onCancel={handleReplyCancel}
        footer={null}
      >
        <div className="mb-3 p-3 bg-light rounded border">
          <strong>Original Message:</strong>
          <p className="mb-0 mt-2 text-muted">{selectedContact?.message}</p>
        </div>

        <Form form={replyForm} layout="vertical" onFinish={handleReplySubmit}>
          <Form.Item
            name="replyMessage"
            label="Your Reply"
            rules={[{ required: true, message: 'Please enter a reply message' }]}
          >
            <Input.TextArea rows={6} placeholder="Type your response here. It will be emailed directly to the customer." />
          </Form.Item>
          
          <Form.Item className="mb-0 text-end">
            <button type="button" className="btn btn-secondary me-2" onClick={handleReplyCancel}>Cancel</button>
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reply Email'}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Help;