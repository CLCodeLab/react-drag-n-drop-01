import React, { useContext } from 'react'

/**
 * -- CONTEXT --
 */
import DispatchContext from '../context/DispatchContext'
import StateContext from '../context/StateContext'

function Checkbox() {
	const appDispatch = useContext(DispatchContext)
	const appState = useContext(StateContext)
  const { placedInWhiteSquare } = appState
  
  function handleChange(){
    appDispatch({type:'placeInWhiteSquare'})
  }

  const style ={
    fontSize: '20px',
    
  }

  const labelStyle = {
    margin: '10px'
  }

  return (
		<div style={style}>
			<input
				type='checkbox'
				id='check1'
				name='check1'
				value='black'
        defaultChecked={placedInWhiteSquare}
        onChange={handleChange}
			/>
			<label style={labelStyle} htmlFor='check1'> Place in white squares only</label>
		</div>
	)
}

export default Checkbox
