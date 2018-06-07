import React, { Component } from 'react'
import { connect } from 'react-redux'

import SingleUploadOutput from '../../../components/SingleUploadOutput/SingleUploadOutput'

class SingleUpload extends Component {
  render() {
    return (
      <div>
        <SingleUploadOutput />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect()(SingleUpload)
