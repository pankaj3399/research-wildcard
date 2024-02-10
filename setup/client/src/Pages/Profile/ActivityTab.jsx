import React from 'react';
import { Box, List, ListItem, ListItemText, Divider } from '@mui/material';

function ActivityTab() {
  
  const activities = [
    { date: '2024-02-10', activity: 'Accepted review for project A' },
    { date: '2024-02-12', activity: 'Completed data extraction for project B' },
    { date: '2024-02-15', activity: 'Resolved conflicts for project C' },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <List>
        {activities.map((activity, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText primary={activity.activity} secondary={activity.date} />
            </ListItem>
            {index < activities.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
}

export default ActivityTab;
