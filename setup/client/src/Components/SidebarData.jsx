import React from "react";
import DashboardIcon from '@mui/icons-material/Dashboard';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const SidebarData = [
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
    link: "/dashboard",
  },
  {
    title: "PRISMA",
    icon: <NoteAddIcon />,
    link: "/prisma",
  },
  {
    title: "Profile", 
    icon: <AccountCircleIcon />,
    link: "/profile", 
  },
  {
    title: "Settings",
    icon: <SettingsIcon />,
    link: "/settings",
  },
];