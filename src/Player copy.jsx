import { RigidBody } from "@react-three/rapier";
import { useKeyboardControls, Cylinder } from "@react-three/drei";
import { useXR, useController } from "@react-three/xr";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useRapier } from "@react-three/rapier";

const speed = 10;
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const direction = new THREE.Vector3();

function Player() {
  const { isPresenting, player } = useXR();
  const { rapier, world } = useRapier();

  const [, get] = useKeyboardControls();
  const rightController = useController("right");
  const rightGamepad = rightController?.inputSource?.gamepad;
  const leftController = useController("left");
  const leftGamepad = leftController?.inputSource?.gamepad;

  const playerRef = useRef();

  useFrame((state, delta) => {
    let { forward, backward, left, right, jump } = get();
    const velocity = playerRef.current.linvel();

    // Gamepad override
    if (isPresenting && rightGamepad) {
      const gamepadAxes = rightGamepad.axes;
      const jumpButton = rightGamepad.buttons[0];

      jump = jumpButton.value > 0.5;

      forward = gamepadAxes[3] < 0;
      backward = gamepadAxes[3] > 0;
      left = gamepadAxes[2] < 0;
      right = gamepadAxes[2] > 0;
    }
    if (isPresenting && leftGamepad) {
      // player.rotation.y -= leftGamepad.axes[2] * 0.05;
      const cameraMatrix = player.children[0].matrixWorld.elements;
      frontVector
        .set(-cameraMatrix[8], -cameraMatrix[9], -cameraMatrix[10])
        .normalize();
      frontVector.y = 0;
    } else {
      frontVector.set(0, 0, backward - forward);
    }

    sideVector.set(left - right, 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(state.camera.rotation);

    // Update camera position
    playerRef.current.setLinvel({
      x: direction.x,
      y: velocity.y,
      z: direction.z,
    });

    // jumping
    const rapierWorld = world.raw();
    const ray = rapierWorld.castRay(
      new rapier.Ray(playerRef.current.translation(), { x: 0, y: -1, z: 0 })
    );
    const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75;
    if (jump && grounded) {
      playerRef.current.setLinvel({ x: 0, y: 5, z: 0 });
    }

    // Camera
    const playerPosition = playerRef.current.translation();
    if (isPresenting && rightController) {
      player.position.set(...playerPosition);
    }

    state.camera.position.set(...playerPosition);
  });

  return (
    <RigidBody
      type="dynamic"
      ref={playerRef}
      mass={100}
      friction={1}
      position={[0, 0, 40]}
      enabledRotations={[false, false, false]}
    >
      <Cylinder args={[2, 2, 2, 8]} material-transparent material-opacity={0} />
    </RigidBody>
  );
}
export default Player;
