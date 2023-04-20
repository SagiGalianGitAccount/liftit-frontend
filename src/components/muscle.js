import React, { Component, useEffect, useState } from "react";
import InspectingMuslce from "./inspectingMuscle";
import "../static/css/muscle.css";
import { IoIosFitness } from "react-icons/io";
//import { IconName } from "react-icons/io5";//IoFitnessSharp

function Muscle(props) {
  const [inspect, setInspect] = useState(false);

  return (
    <div>
      {!inspect ? (
        <div
          className="muscle-container"
          id="scroller" 
          onClick={() => {
            setInspect(true);
            props.setInspecting(true)
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IoIosFitness style={{ marginRight: 20 }} size={40} color="#3f6ce1" />
            <h1>{props.name}</h1>
          </div>
          
        </div>
      ) : (
        <div className="inspecting-Muscle">
          <InspectingMuslce
          renameMuscleLocaly={props.renameMuscleLocaly}
            setInspecting={props.setInspecting}//
            removeMuscle={props.removeMe}
            muscleId={props.muscleId}
            setInspect={setInspect}
            name={props.name}
            muscleExercises={props.muscleExercises}
          />
        </div>
      )}
    </div>
  );
}

export default Muscle;
