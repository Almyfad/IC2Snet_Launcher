import './style.css';
import Rive from 'rive-react';
const About = () => <div className="About">
    <div className="r1">
        <Rive src="assets/appstart.riv" /*layout={new Layout({ fit: 'fitWidth', alignment: 'center' })} */ />
    </div>
    <div className="r2">
        V{window.about.version()}
    </div>
    <div className="r3">
        Node.js {window.about.node()}<span id="node-version"></span>,
        Chromium {window.about.chrome()}<span id="chrome-version"></span>,
        Electron {window.about.electron()}<span id="electron-version"></span>
    </div>
</div>
export default About;

//<Rive src="assets/appstart.riv" layout={new Layout({ fit: 'fitWidth', alignment: 'center' })} />