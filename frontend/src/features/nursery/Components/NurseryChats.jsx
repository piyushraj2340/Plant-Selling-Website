import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

import { Input, Row, Col, Button, Form, List, Typography, Empty, Space, Tag, message, Popconfirm } from 'antd';
import { getNurseryMessagesAsync, replyNurseryMessageAsync, updateNurseryMessageStatusAsync } from '../nurserySlice';

const { Text } = Typography;

const NurseryChats = () => {
    const dispatch = useDispatch();
    const { nurseryMessages, isLoading } = useSelector((state) => state.nursery);

    const [localSearch, setLocalSearch] = useState('');
    const [filteredMessages, setFilteredMessages] = useState([]);

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyForm] = Form.useForm();
    const [socket, setSocket] = useState(null);
    const chatEndRef = useRef(null);

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_API_URL_BACKEND);
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (socket && selectedMessage) {
            socket.emit('join_chat', selectedMessage._id);

            socket.on('receive_message', (reply) => {
                setSelectedMessage(prev => {
                    if (prev && prev._id === selectedMessage._id) {
                        const isDuplicate = prev.replies?.some(r => r.message === reply.message && r.createdAt === reply.createdAt);
                        if (isDuplicate) return prev;
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
            // Filter: only active (open) chats that have at least one reply (i.e. started)
            let activeChats = nurseryMessages.filter(msg => msg.status === 'open' && msg.replies && msg.replies.length > 0);

            const filtered = activeChats.filter(msg =>
                msg.message.toLowerCase().includes(localSearch.toLowerCase()) ||
                msg.name.toLowerCase().includes(localSearch.toLowerCase()) ||
                msg.email.toLowerCase().includes(localSearch.toLowerCase())
            );
            setFilteredMessages(filtered);

            // Auto-update selected message if it gets modified
            if (selectedMessage) {
                const updatedMsg = activeChats.find(m => m._id === selectedMessage._id);
                // If it was closed/resolved, it won't be in activeChats anymore.
                if (!updatedMsg) {
                    setSelectedMessage(null); // It was removed from active chats
                } else if (updatedMsg.status !== selectedMessage.status || updatedMsg.replies?.length !== selectedMessage.replies?.length) {
                    setSelectedMessage(updatedMsg);
                }
            }
        }
    }, [nurseryMessages, localSearch]);

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedMessage?.replies]);

    const handleSearchChange = (e) => {
        setLocalSearch(e.target.value);
    };

    const handleSelectChat = (msg) => {
        setSelectedMessage(msg);
        replyForm.resetFields();
    };

    const handleReplySubmit = async (values) => {
        if (!selectedMessage) return;

        try {
            const response = await dispatch(replyNurseryMessageAsync({
                id: selectedMessage._id,
                replyMessage: values.replyMessage
            })).unwrap();

            if (response.status) {
                replyForm.resetFields();
                dispatch(getNurseryMessagesAsync());
            }
        } catch (error) {
            message.error(error.message || "Failed to send reply");
        }
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedMessage) return;
        try {
            const response = await dispatch(updateNurseryMessageStatusAsync({ id: selectedMessage._id, status })).unwrap();
            if (response.status) {
                message.success(`Chat marked as ${status}`);
                dispatch(getNurseryMessagesAsync());
            }
        } catch (error) {
            message.error(error.message || "Failed to update status");
        }
    };

    return (
        <div className="card mb-4" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Active Customer Chats</h5>
            </div>

            <div className="card-body p-0" style={{ flex: 1, overflow: 'hidden' }}>
                <Row style={{ height: '100%' }}>
                    {/* LEFT PANEL - THREAD LIST */}
                    <Col xs={24} md={8} style={{ borderRight: '1px solid #f0f0f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div className="p-3 border-bottom">
                            <Input
                                placeholder="Search by customer name or email..."
                                allowClear
                                value={localSearch}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <List
                                itemLayout="horizontal"
                                dataSource={filteredMessages}
                                renderItem={item => (
                                    <List.Item
                                        className={`px-3 py-3 cursor-pointer ${selectedMessage?._id === item._id ? 'bg-light' : ''}`}
                                        onClick={() => handleSelectChat(item)}
                                        style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
                                    >
                                        <List.Item.Meta
                                            title={
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="fw-bold">{item.name}</span>
                                                    <Tag color="processing">Open</Tag>
                                                </div>
                                            }
                                            description={
                                                <div>
                                                    <Text type="secondary" ellipsis style={{ maxWidth: '100%' }}>
                                                        {item.message}
                                                    </Text>
                                                    <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </Col>

                    {/* RIGHT PANEL - CHAT VIEW */}
                    <Col xs={24} md={16} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {selectedMessage ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-0">
                                            Chat with {selectedMessage.name} <small>({selectedMessage.email})</small>
                                        </h6>
                                        <small className="text-muted">Started: {new Date(selectedMessage.createdAt).toLocaleString()}</small>
                                    </div>
                                    <Space>
                                        <Button size="small" type="dashed" onClick={() => handleUpdateStatus('resolved')}>Mark Resolved</Button>
                                        <Popconfirm
                                            title="Are you sure you want to close this chat?"
                                            onConfirm={() => handleUpdateStatus('closed')}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button size="small" danger>Close Chat</Button>
                                        </Popconfirm>
                                    </Space>
                                </div>

                                {/* Chat Messages Area */}
                                <div className="p-4" style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fafafa' }}>
                                    <div className="message mb-4">
                                        <div className="d-flex justify-content-start">
                                            <div style={{ maxWidth: '75%', backgroundColor: '#fff', padding: '10px 15px', borderRadius: '10px 10px 10px 0', border: '1px solid #e8e8e8' }}>
                                                <div className="fw-bold text-success mb-1">{selectedMessage.name} (Customer)</div>
                                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', margin: 0 }}>{selectedMessage.message}</pre>
                                                <div className="text-start mt-1" style={{ fontSize: '10px', color: '#999' }}>
                                                    {new Date(selectedMessage.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedMessage.replies && selectedMessage.replies.map((reply, index) => {
                                        const isNursery = reply.sender === 'Nursery';
                                        return (
                                            <div key={index} className="message mb-4">
                                                <div className={`d-flex ${isNursery ? 'justify-content-end' : 'justify-content-start'}`}>
                                                    <div style={{
                                                        maxWidth: '75%',
                                                        backgroundColor: isNursery ? '#e6f7ff' : '#fff',
                                                        padding: '10px 15px',
                                                        borderRadius: isNursery ? '10px 10px 0 10px' : '10px 10px 10px 0',
                                                        border: isNursery ? '1px solid #91d5ff' : '1px solid #e8e8e8',
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                    }}>
                                                        <div className={`fw-bold mb-1 ${isNursery ? 'text-primary' : 'text-success'}`}>
                                                            {isNursery ? 'You' : selectedMessage.name}
                                                        </div>
                                                        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', margin: 0 }}>{reply.message}</pre>
                                                        <div className={`mt-1 ${isNursery ? 'text-end' : 'text-start'}`} style={{ fontSize: '10px', color: '#999' }}>
                                                            {new Date(reply.createdAt).toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Chat Input Area */}
                                <div className="p-3 border-top bg-white">
                                    <Form form={replyForm} layout="vertical" onFinish={handleReplySubmit} className="mb-0">
                                        <Row gutter={10} align="bottom">
                                            <Col flex="auto">
                                                <Form.Item
                                                    name="replyMessage"
                                                    className="mb-0"
                                                    rules={[{ required: true, message: 'Please enter a message' }]}
                                                >
                                                    <Input.TextArea
                                                        rows={2}
                                                        placeholder="Type your reply here..."
                                                        style={{ resize: 'none' }}
                                                        onPressEnter={(e) => {
                                                            if (!e.shiftKey) {
                                                                e.preventDefault();
                                                                replyForm.submit();
                                                            }
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col>
                                                <Form.Item className="mb-0">
                                                    <Button type="primary" htmlType="submit" loading={isLoading} style={{ height: '54px' }}>
                                                        Send
                                                    </Button>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </>
                        ) : (
                            <div className="d-flex justify-content-center align-items-center h-100 bg-light">
                                <Empty description="Select a chat to start messaging" />
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default NurseryChats;
