import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { message, Table, Space, Popconfirm, Tag, Button } from 'antd';
import localStorageUtil from '../../../utils/localStorage';
import { adminUsersAsync, adminImpersonateAsync, adminDeleteUserAsync, adminBulkDeleteUsersAsync } from '../adminSlice';

const Users = () => {
    const dispatch = useDispatch();
    const { users, isLoading } = useSelector((state) => state.admin);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        dispatch(adminUsersAsync());
    }, [dispatch]);

    const handleImpersonate = async (userId) => {
        const action = await dispatch(adminImpersonateAsync({ targetUserId: userId }));
        
        if (adminImpersonateAsync.fulfilled.match(action) && action.payload.status) {
            localStorageUtil.setData("accessToken", action.payload.accessToken);
            localStorageUtil.setData("refreshToken", action.payload.refreshToken);
            window.location.href = '/home'; // Redirect to user home after impersonating
        }
    };

    const handleDelete = (userId) => {
        dispatch(adminDeleteUserAsync(userId));
    };

    const handleBulkDelete = () => {
        if (selectedRowKeys.length === 0) return;
        dispatch(adminBulkDeleteUsersAsync(selectedRowKeys)).then(() => {
            setSelectedRowKeys([]);
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
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Roles',
            key: 'roles',
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
            render: (_, record) => (
                <Space size="middle">
                    <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => handleImpersonate(record._id)}
                        disabled={record.role.includes('admin')}
                    >
                        Impersonate
                    </button>
                    
                    <Popconfirm
                        title="Delete this user?"
                        description="Are you sure you want to permanently delete this user?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes, Delete"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                        disabled={record.role.includes('admin')}
                    >
                        <button className="btn btn-sm btn-danger" disabled={record.role.includes('admin')}>
                            <i className="fas fa-trash"></i>
                        </button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const hasSelected = selectedRowKeys.length > 0;

    return (
        <div className="container-fluid p-2 p-md-4 bg-white rounded border">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0">Platform Users</h4>
                
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
            </div>
            
            <Table 
                rowSelection={rowSelection}
                columns={columns} 
                dataSource={users.map(u => ({ ...u, key: u._id }))} 
                loading={isLoading}
                pagination={{ pageSize: 10 }}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default Users;
