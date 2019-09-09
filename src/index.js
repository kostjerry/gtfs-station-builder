import React from 'react';
import ReactDOM from 'react-dom';
import StationBuilder from './components/StationBuilder';

window.GtfsStationBuilder = {
    mount: (props, container) => {
        ReactDOM.render(<StationBuilder {...props} />, container);
    },
    unmount: (container) => {
        ReactDOM.unmountComponentAtNode(container);
    }
}
