import { useState, useEffect, useRef, Fragment } from "react";
import { Stage, Layer, Text, Transformer } from "react-konva";
import Konva from "konva";

const TheText = ({ textProps, isSelected, onSelect, onChange }) => {
  const textRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <Fragment>
      <Text
        onClick={onSelect}
        onTap={onSelect}
        ref={textRef}
        {...textProps}
        // dragBoundFunc ={(pos)=>{
        //   // important pos - is absolute position of the node
        //   // you should return absolute position too
        //   return {
        //     x: this.absolutePosition().x,
        //     y: pos.y,
        //   };
        // }}
        // verticalAlign='center'
        // fillPatternImage= 'https://i.pinimg.com/564x/eb/68/86/eb68862a2eae8f1648599653cdb740b7.jpg'
        draggable
        onDragEnd={(e) => {
          onChange({
            ...textProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = textRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...textProps,
            x: node.x(),
            y: node.y(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Fragment>
  );
};

const TextEditor = () => {
  const [texts, setTexts] = useState([
    {
      text: "This is Text Editor using react-konva.",
      x: 25,
      y: 25,
      fontSize: 40,
      draggable: true,
      width: 400,
      ellipsis: true,
      fontFamily: "changa",
      fill: "#ff0000",
      align: "center",
      id: "1",
    },
  ]);
  const [selectedId, selectShape] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  return (
    <>
      <Stage width={window.innerWidth} height={window.innerHeight}>
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
              />
            );
          })}
        </Layer>
      </Stage>
    </>
  );
};

export default TextEditor;
