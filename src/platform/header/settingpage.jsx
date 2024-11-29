import React from 'react';
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";
import SettingsPage from '../settings/settings';

function Settingpage() {
  return (
    <div className="absolute w-full top-0">
    <Sidebar/>
    <Header/>
    <SettingsPage/>
    </div>
  )
}

export default Settingpage;
