import React from "react";

function Results({ nums, target, results }) {
  const { canAchieve, dpTable, executionTime } = results;

  return (
    <div>
      <h2>Resultados</h2>
      <p>Arreglo: [{nums.join(", ")}]</p>
      <p>Objetivo: {target}</p>
      <p>
        ¿Es posible alcanzar el objetivo?{" "}
        <strong>{canAchieve ? "Sí" : "No"}</strong>
      </p>
      <p>Tiempo de ejecución: {executionTime} ms</p>

      <h3>Tabla de DP</h3>
     
    </div>
  );
}

export default Results;
