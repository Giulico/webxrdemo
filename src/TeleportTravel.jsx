import * as THREE from "three";
import { useXR, useController, Interactive } from "@react-three/xr";
import { useFrame } from "@react-three/fiber";
import { useCallback, useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useKeyboardControls } from "@react-three/drei";
import { set } from "./store/playerSlice";

export function TeleportIndicator() {
  return (
    <>
      <pointLight position={[0, 0.5, 0]} args={[0xff00ff, 2, 0.6]} />
      <mesh position={[0, 0.25, 0]}>
        <coneGeometry args={[0.1, 0.5, 10]} attach="geometry" />
        <meshBasicMaterial attach="material" color={0xff00ff} />
      </mesh>
    </>
  );
}

export default function TeleportTravel({ children }) {
  const dispatch = useDispatch();
  const [isTeleport, setTeleport] = useState();
  const target = useRef();
  const indicatorRef = useRef();
  const ray = useRef(new THREE.Raycaster());

  const leftController = useController("left");
  const leftGamepad = leftController?.inputSource?.gamepad;

  const [sub, get] = useKeyboardControls();

  const { isPresenting } = useXR();
  const rayDir = useRef({
    pos: new THREE.Vector3(),
    dir: new THREE.Vector3(),
  });

  useEffect(() => {
    return sub(
      (state) => state.teleport,
      (pressed) => {
        if (pressed) {
          setTeleport(true);
        } else {
          setTeleport(false);
        }
      }
    );
  }, []);

  useFrame((state) => {
    if (isPresenting && leftGamepad) {
      const buttonY = leftGamepad.buttons[5].pressed;
      if (buttonY && !isTeleport) {
        setTeleport(true);
      }
      if (!buttonY && isTeleport) {
        setTeleport(false);
      }
    }

    if (!isTeleport) return;

    if (isPresenting && leftGamepad) {
      leftController.controller.getWorldDirection(rayDir.current.dir);
      leftController.controller.getWorldPosition(rayDir.current.pos);
      rayDir.current.dir.multiplyScalar(-1);
    } else {
      rayDir.current.pos = state.camera.parent.position;
      state.camera.getWorldDirection(rayDir.current.dir);
    }

    ray.current.set(rayDir.current.pos, rayDir.current.dir);

    const [intersection] = ray.current.intersectObject(target.current);
    if (intersection) {
      const p = intersection.point;
      indicatorRef.current.position.copy(p);
    }
  });

  const teleport = useCallback((point) => {
    dispatch(set(point));
  }, []);

  const click = useCallback((event) => {
    const point = event.point;
    teleport({ x: point.x, y: point.y, z: point.z });
  }, []);

  const select = useCallback((event) => {
    const point = event.intersection.point;
    teleport({ x: point.x, y: point.y, z: point.z });
  }, []);

  return (
    <>
      <group ref={indicatorRef}>{isTeleport && <TeleportIndicator />}</group>
      <Interactive onSelect={select}>
        <group ref={target} onClick={click}>
          {children}
        </group>
      </Interactive>
    </>
  );
}
