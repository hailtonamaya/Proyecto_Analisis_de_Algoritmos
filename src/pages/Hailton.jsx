import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { Layout, Form, InputNumber, Button, Typography, Divider, Row, Col } from "antd";
import "antd/dist/reset.css";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

// Calcular distancia entre dos puntos
const calculateDistance = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

// Componente para mostrar paso a paso la ruta
const Route = ({ cities, step }) => {
  const lineRef = useRef();

  const points = step.map((index) => {
    const { x, y } = cities[index];
    return new THREE.Vector3(x, y, 0);
  });

  useFrame(() => {
    if (lineRef.current) {
      lineRef.current.geometry.setFromPoints(points);
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry />
      <lineBasicMaterial color="yellow" linewidth={2} />
    </line>
  );
};

// Componente principal
const Hailton = () => {
  const [numCities, setNumCities] = useState(5);
  const [cities, setCities] = useState([]);
  const [route, setRoute] = useState([]);
  const [steps, setSteps] = useState([]);
  const [executionTime, setExecutionTime] = useState(0);

  const generateCities = () => {
    const newCities = Array.from({ length: numCities }, () => ({
      x: Math.random() * 10 - 5,
      y: Math.random() * 10 - 5,
    }));
    setCities(newCities);
    setRoute([]);
    setSteps([]);
  };

  const calculateRoute = () => {
    const distances = [];
    const stepsTaken = [];
    for (let i = 0; i < cities.length; i++) {
      distances[i] = [];
      for (let j = 0; j < cities.length; j++) {
        distances[i][j] = calculateDistance(cities[i], cities[j]);
      }
    }

    const start = performance.now();
    const visited = Array(cities.length).fill(false);
    const currentRoute = [0];
    let currentCity = 0;
    visited[currentCity] = true;

    for (let step = 1; step < cities.length; step++) {
      stepsTaken.push([...currentRoute]);
      let nearestCity = -1;
      let nearestDistance = Infinity;

      for (let i = 0; i < cities.length; i++) {
        if (!visited[i] && distances[currentCity][i] < nearestDistance) {
          nearestCity = i;
          nearestDistance = distances[currentCity][i];
        }
      }

      visited[nearestCity] = true;
      currentRoute.push(nearestCity);
      currentCity = nearestCity;
    }

    currentRoute.push(0);
    stepsTaken.push([...currentRoute]);

    const end = performance.now();
    setExecutionTime((end - start).toFixed(2));
    setRoute(currentRoute);
    setSteps(stepsTaken);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Header style={{ backgroundColor: "#001529", color: "#fff", textAlign: "center" }}>
        <Title style={{ color: "#fff", margin: 0 }}>TSP Visualizer</Title>
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
        </Sider>
        <Content style={{ backgroundColor: "#f0f2f5", padding: "10px" }}>
          <Row justify="center" style={{ height: "100%" }}>
            <Col span={24} style={{ height: "100%" }}>
              <Canvas
                style={{ width: "100%", height: "100%" }}
                camera={{ position: [0, 0, 10], fov: 50 }}
              >
                {/* Mostrar ciudades */}
                {cities.map((city, index) => (
                  <mesh key={index} position={[city.x, city.y, 0]}>
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshBasicMaterial color="red" />
                    <Html distanceFactor={10}>
                      <div
                        style={{
                          color: "white",
                          fontSize: "12px",
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          padding: "2px",
                          borderRadius: "4px",
                        }}
                      >
                        {index + 1}
                      </div>
                    </Html>
                  </mesh>
                ))}

                {/* Dibujar paso a paso */}
                {steps.map((step, index) => (
                  <Route key={index} cities={cities} step={step} />
                ))}

                {/* Luz y cámara */}
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
              </Canvas>
            </Col>
          </Row>
        </Content>
      </Layout>
      <Footer style={{ textAlign: "center" }}>
        TSP Visualizer ©2024 - Powered by React & Ant Design
      </Footer>
    </Layout>
  );
};

export default Hailton;
