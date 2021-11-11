import './style.css';
import Rive, { Layout } from 'rive-react';
const About = () => <div className="About">
    <div className="r1">
    <Rive src="assets/appstart.riv" layout={new Layout({ fit: 'fitWidth', alignment: 'center' })} />
    </div>
<div className="r2">
    <h3 className="blink_me">Coming Soon...</h3>
</div>
<div className="r3">
    <a id="asystrayme" href="#" className="myButton" onClick={() => window.systray.me()}>Systray Me</a>
</div>
    <div className="r4">
        Node.js <span id="node-version"></span>,
        Chromium <span id="chrome-version"></span>,
        Electron <span id="electron-version"></span>
    </div>
</div>
export default About;
