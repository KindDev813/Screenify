import React, { useRef, useCallback, useState, useEffect } from "react";
import { Layer, Stage } from "react-konva";

import { DRAG_DATA_KEY, SHAPE_TYPES } from "../../utils/constants";
import { Shape } from "./Shape";
import {
  useShapes,
  clearSelection,
  createCircle,
  createRectangle,
} from "./state";

const handleDragOver = (event) => event.preventDefault();

const ShapeCanvasField = (props) => {
  const shapes = useShapes((state) => Object.entries(state.shapes));
  const stageRef = useRef();

  const handleDrop = useCallback((event) => {
    const draggedData = event.nativeEvent.dataTransfer.getData(DRAG_DATA_KEY);

    if (draggedData) {
      const {
        offsetX,
        offsetY,
        type,
        clientHeight,
        clientWidth,
        color,
        strokeWidth,
      } = JSON.parse(draggedData);

      stageRef.current.setPointersPositions(event);

      const coords = stageRef.current.getPointerPosition();

      if (type === SHAPE_TYPES.RECT) {
        // rectangle x, y is at the top,left corner
        createRectangle({
          x: coords.x - offsetX,
          y: coords.y - offsetY,
          color: color,
          strokeWidth: strokeWidth,
        });
      } else if (type === SHAPE_TYPES.CIRCLE) {
        // circle x, y is at the center of the circle
        createCircle({
          x: coords.x - (offsetX - clientWidth / 2),
          y: coords.y - (offsetY - clientHeight / 2),
          color: color,
          strokeWidth: strokeWidth,
        });
      }
    }
  }, []);

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver}>
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onClick={clearSelection}
        // onDrop={handleDrop}
        // onDragOver={handleDragOver}
      >
        <Layer>
          {shapes.map(([key, shape]) => (
            <Shape key={key} shape={{ ...shape, id: key }} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default ShapeCanvasField;
