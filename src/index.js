import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import configuratorReducer from './store/reducers/configuratorReducer'

import '../node_modules/bootstrap/dist/css/bootstrap.min.css'

const rootReducer = combineReducers({
  conf: configuratorReducer
})

const logger = store => {
  return next => {
    return action => {
      console.log('[Middleware] dispatching: ' + action)
      const result = next(action)
      console.log('[Middleware] next state: ' + store.getState())
      return result
    }
  }
}

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  composeEnhancer(applyMiddleware(logger, thunk))
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker()
