import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import './KeyValueModel.css'

let x = 2,
  y = 2,
  z = 2

class KeyValueModel extends Component {
  state = {
    newButtonClicked: false,
    keyValuePair: null,
    keyHolder: '',
    valueHolder: '',
    displayTable: null
  }

  handleCreate = e => {
    let spotIndex = this.props.spotIndex,
      spotData = this.props.spotData,
      selectedSpotIndex = this.props.spotIndex

    axios
      .post('http://localhost:5000/checkdb', { selectedSpotIndex })
      .then(res => {
        for (let i = 0; i < res.data.length; i++)
          for (let j = 0; j < spotData.length; j++)
            if (
              res.data[i].key === spotData[j].key &&
              res.data[i].value === spotData[j].value
            )
              spotData.splice(j, 1)

        let todb = {
          spotIndex: spotIndex,
          spotData: spotData
        }

        axios.post('http://localhost:5000/create', { todb }).then(res => {})
      })
  }

  handleRead = e => {
    let selectedSpotIndex = this.props.spotIndex

    axios
      .post('http://localhost:5000/read', { selectedSpotIndex })
      .then(res => {
        let kv = res.data.map(kv => (
          <tr key={kv.ID}>
            <th>{kv.key}</th>
            <th>{kv.value}</th>
            <th>
              <button onClick={this.handleUpdate}>Edit</button>
              <button onClick={() => this.handleDelete(kv.ID)}>Delete</button>
            </th>
          </tr>
        ))

        let displayTable = (
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>{kv}</tbody>
          </table>
        )

        this.setState({ displayTable: displayTable })
      })
  }

  handleUpdate = e => {}

  handleDelete = entryID => {
    let todb = {
      selectedSpotIndex: this.props.spotIndex,
      entryID: entryID
    }
    axios.post('http://localhost:5000/delete', { todb }).then(res => {
      if (res.status >= 400) throw new Error('Bad response')
      this.handleRead()
    })
  }

  isNewButtonClicked = () => {
    this.setState(prevState => ({
      newButtonClicked: !prevState.newButtonClicked
    }))
  }

  displayPairs = () => {
    this.setState({
      keyValuePair: this.props.spotData.map((pair, pairIndex) => {
        let id = 'pair ' + pairIndex
        return (
          <div id={id} key={id} className="pair-kv-row-display">
            <div className="pair-key-kv">
              <p>{pair.key}</p>
            </div>
            <div className="pair-value-kv">
              <p>{pair.value}</p>
            </div>
            <div>
              <button
                className="pair-delete-kv"
                onClick={this.deleteKeyValuePair.bind(this, pairIndex)}
              >
                Delete
              </button>
            </div>
          </div>
        )
      })
    })
  }

  addNewPair = () => {
    this.isNewButtonClicked()

    this.props.handleAddPair(
      this.props.spotIndex,
      this.state.keyHolder,
      this.state.valueHolder
    )

    this.displayPairs()
  }

  deleteKeyValuePair = pairIndex => {
    this.props.handleDeletePair(this.props.spotIndex, pairIndex)

    this.displayPairs()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.newButtonClicked !== this.state.newButtonClicked) {
      document.getElementById('key-holder').value = ''
      document.getElementById('value-holder').value = ''
    }
  }

  componentDidMount() {
    this.displayPairs()
  }

  keyHolderChange = e => {
    this.setState({
      keyHolder: e.target.value
    })
  }

  valueHolderChange = e => {
    this.setState({
      valueHolder: e.target.value
    })
  }

  render() {
    let kvContainerId = 'kv-container ' + this.props.spotIndex
    return (
      <div id={kvContainerId} className="kv-container">
        <div className="kv-title">
          <p className="object-title">{this.props.spotName}</p>
          <button className="exit-kv-container" onClick={this.props.handleExit}>
            &times;
          </button>
        </div>

        <div className="panel panel-primary">
          <div className="panel-body" id="getResult">
            {this.state.displayTable}
          </div>
        </div>

        <button onClick={this.handleRead}>Get</button>

        <div className="kv-body">
          <div className="new-form-kv">
            <form onSubmit={this.handleCreate}>
              <div id="grid-item">
                <label id="key-label">Key</label>
                <input
                  type="text"
                  id="key-holder"
                  name="keyHolder"
                  value={this.state.keyHolder}
                  onChange={this.keyHolderChange}
                />
              </div>

              <div id="grid-item">
                <label id="value-label">Value</label>
                <input
                  type="text"
                  id="value-holder"
                  name="valueHolder"
                  value={this.state.valueHolder}
                  onChange={this.valueHolderChange}
                />
              </div>

              <button type="submit">Add to db</button>
            </form>

            <div id="grid-item">
              <button className="new-button-kv" onClick={this.addNewPair}>
                New
              </button>
              <button
                className="destroy-button-kv"
                onClick={this.props.handleDestroy.bind(
                  this,
                  this.props.spotName,
                  this.props.spotIndex
                )}
              >
                Destroy
              </button>
              <button
                className="plus-kv"
                onClick={() => {
                  x++
                  y++
                  z++

                  let a = this.props.spotArrayObject.map(b => {
                    if (b.name === this.props.spotName) return b
                    else return null
                  })

                  a.filter(e => e !== null)[0].scale.set(x, y, z)
                }}
              >
                +
              </button>
              <button
                className="minus-kv"
                onClick={() => {
                  x--
                  y--
                  z--

                  let a = this.props.spotArrayObject.map(b => {
                    if (b.name === this.props.spotName) return b
                    else return null
                  })

                  a.filter(e => e !== null)[0].scale.set(x, y, z)
                }}
              >
                -
              </button>
            </div>
          </div>
          <div className="pair-display-holder">
            <div>
              <div className="pair-key-title">
                <p>Key</p>
              </div>
              <div className="pair-value-title">
                <p>Value</p>
              </div>
            </div>
            {this.state.keyValuePair}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    objects: state.conf.objects,
    obj_codes: state.conf.obj_codes,
    obj_names: state.conf.obj_names,
    code: state.conf.obj_obj_insts_code,
    price_total: state.conf.obj_obj_insts_price_total
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyValueModel)
