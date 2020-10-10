import React, { useState, useEffect } from 'react'
import Square from './Square'

function Board(props) {
	const { width } = props
	const boardStyle = {
		display: 'flex',
		flexWrap: 'wrap',
		width: `${width}px`,
		height: `${width}px`
	}

	/**
	 * -- BUILD ARRAY OF BOARD SQUARES --
	 */
	const getSquareArray = () => {
		let square = []
		for (let id = 0; id < 64; id++) {
			const x = id % 8
			const y = Math.floor(id / 8)
			const black = (x + y) % 2 === 1
			square.push({
				id,
				black,
				isPieceHere: false
			})
		}
		return square
	}

	/**
	 * -- BUILD BOARD WHEN THIS COMPONENT FIRST RENDERS --
	 */
	const [board, setBoard] = useState([])
	useEffect(() => {
		const squareArray = getSquareArray()
		setBoard(squareArray)
	}, [])

	return (
		<div style={boardStyle}>
			{board.map((square, index) => {
				const { id, black } = square
				const squareStyle = {
					backgroundColor: black ? 'black' : 'white',
					color: black ? 'white' : 'black',
					width: '12.5%',
					height: '12.5%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center'
				}
				return (
					<div key={index} id={id} style={squareStyle}>
						<Square id={id} black={black} />
					</div>
				)
			})}
		</div>
	)
}

export default Board
