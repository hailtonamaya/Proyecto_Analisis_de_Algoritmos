import React, { useState } from "react";
import InputForm from "./components/InputForm";  
import Results from "./components/Results";  
import { subsetSumDP, subsetSumApproximate } from "./utils/SubsetSum";  

import "./Ricardo.css";  

const Ricardo = () => {
  const [array, setArray] = useState([]);
  const [target, setTarget] = useState(0);
  const [dpTable, setDpTable] = useState([]);
  const [executionTime, setExecutionTime] = useState(0);
  const [isPossible, setIsPossible] = useState(false);
  const [approxExecutionTime, setApproxExecutionTime] = useState(0);
  const [approxResult, setApproxResult] = useState(false);
  const [approxSubsets, setApproxSubsets] = useState([]);

  const handleSubmitExact = (nums, targetValue) => {
    setArray(nums);
    setTarget(targetValue);

    const startExact = performance.now();
    const { dpTable: dpResult, canAchieve } = subsetSumDP(nums, targetValue);
    const endExact = performance.now();

    setDpTable(dpResult);
    setIsPossible(canAchieve);
    setExecutionTime((endExact - startExact).toFixed(2)); 
  };

  const handleSubmitApprox = (nums, targetValue) => {
    setArray(nums);
    setTarget(targetValue);

    
    const startApprox = performance.now();
    const { subsets, result } = subsetSumApproximate(nums, targetValue);
    const endApprox = performance.now();

    setApproxSubsets(subsets);
    setApproxResult(result);
    setApproxExecutionTime((endApprox - startApprox).toFixed(2)); 
  };

  return (
    <div>
      <h1>Subset Sum Visualización</h1>
      <InputForm onSubmitExact={handleSubmitExact} onSubmitApprox={handleSubmitApprox} />

      
      <div>
        <h2>Resultados (Exacto)</h2>
        <p>Arreglo: [{array.join(", ")}]</p>
        <p>Objetivo: {target}</p>
        <p>¿Es posible alcanzar el objetivo? {isPossible ? "Sí" : "No"}</p>
        <p>Tiempo de ejecución: {executionTime} ms</p>
      </div>

      <div>
        <h2>Tabla de Programación Dinámica (Exacto)</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              {[...Array(target + 1).keys()].map((value) => (
                <th key={value}>{value}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dpTable.map((row, i) => (
              <tr key={i}>
                <td>{i > 0 ? array[i - 1] : "-"}</td>
                {row.map((cell, j) => (
                  <td key={j} className={cell ? "true" : "false"}>
                    {cell ? "✔️" : "❌"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      <div>
        <h2>Resultados (Aproximado)</h2>
        <p>Arreglo: [{array.join(", ")}]</p>
        <p>Objetivo: {target}</p>
        <p>¿Resultado Aproximado? {approxResult ? "Sí" : "No"}</p>
        <p>Tiempo de ejecución: {approxExecutionTime} ms</p>

        {approxResult && (
          <div>
            <h3>Subconjuntos encontrados:</h3>
            <ul>
              {approxSubsets.map((subset, index) => (
                <li key={index}>[{subset.join(", ")}]</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ricardo;
