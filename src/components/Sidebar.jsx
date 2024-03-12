import React, { useState } from "react";
import "./Sidebar.css";
import Logo from "../imgs/logo.png";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { SidebarData } from "../Data/Data";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";
import { NavLink } from 'react-router-dom';
const Sidebar = ({role}) => {
  const [selected, setSelected] = useState(0);

  const [expanded, setExpaned] = useState(true)

  const sidebarVariants = {
    true: {
      left : '0'
    },
    false:{
      left : '-60%'
    }
  }
  
  console.log(window.innerWidth)
  const filteredSidebarData = SidebarData.filter(item => {
  
    if (item.roles && item.roles.includes(role)) {
      return true;
    }
    return false;
  });
  return (
    <>
      <div className="bars" style={expanded?{left: '60%'}:{left: '5%'}} onClick={()=>setExpaned(!expanded)}>
        <UilBars />
      </div>
    <motion.div className='sidebar'
    variants={sidebarVariants}
    animate={window.innerWidth<=768?`${expanded}`:''}
    >
      {/* logo */}
      {/* <div className="logo">
        <img src={Logo} alt="logo" />
        <span>
          Sh<span>o</span>ps
        </span>
      </div> */}

<div className="menu">
        {filteredSidebarData.map((item, index) => (
         <NavLink
         to={item.path}
         key={index}
         className={({ isActive }) =>
           isActive ? 'menuItem active' : 'menuItem'
         }
         style={{ textDecoration: 'none' }} 
       >
         <item.icon />
         <span>{item.heading}</span>
       </NavLink>
        ))}
        {/* signoutIcon */}
        <div className="menuItem">
          {/* <UilSignOutAlt /> */}
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default Sidebar;
