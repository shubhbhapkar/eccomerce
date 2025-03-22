import React from 'react'
import Navbar from './vendorNavbar';
import Summary from './summary';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


const Dashboard = () => {
  return (
    <div className='d-flex'>
      <div >
      <Navbar></Navbar>
      </div>
      <div >
      <Summary/>
      </div>
    </div>
  )
}

export default Dashboard;
