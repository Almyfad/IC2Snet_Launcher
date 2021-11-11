import './style.css';
import Rive from 'rive-react';
const About = () => <div className="App">
    <Rive src="assets/appstart.riv" />
    <h3 className="blink_me">Coming Soon...</h3>
    <a id="asystrayme" href="#" className="myButton" onClick={() => window.systray.me()}>Systray Me</a>
    <p></p>
    <div>
        Node.js <span id="node-version"></span>,
        Chromium <span id="chrome-version"></span>,
        Electron <span id="electron-version"></span>
    </div>
</div>

export default About;
