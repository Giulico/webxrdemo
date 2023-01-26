import {
  Box,
  OrbitControls,
  Plane,
  Sphere,
  Sky,
  useMatcapTexture,
} from "@react-three/drei";

import { usePlane } from "@react-three/cannon";

function Scene() {
  const [planeRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
  }));
  return (
    <>
      <Sky />
      <Plane ref={planeRef} args={[10, 10]} receiveShadow />
    </>
  );
}
export default Scene;
