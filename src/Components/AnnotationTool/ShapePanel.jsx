import {
  MdOutlineRectangle,
  MdOutlineCircle,
  MdShowChart,
} from "react-icons/md";

import { DRAG_DATA_KEY, SHAPE_TYPES } from "../../utils/constants";

const ShapePanel = (props) => {
  const { color, strokeWidth } = props;
  const handleDragStart = (event) => {
    const type = event.target.dataset.shape;

    if (type) {
      const offsetX = event.nativeEvent.offsetX;
      const offsetY = event.nativeEvent.offsetY;

      // dimensions of the node on the browser
      const clientWidth = event.target.clientWidth;
      const clientHeight = event.target.clientHeight;

      const dragPayload = JSON.stringify({
        type,
        offsetX,
        offsetY,
        clientWidth,
        clientHeight,
        color,
        strokeWidth,
      });

      event.nativeEvent.dataTransfer.setData(DRAG_DATA_KEY, dragPayload);
    }
  };
  return (
    <>
      <div className="flex flex-col w-auto p-1 items-center">
        <div
          className={`m-[10px] h-[100px] w-[150px] border-2 border-[${color}]`}
          data-shape={SHAPE_TYPES.RECT}
          draggable
          onDragStart={handleDragStart}
        ></div>
        <div
          className={`m-[10px] h-[100px] w-[100px] border-2 border-[${color}] rounded-full`}
          draggable
          data-shape={SHAPE_TYPES.CIRCLE}
          onDragStart={handleDragStart}
        ></div>
        {/* <div className="hover:text-[#ff0000]" draggable>
          <MdShowChart size={50} />
        </div> */}
      </div>
    </>
  );
};
export default ShapePanel;
