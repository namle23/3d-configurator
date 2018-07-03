import React from 'react'

let modelIndex = 0

const modelCarousel = obj_names_length => {
  return (
    <div>
      <button
        className="btn btn-default"
        onClick={() => this.prevScene(this.props.obj_names.length)}
      >
        Prev
      </button>
      <button
        className="btn btn-default"
        onClick={() => this.nextScene(this.props.obj_names.length)}
      >
        Next
      </button>
    </div>
  )
}

const nextScene = obj_names_length => {
  ++modelIndex
  if (modelIndex >= obj_names_length) {
    modelIndex = 0
    scene = this.props.scenes[0]
  } else {
    scene = this.props.scenes[modelIndex]
  }
}

const prevScene = obj_names_length => {
  --modelIndex
  if (modelIndex <= 0) {
    modelIndex = obj_names_length
    scene = this.props.scenes[0]
  } else {
    scene = this.props.scenes[modelIndex]
  }
}

export default (nextScene, prevScene)
