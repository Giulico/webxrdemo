// Components
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { XR, VRButton } from "@react-three/xr";
import { OrbitControls } from "@react-three/drei";
import Scene from "./Scene";

function App() {
  return (
    <>
      <VRButton />
      <Canvas
        shadows
        camera={{
          position: [0, 1, -1],
        }}
      >
        <OrbitControls />
        <XR>
          <Physics
            gravity={[0, -2, 0]}
            iterations={20}
            defaultContactMaterial={{
              friction: 0.09,
            }}
          >
            <Scene />
          </Physics>
        </XR>
      </Canvas>
    </>
  );
}

export default App;
