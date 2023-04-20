import React, { Component, useState } from "react";
import "../static/css/exercise.css";
import InspectingExercise from "./inspectingExercise";
import { IoMdFitness } from "react-icons/io";

function Exercise(props) {
  const [inspecting, setInspecting] = useState(false);

  return (
    <div>
      {!inspecting ? (
        <div
          id="scroller"
          className="exercise-container"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
          onClick={() => {
            setInspecting(true);
          }}
        >
          <IoMdFitness style={{ marginRight: 20 }} size={30} color="#3f6ce1" />
          <h1>{props.name}</h1>
        </div>
      ) : (
        <InspectingExercise
        renameExercise={props.renameExercise}
          deleteExercise={props.deleteExercise}
          exerciseId={props.id}
          muscleId={props.muscleId}
          name={props.name}
          setInspecting={setInspecting}
        />
      )}
    </div>
  );
}

export default Exercise;
