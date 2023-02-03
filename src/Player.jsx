import * as THREE from "three";

// Hooks
import { useFrame, useThree } from "@react-three/fiber";
import { useSelector, useDispatch } from "react-redux";
import { useKeyboardControls } from "@react-three/drei";
import { useXR, useController } from "@react-three/xr";
import { useRef, useEffect } from "react";
import { useRapier } from "@react-three/rapier";

// Components
import { RigidBody, CapsuleCollider } from "@react-three/rapier";

const speed = 10;
const gamepadThreshold = 0.05;
const playerSize = 0.5;
const rotationSensitivity = 0.05;
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const direction = new THREE.Vector3();

function Player() {
  const playerState = useSelector((state) => state.player);

  const { isPresenting, player } = useXR();
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  const [, get] = useKeyboardControls();
  const rightController = useController("right");
  const rightGamepad = rightController?.inputSource?.gamepad;
  const leftController = useController("left");
  const leftGamepad = leftController?.inputSource?.gamepad;

  const playerRef = useRef();

  useFrame((state, delta) => {
    const playerCamera = player.children[0];
    let { forward, backward, left, right, jump } = get();

    let vertical = backward - forward;
    let horizontal = left - right;
    const velocity = playerRef.current.linvel();
    const position = playerRef.current.translation();

    // Update XR Camera / Player
    player.position.set(position.x, position.y, position.z);
    playerCamera.position.set(0, 3, 0);

    // Gamepad right override
    if (isPresenting && rightGamepad) {
      // Jump button check
      const jumpButton = rightGamepad.buttons[0];
      jump = jumpButton.value > 0.5;

      // Movements
      const gamepadAxes = rightGamepad.axes;
      vertical = gamepadAxes[3];
      horizontal = -gamepadAxes[2];
    }

    // Gamepad left override
    if (isPresenting && leftGamepad) {
      // Rotation
      const rotationY =
        (Math.abs(leftGamepad.axes[2]) > gamepadThreshold
          ? leftGamepad.axes[2]
          : 0) * rotationSensitivity;
      player.rotation.y -= rotationY;
    }

    frontVector.set(0, 0, vertical);
    sideVector.set(horizontal, 0, 0);
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(player.rotation)
      .applyEuler(state.camera.rotation);

    // Update camera position
    playerRef.current.setLinvel({
      x: direction.x,
      y: velocity.y,
      z: direction.z,
    });

    // Jump goes at last
    if (jump) {
      const ray = rapierWorld.castRay(
        new rapier.Ray(playerRef.current.translation(), { x: 0, y: -1, z: 0 })
      );
      const grounded = ray && ray.collider && Math.abs(ray.toi) <= 1.75;
      if (jump && grounded) {
        playerRef.current.applyImpulse({ x: 0, y: 5, z: 0 });
      }
    }
  });

  // Teleport
  useEffect(() => {
    if (playerState.newPosition.length === 0) return;

    const newPosition = JSON.parse(playerState.newPosition);
    playerRef.current.setTranslation(newPosition);
  }, [playerState.newPosition]);

  return (
    <>
      <RigidBody
        type="dynamic"
        ref={playerRef}
        position={[0, 0.5, 40]}
        enabledRotations={[false, false, false]}
        colliders={false}
      >
        <CapsuleCollider args={[playerSize, playerSize]} mass={10} />
      </RigidBody>
    </>
  );
}
export default Player;
