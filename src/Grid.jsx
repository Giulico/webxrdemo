import { Grid as DreiGrid } from "@react-three/drei";
import { useControls } from "leva";

function Grid() {
  const { gridSize, enableGrid, ...gridConfig } = useControls(
    "Grid",
    {
      enableGrid: true,
      gridSize: [10.5, 10.5],
      cellSize: { value: 1, min: 0, max: 10, step: 0.1 },
      cellThickness: { value: 0.5, min: 0, max: 5, step: 0.1 },
      cellColor: "#6f6f6f",
      sectionSize: { value: 5, min: 0, max: 10, step: 0.1 },
      sectionThickness: { value: 0.75, min: 0, max: 5, step: 0.1 },
      sectionColor: "#cb8a72",
      fadeDistance: { value: 60, min: 0, max: 100, step: 1 },
      fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
      followCamera: false,
      infiniteGrid: true,
    },
    {
      collapsed: true,
    }
  );

  return enableGrid ? (
    <DreiGrid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
  ) : null;
}
export default Grid;
