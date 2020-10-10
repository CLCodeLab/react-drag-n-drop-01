import React from 'react'
import { useDrag, DragPreviewImage } from 'react-dnd'
import { ReactComponent as FlagSvg } from '../svg/location.svg'
import ItemTypes from '../utils/ItemTypes'
import Pin from '../svg/pin.svg'

function Flag() {
	/**
	 * -- USEDRAG HOOK --
	 */
	const [{ isDragging }, drag, preview] = useDrag({
		item: { type: ItemTypes.FLAG },
		collect: monitor => ({
			isDragging: !!monitor.isDragging()
		})
	})

	const style = {
		cursor: 'move',
		opacity: isDragging ? 0.5 : 1
	}

	return (
		<>
			<DragPreviewImage connect={preview} src={Pin} />
			<div style={style} ref={drag}>
				<FlagSvg width='40px' height='40px' />
			</div>
		</>
	)
}

export default Flag
