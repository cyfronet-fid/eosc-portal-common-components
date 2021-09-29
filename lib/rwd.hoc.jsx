import React from "react";
import uniqueId from "lodash-es/uniqueId";
import { useMediaQuery } from "react-responsive";
import { environment } from "../env/env";
import { GRID_FIELD, GRID_KEYS } from "./globals";

/**
 * @param {{ new(props: T): Component<T, S, any> }} WrappedComponent
 * @param {GRID_KEYS[]} showOnBreakpoints
 * @return {function(props: T): JSX.Element}
 */
export default function rwdHOC(WrappedComponent, showOnBreakpoints) {
  function Wrapper(props) {
    const styles = { display: isComponentVisible(showOnBreakpoints) ? "block" : "none" };
    const uid = uniqueId(`rwd-hoc-${WrappedComponent.name}-`);
    return (
      <div key={uid} style={styles}>
        <WrappedComponent {...props} /> {/* eslint-disable-line */}
      </div>
    );
  }
  return Wrapper;
}

/**
 * @type {{[GRID_KEYS]: {minWidth: number, maxWidth?: number}}}
 */
const lookupTable = {};
/**
 * @param {GRID_KEYS[]} showOnBreakpoints
 * @return {boolean}
 */
const isComponentVisible = (showOnBreakpoints) => {
  if (!showOnBreakpoints || showOnBreakpoints.length === 0) {
    console.warn("Component may not be displayed due to missing RWD breakpoints!!!"); // eslint-disable-line
  }

  // Build lookup table of breakpoints bounds in px
  if (Object.keys(lookupTable).length === 0) {
    GRID_KEYS.forEach((key, index) => {
      const nextKey = GRID_KEYS[index + 1];
      lookupTable[key] = { minWidth: environment.defaultConfiguration[GRID_FIELD][key] };
      if (nextKey) {
        lookupTable[key].maxWidth = environment.defaultConfiguration[GRID_FIELD][nextKey];
      }
    });
  }

  // Map current with to allowed breakpoints
  return showOnBreakpoints
    .map((key) => lookupTable[key])
    .map((bounds) => useMediaQuery(bounds))
    .some((value) => value);
};
