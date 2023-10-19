import React, { useRef, useCallback, useState } from "react";
import { Layer, Stage } from "react-konva";

import { DRAG_DATA_KEY, SHAPE_TYPES } from "../../utils/constants";
import { createCircle, createRectangle } from "../ShapeCanvasField/state";
import FreeHand from "../FreeHand";
import ShapeCanvasField from "../ShapeCanvasField";
import TextEditor from "../TextEditor";

let tool = "pen";

const handleDragOver = (event) => event.preventDefault();

const AnnotationPlayField = (props) => {
  const { nowColor, nowSize, currentSelectedOption } = props;
  const [lines, setLines] = useState([]);
  const isDrawing = useRef(false);
  const stageRef = useRef();

  const [texts, setTexts] = useState([
    {
      text: "Here is editable text editor.",
      x: 100,
      y: 100,
      fontSize: nowSize,
      draggable: true,
      width: 500,
      ellipsis: true,
      fontFamily: "changa",
      fill: nowColor,
      align: "center",
      id: "1",
    },
  ]);

  const handleDrop = useCallback(
    (event) => {
      if (currentSelectedOption !== 3) {
        return;
      }
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
    },
    [currentSelectedOption]
  );

  const handleMouseDown = (e) => {
    if (currentSelectedOption !== 4) {
      return;
    }
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      { tool, points: [pos.x, pos.y], color: nowColor, size: nowSize },
    ]);
  };

  const handleMouseMove = (e) => {
    if (currentSelectedOption !== 4) {
      return;
    }
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    // add point
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = useCallback(
    (e) => {
      if (currentSelectedOption === 4) {
        isDrawing.current = false;
      } else if (currentSelectedOption === 2) {
        const pos = e.target.getStage().getPointerPosition();

        setTexts([
          ...texts,
          {
            text: "Here is editable text editor.",
            x: pos.x,
            y: pos.y,
            fontSize: nowSize,
            draggable: true,
            width: 400,
            ellipsis: true,
            fontFamily: "changa",
            fill: nowColor,
            align: "center",
            id: (texts.length + 1).toString(),
          },
        ]);
      }
    },
    [currentSelectedOption]
  );

  return (
    <>
      <div onDrop={handleDrop} onDragOver={handleDragOver}>
        <Stage
          width={window.innerWidth}
          height={window.innerHeight}
          ref={stageRef}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
        >
          <Layer>
            <TextEditor
              texts={texts}
              handleSetText={(value) => setTexts(value)}
            />
            <FreeHand lines={lines} />
            <ShapeCanvasField />
          </Layer>
        </Stage>
      </div>
    </>
  );
};

export default AnnotationPlayField;
