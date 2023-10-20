import { useState } from "react";
import TheText from "./Text";

const TextEditor = (props) => {
  const { texts, handleSetText } = props;
  const [selectedId, selectShape] = useState(null);

  return (
    <>
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
              handleSetText(txts);
            }}
            x={txt.x}
            y={txt.y}
          />
        );
      })}
    </>
  );
};

export default TextEditor;
