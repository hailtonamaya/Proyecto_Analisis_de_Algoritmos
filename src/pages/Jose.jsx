import React, { useState } from "react";
import { Button, Input, message, Checkbox, Row, Col } from "antd";

// Algoritmo Knapsack
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

  return mochila[noObj][capacidad]; // Devolver el valor máximo alcanzado
};

// Componente Visual
const Jose = () => {
  const [capacidad, setCapacidad] = useState(100000);
  const [noObj, setNoObj] = useState(4);
  const [pesos, setPesos] = useState([1000, 3000, 4000, 5000]);
  const [valores, setValores] = useState([1000, 4000, 5000, 7000]);
  const [tiempoEjecucion, setTiempoEjecucion] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [casoAleatorio, setCasoAleatorio] = useState(false);

  // Función para ejecutar el algoritmo y medir el tiempo
  const ejecutarKnapsack = () => {
    const start = performance.now(); // Tiempo de inicio

    const maxValor = knapsackFor(capacidad, pesos, valores, noObj);
    const end = performance.now(); // Tiempo de fin

    const tiempo = (end - start).toFixed(4); // Tiempo de ejecución en milisegundos
    setTiempoEjecucion(tiempo);
    setResultado(maxValor);

    message.success(`Tiempo de ejecución: ${tiempo} ms`);
  };

  // Función para generar datos aleatorios para la capacidad y cantidad de objetos
  const generarConfiguracionAleatoria = (nivel) => {
    let capacidadAleatoria = 0;
    let cantidadObjetosAleatoria = 0;

    switch (nivel) {
      case "bajo":
        capacidadAleatoria = Math.floor(Math.random() * 5000) + 1; // Capacidad aleatoria entre 1 y 5000
        cantidadObjetosAleatoria = Math.floor(Math.random() * 5) + 1; // Objetos entre 1 y 5
        break;
      case "medio":
        capacidadAleatoria = Math.floor(Math.random() * 50000) + 5000; // Capacidad entre 5000 y 50000
        cantidadObjetosAleatoria = Math.floor(Math.random() * 10) + 5; // Objetos entre 5 y 10
        break;
      case "alto":
        capacidadAleatoria = Math.floor(Math.random() * 100000) + 50000; // Capacidad entre 50000 y 100000
        cantidadObjetosAleatoria = Math.floor(Math.random() * 15) + 10; // Objetos entre 10 y 15
        break;
      default:
        break;
    }

    // Actualizar el estado con los datos aleatorios
    setCapacidad(capacidadAleatoria);
    setNoObj(cantidadObjetosAleatoria);
  };

  // Función para generar datos aleatorios para los pesos y valores
  const generarPesosYValoresAleatorios = () => {
    const pesosAleatorios = Array.from({ length: noObj }, () =>
      Math.floor(Math.random() * 100000) + 1 // Pesos aleatorios entre 1 y 100,000
    );
    const valoresAleatorios = Array.from({ length: noObj }, () =>
      Math.floor(Math.random() * 100000) + 1 // Valores aleatorios entre 1 y 100,000
    );

    // Actualizar el estado con los datos aleatorios
    setPesos(pesosAleatorios);
    setValores(valoresAleatorios);
  };

  // Función para manejar el cambio de pesos y valores como texto separado por comas
  const handlePesosChange = (value) => {
    const nuevosPesos = value.split(",").map((peso) => parseInt(peso.trim(), 10));
    setPesos(nuevosPesos);
  };

  const handleValoresChange = (value) => {
    const nuevosValores = value.split(",").map((valor) => parseInt(valor.trim(), 10));
    setValores(nuevosValores);
  };

  // Generar campos para pesos y valores
  const renderObjetoInputs = () => {
    return (
      <div>
        <div style={{ marginBottom: "20px" }}>
          <h3>Pesos de los objetos (separados por coma):</h3>
          <Input
            placeholder="Ej: 1000, 2000, 3000"
            value={pesos.join(", ")}
            onChange={(e) => handlePesosChange(e.target.value)}
          />
        </div>
        <div>
          <h3>Valores de los objetos (separados por coma):</h3>
          <Input
            placeholder="Ej: 1000, 4000, 5000"
            value={valores.join(", ")}
            onChange={(e) => handleValoresChange(e.target.value)}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Knapsack Visualizer</h1>

      {/* Configuración de la Mochila */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Configuración de la Mochila:</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <Button type="primary" onClick={() => generarConfiguracionAleatoria("bajo")}>
            Aleatorizar bajo
          </Button>
          <Button type="primary" onClick={() => generarConfiguracionAleatoria("medio")}>
            Aleatorizar medio
          </Button>
          <Button type="primary" onClick={() => generarConfiguracionAleatoria("alto")}>
            Aleatorizar alto
          </Button>
        </div>
        <div style={{ marginTop: "10px" }}>
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
                onChange={(e) => {
                  setNoObj(parseInt(e.target.value));
                  const newPesos = new Array(parseInt(e.target.value)).fill(1);
                  const newValores = new Array(parseInt(e.target.value)).fill(1);
                  setPesos(newPesos);
                  setValores(newValores);
                }}
                placeholder="Cantidad de objetos"
                type="number"
              />
            </Col>
          </Row>
        </div>
      </div>

      {/* Botón para aleatorizar pesos y valores */}
      <div style={{ marginTop: "20px" }}>
        <Button type="primary" onClick={generarPesosYValoresAleatorios}>
          Aleatorizar Pesos y Valores
        </Button>
      </div>

      {/* Entradas dinámicas para pesos y valores */}
      {renderObjetoInputs()}

      {/* Resultado y Tiempo de ejecución */}
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

      {/* Botón para ejecutar el algoritmo */}
      <Button type="primary" onClick={ejecutarKnapsack} style={{ marginTop: "20px" }}>
        Ejecutar Knapsack
      </Button>

      {/* Caso Aleatorio */}
      <div style={{ marginTop: "20px" }}>
        <Checkbox
          checked={casoAleatorio}
          onChange={(e) => {
            setCasoAleatorio(e.target.checked);
            if (e.target.checked) {
              generarConfiguracionAleatoria("alto"); // Configuración por defecto alta al activar el checkbox
              generarPesosYValoresAleatorios();
            } else {
              setCapacidad(100000);
              setNoObj(4);
              setPesos([1000, 3000, 4000, 5000]);
              setValores([1000, 4000, 5000, 7000]);
            }
          }}
        >
          Caso Aleatorio
        </Checkbox>
      </div>
    </div>
  );
};

export default Jose;
