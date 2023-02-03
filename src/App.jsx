// Components
import { Canvas } from "@react-three/fiber";
import { XR, VRButton } from "@react-three/xr";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import Experience from "./Experience";
import { Perf } from "r3f-perf";
import { Leva } from "leva";
import Providers from "./providers";

// Hooks
import { useMemo } from "react";
import { useControls } from "leva";

const Controls = {
  forward: "forward",
  backward: "backward",
  left: "left",
  right: "right",
  jump: "jump",
  teleport: "teleport",
};

function App() {
  const map = useMemo(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.backward, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
      { name: Controls.teleport, keys: ["KeyE"] },
    ],
    []
  );

  // const { orbitControls } = useControls({
  //   orbitControls: false,
  // });
  const orbitControls = false;

  return (
    <Providers>
      <VRButton />
      <Canvas shadows>
        <Perf position="top-left" />
        {/* <Leva hidden={true} /> */}
        {orbitControls && <OrbitControls makeDefault />}

        <KeyboardControls map={map}>
          <XR>
            <Experience />
          </XR>
        </KeyboardControls>
      </Canvas>
    </Providers>
  );
}

export default App;
