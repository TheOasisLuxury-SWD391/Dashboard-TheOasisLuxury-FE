// Sidebar imports
import {
  UilEstate,
  UilClipboardAlt,
  UilUsersAlt,
  UilPackage,
  UilChart,
  UilSignOutAlt,
} from "@iconscout/react-unicons";
import React, { useState, useEffect } from 'react';
// Analytics Cards imports
import { UilUsdSquare, UilMoneyWithdrawal } from "@iconscout/react-unicons";

// Sidebar Data
export const SidebarData = [
  { 
    path: '/',
    icon: UilEstate,
    heading: "Dashboard",
    roles: ['ADMIN'],
  },
  { 
    path: '/orders',
    icon: UilClipboardAlt,
    heading: "Orders",
    roles: ['ADMIN'],
  },
  { 
    path: '/accounts',
    icon: UilUsersAlt,
    heading: "Accounts",
    roles: ['ADMIN'],
  },
  { 
    path: '/projects',
    icon: UilPackage,
    heading: 'Projects',
    roles: ['ADMIN','STAFF'],
  },
  { 
    path: '/subdivisions',
    icon: UilPackage,
    heading: 'Subdivisions',
    roles: ['ADMIN','STAFF'],
  },
  { 
    path: '/villas',
    icon: UilClipboardAlt,
    heading: 'Villas',
    roles: ['ADMIN','STAFF'],
  },
  { 
    path: '/timeshares',
    icon: UilClipboardAlt,
    heading: 'Timeshares',
    roles: ['ADMIN','STAFF'],
  },
  { 
    path: '/contracts',
    icon: UilClipboardAlt,
    heading: 'Contracts',
    roles: ['ADMIN', 'STAFF'],
  },{ 
    path: '/blogs',
    icon: UilClipboardAlt,
    heading: 'Blog',
    roles: ['ADMIN','STAFF'],
  },
];



