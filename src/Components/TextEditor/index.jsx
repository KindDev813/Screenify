import { useState, useEffect, useRef, Fragment } from "react";
import { Stage, Layer } from "react-konva";
import TheText from "./Text";

const TextEditor = (props) => {
  const { fontColor, fontSize } = props;

  const [texts, setTexts] = useState([
    {
      text: "Here is editable text editor.",
      x: 100,
      y: 100,
      fontSize: 40,
      draggable: true,
      width: 500,
      ellipsis: true,
      fontFamily: "changa",
      fill: fontColor,
      align: "center",
      id: "1",
    },
  ]);
  const [selectedId, selectShape] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  const handleMouseDown = (e) => {
    const pos = e.target.getStage().getPointerPosition();

    setTexts([
      ...texts,
      {
        text: "Here is editable text editor.",
        x: pos.x,
        y: pos.y,
        fontSize: fontSize,
        draggable: true,
        width: 400,
        ellipsis: true,
        fontFamily: "changa",
        fill: fontColor,
        align: "center",
        id: (texts.length + 1).toString(),
      },
    ]);
  };

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        // onMouseUp={handleMouseDown}
      >
        <Layer>
          {texts.map((txt, i) => {
            return (
              <TheText
                key={i}
                textProps={txt}
                isSelected={txt.id === selectedId}
                onSelect={() => {
                  selectShape(txt.id);
                }}
                onChange={(newAttrs) => {
                  const txts = texts.slice();
                  txts[i] = newAttrs;
                  setTexts(txts);
                }}
                onClick={(e) => {
                  console.log("values");
                }}
              />
            );
          })}
        </Layer>
      </Stage>
    </>
  );
};

export default TextEditor;
