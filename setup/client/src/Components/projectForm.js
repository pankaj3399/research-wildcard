import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Steps, Select, message, Upload, DatePicker } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;
const Dragger = Upload.Dragger;
const initialProjectDataState = {
    title: '',
    description: '',
    collaborators: [],
    roles: [],
    articles: []
};


const ProjectForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        collaborators: [],
        roles: [],
        articles: []
    });
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/users');
                console.log("Fetched users response:", response.data); // Log #1: Raw response from /api/users
                const options = response.data.map(users => ({
                    value: users._id,
                    label: users.name
                }));
                console.log("Processed users for select options:", options); // Log #2: Processed data for Select component
                setUsers(options);
                setUsersMap(response.data.reduce((map, users) => ({...map, [users._id]: users.name}), {}));
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
    
        fetchEmployees();
    }, []);

    useEffect(() => {
        console.log("Updated users state:", users); // Log #3: Check the updated 'users' state
    }, [users]);

    useEffect(() => {
        console.log("Current collaborators selection:", projectData.collaborators); // Log #6: Monitor collaborator selections
    }, [projectData.collaborators]);
    
    
    

    const handleChange = (key, value) => {
        console.log(`Value before setting ${key}:`, value); // Log #5: Check value before setting state
        setProjectData({ ...projectData, [key]: value });
    };
    
    

    const handleFileChange = info => {
        // Assuming you want to post articles directly on form submission rather than immediately
        let articleList = [...info.articleList];
        // You might want to process articleList here
        handleChange('articles', articleList);
    };
    

    const handleSubmit = async () => {
        setLoading(true);
    
        try {
            // 1. Create project
            const projectResponse = await axios.post('/api/projects', {
                title: projectData.title,
                description: projectData.description,
                startDate: projectData.startDate, // Assuming you have a start date
                collaborators: projectData.collaborators.map(c => c.userId), // Just sending user IDs initially
            });
    
            // 2. Upload articles (if any)
            if (projectData.articles && projectData.articles.length > 0) {
                const formData = new FormData();
                projectData.articles.forEach(file => {
                    formData.append('articles', file.originFileObj);
                });
    
                await axios.post(`/api/projects/${projectResponse.data.project._id}/articles`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
    
            // 3. Assign roles to collaborators
            for (const collaborator of projectData.collaborators) {
                await axios.post('/api/userRoles/assignRole', {
                    userId: collaborator.userId,
                    roleId: collaborator.roleId,
                    projectId: projectResponse.data.project._id,
                    // Include teamId if applicable
                });
            }
    
            // Final Step: Confirmation and Cleanup
            message.success('Project created successfully!');
            setLoading(false);
            setCurrentStep(0);
            setProjectData(initialProjectDataState); 
        } catch (error) {
            console.error('Error creating project:', error);
            setLoading(false);
            message.error('Failed to create project. Please try again.');
        }
    };

    const steps = [
        {
            title: 'Project Details',
            content: (
                <div>
                    <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the project title!' }]}>
                        <Input value={projectData.title} onChange={e => handleChange('title', e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please input the project description!' }]}>
                        <TextArea value={projectData.description} onChange={e => handleChange('description', e.target.value)} />
                    </Form.Item>
                    <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: 'Please select the start date!' }]}>
                        <DatePicker onChange={date => handleChange('startDate', date)} />
                    </Form.Item>
                </div>
            ),
        },
        {
            title: 'Collaborators',
            content: (
                <div>
                    <Form.Item label="Collaborators" name="collaborators" rules={[{ required: true, message: 'Please select at least one collaborator!' }]}>
    <Select
        mode="multiple"
        placeholder="Select collaborators"
        value={projectData.collaborators}
        onChange={value => handleChange('collaborators', value)}
    >
        {users.map(user => (
            <Option key={user.value} value={user.value}>{user.label}</Option>
        ))}
    </Select>
</Form.Item>

                </div>
            ),
        },
        {
            title: 'Roles',
            content: (
                <div>
                    {projectData.collaborators.map(collaborator => (
                        <Form.Item key={collaborator.userId} label={`Role for ${collaborator.name}`} name={`role-${collaborator.userId}`} rules={[{ required: true, message: `Please select a role for ${collaborator.name}!` }]}>
                            <Select
                                placeholder={`Select role for ${collaborator.name}`}
                                value={collaborator.roleId}
                                onChange={value => handleChange('collaborators', projectData.collaborators.map(c => c.userId === collaborator.userId ? { ...c, roleId: value } : c))}
                            >
                                {roles.map(role => (
                                    <Option key={role._id} value={role._id}>{role.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    ))}
                </div>
            ),
        },
        {
            title: 'Upload articles',
            content: (
                <div>
                    <Dragger
                        name="articles"
                        multiple
                        onChange={handleFileChange}
                        beforeUpload={() => false} // Prevent file upload here
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                    </Dragger>
                </div>
            ),
        },
        {
            title: 'Confirmation',
            content: (
                <div>
                    <h3>Project Title: {projectData.title}</h3>
                    <h3>Project Description:</h3>
                    <p>{projectData.description}</p>
                    <h3>Collaborators:</h3>
                    {projectData.collaborators.map(collaborator => (
                        <p key={collaborator}>{users.find(option => option.value === collaborator)?.label}</p>
                    ))}
                    <h3>Roles:</h3>
                    {projectData.roles.map(role => (
                        <p key={role.roleId}>{`${roles.find(option => option.value === role.roleId)?.label} assigned to ${users.find(option => option.value === role.userId)?.label}`}</p>
                    ))}
                </div>
            ),
        },
    ];
    

    return (
        <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Steps current={currentStep}>
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="steps-content" style={{ marginTop: '24px' }}>
                {steps[currentStep].content}
            </div>
            <div className="steps-action" style={{ marginTop: '24px' }}>
                {currentStep < steps.length - 1 && (
                    <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)} disabled={loading}>
                        Next
                    </Button>
                )}
                {currentStep === steps.length - 1 && (
                    <Button type="primary" onClick={handleSubmit} disabled={loading}>
                        Confirm Project
                    </Button>
                )}
                {currentStep > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => setCurrentStep(currentStep - 1)} disabled={loading}>
                        Previous
                    </Button>
                )}
            </div>
        </Form>
    );
}

export default ProjectForm;


    
    
    
    
    
    
    

    