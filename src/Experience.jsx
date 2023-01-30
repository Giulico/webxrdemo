// Components
import { Suspense } from "react";
import { Sky, PointerLockControls } from "@react-three/drei";
import { Controllers, Hands, useXR } from "@react-three/xr";
import { Physics, Debug } from "@react-three/rapier";
import Player from "./Player";
import Floor from "./Floor";
import Grid from "./Grid";

// Hooks
import { useControls } from "leva";

function Experience() {
  const { isPresenting } = useXR();

  const { sunPosition } = useControls(
    "Sky",
    {
      sunPosition: {
        value: [1, 2, 3],
        step: 0.1,
      },
    },
    {
      collapsed: true,
    }
  );

  return (
    <>
      <Sky sunPosition={sunPosition} />
      <ambientLight intensity={0.3} />

      <Controllers rayMaterial={{ color: "blue" }} />
      <Hands />

      <Suspense>
        <Physics>
          <Debug />
          <Grid />

          <Player />

          <Floor args={[30, 0.2, 100]} />
        </Physics>
        {!isPresenting && <PointerLockControls />}
      </Suspense>
    </>
  );
}
export default Experience;
