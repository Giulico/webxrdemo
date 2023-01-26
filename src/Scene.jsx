import {
  Box,
  OrbitControls,
  Plane,
  Sphere,
  Sky,
  useMatcapTexture,
} from "@react-three/drei";

import { Controllers, Hands } from "@react-three/xr";
import { usePlane } from "@react-three/cannon";

function Scene() {
  const [planeRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight
        position={[1, 8, 1]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        castShadow
      />

      <Sky />
      <Plane ref={planeRef} args={[40, 40]} receiveShadow />
      <Controllers />
      <Hands />
    </>
  );
}
export default Scene;
