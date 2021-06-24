import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import HistoryIcon from '@material-ui/icons/History';
import EventNoteIcon from '@material-ui/icons/EventNote';
import SettingsIcon from '@material-ui/icons/Settings';

export const SidebarData = [
    {
        title: "Dashboard",
        icon: <DashboardIcon />,
        link: "/dashboard"
    },
    {
        title: "Task History",
        icon: <HistoryIcon />,
        link: "/task-history",
    },
    {
        title: "Calendar",
        icon: <EventNoteIcon />,
        link: "/calendar"
    },{
        title: "Settings",
        icon: <SettingsIcon />,
        link: "/settings"
    },
];
