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
  const xr = useXR();
  // console.log(xr);
  const { session } = xr;

  const { showDebug } = useControls({
    showDebug: false,
  });
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

  console.log(session);

  return (
    <>
      <Sky sunPosition={sunPosition} />
      <ambientLight intensity={0.3} />

      <Controllers rayMaterial={{ color: "blue" }} />
      <Hands />

      <Suspense>
        <Physics>
          {showDebug && <Debug />}
          <Grid />

          <Player />

          <Floor args={[30, 0.2, 100]} />
        </Physics>
        {!session && <PointerLockControls />}
      </Suspense>
    </>
  );
}
export default Experience;
