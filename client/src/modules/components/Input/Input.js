import React from 'react';

import './Input.css';

export default function Input(props) {
  return (<input type='text' {...props} className={'Input ' + props.className} >
    {props.children}
  </input>);
}
