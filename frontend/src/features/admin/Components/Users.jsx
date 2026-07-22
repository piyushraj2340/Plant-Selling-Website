import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message, Table, Space, Popconfirm, Tag, Button, Dropdown, Modal, Checkbox, Input, Row, Col } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useTableParams } from '../../../hooks/useTableParams';
import localStorageUtil from '../../../utils/localStorage';
import {
    adminUsersAsync,
    adminImpersonateAsync,
    adminDeleteUserAsync,
    adminBulkDeleteUsersAsync,
    adminUpdateUserRoleAsync,
    adminUpdateUserPasswordAsync,
    adminToggleBlockUserAsync,
    adminToggleVerifyUserAsync
} from '../adminSlice';

const Users = () => {
    const dispatch = useDispatch();
    const { users, usersTotal, isLoading } = useSelector((state) => state.admin);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const { tableParams, localSearch, handleTableChange, handleSearchChange, fetchData } = useTableParams(adminUsersAsync);

    // Modal states
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Form states
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [newPassword, setNewPassword] = useState('');


    const handleImpersonate = async (userId) => {
        const action = await dispatch(adminImpersonateAsync({ targetUserId: userId }));

        if (adminImpersonateAsync.fulfilled.match(action) && action.payload.status) {
            const currentAccessToken = localStorageUtil.getData("accessToken");
            const currentRefreshToken = localStorageUtil.getData("refreshToken");

            if (currentAccessToken && currentRefreshToken) {
                localStorageUtil.setData("adminAccessToken", currentAccessToken);
                localStorageUtil.setData("adminRefreshToken", currentRefreshToken);
            }

            localStorageUtil.setData("accessToken", action.payload.accessToken);
            localStorageUtil.setData("refreshToken", action.payload.refreshToken);
            window.location.href = '/profile'; // Redirect to user home after impersonating
        }
    };

    const handleDelete = (userId) => {
        dispatch(adminDeleteUserAsync(userId)).then(() => fetchData());
    };

    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) return;
        dispatch(adminBulkDeleteUsersAsync(selectedRowKeys)).then(() => {
            setSelectedRowKeys([]);
            fetchData();
        });
    };

    const handleBlockToggle = (userId) => {
        dispatch(adminToggleBlockUserAsync(userId)).then(() => fetchData());
    };

    const handleVerifyToggle = (userId) => {
        dispatch(adminToggleVerifyUserAsync(userId)).then(() => fetchData());
    };

    const openRoleModal = (user) => {
        setSelectedUser(user);
        setSelectedRoles([...user.role]);
        setRoleModalVisible(true);
    };

    const submitRoleUpdate = () => {
        if (selectedRoles.length === 0) {
            message.error("User must have at least one role.");
            return;
        }
        dispatch(adminUpdateUserRoleAsync({ id: selectedUser._id, role: selectedRoles })).then(() => {
            setRoleModalVisible(false);
            fetchData();
        });
    };

    const openPasswordModal = (user) => {
        setSelectedUser(user);
        setNewPassword('');
        setPasswordModalVisible(true);
    };

    const submitPasswordUpdate = () => {
        if (newPassword.length < 6) {
            message.error("Password must be at least 6 characters.");
            return;
        }
        dispatch(adminUpdateUserPasswordAsync({ id: selectedUser._id, password: newPassword })).then(() => {
            setPasswordModalVisible(false);
            fetchData();
        });
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: true,
        },
        {
            title: 'Status',
            key: 'status',
            filters: [
                { text: 'Blocked', value: 'blocked' },
                { text: 'Verified', value: 'verified' },
                { text: 'Unverified', value: 'unverified' }
            ],
            render: (_, record) => (
                <Space>
                    {record.isBlocked && <Tag color="red">BLOCKED</Tag>}
                    {record.isUserVerified ? <Tag color="green">VERIFIED</Tag> : <Tag color="orange">UNVERIFIED</Tag>}
                </Space>
            )
        },
        {
            title: 'Roles',
            key: 'role',
            filters: [
                { text: 'Admin', value: 'admin' },
                { text: 'User', value: 'user' },
                { text: 'Nursery', value: 'nursery' }
            ],
            render: (_, record) => (
                <>
                    {record.role.map((r) => {
                        let color = r === 'admin' ? 'volcano' : 'green';
                        if (r === 'nursery') color = 'geekblue';
                        return (
                            <Tag color={color} key={r}>
                                {r.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                const isAdmin = record.role.includes('admin');

                const items = [
                    {
                        key: '1',
                        label: 'Impersonate',
                        disabled: isAdmin || record.isBlocked,
                        onClick: () => handleImpersonate(record._id)
                    },
                    {
                        key: '2',
                        label: 'Assign Roles',
                        disabled: isAdmin,
                        onClick: () => openRoleModal(record)
                    },
                    {
                        key: '3',
                        label: 'Change Password',
                        disabled: isAdmin,
                        onClick: () => openPasswordModal(record)
                    },
                    {
                        type: 'divider',
                    },
                    {
                        key: '4',
                        label: record.isBlocked ? 'Unblock User' : 'Block User',
                        disabled: isAdmin,
                        danger: !record.isBlocked,
                        onClick: () => {
                            Modal.confirm({
                                title: record.isBlocked ? 'Unblock User?' : 'Block User?',
                                content: record.isBlocked ? 'This user will be able to log in again.' : 'This user will be immediately logged out and prevented from accessing the API.',
                                okText: 'Yes',
                                cancelText: 'No',
                                onConfirm: () => handleBlockToggle(record._id)
                            });
                        }
                    },
                    {
                        key: '5',
                        label: record.isUserVerified ? 'Unverify User' : 'Verify User',
                        disabled: isAdmin,
                        onClick: () => {
                            Modal.confirm({
                                title: record.isUserVerified ? 'Unverify User?' : 'Verify User?',
                                content: record.isUserVerified ? 'This user will lose verified status.' : 'This user will be marked as verified and will bypass OTP check.',
                                okText: 'Yes',
                                cancelText: 'No',
                                onConfirm: () => handleVerifyToggle(record._id)
                            });
                        }
                    },
                    {
                        key: '6',
                        label: 'Delete User',
                        disabled: isAdmin,
                        danger: true,
                        onClick: () => {
                            Modal.confirm({
                                title: 'Delete User?',
                                content: 'Are you sure you want to permanently delete this user?',
                                okText: 'Yes, Delete',
                                okType: 'danger',
                                cancelText: 'No',
                                onConfirm: () => handleDelete(record._id)
                            });
                        }
                    }
                ];

                return (
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button icon={<EllipsisOutlined />} size="small" />
                    </Dropdown>
                );
            },
        },
    ];

    const hasSelected = selectedRowKeys.length > 0;
    const roleOptions = [
        { label: 'User', value: 'user' },
        { label: 'Nursery', value: 'nursery' },
        { label: 'Admin', value: 'admin' },
    ];

    return (
        <div className="container-fluid p-2 p-md-4 bg-white rounded border">
            <Row justify="space-between" align="middle" gutter={[16, 16]} className="mb-4">
                <Col xs={24} md={8}>
                    <h4 className="fw-bold m-0">Platform Users</h4>
                </Col>
                <Col xs={24} md={16} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                    <Input
                        placeholder="Search users..."
                        allowClear
                        prefix={<span role="img" aria-label="search">🔍</span>}
                        value={localSearch}
                        onChange={handleSearchChange}
                        style={{ width: '100%', maxWidth: '300px' }}
                    />
                    {hasSelected && (
                        <Popconfirm
                            title={`Delete ${selectedRowKeys.length} users?`}
                            description="Are you sure you want to permanently delete these selected users?"
                            onConfirm={handleBulkDelete}
                            okText="Yes, Delete All"
                            cancelText="No"
                            okButtonProps={{ danger: true }}
                        >
                            <Button danger type="primary">
                                Bulk Delete ({selectedRowKeys.length})
                            </Button>
                        </Popconfirm>
                    )}
                </Col>
            </Row>

            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={users.map(u => ({ ...u, key: u._id }))}
                loading={isLoading}
                pagination={{
                    ...tableParams.pagination,
                    total: usersTotal,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
            />

            {/* Role Modal */}
            <Modal
                title={`Assign Roles to ${selectedUser?.name}`}
                open={roleModalVisible}
                onOk={submitRoleUpdate}
                onCancel={() => setRoleModalVisible(false)}
                okText="Save Roles"
            >
                <div className="py-3">
                    <p className="text-muted small">Select the roles this user should have:</p>
                    <Checkbox.Group
                        options={roleOptions}
                        value={selectedRoles}
                        onChange={(checkedValues) => setSelectedRoles(checkedValues)}
                    />
                </div>
            </Modal>

            {/* Password Modal */}
            <Modal
                title={`Change Password for ${selectedUser?.name}`}
                open={passwordModalVisible}
                onOk={submitPasswordUpdate}
                onCancel={() => setPasswordModalVisible(false)}
                okText="Update Password"
            >
                <div className="py-3">
                    <p className="text-muted small">Enter a new secure password (minimum 6 characters):</p>
                    <Input.Password
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Users;
