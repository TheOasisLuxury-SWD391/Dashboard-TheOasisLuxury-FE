import React from "react";

import Table from "../Table/Table";
import "./MainDash.css";
import YourComponent from "../Cards/card";
import Card from "../Cards/card";
const MainDash = () => {
  return (
    <div className="MainDash">
      <h1>Dashboard</h1>
      <Card/>
      <Table />
    </div>
  );
};

export default MainDash;
