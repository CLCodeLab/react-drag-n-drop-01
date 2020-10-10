import React from 'react'
import { useImmerReducer } from 'use-immer'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './App.css'
import Board from './components/Board'
import Checkbox from './components/Checkbox'

/**
 * -- CONTEXT --
 */
import DispatchContext from './context/DispatchContext'
import StateContext from './context/StateContext'

function App() {
	/**
	 * -- APP WIDE REDUCER --
	 */
	const initialState = {
		selectedSquareId: -1,
		placedInWhiteSquare: false
	}
	function reducer(draft, action) {
		switch (action.type) {
			case 'getSelectedSquareId':
				draft.selectedSquareId = action.value
				return
			case 'placeInWhiteSquare':
				draft.placedInWhiteSquare = !draft.placedInWhiteSquare
				return

			default:
				return
		}
	}
	const [state, dispatch] = useImmerReducer(reducer, initialState)

	return (
		<DispatchContext.Provider value={dispatch}>
			<StateContext.Provider value={state}>
				<DndProvider backend={HTML5Backend}>
					<div className='App'>
						<Board width={500} />
						<Checkbox />
					</div>
				</DndProvider>
			</StateContext.Provider>
		</DispatchContext.Provider>
	)
}

export default App
