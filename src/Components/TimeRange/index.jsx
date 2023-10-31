import React, { useState } from "react";
import { scaleTime } from "d3-scale";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";

import SliderRail from "./components/SliderRail";
import Track from "./components/Track";
import Tick from "./components/Tick";
import Handle from "./components/Handle";

import "./style.css";

const TimeRange = (props) => {
  // Handle onChange event
  const onChange = (newTime) => {
    const formattedNewTime = newTime.map((t) => new Date(t));
    props.onChangeCallback(formattedNewTime);
  };

  // Get date ticks
  const getDateTicks = () => {
    const { timelineInterval, ticksNumber } = props;

    return scaleTime()
      .domain(timelineInterval)
      .ticks(ticksNumber)
      .map((t) => +t);
  };

  return (
    <div
      className={
        props.containerClassName || "react_time_range__time_range_container"
      }
    >
      <Slider
        step={props.step}
        domain={props.timelineInterval.map((t) => Number(t))}
        onChange={onChange}
        values={props.selectedInterval.map((t) => +t)}
        rootStyle={{ position: "relative", width: "100%" }}
      >
        <Ticks values={getDateTicks()}>
          {({ ticks }) => (
            <>
              {ticks.map((tick, i) => (
                <Tick
                  key={tick.id}
                  tick={tick}
                  count={ticks.length}
                  index={i}
                />
              ))}
            </>
          )}
        </Ticks>

        <Rail>
          {({ getRailProps }) => (
            <SliderRail
              className={props.sliderRailClassName}
              getRailProps={getRailProps}
              backgroundImages={props.backgroundImages}
            />
          )}
        </Rail>

        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <>
              {tracks?.map(({ id, source, target }) => (
                <Track
                  error={props.error}
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                />
              ))}
            </>
          )}
        </Tracks>
      </Slider>
    </div>
  );
};

export default TimeRange;
