import React, { Component } from 'react';
import vis from 'vis';
import 'vis/dist/vis-network.min.css';
import './Vis.scss';
import data from './data.sample';
import StopInterface, { LocationTypeColors, LocationTypeMap, LocationTypeSort, WheelchairBoardingMap } from './interfaces/StopInterface';
import PathwayInterface, { PathwayModeColor } from './interfaces/PathwayInterface';
import StopDialog from './StopDialog';

export interface VisState {
  
}

export interface VisProps {
  onStopAdd: Function
}

export interface VisNode {
  id: number,
  x: number,
  y: number,
  label: string
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
    let nodes: any = data.stops.map((stop: StopInterface) => {
      let level = LocationTypeSort[stop.location_type];
      if (!levelsX[level]) {
        levelsX[level] = x - stepX;
      }
      levelsX[level] += stepX;
      return {
        id: stop.stop_id,
        label: stop.stop_name,
        color: LocationTypeColors[stop.location_type],
        font: {
          color: "#FFFFFF"
        },
        x: levelsX[level],
        y: y + LocationTypeSort[stop.location_type] * stepY
      };
    });

    const edges = data.pathways.map((pathway: PathwayInterface) => {
      return {
        from: pathway.from_stop_id,
        to: pathway.to_stop_id,
        color: {
          color: PathwayModeColor[pathway.pathway_mode],
          highlight: PathwayModeColor[pathway.pathway_mode]
        },
        arrows: {
          to: true,
          from: pathway.is_bidirectional
        },
        font: {align: 'top'},
        label: pathway.traversal_time + "s"
      };
    });
    
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
          addNode: (node: VisNode, callback: Function) => {
            this.props.onStopAdd(node, () => {
              callback(node);
            });
          },
          addEdge: (edge: any, callback: Function) => {
            console.log(edge);
            callback(edge);
          },
          editNode: (node: any, callback: Function) => {
            console.log(node);
            callback(node);
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
