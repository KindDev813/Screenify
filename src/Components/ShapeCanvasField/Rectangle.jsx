import React, { useRef, useEffect, useCallback } from "react";
import { Rect as KonvaRectangle, Transformer } from "react-konva";

import { LIMITS_SHAPE_VALUE } from "../../utils/constants";
import { selectShape, transformRectangleShape, moveShape } from "./state";

const boundBoxCallbackForRectangle = (oldBox, newBox) => {
  // limit resize
  if (
    newBox.width < LIMITS_SHAPE_VALUE.RECT.MIN ||
    newBox.height < LIMITS_SHAPE_VALUE.RECT.MIN ||
    newBox.width > LIMITS_SHAPE_VALUE.RECT.MAX ||
    newBox.height > LIMITS_SHAPE_VALUE.RECT.MAX
  ) {
    return oldBox;
  }
  return newBox;
};

export function Rectangle({ id, isSelected, type, ...shapeProps }) {
  const shapeRef = useRef();
  const transformerRef = useRef();

  useEffect(() => {
    if (isSelected) {
      transformerRef.current.nodes([shapeRef.current]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleSelect = useCallback(
    (event) => {
      event.cancelBubble = true;

      selectShape(id);
    },
    [id]
  );

  const handleDrag = useCallback(
    (event) => {
      moveShape(id, event);
    },
    [id]
  );

  const handleTransform = useCallback(
    (event) => {
      transformRectangleShape(shapeRef.current, id, event);
    },
    [id]
  );

  return (
    <>
      <KonvaRectangle
        onClick={handleSelect}
        onTap={handleSelect}
        onDragStart={handleSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={handleDrag}
        onTransformEnd={handleTransform}
      />
      {isSelected && (
        <Transformer
          anchorSize={5}
          borderDash={[6, 2]}
          ref={transformerRef}
          boundBoxFunc={boundBoxCallbackForRectangle}
        />
      )}
    </>
  );
}
