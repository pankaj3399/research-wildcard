import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Steps, Button, Input, Form, Select, message } from 'antd';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

function ProjectForm() {
    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        collaborators: []
    });
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [employeeMap, setEmployeeMap] = useState({});
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('http://localhost:3000/project/employees');
                const options = response.data.map(employee => ({
                    value: employee._id,
                    label: employee.name
                }));
                setEmployeeOptions(options);
                setEmployeeMap(response.data.reduce((map, employee) => ({...map, [employee._id]: employee.name}), {}));
    
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    const handleChange = (name, value) => {
        setProjectData({ ...projectData, [name]: value });
    };

    const filterOptions = (input, option) =>
    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

    



    

    const handleSubmit = async () => {
        const token = localStorage.getItem('token'); 

        try {
            const response = await axios.post('http://localhost:3000/project/create', projectData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            message.success('Project created successfully');
            navigate('/dashboard');
            // Additional actions after successful creation (e.g., redirect)
        } catch (error) {
            console.error('Error creating project:', error);
            message.error('Error creating project');
        }
    };

    const steps = [
        {
            title: 'Project Details',
            content: (
                <Form.Item>
                    <Input
                        placeholder="Project Title"
                        value={projectData.title}
                        onChange={e => handleChange('title', e.target.value)}
                    />
                    <TextArea
                        placeholder="Project Description"
                        value={projectData.description}
                        onChange={e => handleChange('description', e.target.value)}
                        style={{ marginTop: '16px' }}
                    />
                </Form.Item>
            ),
        },
        {
            title: 'Collaborators',
            content: (
                <Form.Item>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select collaborators"
                        value={projectData.collaborators}
                        onChange={value => handleChange('collaborators', value)}
                        showSearch
                        filterOption={filterOptions}
                    >
                        {employeeOptions.map(option => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            ),
        },
        {
            title: 'Confirmation',
            content: (
                <div>
                    <h3>Project Title:</h3>
                    <p>{projectData.title}</p>
                    <h3>Project Description:</h3>
                    <p>{projectData.description}</p>
                    <h3>Collaborators:</h3>
                    <ul>
                        {projectData.collaborators.map((collaboratorId, index) => (
                            <li key={index}>{employeeMap[collaboratorId]}</li>
                        ))}
                    </ul>
                </div>
            ),
        },
    ];
    

    return (
        <Form onFinish={handleSubmit} layout="vertical">
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
                    <Button type="primary" onClick={() => {
                        console.log(projectData);
                        console.log(projectData.collaborators);
                        setCurrentStep(currentStep + 1);
                    }}>
                        Next
                    </Button>
                )}
                {currentStep === steps.length - 1 && (
                    <Button type="primary" htmlType="submit">
                        Confirm Project
                    </Button>
                )}
                {currentStep > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => setCurrentStep(currentStep - 1)}>
                        Previous
                    </Button>
                )}
            </div>
        </Form>
    );
}

export default ProjectForm;
