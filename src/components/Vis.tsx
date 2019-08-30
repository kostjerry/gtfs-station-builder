import React, { Component } from 'react';
import vis from 'vis';
import 'vis/dist/vis-network.min.css';
import './Vis.scss';
import Stop, { LocationTypeSort } from '../interfaces/Stop';
import VisNode from '../interfaces/VisNode';
import VisService from '../services/VisService';
import VisEdge from '../interfaces/VisEdge';
import Communication from '../interfaces/Communication';
import Pathway from '../interfaces/Pathway';

export interface VisState {
  
}

export interface VisProps {
  data: Communication,
  onStopAdd: (node: VisNode, callback: (node?: VisNode) => void) => void,
  onStopEdit: (node: VisNode, callback: (node?: VisNode) => void) => void,
  onStopDelete: (dataToDelete: { nodes: number[], edges: number[] }, callback: (dataToDelete?: { nodes: number[], edges: number[] }) => void) => void,
  onPathwayAdd: (edge: VisEdge, callback: (edge?: VisEdge) => void) => void,
  onPathwayEdit: (edge: VisEdge, callback: (edge?: VisEdge) => void) => void,
  onPathwayDelete: (dataToDelete: { nodes: number[], edges: number[] }, callback: (dataToDelete?: { nodes: number[], edges: number[] }) => void) => void,
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
    let levelsX: { [key: string]: number }  = {};

    // get nodes from stops
	let nodes: VisNode[] = [];
	if (this.props.data.stops) {
		nodes = this.props.data.stops.map((stop: Stop): VisNode => {
		let graphLevel = LocationTypeSort[stop.locationType];
		if (!levelsX[graphLevel]) {
			levelsX[graphLevel] = x - stepX;
		}
		levelsX[graphLevel] += stepX;
		const node = VisService.convertStopToNode(stop, levelsX[graphLevel], y + LocationTypeSort[stop.locationType] * stepY);
		return node;
		});
	}

	// get edges from pathways
	let edges: VisEdge[] = [];
	if (this.props.data.pathways) {
		edges = this.props.data.pathways.map((pathway: Pathway): VisEdge => {
		const edge = VisService.convertPathwayToEdge(pathway);
		return edge;
		});
	}

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
          deleteNode: this.props.onStopDelete,
          addEdge: this.props.onPathwayAdd,
          editEdge:  {
            editWithoutDrag: (edge: VisEdge, callback: (edge?: VisEdge) => void) => {
              // Get edge from DataSets because from params we can't get attached information
              let edgesDataSet = network.body.data.edges;
              edge = edgesDataSet.get(edge.id);
              this.props.onPathwayEdit(edge, callback);
            }
          },
          deleteEdge: this.props.onPathwayDelete
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
		},
		locales: {
			'gtfs': {
				edit: 'Edit',
				del: 'Delete selected',
				back: 'Back',
				addNode: 'Add Location',
				addEdge: 'Add Pathway',
				editNode: 'Edit Location',
				editEdge: 'Edit Pathway',
				addDescription: 'Click in an empty space to place a new location.',
				edgeDescription: 'Click on a location and drag the pathway to another location to connect them.',
				editEdgeDescription: 'Click on the control points and drag them to a location to connect to it.',
				createEdgeError: 'Cannot link pathways to a cluster.',
				deleteClusterError: 'Clusters cannot be deleted.',
				editClusterError: 'Clusters cannot be edited.'
			}
		},
		locale: 'gtfs'
    };
    let network = new vis.Network(container, {nodes, edges}, options);

    network.on("doubleClick", () => {
      let selection = network.getSelection();
      if (selection.nodes.length === 1) {
        network.editNode();
      }
      else if (selection.edges.length === 1) {
        network.editEdgeMode();
      }
    });
  }

  render() {
    return (
      <div id="vis"></div>
    );
  }
}
