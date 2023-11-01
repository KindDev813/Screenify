import React, { useEffect, useState } from "react";
import { scaleTime } from "d3-scale";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { LOCAL_STORAGE } from "../../utils/constants";

import SliderRail from "./components/SliderRail";
import Track from "./components/Track";
import Tick from "./components/Tick";
import Handle from "./components/Handle";

import "./style.css";

const TimeRange = (props) => {
  const { localVideoLink, maxTime, handleMaxTime, onUpdateCallback } = props;

  useEffect(() => {
    if (localVideoLink) {
      handleMaxTime(
        Math.floor(
          localStorage.getItem(LOCAL_STORAGE.RECORDING_DURATION) / 1000
        )
      );
    } else {
      handleMaxTime(0);
    }
  }, [localVideoLink]);

  // Handle onUpdate event
  const onUpdate = (newTime) => {
    onUpdateCallback(newTime);
  };

  // Get date ticks
  const getDateTicks = () => {
    const { ticksNumber } = props;
    return scaleTime()
      .domain([0, maxTime])
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
        onUpdate={onUpdate}
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
