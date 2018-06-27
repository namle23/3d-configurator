import React from 'react'

import style from './Spinner.css'

const loadingSpinner = () => (
  <div className={style.Loader}>
    <i>Loading...</i>
  </div>
)

export default loadingSpinner
