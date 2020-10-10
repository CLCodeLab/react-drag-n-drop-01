/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useState, useEffect, useContext } from 'react'
import { useDrop } from 'react-dnd'
import ItemTypes from '../utils/ItemTypes'
import Flag from './Flag'

/**
 * -- CONTEXT --
 */
import DispatchContext from '../context/DispatchContext'
import StateContext from '../context/StateContext'

function Square(props) {
	const { id, black } = props
	/**
	 * -- APP WIDE CONTEXTS --
	 */
	const appDispatch = useContext(DispatchContext)
	const appState = useContext(StateContext)
	const { selectedSquareId, placedInWhiteSquare } = appState

	/**
	 * -- COMPONENT STATE --
	 */
	const [isFlag, setIsFlag] = useState(false)

	/**
	 * -- SET FLAG AT TOP LEFT CORNER AT FIRST RENDER --
	 */
	useEffect(() => {
		if (id == 0) setIsFlag(true)
	}, [])

	/**
	 * -- SWITCH FLAG OFF WHEN SQUARE NOT SELECTED --
	 */
	useEffect(() => {
		if (isFlag && id != selectedSquareId) {
			setIsFlag(false)
		}
	}, [selectedSquareId])

	/**
	 * -- USEDROP HOOK --
	 */
  const [{ isOver, canDrop }, drop] = useDrop({
		accept: ItemTypes.FLAG,
		drop: () => {
			appDispatch({ type: 'getSelectedSquareId', value: id })
			setIsFlag(true)
		},
		canDrop: () => {
			return canDropHere()
		},
		collect: monitor => ({
			isOver: !!monitor.isOver(),
			canDrop: !!monitor.canDrop()
		})
	})

	const canDropHere = () => {
		let result = true
		if (placedInWhiteSquare && black == true) result = false
		return result
  }
  
  const backgroundColor = () => {
		if (placedInWhiteSquare) {
			if (isOver && !canDrop) return 'red'
			if (!isOver && canDrop) return 'yellow'
			if (isOver && canDrop) return 'green'
		} else {
			return ''
		}
  }
  
  const style = {
		height: '100%',
		width: '100%',
		zIndex: 1,
		opacity: isOver ? 0.5 : 1,
		backgroundColor: backgroundColor()
	}

	return (
		<div ref={drop} id={id} style={style}>
			{isFlag && <Flag />}
    </div>
    )
}

export default Square
