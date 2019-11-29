import React from 'react';
import ReactDOM from 'react-dom';
import StationBuilder from './components/StationBuilder';
import App from './App';

window.GtfsStationBuilder = {
    mount: (props, container) => {
        ReactDOM.render(<StationBuilder {...props} />, container);
    },
    unmount: (container) => {
        ReactDOM.unmountComponentAtNode(container);
    }
}

const ref = document.getElementById("gtfs-station-builder-root");
if (ref) {
	ReactDOM.render(<App />, ref);
}
