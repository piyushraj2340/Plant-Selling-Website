import React, { useEffect, useState } from 'react';
import { Form, List, Typography, Space, Button, Popconfirm, Input, Row, Col, Table, Tag, Modal, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { replyNurseryMessageAsync, replyNurseryMessageEmailAsync, getNurseryMessagesAsync, markNurseryMessageAsViewedAsync, updateNurseryMessageStatusAsync } from '../nurserySlice';
import io from 'socket.io-client';

const NurseryHelp = () => {
    const dispatch = useDispatch();
    const { nurseryMessages, isLoading } = useSelector((state) => state.nursery);
    
    const [localSearch, setLocalSearch] = useState('');
    const [filteredMessages, setFilteredMessages] = useState([]);
    
    const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyForm] = Form.useForm();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_API_URL_BACKEND);
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (socket && selectedMessage) {
            socket.emit('join_chat', selectedMessage._id);

            socket.on('receive_message', (reply) => {
                // Update local state without fetching all messages
                setSelectedMessage(prev => {
                    if (prev && prev._id === selectedMessage._id) {
                        // Prevent duplicates
                        const isDuplicate = prev.replies?.some(r => r.message === reply.message && r.createdAt === reply.createdAt);
                        if(isDuplicate) return prev;
                        return { ...prev, replies: [...(prev.replies || []), reply] };
                    }
                    return prev;
                });
            });
        }
        return () => {
            if (socket) socket.off('receive_message');
        };
    }, [socket, selectedMessage]);

    useEffect(() => {
        dispatch(getNurseryMessagesAsync());
    }, [dispatch]);

    useEffect(() => {
        if (nurseryMessages) {
            const filtered = nurseryMessages.filter(msg => 
                msg.name.toLowerCase().includes(localSearch.toLowerCase()) || 
                msg.email.toLowerCase().includes(localSearch.toLowerCase()) ||
                msg.message.toLowerCase().includes(localSearch.toLowerCase())
            );
            setFilteredMessages(filtered);
        }
    }, [nurseryMessages, localSearch]);

    const handleSearchChange = (e) => {
        setLocalSearch(e.target.value);
    };

    const handleMarkAsViewed = async (id) => {
        await dispatch(markNurseryMessageAsViewedAsync(id));
    };

    const showReplyModal = (msg) => {
        setSelectedMessage(msg);
        setIsReplyModalVisible(true);
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedMessage) return;
        try {
            const response = await dispatch(updateNurseryMessageStatusAsync({ id: selectedMessage._id, status })).unwrap();
            if (response.status) {
                message.success(`Chat marked as ${status}`);
                setSelectedMessage({ ...selectedMessage, status });
            }
        } catch (error) {
            message.error(error.message || "Failed to update status");
        }
    };

    const handleReplyCancel = () => {
        setIsReplyModalVisible(false);
        setSelectedMessage(null);
        replyForm.resetFields();
    };

    const handleReplySubmit = async (values, isEmail = false) => {
        if (!selectedMessage) return;
        
        try {
            let response;
            if (isEmail) {
                response = await dispatch(replyNurseryMessageEmailAsync({ 
                    id: selectedMessage._id, 
                    replyMessage: values.replyMessage 
                })).unwrap();
            } else {
                response = await dispatch(replyNurseryMessageAsync({ 
                    id: selectedMessage._id, 
                    replyMessage: values.replyMessage 
                })).unwrap();
            }

            if (response.status) {
                handleReplyCancel();
                message.success(response.message || "Reply sent successfully.");
            }
        } catch (error) {
            message.error(error.message || "Failed to send reply. Please check your SMTP settings if using Email.");
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
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
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (date) => new Date(date).toLocaleString()
        },
        {
            title: "Status",
            key: 'status_combined',
            render: (_, record) => {
                let color = 'orange';
                let text = 'UNREAD';
                if (record.isMessageViewed) {
                    color = 'green';
                    text = 'VIEWED';
                }
                
                let threadColor = 'processing';
                if (record.status === 'resolved') threadColor = 'success';
                if (record.status === 'closed') threadColor = 'default';

                return (
                    <Space direction="vertical" size={0}>
                        <Tag color={color}>{text}</Tag>
                        <Tag color={threadColor}>{record.status?.toUpperCase() || 'OPEN'}</Tag>
                    </Space>
                );
            }
        },
                {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button size="small" type="primary" onClick={() => showReplyModal(record)}>
                        View & Reply
                    </Button>
                    {!record.isMessageViewed && (
                        <Popconfirm
                            title="Mark as viewed?"
                            onConfirm={() => handleMarkAsViewed(record._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button size="small">Mark Viewed</Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="row g-2 my-2 bg-white border rounded p-3 mx-2">
            <Row justify="space-between" align="middle" gutter={[16, 16]} className="mb-4">
                <Col xs={24} md={12}>
                    <h5 className='h5 fw-bolder mb-0'>Nursery Help & Messages</h5>
                    <p className="text-muted small m-0">View queries and support requests from customers.</p>
                </Col>
                <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                    <Input
                        placeholder="Search by name, email or message..."
                        allowClear
                        prefix={<span role="img" aria-label="search">🔍</span>}
                        value={localSearch}
                        onChange={handleSearchChange}
                        style={{ width: '100%', maxWidth: '300px' }}
                    />
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => dispatch(getNurseryMessagesAsync())}>
                        <i className="fas fa-sync-alt"></i> Refresh
                    </button>
                </Col>
            </Row>

            <Table
                dataSource={filteredMessages}
                columns={columns}
                rowKey="_id"
                loading={isLoading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
            />

            <Modal
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '30px' }}>
                        <span>Conversation with {selectedMessage?.name}</span>
                        {selectedMessage && selectedMessage.status !== 'closed' && (
                            <Space>
                                {selectedMessage.status !== 'resolved' && (
                                    <Button size="small" type="dashed" onClick={() => handleUpdateStatus('resolved')}>Mark Resolved</Button>
                                )}
                                <Popconfirm
                                    title="Are you sure you want to close this chat?"
                                    onConfirm={() => handleUpdateStatus('closed')}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button size="small" danger>Close Chat</Button>
                                </Popconfirm>
                            </Space>
                        )}
                    </div>
                }
                open={isReplyModalVisible}
                onCancel={handleReplyCancel}
                footer={null}
                width={700}
            >
                <div className="chat-history mb-3 p-3 bg-light rounded border" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    <div className="message mb-3">
                        <strong className="text-primary">{selectedMessage?.name} (Customer):</strong>
                        <p className="mb-0 mt-1">{selectedMessage?.message}</p>
                        <small className="text-muted">{new Date(selectedMessage?.createdAt).toLocaleString()}</small>
                    </div>
                    {selectedMessage?.replies && selectedMessage.replies.map((reply, index) => (
                        <div key={index} className={`message mb-3 ${reply.sender === 'Nursery' ? 'text-end' : ''}`}>
                            <strong className={reply.sender === 'Nursery' ? 'text-success' : 'text-primary'}>
                                {reply.sender === 'Nursery' ? 'You' : selectedMessage.name}:
                            </strong>
                            <p className="mb-0 mt-1">{reply.message}</p>
                            <small className="text-muted">{new Date(reply.createdAt).toLocaleString()}</small>
                        </div>
                    ))}
                </div>

                <Form form={replyForm} layout="vertical">
                    <Form.Item
                        name="replyMessage"
                        label="Your Reply"
                        rules={[{ required: true, message: 'Please enter a reply message' }]}
                    >
                        <Input.TextArea rows={4} placeholder="Type your response here..." disabled={selectedMessage?.status === 'closed' || selectedMessage?.status === 'resolved'} />
                    </Form.Item>
                    {(selectedMessage?.status === 'closed' || selectedMessage?.status === 'resolved') && (
                        <div className="alert alert-warning py-2 mb-3">
                            This chat is currently {selectedMessage.status}. You must reopen it to chat further.
                            <div className="mt-2">
                                <Button type="primary" size="small" onClick={() => handleUpdateStatus('open')}>
                                    Reopen Chat
                                </Button>
                            </div>
                        </div>
                    )}
                    <Form.Item className="mb-0">
                        <div className="d-flex justify-content-end gap-2 flex-wrap">
                            <Button type="default" onClick={handleReplyCancel}>Cancel</Button>
                            <Button type="primary" disabled={selectedMessage?.status === 'closed' || selectedMessage?.status === 'resolved'} onClick={() => {
                                replyForm.validateFields().then(values => handleReplySubmit(values, false));
                            }} loading={isLoading}>
                                Reply via Chat
                            </Button>
                            <Button type="dashed" onClick={() => {
                                replyForm.validateFields().then(values => handleReplySubmit(values, true));
                            }} loading={isLoading}>
                                Reply via Email
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NurseryHelp;

