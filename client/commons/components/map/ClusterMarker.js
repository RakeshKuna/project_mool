import React from 'react';
import compose from 'recompose/compose';
import defaultProps from 'recompose/defaultProps';
import withPropsOnChange from 'recompose/withPropsOnChange';
import { Motion, spring } from 'react-motion';

export const clusterMarker = ({
  styles, text, userType,
  defaultMotionStyle, motionStyle,
}) => (
  <Motion defaultStyle={defaultMotionStyle}
    style={motionStyle}
  >
    {
      ({ scale }) => (
        <div
          className={'chapter_map'}
          style={{
            transform: `translate3D(0,0,0) scale(${scale}, ${scale})`,
          }}
        >
          <div
            className={`hex_btn ${userType}`}
          >
            {text}
          </div>
        </div>
      )
    }
  </Motion>
);

export const clusterMarkerHOC = compose(
  defaultProps({
    text: '0',
    styles: {
      marker:{
      position: 'absolute',
      cursor: 'pointer',
      width: '40px !default',
      height: '40px !default',
      left: '-20px',
      top: '-20px',
      border: '5px solid #004336',
      'border-radius': '50%',
      'background-color': 'white',
      'text-align': 'center',
      color: '#333',

      'font-size': '14px !default',
      'font-weight': 'bold',
      display: 'flex',
      'align-items': 'center',
      'justify-content': 'center'
      }
     },
    initialScale: 0.6,
    defaultScale: 1,
    hoveredScale: 1.15,
    hovered: false,
    stiffness: 320,
    damping: 7,
    precision: 0.001,
  }),
  // pure optimization can cause some effects you don't want,
  // don't use it in development for markers

  withPropsOnChange(
    ['initialScale'],
    ({ initialScale, defaultScale, $prerender }) => ({
      initialScale,
      defaultMotionStyle: { scale: $prerender ? defaultScale : initialScale },
    })
  ),
  withPropsOnChange(
    ['hovered'],
    ({
      hovered, hoveredScale, defaultScale,
      stiffness, damping, precision,
    }) => ({
      hovered,
      motionStyle: {
        scale: spring(
          hovered ? hoveredScale : defaultScale,
          { stiffness, damping, precision }
        ),
      },
    })
  )
);

export default clusterMarkerHOC(clusterMarker);
