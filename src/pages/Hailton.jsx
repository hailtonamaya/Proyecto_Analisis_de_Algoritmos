import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Html, OrbitControls } from "@react-three/drei";
import { Layout, Form, InputNumber, Button, Typography, Divider, Row, Col, List } from "antd";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa"; // Importar ícono de edificio
import "antd/dist/reset.css";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

// Calcular distancia entre dos puntos
const calculateDistance = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Componente para mostrar la línea de la ruta
const AnimatedRoute = ({ cities, stepIndex, route }) => {
  const lineRef = useRef();
  const points = [];

  // Crear puntos según el índice actual
  for (let i = 0; i <= stepIndex && i < route.length; i++) {
    const city = cities[route[i]];
    points.push(new THREE.Vector3(city.x, city.y, 0));
  }

  useEffect(() => {
    if (lineRef.current) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lineRef.current.geometry.dispose(); // Liberar geometría previa
      lineRef.current.geometry = geometry; // Asignar nueva geometría
    }
  }, [stepIndex, points]); // Ejecutar cada vez que cambie `stepIndex`

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      {/* Establecer línea punteada */}
      <lineDashedMaterial color="black" dashSize={0.5} gapSize={0.2} linewidth={2} />
    </line>
  );
};

const Hailton = () => {
  const [numCities, setNumCities] = useState(5);
  const [cities, setCities] = useState([]);
  const [route, setRoute] = useState([]);
  const [visited, setVisited] = useState([]);
  const [stepIndex, setStepIndex] = useState(-1);
  const [executionTime, setExecutionTime] = useState(0);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [decimalPrecision, setDecimalPrecision] = useState(4);

  const generateCities = () => {
    const newCities = Array.from({ length: numCities }, () => ({
      x: Math.random() * 10 - 5,
      y: Math.random() * 10 - 5,
    }));
    setCities(newCities);
    setRoute([]);
    setVisited([]);
    setStepIndex(-1);
  };

  const calculateRoute = () => {
    const start = Date.now();
    const distances = [];
    const currentRoute = [0];
    const visitedCities = Array(cities.length).fill(false);
    visitedCities[0] = true;

    for (let i = 0; i < cities.length; i++) {
      distances[i] = [];
      for (let j = 0; j < cities.length; j++) {
        distances[i][j] = calculateDistance(cities[i], cities[j]);
      }
    }

    let currentCity = 0;
    for (let step = 1; step < cities.length; step++) {
      let nearestCity = -1;
      let nearestDistance = Infinity;

      for (let i = 0; i < cities.length; i++) {
        if (!visitedCities[i] && distances[currentCity][i] < nearestDistance) {
          nearestCity = i;
          nearestDistance = distances[currentCity][i];
        }
      }

      visitedCities[nearestCity] = true;
      currentRoute.push(nearestCity);
      currentCity = nearestCity;
    }
    currentRoute.push(0);

    const end = Date.now();
    const timeTaken = end - start;

    console.log(`Tiempo de ejecución real: ${timeTaken} ms`);

    const minTimeThreshold = 1;

    let finalTime = timeTaken < minTimeThreshold ? timeTaken : timeTaken.toFixed(2);

    setExecutionTime(finalTime);
    setExecutionHistory((prevHistory) => [
      ...prevHistory,
      { time: finalTime, cities: numCities },
    ]);

    setRoute(currentRoute);
    setVisited(visitedCities.map(() => false));
    setStepIndex(0);
  };

  useEffect(() => {
    if (stepIndex >= 0 && stepIndex < route.length - 1) {
      const timer = setTimeout(() => {
        setVisited((prev) => {
          const newVisited = [...prev];
          newVisited[route[stepIndex]] = true;
          return newVisited;
        });
        setStepIndex((prev) => prev + 1);
      }, 1000); // 1 segundo entre pasos
      return () => clearTimeout(timer);
    }
  }, [stepIndex, route]);

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ backgroundColor: "#001529", color: "#fff", padding: "10px 20px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title style={{ color: "#fff", margin: 0 }}>TSP Visualizer</Title>
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider width={300} style={{ backgroundColor: "#fff", padding: "20px" }}>
          <Form layout="vertical">
            <Form.Item label="Número de ciudades">
              <InputNumber
                min={2}
                value={numCities}
                onChange={(value) => setNumCities(value || 2)}
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={generateCities} block>
                Generar Ciudades
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={calculateRoute}
                disabled={cities.length === 0}
                block
              >
                Calcular Ruta
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <Text strong>Tiempo de ejecución:</Text>
          <Text>{` ${executionTime} ms`}</Text>
          <Divider />
          <Text strong>Historial de Ejecuciones:</Text>
          <List
            dataSource={executionHistory}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <Text>{`Ciudades: ${item.cities}, Tiempo: ${item.time} ms`}</Text>
              </List.Item>
            )}
            style={{ maxHeight: "200px", overflowY: "auto" }} // Establecer altura máxima y permitir el scroll vertical
          />
        </Sider>
        <Content style={{ backgroundColor: "#faf8ec", padding: "10px" }}>
          <Canvas
            style={{ width: "100%", height: "100%" }}
            camera={{ position: [0, 0, 15], fov: 50 }}
          >
            {/* Mostrar ciudades con icono de edificio */}
            {cities.map((city, index) => (
              <Html key={index} position={[city.x, city.y, 0]}>
                <div style={{ textAlign: "center", color: visited[index] ? "black" : "red" }}>
                  <FaBuilding size={24} color={visited[index] ? "black" : "red"} />
                  <div style={{ fontSize: "12px" }}>{index + 1}</div>
                </div>
              </Html>
            ))}

            {/* Dibujar línea de la ruta */}
            <AnimatedRoute cities={cities} stepIndex={stepIndex} route={route} />

            {/* Luz y cámara */}
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <OrbitControls />
          </Canvas>
        </Content>
      </Layout>
      <Footer style={{ textAlign: "center" }}>
        TSP Visualizer ©2024 - Powered by React & Ant Design
      </Footer>
    </Layout>
  );
};

export default Hailton;
