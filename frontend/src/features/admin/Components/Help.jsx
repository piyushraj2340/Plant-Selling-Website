import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Modal, Input, Form, message, Popconfirm, Row, Col } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { adminGetContactsAsync, adminReplyToContactAsync, adminDeleteContactAsync } from '../adminSlice';
import { useTableParams } from '../../../hooks/useTableParams';

const Help = () => {
  const dispatch = useDispatch();
  const { contactsData, isLoading } = useSelector((state) => state.admin);
  const contacts = contactsData?.contacts || [];

  const contactsTotal = useSelector((state) => state.admin.contactsData?.total) || 0;

  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyForm] = Form.useForm();

  const { tableParams, localSearch, handleTableChange, handleSearchChange } = useTableParams(adminGetContactsAsync);

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
      <Row justify="space-between" align="middle" gutter={[16, 16]} className="mb-4">
        <Col xs={24} md={8}>
          <h5 className='h5 fw-bolder mb-0'>Help & Support (Contact Us Queries)</h5>
        </Col>
        <Col xs={24} md={16} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
          <Input.Search
            placeholder="Search messages..."
            allowClear
            value={localSearch}
            onChange={handleSearchChange}
            style={{ width: '100%', maxWidth: '300px' }}
          />
          <button className="btn btn-outline-secondary btn-sm" onClick={() => handleSearchChange({ target: { value: localSearch } })}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </Col>
      </Row>

      <Table 
        dataSource={contacts} 
        columns={columns} 
        rowKey="_id" 
        loading={isLoading}
        pagination={{
            ...tableParams.pagination,
            total: contactsTotal,
            showSizeChanger: true,
            position: ['bottomCenter']
        }}
        onChange={handleTableChange}
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