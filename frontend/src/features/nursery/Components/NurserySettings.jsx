import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, Divider, message, Alert, Tabs, Popconfirm, Upload } from 'antd';
import { UploadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { updateNurserySMTPSettingsAsync, nurseryUpdateAsync, nurseryDeleteAsync, nurseryProfileImagesUpload } from '../nurserySlice';

const { TabPane } = Tabs;

const NurserySettings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    
    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get('tab') || 'general-profile';

    const { nursery, isLoading } = useSelector(state => state.nursery);
    const { userData: user } = useSelector(state => state.user);
    
    const [smtpForm] = Form.useForm();
    const [profileForm] = Form.useForm();
    const [socialForm] = Form.useForm();

    useEffect(() => {
        if (nursery) {
            smtpForm.setFieldsValue({
                email: nursery.smtpSettings?.email || '',
                password: nursery.smtpSettings?.password || ''
            });

            profileForm.setFieldsValue({
                nurseryName: nursery.nurseryName || '',
                address: nursery.address || '',
                pinCode: nursery.pinCode || '',
                city: nursery.city || '',
                state: nursery.state || ''
            });

            socialForm.setFieldsValue({
                facebook: nursery.socialLinks?.facebook || '',
                instagram: nursery.socialLinks?.instagram || '',
                website: nursery.socialLinks?.website || ''
            });
        }
    }, [nursery, smtpForm, profileForm, socialForm]);

    const handleSMTPSubmit = async (values) => {
        try {
            const res = await dispatch(updateNurserySMTPSettingsAsync(values)).unwrap();
            if (res.status) {
                message.success('SMTP Settings updated successfully');
            }
        } catch (error) {
            message.error(error.message || 'Failed to update SMTP settings');
        }
    };

    const handleProfileSubmit = async (values) => {
        try {
            await dispatch(nurseryUpdateAsync({ nurseryData: values, navigate: () => {} })).unwrap();
            message.success('Profile updated successfully');
        } catch (error) {
            message.error(error.message || 'Failed to update profile');
        }
    };

    const handleSocialSubmit = async (values) => {
        try {
            await dispatch(nurseryUpdateAsync({ nurseryData: { socialLinks: values }, navigate: () => {} })).unwrap();
            message.success('Social links updated successfully');
        } catch (error) {
            message.error(error.message || 'Failed to update social links');
        }
    };

    const handleImageUpload = async (file, type) => {
        const data = new FormData();
        data.append("type", type);
        data.append(type, file);
        data.append("nurserId", nursery._id); // Typo maintained from original code 'nurserId'

        try {
            await dispatch(nurseryProfileImagesUpload(data)).unwrap();
            message.success(`${type} image uploaded successfully`);
            return false; // Prevent default upload behavior
        } catch(error) {
            message.error(error.message || "Upload failed");
            return false;
        }
    };

    const handleDeactivate = async () => {
        try {
            await dispatch(nurseryUpdateAsync({ nurseryData: { isActive: false }, navigate: () => {} })).unwrap();
            message.success("Nursery account deactivated successfully.");
        } catch (error) {
            message.error(error.message || "Failed to deactivate");
        }
    };

    const handleDelete = async () => {
        try {
            await dispatch(nurseryDeleteAsync()).unwrap();
            navigate('/profile'); // Redirect after deletion
        } catch (error) {
            message.error(error.message || "Failed to delete nursery");
        }
    };
    const [tabPosition, setTabPosition] = useState(window.innerWidth < 768 ? 'top' : 'left');

    useEffect(() => {
        const handleResize = () => setTabPosition(window.innerWidth < 768 ? 'top' : 'left');
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!nursery) return <div>Loading...</div>;

    const cover = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/nursery-cover-header";
    const defaultAvatarUrl = "https://res.cloudinary.com/dcd6y2awx/image/upload/f_auto,q_auto/v1/PlantSeller/UI%20Images/nursery-avatar-header";

    return (
        <div className="row g-2 my-2 bg-white border rounded p-2 p-md-3 mx-1 mx-md-2" style={{ minHeight: '80vh' }}>
            <h4 className='h4 fw-bolder mb-1'>Nursery Settings</h4>
            <p className="text-muted small m-0 mb-4">Manage your nursery's global configurations, branding, and details.</p>
            
            <Tabs 
                activeKey={activeTab} 
                onChange={(key) => navigate(`?tab=${key}`)} 
                tabPosition={tabPosition}
            >
                {/* 1. GENERAL PROFILE */}
                <TabPane tab="General Profile" key="general-profile">
                    <Card title="Profile Details" bordered={false} className="mb-4 shadow-sm">
                        <Form form={profileForm} layout="vertical" onFinish={handleProfileSubmit}>
                            
                            {/* Read-only indicators */}
                            <Alert 
                                message="Owner Name, Email, and Phone cannot be changed here as they are linked to your core account." 
                                type="info" 
                                showIcon 
                                className="mb-4"
                            />
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label text-muted">Owner Name</label>
                                    <Input value={nursery.nurseryOwnerName} disabled />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label text-muted">Email</label>
                                    <Input value={nursery.nurseryEmail} disabled />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label text-muted">Phone</label>
                                    <Input value={nursery.nurseryPhone} disabled />
                                </div>
                            </div>
                            
                            <Divider />
                            <h6 className="mb-3">Editable Details</h6>

                            <Form.Item name="nurseryName" label="Nursery Name" rules={[{ required: true, message: 'Please enter nursery name' }]}>
                                <Input />
                            </Form.Item>
                            
                            <Form.Item name="address" label="Address" rules={[{ required: true, message: 'Please enter address' }]}>
                                <Input />
                            </Form.Item>
                            
                            <div className="row">
                                <div className="col-md-4">
                                    <Form.Item name="city" label="City" rules={[{ required: true, message: 'Please enter city' }]}>
                                        <Input />
                                    </Form.Item>
                                </div>
                                <div className="col-md-4">
                                    <Form.Item name="state" label="State" rules={[{ required: true, message: 'Please enter state' }]}>
                                        <Input />
                                    </Form.Item>
                                </div>
                                <div className="col-md-4">
                                    <Form.Item name="pinCode" label="Pin Code" rules={[{ required: true, message: 'Please enter pin code' }]}>
                                        <Input type="number" />
                                    </Form.Item>
                                </div>
                            </div>
                            
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isLoading}>Save Profile</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                {/* 2. MEDIA & BRANDING */}
                <TabPane tab="Media & Branding" key="media-branding">
                    <Card title="Images" bordered={false} className="mb-4 shadow-sm">
                        <div className="mb-5">
                            <h6 className="mb-3">Avatar (Logo)</h6>
                            <div className="d-flex align-items-center">
                                <img src={nursery.avatar?.url || defaultAvatarUrl} alt="Avatar" className="rounded-circle border me-4" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                <Upload 
                                    accept="image/png, image/jpeg" 
                                    showUploadList={false} 
                                    beforeUpload={(file) => handleImageUpload(file, 'avatar')}
                                >
                                    <Button icon={<UploadOutlined />} loading={isLoading}>Upload New Avatar</Button>
                                </Upload>
                            </div>
                        </div>
                        
                        <Divider />
                        
                        <div>
                            <h6 className="mb-3">Cover Image</h6>
                            <div className="mb-3">
                                <img src={nursery.cover?.url || cover} alt="Cover" className="rounded border w-100" style={{ height: '200px', objectFit: 'cover' }} />
                            </div>
                            <Upload 
                                accept="image/png, image/jpeg" 
                                showUploadList={false} 
                                beforeUpload={(file) => handleImageUpload(file, 'cover')}
                            >
                                <Button icon={<UploadOutlined />} loading={isLoading}>Upload New Cover</Button>
                            </Upload>
                        </div>
                    </Card>
                </TabPane>

                {/* 3. SOCIAL & LINKS */}
                <TabPane tab="Social & Links" key="social-links">
                    <Card title="Online Presence" bordered={false} className="mb-4 shadow-sm">
                        <Form form={socialForm} layout="vertical" onFinish={handleSocialSubmit}>
                            <Form.Item name="website" label="Website URL" rules={[{ type: 'url', message: 'Enter a valid URL' }]}>
                                <Input placeholder="https://www.yourwebsite.com" />
                            </Form.Item>
                            
                            <Form.Item name="facebook" label="Facebook Page URL" rules={[{ type: 'url', message: 'Enter a valid URL' }]}>
                                <Input placeholder="https://facebook.com/yourpage" />
                            </Form.Item>
                            
                            <Form.Item name="instagram" label="Instagram URL" rules={[{ type: 'url', message: 'Enter a valid URL' }]}>
                                <Input placeholder="https://instagram.com/yourhandle" />
                            </Form.Item>
                            
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isLoading}>Save Links</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                {/* 4. SMTP SETTINGS */}
                <TabPane tab="SMTP Settings" key="smtp-settings">
                    <Card title="Help Center Email Integrations" bordered={false} className="mb-4 shadow-sm">
                        <Alert 
                            message="Setup 'Reply via Email'" 
                            description="Configure your email credentials here to reply directly to customer queries via Email from the Help center. We strongly recommend using a Gmail App Password rather than your real password." 
                            type="info" 
                            showIcon 
                            className="mb-4"
                        />

                        <Form form={smtpForm} layout="vertical" onFinish={handleSMTPSubmit}>
                            <Form.Item name="email" label="SMTP Email Address" rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Please enter a valid email' }]}>
                                <Input placeholder="e.g. nursery@gmail.com" />
                            </Form.Item>

                            <Form.Item name="password" label="SMTP Password / App Password" rules={[{ required: true, message: 'Please enter your password or app password' }]}>
                                <Input.Password placeholder="Enter your 16-digit App Password" />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isLoading}>Save Email Settings</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </TabPane>

                {/* 5. DANGER ZONE */}
                <TabPane tab={<span className="text-danger">Danger Zone</span>} key="danger-zone">
                    <Card title="Account Management" bordered={false} className="mb-4 border-danger border-opacity-25 shadow-sm">
                        <div className="mb-4">
                            <h6 className="text-warning mb-2">Deactivate Nursery</h6>
                            <p className="text-muted small">Temporarily hide your nursery and store from the public. You can reactivate it later.</p>
                            <Popconfirm 
                                title="Are you sure you want to deactivate?" 
                                onConfirm={handleDeactivate} 
                                okText="Yes, Deactivate" 
                                cancelText="Cancel"
                            >
                                <Button type="default" danger>Deactivate Nursery</Button>
                            </Popconfirm>
                        </div>
                        
                        <Divider />
                        
                        <div>
                            <h6 className="text-danger mb-2">Delete Nursery Permanently</h6>
                            <p className="text-muted small">This action cannot be undone. All your plants, orders, and templates will be permanently removed.</p>
                            <Popconfirm 
                                title="Are you absolutely sure?" 
                                description="This action cannot be undone." 
                                onConfirm={handleDelete} 
                                okText="Yes, Delete Permanently" 
                                okButtonProps={{ danger: true }}
                                cancelText="Cancel"
                            >
                                <Button type="primary" danger>Delete Nursery</Button>
                            </Popconfirm>
                        </div>
                    </Card>
                </TabPane>

            </Tabs>
        </div>
    );
};

export default NurserySettings;
