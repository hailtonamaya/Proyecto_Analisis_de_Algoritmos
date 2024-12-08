import React, { useState } from "react";
import { Button, Input, message, Row, Col, Checkbox } from "antd";

// Algoritmo Knapsack Tradicional
const knapsackFor = (capacidad, peso, valor, noObj) => {
  const mochila = Array.from({ length: noObj + 1 }, () =>
    Array(capacidad + 1).fill(0)
  );

  for (let i = 1; i <= noObj; i++) {
    for (let w = 1; w <= capacidad; w++) {
      if (peso[i - 1] <= w) {
        mochila[i][w] = Math.max(
          mochila[i - 1][w],
          mochila[i - 1][w - peso[i - 1]] + valor[i - 1]
        );
      } else {
        mochila[i][w] = mochila[i - 1][w];
      }
    }
  }

  return mochila[noObj][capacidad];
};

// Algoritmo Knapsack Fraccionado
const fractionalKnapsack = (capacidad, peso, valor, noObj) => {
  const items = Array.from({ length: noObj }, (_, i) => ({
    valor: valor[i],
    peso: peso[i],
    ratio: valor[i] / peso[i]
  }));

  items.sort((a, b) => b.ratio - a.ratio); // Ordenar por relación valor/peso

  let valorTotal = 0;

  for (const item of items) {
    if (capacidad >= item.peso) {
      capacidad -= item.peso;
      valorTotal += item.valor;
    } else {
      valorTotal += item.ratio * capacidad; // Tomar la fracción
      break;
    }
  }

  return valorTotal;
};

// Componente Visual
const Jose = () => {
  const [capacidad, setCapacidad] = useState(50);
  const [noObj, setNoObj] = useState(10);
  const [pesos, setPesos] = useState([10, 20, 30, 5, 25, 15, 10, 20, 10, 5]);
  const [valores, setValores] = useState([60, 100, 120, 50, 75, 90, 40, 70, 30, 20]);
  const [tiempoEjecucion, setTiempoEjecucion] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [isFractional, setIsFractional] = useState(false); // Estado para saber qué algoritmo usar

  // Función para ejecutar el algoritmo y medir el tiempo
  const ejecutarKnapsack = () => {
    const start = performance.now();
    let maxValor;

    // Ejecuta el algoritmo seleccionado
    if (isFractional) {
      console.log("Ejecutando Knapsack Fraccionado");
      maxValor = fractionalKnapsack(capacidad, pesos, valores, noObj);
    } else {
      console.log("Ejecutando Knapsack Tradicional");
      maxValor = knapsackFor(capacidad, pesos, valores, noObj);
    }

    const end = performance.now();
    const tiempo = (end - start).toFixed(6); // Medir tiempo con 6 decimales
    setTiempoEjecucion(tiempo);
    setResultado(maxValor);

    console.log(`Tiempo de ejecución: ${tiempo} ms`); // Imprimir en consola el tiempo de ejecución
    message.success(`Tiempo de ejecución: ${tiempo} ms`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Knapsack Visualizer</h1>

      {/* Configuración de la Mochila */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Configuración de la Mochila:</h3>
        <Row gutter={16}>
          <Col span={12}>
            <label>Capacidad de la mochila:</label>
            <Input
              value={capacidad}
              onChange={(e) => setCapacidad(parseInt(e.target.value))}
              placeholder="Capacidad de la mochila"
              type="number"
            />
          </Col>
          <Col span={12}>
            <label>Cantidad de objetos:</label>
            <Input
              value={noObj}
              onChange={(e) =>
                setNoObj(Math.max(1, parseInt(e.target.value || "1")))
              }
              placeholder="Cantidad de objetos"
              type="number"
              min={1}
            />
          </Col>
        </Row>
      </div>

      {/* Entradas para pesos y valores */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Pesos de los objetos (separados por coma):</h3>
        <Input
          placeholder="Ej: 10, 20, 30"
          value={pesos.join(", ")}
          onChange={(e) =>
            setPesos(
              e.target.value
                .split(",")
                .map((peso) => Math.max(1, parseInt(peso.trim())))
            )
          }
        />
        <h3>Valores de los objetos (separados por coma):</h3>
        <Input
          placeholder="Ej: 60, 100, 120"
          value={valores.join(", ")}
          onChange={(e) =>
            setValores(
              e.target.value
                .split(",")
                .map((valor) => Math.max(1, parseInt(valor.trim())))
            )
          }
        />
      </div>

      {/* Checkbox para elegir el algoritmo */}
      <div style={{ marginBottom: "20px" }}>
        <Checkbox
          checked={isFractional}
          onChange={(e) => setIsFractional(e.target.checked)}
        >
          Usar Knapsack Fraccionado
        </Checkbox>
      </div>

      {/* Botón para ejecutar el algoritmo */}
      <Button
        type="primary"
        onClick={ejecutarKnapsack}
        style={{ marginTop: "20px" }}
      >
        Ejecutar Knapsack
      </Button>

      {/* Resultados */}
      {resultado !== null && (
        <div style={{ marginTop: "20px" }}>
          <h3>Valor máximo alcanzado: {resultado}</h3>
        </div>
      )}
      {tiempoEjecucion && (
        <div style={{ marginTop: "10px" }}>
          <strong>Tiempo de ejecución: {tiempoEjecucion} ms</strong>
        </div>
      )}
    </div>
  );
};

export default Jose;
