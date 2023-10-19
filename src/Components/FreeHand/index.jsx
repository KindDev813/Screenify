import { Line } from "react-konva";

const FreeHand = (props) => (
  <>
    {props.lines.map((line, i) => (
      <Line
        key={i}
        points={line.points}
        stroke={line.color}
        // fill={line.color}
        strokeWidth={line.size}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation={"source-over"}
      />
    ))}
  </>
);

export default FreeHand;
