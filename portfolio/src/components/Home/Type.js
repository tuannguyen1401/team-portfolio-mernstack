import React from "react";
import Typewriter from "typewriter-effect";

function Type({ stackName }) {
  let arrayStackName = [];

  if (stackName) arrayStackName = stackName.value.split(',');

  return (
    <Typewriter
      options={{
        strings: arrayStackName,
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
