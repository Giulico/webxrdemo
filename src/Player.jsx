import { RigidBody } from "@react-three/rapier";
import { useKeyboardControls, Cylinder } from "@react-three/drei";
import { useXR, useController } from "@react-three/xr";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const speed = 5;
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const direction = new THREE.Vector3();
const velocity = new THREE.Vector3();

function Player() {
  const [, get] = useKeyboardControls();
  const { isPresenting, player } = useXR();
  const controller = useController("right");
  const playerRef = useRef();

  useFrame((state, delta) => {
    let { forward, backward, left, right, jump } = get();

    // Gamepad override
    if (isPresenting && controller) {
      const gamepadAxes = controller.inputSource.gamepad.axes;

      forward = gamepadAxes[3] < 0;
      backward = gamepadAxes[3] > 0;
      left = gamepadAxes[2] < 0;
      right = gamepadAxes[2] > 0;
    }

    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(state.camera.rotation);

    playerRef.current.setLinvel({
      x: direction.x,
      y: velocity.y,
      z: direction.z,
    });

    // Update camera position
    const playerPosition = playerRef.current.translation();
    state.camera.position.set(...playerPosition);
    if (isPresenting && controller) {
      player.position.set(...playerPosition);
    }
  });

  return (
    <RigidBody
      type="dynamic"
      ref={playerRef}
      position={[0, 0, 40]}
      enabledRotations={[false, false, false]}
    >
      <Cylinder args={[2, 2, 2, 8]} material-transparent material-opacity={0} />
    </RigidBody>
  );
}
export default Player;
