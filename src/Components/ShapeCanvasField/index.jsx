import React from "react";
import { Shape } from "./Shape";
import { useShapes } from "./state";

const ShapeCanvasField = (props) => {
  const shapes = useShapes((state) => Object.entries(state.shapes));

  return (
    <>
      {shapes.map(([key, shape]) => (
        <Shape key={key} shape={{ ...shape, id: key }} />
      ))}
    </>
  );
};

export default ShapeCanvasField;
