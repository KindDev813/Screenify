import { useState } from "react";
import TheText from "./Text";

const TextEditor = (props) => {
  const { handleSetText } = props;
  const [selectedId, selectShape] = useState(null);

  return (
    <>
      {props.texts.map((txt, i) => {
        return (
          <TheText
            key={i}
            textProps={txt}
            isSelected={txt.id === selectedId}
            onSelect={() => {
              selectShape(txt.id);
            }}
            onChange={(newAttrs) => {
              const txts = props.texts.slice();
              txts[i] = newAttrs;
              handleSetText(txts);
            }}
          />
        );
      })}
    </>
  );
};

export default TextEditor;
