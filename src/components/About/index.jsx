import './style.css';
import Rive, { Layout } from 'rive-react';
import Online from '../Online';
const About = () => <div className="About">
    <div className="r1">
        <Rive src="assets/appstart.riv" /*layout={new Layout({ fit: 'fitWidth', alignment: 'center' })} */ />
    </div>
    <div className="r2">
        <Online />
    </div>
    <div className="r3">
        Node.js <span id="node-version"></span>,
        Chromium <span id="chrome-version"></span>,
        Electron <span id="electron-version"></span>
    </div>
</div>
export default About;
