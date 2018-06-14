import React from 'react'

import style from './AngleView.css'

const angleView = props => {
  return (
    <div className={style.circle}>
      <button className="btn btn-default" onClick={props.topclick}>
        Top
      </button>
      <button className="btn btn-default" onClick={props.rightclick}>
        Right
      </button>
      <button className="btn btn-default" onClick={props.bottomclick}>
        Bottom
      </button>
      <button className="btn btn-default" onClick={props.leftclick}>
        Left
      </button>
    </div>
  )
}

export default angleView
