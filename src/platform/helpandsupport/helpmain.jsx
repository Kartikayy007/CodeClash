import React from 'react';
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import HelpPage from './helpandsupp';

function Helpmain() {
  return (
    <div className="fixed w-full top-0">
        <Sidebar/>
        <Header/>
        <div>
        <HelpPage/>
        </div>
        </div>
  )
}

export default Helpmain;
