import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

import { Input, Row, Col, Button, Form, List, Typography, Badge, Empty, Space, Tag } from 'antd';
import { getUserMessagesAsync, replyUserMessageAsync } from '../userSlice';
import { Link } from 'react-router-dom';

const { Text } = Typography;

const UserMessages = () => {
    const dispatch = useDispatch();
    const { userMessages, isLoading } = useSelector((state) => state.user);

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
        dispatch(getUserMessagesAsync());
    }, [dispatch]);

    useEffect(() => {
        if (userMessages) {
            const filtered = userMessages.filter(msg =>
                msg.message.toLowerCase().includes(localSearch.toLowerCase()) ||
                (msg.nursery && msg.nursery.nurseryName.toLowerCase().includes(localSearch.toLowerCase()))
            );
            setFilteredMessages(filtered);

            // Auto-update selected message if it gets modified
            if (selectedMessage) {
                const updatedMsg = userMessages.find(m => m._id === selectedMessage._id);
                if (updatedMsg && updatedMsg.status !== selectedMessage.status) {
                    setSelectedMessage(updatedMsg);
                }
            }
        }
    }, [userMessages, localSearch]);

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

        const response = await dispatch(replyUserMessageAsync({
            id: selectedMessage._id,
            replyMessage: values.replyMessage
        })).unwrap();

        if (response.status) {
            replyForm.resetFields();
            // Refetch to ensure state is in sync
            dispatch(getUserMessagesAsync());
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
            case 'resolved': return <Tag color="success">Resolved</Tag>;
            case 'closed': return <Tag color="default">Closed</Tag>;
            default: return <Tag color="processing">Open</Tag>;
        }
    };

    return (
        <div className="card mb-4" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">My Support Chats</h5>
            </div>

            <div className="card-body p-0" style={{ flex: 1, overflow: 'hidden' }}>
                <Row style={{ height: '100%' }}>
                    {/* LEFT PANEL - THREAD LIST */}
                    <Col xs={24} md={8} style={{ borderRight: '1px solid #f0f0f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div className="p-3 border-bottom">
                            <Input
                                placeholder="Search nurseries..."
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
                                                    <span className="fw-bold">{item.nursery?.nurseryName || 'Unknown Nursery'}</span>
                                                    {getStatusTag(item.status)}
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
                                            Chat with <Link to={`/nursery/store/view/${selectedMessage.nursery?._id}`}>{selectedMessage.nursery?.nurseryName}</Link>
                                        </h6>
                                        <small className="text-muted">Started: {new Date(selectedMessage.createdAt).toLocaleString()}</small>
                                    </div>
                                    <div>
                                        {getStatusTag(selectedMessage.status)}
                                    </div>
                                </div>

                                {/* Chat Messages Area */}
                                <div className="p-4" style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fafafa' }}>
                                    <div className="message mb-4">
                                        <div className="d-flex justify-content-end">
                                            <div style={{ maxWidth: '75%', backgroundColor: '#e6f7ff', padding: '10px 15px', borderRadius: '10px 10px 0 10px', border: '1px solid #91d5ff' }}>
                                                <div className="fw-bold text-primary mb-1">You (Initial Inquiry)</div>
                                                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', margin: 0 }}>{selectedMessage.message}</pre>
                                                <div className="text-end mt-1" style={{ fontSize: '10px', color: '#999' }}>
                                                    {new Date(selectedMessage.createdAt).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedMessage.replies && selectedMessage.replies.map((reply, index) => {
                                        const isUser = reply.sender === 'User';
                                        return (
                                            <div key={index} className="message mb-4">
                                                <div className={`d-flex ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
                                                    <div style={{
                                                        maxWidth: '75%',
                                                        backgroundColor: isUser ? '#e6f7ff' : '#fff',
                                                        padding: '10px 15px',
                                                        borderRadius: isUser ? '10px 10px 0 10px' : '10px 10px 10px 0',
                                                        border: isUser ? '1px solid #91d5ff' : '1px solid #e8e8e8',
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                    }}>
                                                        <div className={`fw-bold mb-1 ${isUser ? 'text-primary' : 'text-success'}`}>
                                                            {isUser ? 'You' : selectedMessage.nursery?.nurseryName}
                                                        </div>
                                                        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', margin: 0 }}>{reply.message}</pre>
                                                        <div className={`mt-1 ${isUser ? 'text-end' : 'text-start'}`} style={{ fontSize: '10px', color: '#999' }}>
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
                                    {(selectedMessage.status === 'closed' || selectedMessage.status === 'resolved') ? (
                                        <div className="alert alert-secondary text-center mb-0">
                                            This chat was marked as <strong>{selectedMessage.status}</strong> by the nursery. Further replies are disabled.
                                        </div>
                                    ) : (
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
                                    )}
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

export default UserMessages;

