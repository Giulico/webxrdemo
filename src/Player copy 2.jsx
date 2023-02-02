import { RigidBody } from "@react-three/rapier";
import { useKeyboardControls, Cylinder } from "@react-three/drei";
import { useXR, useController } from "@react-three/xr";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useRapier } from "@react-three/rapier";

const speed = 10;
const gamepadThreshold = 0.05;
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

    if (isPresenting && leftGamepad) {
      const playerCamera = player.children[0];
      const cameraMatrix = playerCamera.matrixWorld.elements;

      frontVector
        .set(-cameraMatrix[8], -cameraMatrix[9], -cameraMatrix[10])
        .normalize();
      frontVector.y = 0;
      sideVector.y = 0;
      // Horizontal movement
      sideVector.copy(frontVector);
      sideVector.cross(playerCamera.up).normalize();
      direction
        .subVectors(
          frontVector.multiplyScalar(
            Math.abs(rightGamepad.axes[3]) > gamepadThreshold
              ? -rightGamepad.axes[3]
              : 0
          ),
          sideVector.multiplyScalar(
            Math.abs(rightGamepad.axes[2]) > gamepadThreshold
              ? -rightGamepad.axes[2]
              : 0
          )
        )
        .normalize()
        .multiplyScalar(speed);

      playerRef.current.setLinvel(direction);

      // Rotation
      playerRef.current.setAngvel({
        x: 0,
        y:
          Math.abs(leftGamepad.axes[2]) > gamepadThreshold
            ? -leftGamepad.axes[2]
            : 0,
        z: 0,
      });
      // playerRef.current.rotation.y -=
      //   (Math.abs(leftGamepad.axes[2]) > gamepadThreshold
      //     ? leftGamepad.axes[2]
      //     : 0) * speed;

      // Jump
      const jumpButton = rightGamepad.buttons[0];
      jump = jumpButton.value > 0.5;
      if (jump) {
        playerRef.current.setLinvel({ x: 0, y: 2.5, z: 0 });
      }
      // Update player
      player.position.set(...playerRef.current.translation());
      // console.log(player.rotation, playerRef.current.rotation());
      const eulerRotation = new THREE.Euler().setFromQuaternion(
        playerRef.current.rotation(),
        "XYZ"
      );
      // eulerRotation.setFromQuaternion(playerRef.current.rotation());
      // console.log(player.rotation, eulerRotation);
      console.log(playerCamera);
      // playerCamera.rotation.z = playerRef.current.rotation.z;
    } else {
      const velocity = playerRef.current.linvel();
      frontVector.set(0, 0, backward - forward);
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

      const playerPosition = playerRef.current.translation();
      state.camera.position.set(...playerPosition);

      // jumping
      const rapierWorld = world.raw();
      const ray = rapierWorld.castRay(
        new rapier.Ray(playerRef.current.translation(), { x: 0, y: -1, z: 0 })
      );
      const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75;
      if (jump && grounded) {
        playerRef.current.setLinvel({ x: 0, y: 5, z: 0 });
      }
    }

    // Camera
    // if (isPresenting && rightController) {
    //   player.position.set(...playerPosition);
    // }
  });

  return (
    <RigidBody
      type="dynamic"
      ref={playerRef}
      position={[0, 0, 40]}
      enabledRotations={[false, false, false]}
    >
      <Cylinder
        args={[2, 2, 2, 8]}
        material-color="red"
        material-transparent
        material-opacity={0.2}
      />
    </RigidBody>
  );
}
export default Player;
