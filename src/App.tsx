import React, { Component } from 'react';
import './App.scss';
import StationBuilder from './components/StationBuilder';
import Communication from './interfaces/Communication';
import GTFSService from './services/GTFSService';
import { GTFSStopNumericFields } from './interfaces/GTFSStop';
import { GTFSPathwayNumericFields } from './interfaces/GTFSPathway';
import { GTFSLevelNumericFields } from './interfaces/GTFSLevel';

export interface AppProps { }

export interface AppState {
    editMode: boolean,
    data: Communication
}

export default class App extends Component<AppProps, AppState> {
    public constructor(props: AppProps) {
        super(props);
        this.state = {
            editMode: false,
            data: {
                stops: [],
                pathways: [],
                levels: []
            }
        };
    }

    private handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            let requiredFiles = ['stops.txt', 'levels.txt', 'pathways.txt'];
            let communicationPacket: {[key: string]: {}} = {};
            Array.from(event.target.files).forEach((file: File) => {
                requiredFiles.splice(requiredFiles.indexOf(file.name), 1);
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    switch (file.name) {
                        case 'stops.txt':
                            communicationPacket.stops = GTFSService.getDataFromCSV(fileReader.result ? fileReader.result.toString() : "", GTFSStopNumericFields);
                            break;
                        case 'pathways.txt':
                            communicationPacket.pathways = GTFSService.getDataFromCSV(fileReader.result ? fileReader.result.toString() : "", GTFSPathwayNumericFields);
                            break;
                        case 'levels.txt':
                            communicationPacket.levels = GTFSService.getDataFromCSV(fileReader.result ? fileReader.result.toString() : "", GTFSLevelNumericFields);
                            break;
                    }
                    if (Object.keys(communicationPacket).length === 3) {
                        this.setState({
                            data: communicationPacket as unknown as Communication, // TODO
                            editMode: true
                        });
                    }
                }
                fileReader.readAsText(file);
            });
            if (requiredFiles.length !== 0) {
                alert("Please, select stops.txt, pathways.txt and levels.txt");
            }
        }
    }

    render() {
        return (
            <div className="container">
                {!this.state.editMode &&
                    <div>
                        Select stops.txt, pathways.txt and levels.txt: 
                        <input type="file" multiple={true} onChange={this.handleFileChange} />
                    </div>
                }
                {this.state.editMode && <StationBuilder data={this.state.data}></StationBuilder>}
            </div>
        );
      }
}
