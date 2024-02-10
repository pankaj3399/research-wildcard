import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import AccountTab from './AccountTab';
import TodoListTab from './TodoListTab'; 
import NotificationsTab from './NotificationsTab'; 
import ActivityTab from './ActivityTab';

function ProfilePage() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ 
      flexGrow: 1,
      marginLeft: '240px',
      width: 'calc(100% - 240px)', 
    }}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
      <Tabs 
        value={selectedTab} 
        onChange={handleChange} 
        aria-label="profile tabs" 
        variant="fullWidth" 
      >
        <Tab label="Account" />
        <Tab label="Notifications" />
        <Tab label="To-Do List" />
        <Tab label="Activity" />
      </Tabs>
    </Box>
    {selectedTab === 0 && <AccountTab />}
    {selectedTab === 1 && <NotificationsTab />}
    {selectedTab === 2 && <TodoListTab />}
    {selectedTab === 3 && <ActivityTab />}
  </Box>
);
}

export default ProfilePage;