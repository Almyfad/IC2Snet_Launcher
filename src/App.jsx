import './App.css';
import Home from './components/Home'
import About from './components/About'
import Online from './components/Online'
import React, { useState, useEffect } from 'react';


import { bubble as Menu } from 'react-burger-menu'

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeviceHubOutlinedIcon from '@mui/icons-material/DeviceHubOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';




const App = () => {
  const switchToScrren = (e, screen) => {
    e.preventDefault();
    setScreen(screen)
    setisOpen(false)
  }

  const handleOpen = () => {
    setisOpen(true)
  }

  const handleClose = () => {
    setisOpen(false)
  }

  const [screen, setScreen] = useState('Home');
  const [isOpen, setisOpen] = useState(false);
  const [isAdmin, SetIsAdmin] = useState(false);


  useEffect(() => {
    window.profil.isadmin().then(x => {
      SetIsAdmin(x)
    })
  }, []);


  return <>
    <div className="App">
      <Menu isOpen={isOpen} onOpen={handleOpen} onClose={handleClose} pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
        <div className="menulogo" onClick={(e) => switchToScrren(e, "Home")}><img alt="logo" src="./assets/img/logo.png" /></div>
        <div className="menuitem" onClick={(e) => switchToScrren(e, "Home")}>< HomeOutlinedIcon /><span>Acceuil</span></div>
        <>{isAdmin && <div className="menuitem" onClick={(e) => switchToScrren(e, "Online")}>< DeviceHubOutlinedIcon /><span>Liste des devices</span></div>}</>
        <div className="menuitem" onClick={(e) => switchToScrren(e, "About")}>< InfoOutlinedIcon /><span>A propos</span></div>
      </Menu>
      <div id="outer-container">
        <div id="page-wrap">
          <Switch Screen={screen} />
        </div>
      </div>
    </div></>
    ;
}



const Switch = ({ Screen }) => {
  switch (Screen) {
    case "Home":
      return <Home />
    case "Online":
      return <Online />
    case "About":
      return <About />
    default:
      return <Home />
  }
}

export default App;



