import
{
  initProvenance,
  Provenance,
  NodeID
} from '@visdesignlab/trrack';

import OriginalPlot from "./originalChart"

import TimeSeriesPlot from './timeSeriesChart';

import * as d3 from "d3"

import { ProvVisCreator } from '@visdesignlab/trrack-vis';

/**
* interface representing the state of the application
*/
export interface NodeState {
  selectedNode:string;
  hoveredNode:string;
  dblClickNode:string;
};

/**
* Initial state
*/

const initialState: NodeState = {
  selectedNode: 'none',
  hoveredNode: 'none',
  dblClickNode: 'none'
}

type EventTypes = "Select Node" | "Hover Node" | "DblClick Node"

//initialize provenance with the first state
let prov = initProvenance<NodeState, EventTypes, string>(initialState, false);

//Set up apply action functions for each of the 3 actions that affect state

/**
* Function called when the quartet number is changed. Applies an action to provenance.
* This is a complex action, meaning it always stores a state node.
*/

// export function changeQuartetUpdate(newQuartet: string){

//   prov.addAction(
//       `Quartet ${newQuartet} Selected`,
//       (state:NodeState) => {
//         state.selectedQuartet = newQuartet;
//         return state;
//       }
//     )
//     .addEventType("Change Quartet")
//     .alwaysStoreState(true)
//     .applyAction();
// }

/**
* Function called when a node is selected. Applies an action to provenance.
*/

export function selectNodeUpdate(newSelected: string){
  prov.addAction(
       `${newSelected} Selected`,
      (state:NodeState) => {
        state.selectedNode = newSelected;
        return state;
      }
    )
    .addEventType("Select Node")
    .applyAction();
}
export function chartInit(){
  let op = new OriginalPlot();
  let tsp = new TimeSeriesPlot();
  provVisUpdate();
  // Set up observers for the three keys in state. These observers will get called either when an applyAction
  // function changes the associated keys value.

  // Also will be called when an internal graph change such as goBackNSteps, goBackOneStep or goToNode
  // change the keys value.


  prov.addGlobalObserver(() => {
    provVisUpdate();
  })
  /**
  * Observer for when the quartet state is changed. Calls changeQuartet in OriginalPlot to update vis.
  */
  // prov.addObserver(["selectedQuartet"], () => {
  //   op.changeQuartet(prov.current().getState().selectedQuartet);
  // });

  /**
  * Observer for when the selected node state is changed. Calls selectNode in OriginalPlot to update vis.
  */
  prov.addObserver(["selectedNode"], () => {
    tsp.selectNode(prov.current().getState().selectedNode);
  });

  /**
  * Observer for when the hovered node state is changed. Calls hoverNode in OriginalPlot to update vis.
  */
  prov.addObserver(["hoveredNode"], () => {
    op.hoverNode(prov.current().getState().hoveredNode);
    tsp.hoverNode(prov.current().getState().hoveredNode);
  });

  /**
  * Observer for when the double clicked node state is changed. Calls dblClickNode in OriginalPlot to update vis.
  */
  prov.addObserver(["dblClickNode"], () => {
    tsp.hoverNode(prov.current().getState().hoveredNode);
  });
}


/**
* Function called when a node is hovered. Applies an action to provenance.
*/

export function hoverNodeUpdate(newHover: string, hoverTime:number){
  prov.addAction(
      newHover === "" ? `Hovered for ${hoverTime} s` : `${newHover} Hovered`, //Assign a label
      (state : NodeState) => {
        state.hoveredNode = newHover; //Change the desired portion of the state
        return state;
      }
    )
    .addEventType("Hover Node")
    .applyAction();
}

/**
* Function called when a node is double clicked. Applies an action to provenance.
*/

export function dblClickNodeUpdate(newDbl: string){
  prov.addAction(
       `Compare ${newDbl}`,
      (state:NodeState) => {
        state.selectedNode = newDbl;
        return state;
      }
    )
    .addEventType("DblClick Node")
    .applyAction();
}

// Create our OriginalPlot class which handles the actual vis.
// OriginalPlot contains 3 primary functions, 

// changeQuartet(string) - updates the current quartet
// selectNode(string) - selects a new node
// hoverNode(string) - hovers over a node or removes hover of empty string
// let op = new OriginalPlot();
// let tsp = new TimeSeriesPlot();

// // Set up observers for the three keys in state. These observers will get called either when an applyAction
// // function changes the associated keys value.

// // Also will be called when an internal graph change such as goBackNSteps, goBackOneStep or goToNode
// // change the keys value.


// prov.addGlobalObserver(() => {
//   provVisUpdate();
// })
// /**
// * Observer for when the quartet state is changed. Calls changeQuartet in OriginalPlot to update vis.
// */
// // prov.addObserver(["selectedQuartet"], () => {
// //   op.changeQuartet(prov.current().getState().selectedQuartet);
// // });

// /**
// * Observer for when the selected node state is changed. Calls selectNode in OriginalPlot to update vis.
// */
// prov.addObserver(["selectedNode"], () => {
//   tsp.selectNode(prov.current().getState().selectedNode);
// });

// /**
// * Observer for when the hovered node state is changed. Calls hoverNode in OriginalPlot to update vis.
// */
// prov.addObserver(["hoveredNode"], () => {
//   op.hoverNode(prov.current().getState().hoveredNode);
//   tsp.hoverNode(prov.current().getState().hoveredNode);
// });

// /**
// * Observer for when the double clicked node state is changed. Calls dblClickNode in OriginalPlot to update vis.
// */
// prov.addObserver(["dblClickNode"], () => {
//   tsp.hoverNode(prov.current().getState().hoveredNode);
// });

//Setup ProvVis once initially
// export function chartInit(){
//   provVisUpdate()
// }


// Undo function which simply goes one step backwards in the graph.
function undo(){
  prov.goBackOneStep();
}

//Redo function which traverses down the tree one step.
function redo(){
  if(prov.current().children.length == 0){
    return;
  }
  prov.goForwardOneStep();
}

function provVisUpdate()
{
  ProvVisCreator(
    document.getElementById("provDiv")!,
    prov,
    (newNode: NodeID) => {
      prov.goToNode(newNode);

      //Incase the state doesn't change and the observers arent called, updating the ProvVis here.
      provVisUpdate()
    });
}

//Setting up undo/redo hotkey to typical buttons
document.onkeydown = function(e){
  var mac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

  if(!e.shiftKey && (mac ? e.metaKey : e.ctrlKey) && e.which == 90){
    undo();
  }
  else if(e.shiftKey && (mac ? e.metaKey : e.ctrlKey) && e.which == 90){
    redo();
  }
}

chartInit();

// let n: number;
// n = window.setTimeout(function () { chartInit()  }, 10000);