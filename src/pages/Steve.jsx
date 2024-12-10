import React, { useState, useEffect } from "react";
import { Layout, Form, Input, Button, Typography, Divider, List } from "antd";
import "antd/dist/reset.css";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const VisualizadorCoberturaConjuntos = () => {
  const [universo, setUniverso] = useState([]);
  const [conjuntos, setConjuntos] = useState([]);
  const [conjuntosSeleccionados, setConjuntosSeleccionados] = useState([]);
  const [conjuntosSeleccionadosProgresivos, setConjuntosSeleccionadosProgresivos] = useState([]);
  const [registro, setRegistro] = useState([]);
  const [estadoAnimacion, setEstadoAnimacion] = useState([]);
  const [animando, setAnimando] = useState(false);
  const [paso, setPaso] = useState(0);
  const [tiempoEjecucion, setTiempoEjecucion] = useState(0);

  // Algoritmo aproximado
  const algoritmoCoberturaConjuntosAproximado = (universo, conjuntos) => {
    const conjuntosSeleccionados = [];
    const pasos = [];
    let elementosNoCubiertos = new Set(universo);

    while (elementosNoCubiertos.size > 0) {
      let mejorConjunto = null;
      let cantidadCubierta = 0;

      // Buscar el mejor conjunto
      for (const conjunto of conjuntos) {
        const elementosNoCubiertosEnConjunto = conjunto.filter((el) => elementosNoCubiertos.has(el));
        if (elementosNoCubiertosEnConjunto.length > cantidadCubierta) {
          mejorConjunto = conjunto;
          cantidadCubierta = elementosNoCubiertosEnConjunto.length;
        }
      }

      if (!mejorConjunto) break;

      conjuntosSeleccionados.push(mejorConjunto);
      pasos.push({
        conjuntoSeleccionado: mejorConjunto,
        noCubiertos: [...elementosNoCubiertos],
      });

      // Actualizar los elementos no cubiertos
      elementosNoCubiertos = new Set(
        [...elementosNoCubiertos].filter((el) => !mejorConjunto.includes(el))
      );
    }

    return { conjuntosSeleccionados, pasos };
  };

  // Algoritmo de fuerza bruta
  const algoritmoCoberturaConjuntosFuerzaBruta = (universo, conjuntos) => {
    const todasCombinaciones = (arr) => {
      return arr.reduce(
        (subsets, value) => [...subsets, ...subsets.map((set) => [...set, value])],
        [[]]
      );
    };

    const combinaciones = todasCombinaciones(conjuntos);
    let mejorSolucion = null;

    for (const combinacion of combinaciones) {
      const union = new Set(combinacion.flat());
      if (universo.every((elemento) => union.has(elemento))) {
        if (!mejorSolucion || combinacion.length < mejorSolucion.length) {
          mejorSolucion = combinacion;
        }
      }
    }

    return {
      conjuntosSeleccionados: mejorSolucion || [],
      pasos: [],
    };
  };

  const manejarEjecucion = () => {
    const universoParseado = universo;
    const conjuntosParseados = conjuntos;

    // Registrar tiempo de inicio
    const tiempoInicio = performance.now();

    // Ejecutar el algoritmo (elige el que desees usar)
    const { conjuntosSeleccionados, pasos } = algoritmoCoberturaConjuntosAproximado(universoParseado, conjuntosParseados);
    //const { conjuntosSeleccionados, pasos } = algoritmoCoberturaConjuntosFuerzaBruta(universoParseado, conjuntosParseados);

    // Registrar tiempo de fin y calcular diferencia
    const tiempoFin = performance.now();
    setTiempoEjecucion(tiempoFin - tiempoInicio);

    // Configurar los estados con los resultados
    setConjuntosSeleccionados(conjuntosSeleccionados);
    setEstadoAnimacion(pasos);
    setRegistro([]);
    setConjuntosSeleccionadosProgresivos([]);
    setPaso(0);
    setAnimando(true);
  };

  const manejarVisualizacionPaso = (indicePaso) => {
    setConjuntosSeleccionadosProgresivos(conjuntosSeleccionados.slice(0, indicePaso + 1));
    setRegistro((prevRegistro) =>
      prevRegistro.map((entrada, indice) =>
        indice <= indicePaso ? { ...entrada, activo: true } : { ...entrada, activo: false }
      )
    );
    setPaso(indicePaso);
    setAnimando(false);
  };

  useEffect(() => {
    if (animando && estadoAnimacion.length > 0 && paso < estadoAnimacion.length) {
      const intervalo = setTimeout(() => {
        setConjuntosSeleccionadosProgresivos((prev) => [
          ...prev,
          conjuntosSeleccionados[paso],
        ]);

        setRegistro((prevRegistro) => [
          ...prevRegistro,
          {
            texto: `Paso ${paso + 1}: Seleccionado {${conjuntosSeleccionados[paso].join(
              ", "
            )}}.`,
            restantes: `Valores no cubiertos: {${estadoAnimacion[paso].noCubiertos.join(", ")}}`,
            indice: paso,
            activo: true,
          },
        ]);

        setPaso((prev) => prev + 1);

        if (paso + 1 >= estadoAnimacion.length) {
          setAnimando(false);
        }
      }, 2000);

      return () => clearTimeout(intervalo);
    }
  }, [estadoAnimacion, paso, animando, conjuntosSeleccionados]);

  return (
    <Layout style={{ height: "100vh" }}>
      <Header
        style={{ backgroundColor: "#001529", color: "#fff", padding: "10px 20px" }}
      >
        <Title style={{ color: "#fff", margin: 0 }}>Visualizador Cobertura de Conjuntos</Title>
      </Header>
      <Layout>
        <Sider width={400} style={{ backgroundColor: "#fff", padding: "20px" }}>
          <Form layout="vertical">
            <Form.Item label="Universo (ej: 1,2,3,4)">
              <Input
                placeholder="1,2,3,4"
                onChange={(e) => {
                  const universoParseado = e.target.value
                    .split(",")
                    .map((el) => parseInt(el.trim()))
                    .filter((el) => !isNaN(el));
                  setUniverso(universoParseado);
                }}
              />
            </Form.Item>
            <Form.Item label="Conjuntos (ej: 1,2 | 2,3 | 3,4)">
              <Input.TextArea
                rows={4}
                placeholder="1,2 | 2,3 | 3,4"
                onChange={(e) =>
                  setConjuntos(
                    e.target.value
                      .split("|")
                      .map((s) =>
                        s
                          .split(",")
                          .map((el) => parseInt(el.trim()))
                          .filter((el) => !isNaN(el))
                      )
                  )
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={manejarEjecucion}
                block
                disabled={animando}
              >
                Ejecutar Algoritmo
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <Text strong style={{ display: "block", marginBottom: "10px" }}>
            Tiempo de Ejecución: {tiempoEjecucion.toFixed(10)} ms
          </Text>
          <Divider />
          <Text strong>Registro del Algoritmo:</Text>
          <div
            style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "16px" }}
          >
            <List
              dataSource={registro}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button
                      type="link"
                      onClick={() => manejarVisualizacionPaso(item.indice)}
                      key={`btn-${item.indice}`}
                    >
                      Ver
                    </Button>,
                  ]}
                >
                  <div>
                    {item.texto}
                    <br />
                    <Text type="secondary">{item.restantes}</Text>
                  </div>
                </List.Item>
              )}
            />
          </div>
          <Divider />
          <Text strong>Conjuntos Seleccionados:</Text>
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            <List
              dataSource={conjuntosSeleccionadosProgresivos}
              renderItem={(item, indice) => (
                <List.Item key={indice}>{`{ ${item.join(", ")} }`}</List.Item>
              )}
            />
          </div>
        </Sider>
        <Content style={{ backgroundColor: "#f0f2f5", padding: "20px" }}>
          {/* Espacio de visualización */}
          <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            {/* Recuadro del universo */}
            <div
              style={{
                border: "2px dashed #001529",
                minWidth: "600px",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                padding: "10px",
                gap: "10px",
              }}
            >
              {conjuntosSeleccionadosProgresivos.map((conjunto, indiceConjunto) => (
                <div
                  key={indiceConjunto}
                  style={{
                    border: "1px solid #001529",
                    padding: "10px",
                    width: `${Math.max(100, conjunto.length * 60)}px`,
                    backgroundColor: "#f0f8ff",
                  }}
                >
                  <Text strong style={{ marginBottom: "5px" }}>
                    Conjunto #{conjuntos.findIndex(
                      (conjuntoOriginal) =>
                        JSON.stringify(conjuntoOriginal) === JSON.stringify(conjunto)
                    ) + 1}
                  </Text>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {conjunto.map((item, indice) => (
                      <div
                        key={indice}
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "#1976d2",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Conjuntos afuera */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {conjuntos
                .filter(
                  (conjunto) =>
                    !conjuntosSeleccionadosProgresivos.some((conjuntoSeleccionado) =>
                      JSON.stringify(conjuntoSeleccionado) === JSON.stringify(conjunto)
                    )
                )
                .map((conjunto, indiceConjunto) => (
                  <div
                    key={indiceConjunto}
                    style={{
                      border: "1px solid #001529",
                      padding: "10px",
                      backgroundColor: "#f0f8ff",
                      width: `${Math.max(100, conjunto.length * 60)}px`,
                    }}
                  >
                    <Text strong style={{ marginBottom: "5px" }}>
                      Conjunto #{indiceConjunto + 1}
                    </Text>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {conjunto.map((item, indice) => (
                        <div
                          key={indice}
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#1976d2",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default VisualizadorCoberturaConjuntos;