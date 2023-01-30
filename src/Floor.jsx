import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

function Floor({ args }) {
  return (
    <RigidBody type="fixed" position={[0, args[1] / -2 - 0.1, 0]}>
      <Box args={args} material-color="white" />
    </RigidBody>
  );
}
export default Floor;
