import React, { Component } from 'react';
import vis from 'vis';
import 'vis/dist/vis-network.min.css';
import './Vis.scss';
import data from '../data/data.sample';
import StopInterface, { LocationTypeColors, LocationTypeSort } from '../interfaces/StopInterface';
import PathwayInterface, { PathwayModeColors } from '../interfaces/PathwayInterface';
import VisNodeInterface from '../interfaces/VisNodeInterface';
import DataService from '../services/DataService';

export interface VisState {
  
}

export interface VisProps {
  onStopAdd: Function,
  onStopEdit: Function
}

export default class Vis extends Component<VisProps, VisState> {
  componentDidMount() {
    var container = document.getElementById('vis');
    if (!container) {
      return;
    }

    let x = - container.clientWidth / 2;
    let y = - container.clientHeight / 2;
    const stepX = 200;
    const stepY = 100;
    let levelsX: any = {};

    // get nodes from stops
    let nodes: any = data.stops.map((stopUnderscore: any): VisNodeInterface => {
      const stop = DataService.stopUnderscoreToCamel(stopUnderscore);
      let graphLevel = LocationTypeSort[stop.locationType];
      if (!levelsX[graphLevel]) {
        levelsX[graphLevel] = x - stepX;
      }
      levelsX[graphLevel] += stepX;
      const node = {
        id: stop.stopId,
        label: stop.stopName || "",
        color: LocationTypeColors[stop.locationType],
        font: {
          color: "#FFFFFF"
        },
        x: levelsX[graphLevel],
        y: y + LocationTypeSort[stop.locationType] * stepY,
        stop: stop
      };
      return node;
    });

    // get edges from pathways
    const edges = data.pathways.map((pathway: PathwayInterface) => {
      return {
        from: pathway.from_stop_id,
        to: pathway.to_stop_id,
        color: {
          color: PathwayModeColors[pathway.pathway_mode],
          highlight: PathwayModeColors[pathway.pathway_mode]
        },
        arrows: {
          to: true,
          from: pathway.is_bidirectional
        },
        font: {align: 'top'},
        label: pathway.traversal_time + "s"
      };
    });
    
    // configure vis
    var options = {
        nodes: {
          borderWidth: 2
        },
        edges: {
          selectionWidth: 2
        },
        manipulation: {
          enabled: true,
          initiallyActive: true,
          addNode: this.props.onStopAdd,
          editNode: this.props.onStopEdit,
          addEdge: (edge: any, callback: Function) => {
            console.log(edge);
            callback(edge);
          },
          editEdge: (edge: any, callback: Function) => {
            console.log(edge);
            callback(edge);
          },
          deleteNode: true,
          deleteEdge: true
        },
        interaction: {
          dragView: false,
          hoverConnectedEdges: false,
          selectConnectedEdges: false,
          zoomView: false
        },
        physics: {
          enabled: true,
          barnesHut: {
            avoidOverlap: 1,
            gravitationalConstant: -0.03,
            centralGravity: 0,
            springConstant: 0,
            damping: 1,
            springLength: 200
          },
          maxVelocity: 40
        }
    };
    
    var network = new vis.Network(container, { nodes, edges }, options);
  }

  render() {
    return (
      <div id="vis"></div>
    );
  }
}
