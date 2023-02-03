import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

function Floor({ args, position, color = "white" }) {
  return (
    <RigidBody type="fixed" position={position}>
      <Box castShadow receiveShadow args={args}>
        <meshStandardMaterial color={color} />
      </Box>
    </RigidBody>
  );
}
export default Floor;
