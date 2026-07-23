import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Card, Divider, message, Alert } from 'antd';
import { updateNurserySMTPSettingsAsync } from '../nurserySlice';

const NurserySettings = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSMTPSubmit = async (values) => {
        setIsLoading(true);
        try {
            const res = await dispatch(updateNurserySMTPSettingsAsync(values)).unwrap();
            if (res.status) {
                message.success('SMTP Settings updated successfully');
                form.resetFields();
            }
        } catch (error) {
            message.error(error.message || 'Failed to update settings');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="row g-2 my-2 bg-white border rounded p-3 mx-2">
            <h5 className='h5 fw-bolder mb-0'>Nursery Settings</h5>
            <p className="text-muted small m-0">Configure your nursery's global settings here.</p>
            
            <Divider />

            <Card title="SMTP Email Settings" bordered={false} className="mb-4">
                <Alert 
                    message="Setup 'Reply via Email'" 
                    description="Configure your email credentials here to reply directly to customer queries via Email from the Help center. We strongly recommend using a Gmail App Password rather than your real password." 
                    type="info" 
                    showIcon 
                    className="mb-4"
                />

                <Form 
                    form={form} 
                    layout="vertical" 
                    onFinish={handleSMTPSubmit}
                >
                    <Form.Item
                        name="email"
                        label="SMTP Email Address"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input placeholder="e.g. nursery@gmail.com" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="SMTP Password / App Password"
                        rules={[{ required: true, message: 'Please enter your password or app password' }]}
                    >
                        <Input.Password placeholder="Enter your 16-digit App Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isLoading}>
                            Save Email Settings
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default NurserySettings;
