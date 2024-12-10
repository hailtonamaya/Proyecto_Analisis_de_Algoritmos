import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { Html, OrbitControls } from "@react-three/drei";
import { Layout, Form, InputNumber, Button, Typography, Divider, Row, Col, List } from "antd";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import "antd/dist/reset.css";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

const calculateDistance = (a, b) => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const AnimatedRoute = ({ cities, stepIndex, route }) => {
  const lineRef = useRef();
  const points = [];

  for (let i = 0; i <= stepIndex && i < route.length; i++) {
    const city = cities[route[i]];
    points.push(new THREE.Vector3(city.x, city.y, 0));
  }

  useEffect(() => {
    if (lineRef.current) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lineRef.current.geometry.dispose();
      lineRef.current.geometry = geometry;
    }
  }, [stepIndex, points]);

  return (
    <line ref={lineRef}>
      <bufferGeometry />
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

  const generateCities = () => {
    const newCities = Array.from({ length: numCities }, () => ({
      x: Math.random() * 10 - 5,
      y: Math.random() * 10 - 5,
    }));
    setCities(newCities);
    resetVisualization();
  };

  const resetVisualization = () => {
    setRoute([]);
    setVisited([]);
    setStepIndex(-1);
  };

  const calculateExactRoute = () => {
    const start = Date.now();
    const distances = cities.map((_, i) =>
      cities.map((_, j) => calculateDistance(cities[i], cities[j]))
    );

    const allRoutes = permute(Array.from({ length: cities.length }, (_, i) => i).slice(1));
    let shortestRoute = null;
    let shortestDistance = Infinity;

    allRoutes.forEach((route) => {
      const fullRoute = [0, ...route, 0];
      const distance = fullRoute.reduce(
        (sum, city, i) => sum + (i === fullRoute.length - 1 ? 0 : distances[city][fullRoute[i + 1]]),
        0
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        shortestRoute = fullRoute;
      }
    });

    const end = Date.now();
    setExecutionTime(end - start);
    console.log(executionTime);
    setRoute(shortestRoute);
    setStepIndex(0);
  };

  const calculateApproximateRoute = () => {
    const start = Date.now();
    const distances = cities.map((_, i) =>
      cities.map((_, j) => calculateDistance(cities[i], cities[j]))
    );
    const visitedCities = Array(cities.length).fill(false);
    let currentCity = 0;
    visitedCities[currentCity] = true;
    const currentRoute = [currentCity];

    for (let step = 1; step < cities.length; step++) {
      const nearestCity = distances[currentCity]
        .map((dist, i) => ({ dist, i }))
        .filter(({ i }) => !visitedCities[i])
        .reduce((min, next) => (next.dist < min.dist ? next : min)).i;

      visitedCities[nearestCity] = true;
      currentRoute.push(nearestCity);
      currentCity = nearestCity;
    }
    currentRoute.push(0);

    const end = Date.now();
    setExecutionTime(end - start);
    console.log(executionTime);
    setRoute(currentRoute);
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
      }, 1000);
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
                onClick={calculateExactRoute}
                disabled={cities.length === 0}
                block
              >
                Algoritmo Exacto
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={calculateApproximateRoute}
                disabled={cities.length === 0}
                block
              >
                Algoritmo Aproximado
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="default"
                onClick={resetVisualization}
                disabled={cities.length === 0}
                block
              >
                Limpiar Ciudades
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <Text strong>Tiempo de ejecución:</Text>
          <Text>{` ${executionTime} ms`}</Text>
        </Sider>
        <Content style={{ backgroundColor: "#faf8ec", padding: "10px" }}>
          <Canvas
            style={{ width: "100%", height: "100%" }}
            camera={{ position: [0, 0, 15], fov: 50 }}
          >
            {cities.map((city, index) => (
              <Html key={index} position={[city.x, city.y, 0]}>
                <div style={{ textAlign: "center", color: visited[index] ? "black" : "red" }}>
                  <FaBuilding size={24} color={visited[index] ? "black" : "red"} />
                  <div style={{ fontSize: "12px" }}>{index + 1}</div>
                </div>
              </Html>
            ))}
            <AnimatedRoute cities={cities} stepIndex={stepIndex} route={route} />
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

const permute = (arr) => {
  if (arr.length <= 1) return [arr];
  const permutations = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = permute([...arr.slice(0, i), ...arr.slice(i + 1)]);
    rest.forEach((perm) => permutations.push([arr[i], ...perm]));
  }
  return permutations;
};

export default Hailton;
