import { useState, useEffect, useRef, Fragment } from "react";
import { Text, Transformer } from "react-konva";
import { Html } from "react-konva-utils";
import { KEY_CODE } from "../../utils/constants";

function getStyle(width, fontSize, color) {
  const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
  const baseStyle = {
    width: `${width}px`,
    border: "none",
    padding: "0px",
    margin: "0px",
    align: "center",
    background: "none",
    outline: "none",
    color: color,
    fontSize: fontSize,
    fontFamily: "changa",
    overflow: "hidden",
  };
  if (isFirefox) {
    return baseStyle;
  }
  return {
    ...baseStyle,
    margintop: "-4px",
  };
}

const TheText = ({ textProps, isSelected, onSelect, onChange, x, y }) => {
  const textRef = useRef();
  const trRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const style = getStyle(textProps.width, textProps.fontSize, textProps.fill);

  useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const handleEscapeKeys = (e) => {
    if (
      (e.keyCode === KEY_CODE.RETURN_KEY && !e.shiftKey) ||
      e.keyCode === KEY_CODE.ESCAPE_KEY
    ) {
      setIsEditing(false);
    }
  };

  return (
    <Fragment>
      {!isEditing ? (
        <div>
          <Text
            onClick={onSelect}
            onTap={onSelect}
            ref={textRef}
            {...textProps}
            draggable
            onDragEnd={(e) => {
              onChange({
                ...textProps,
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
            onDblClick={(e) => {
              setIsEditing(true);
              console.log(e);
            }}
            onTransformEnd={(e) => {
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
        </div>
      ) : (
        <Html groupProps={{ x, y }} divProps={{ style: { opacity: 1 } }}>
          <textarea
            value={textProps.text}
            onChange={(e) => {
              onChange({
                ...textProps,
                text: e.target.value,
              });
            }}
            onKeyDown={(e) => {
              handleEscapeKeys(e);
            }}
            style={style}
          />
        </Html>
      )}
    </Fragment>
  );
};

export default TheText;
