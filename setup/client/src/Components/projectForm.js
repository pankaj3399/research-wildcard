import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Steps, Select, message, Upload, DatePicker, List } from 'antd';
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
    articles: [],
    pubmedIds: '' // Added for PubMed IDs
};

const ProjectForm = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [projectData, setProjectData] = useState(initialProjectDataState);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [usersMap, setUsersMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [studies, setStudies] = useState([]);
    const [projects, setProjects] = useState([]);


    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/users');
                const options = response.data.map(user => ({
                    value: user._id,
                    label: user.name
                }));
                setUsers(options);
                setUsersMap(response.data.reduce((map, user) => ({...map, [user._id]: user.name}), {}));
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
    
        fetchEmployees();
    }, []);

    useEffect(() => {
        const fetchStudiesAndProjects = async () => {
            try {
                const studiesResponse = await axios.get('http://localhost:3000/api/projects/:projectId/articles');
                setStudies(studiesResponse.data);
    
                const projectsResponse = await axios.get('http://localhost:3000/api/projects/display');
                setProjects(projectsResponse.data);
            } catch (error) {
                console.error('Error fetching studies and projects:', error);
            }
        };
    
        fetchStudiesAndProjects();
    }, []);



    const handleChange = (key, value) => {
        setProjectData({ ...projectData, [key]: value });
    };

    const handleFileChange = info => {
        let fileList = [...info.fileList];
        handleChange('articles', fileList);
    };

    const handleSubmit = async () => {
        setLoading(true);
    
        try {
            // Create project
            const projectResponse = await axios.post('http://localhost:3000/api/projects', {
                title: projectData.title,
                description: projectData.description,
                startDate: projectData.startDate,
                collaborators: projectData.collaborators,
            });
    
            // Upload articles (if any)
            const formData = new FormData();
            formData.append('pubmedIds', projectData.pubmedIds); // Include PubMed IDs
            projectData.articles.forEach(file => {
                formData.append('articles', file.originFileObj);
            });
    
            await axios.post(`http://localhost:3000/api/projects/${projectResponse.data.project._id}/articles`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Assign roles to collaborators (as needed)
    
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
                    <Form.Item label="Collaborators" name="collaborators" rules={[{ required: true, message: 'Please select at least two collaborator!' }]}>
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
<List
    itemLayout="horizontal"
    dataSource={projectData.collaborators.map(userId => ({id: userId, name: usersMap[userId]}))}
    renderItem={user => (
        <List.Item>
            <List.Item.Meta
                title={user.name}
            />
            <Form.Item name={`role-${user.id}`} rules={[{ required: true, message: 'Please select a role!' }]}>
                <Select
                    placeholder="Select role"
                    onChange={value => handleChange('roles', projectData.roles.map(r => r.userId === user.id ? { ...r, roleId: value } : r))}
                >
                    {roles.map(role => (
                        <Option key={role._id} value={role._id}>{role.name}</Option>
                    ))}
                </Select>
            </Form.Item>
        </List.Item>
    )}
/>

        

                </div>
            ),
        },
        
        {
            title: 'Upload articles',
            content: (
                <div>
                    <Form.Item label="PubMed IDs" name="pubmedIds">
                        <Input placeholder="Enter PubMed IDs separated by commas" value={projectData.pubmedIds} onChange={e => handleChange('pubmedIds', e.target.value)} />
                    </Form.Item>
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


    
    
    
    
    
    
    

    