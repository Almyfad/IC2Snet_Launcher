//import React, { useState, useEffect } from 'react';
import './style.css'

import Rive from 'rive-react';

const Online = () => {

  /*  const [data, setData] = useState([]);
    useEffect(() => {

    }, []);*/
  return (
  <div className="Home">
   <div className="rive"><Rive src="assets/appstart.riv" /*layout={new Layout({ fit: 'fitWidth', alignment: 'center' })} */ /></div>
    <div className="img"><img alt="underconstruction" src="./assets/img/underconstruction.jpg" /></div></div>
  )
}


export default Online;