// Components
import { Suspense } from "react";
import { useLoader } from "@react-three/fiber";
import { Sky, PointerLockControls } from "@react-three/drei";
import { Controllers, Hands, useXR } from "@react-three/xr";
import { Physics, Debug } from "@react-three/rapier";
import Player from "./Player";
import Floor from "./Floor";
import Grid from "./Grid";
import ErrorBoundary from "./ErrorBoundary";
import TeleportTravel from "./TeleportTravel";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// Hooks
import { useControls } from "leva";

function Experience() {
  const { session } = useXR();

  const { showDebug } = useControls({ showDebug: false });

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

  const model = useLoader(GLTFLoader, "./CLASSROOM.glb", (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    loader.setDRACOLoader(dracoLoader);
  });

  return (
    <>
      <Sky sunPosition={sunPosition} />
      <directionalLight
        castShadow
        position={[1, 2, 3]}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-top={25}
        shadow-camera-right={25}
        shadow-camera-bottom={-25}
        shadow-camera-left={-25}
      />
      <ambientLight intensity={0.5} />

      <Controllers rayMaterial={{ color: "blue" }} />
      <Hands />

      <Suspense>
        <Physics>
          {showDebug && <Debug />}
          <Grid />

          <Player />

          {/* Floor */}
          <TeleportTravel>
            <Floor
              args={[100, 0.2, 100]}
              position={[0, -0.2, 0]}
              color="darkslategrey"
            />
          </TeleportTravel>

          <primitive object={model.scene} />
        </Physics>
        {!session && (
          <ErrorBoundary>
            <PointerLockControls />
          </ErrorBoundary>
        )}
      </Suspense>
    </>
  );
}
export default Experience;
