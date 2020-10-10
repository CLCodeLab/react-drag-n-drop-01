# react-drag-n-drop-01

Explains and demonstrates the main functions of the react-dnd (react drag-n-drop) package.

## Purpose

This is inspired by the React DnD example used in the documentation [site](https://react-dnd.github.io/react-dnd/docs/tutorial).

This example is structured differently than the one on the React DnD site. It is simplified and straight forward, especially for React newbies, and covers all the common drag and drop functionalities typically used.

The explanation and details provided below are based on the example provided in this repository and hopefully can be used for referencing and education purposes.

> Prerequisit knowledge of Reacts' **useContext** and **useReducer**  hooks is required to understand how app wide states are updated in this example. 

## npm Packages Used

- immer
- use-immer
- react-dnd
- react-dnd-html5-backend

> NOTE: the npm packages _immer_ and _use-immer_ are used as alternatives to some React hooks, to simplify the state manipulation without having to deal with immutability issues.
>
> This can be shown in the **App.js** where the _useImmerReducer_ hook is used instead of Reacts _useReducer_ hook.

## In a Nutshell

- The React DnD package mainly uses a **useDrag** hook referenced in the component that is to be dragged, and a **useDrop** hook referenced in the target component (where the draggable component is *dropped*).
- Both hooks can include controls which can be passed on to the app for different effects.
- To associate the *draggable* component to its *target* components, a common **ItemTypes** object is created and referenced in both of these components.
- To make it all work, all components used in the drag and drop event will need to be *wrapped* with the **DndProvider**.

## In this Example

- The **Flag** component is reset in the top left-hand corner of the board when the window first renders.
- When the **Flag** is dragged and then dropped into a **Square** on the board, the **id** of the target **Square** is obtained and _dispatched_ via a _reducer function_ which updates the app wide state associated to the square where the **Flag** is then switched **on**, hence giving the effect of the **Flag** being *dropped* in the current active square.
- The *check* option in the *Place in white squares only* checkbox, calls for a app wide state limit the *dropping* of the **Flag** in he *white* squares only, with additional effects added to the **Square** component.

## Let’s Dive In

### DndProvider

The first step is to import the **DndProvider** and a relevant **Backend** (**HTML5Backend** in this example) to the top level **App.js** file.

```javascript
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
```

The **DndProvider** must wrap all the components (and their children) which will use the drag-and-drop methods within the app.

```javascript
<DndProvider backend={HTML5Backend}>
	<div className='App'>
		<Board width={500} />
		<Checkbox />
	</div>
</DndProvider>
```

### ItemTypes

To associate a drag component to its respective target component, the same **item type** needs to be specified in both of these components.

This is done by creating **src/utils/ItemTypes.js** and adding an **ItemTypes** object:

```javascript
const ItemTypes = {
	FLAG: 'flag'
}
export default ItemTypes
```

### useDrag Hook

The **useDrag** hook is used in the draggable component (**Flag.js** file, in this example).

```javascript
import ItemTypes from '../utils/ItemTypes'
import { useDrag } from 'react-dnd'
```

To make the element *draggable*, include the ```ref={drag}``` attribute to that element.

In this example, the draggable **div**, which wraps the **FlagSvg** component, is referenced as the ```drag``` element:

```javascript
<div style={style} ref={drag}>
	<FlagSvg width='40px' height='40px' />
</div>
```

> NOTE: The **FlagSvd** is an SVG that is used as a **React Component** declared as follows:

```javascript
import { ReactComponent as FlagSvg } from '../svg/location.svg'
```

The **useDrag** hook can then be used as follows:

```javascript
const [{ isDragging }, drag] = useDrag({
	item: { type: ItemTypes.FLAG },
	collect: monitor => ({
		isDragging: !!monitor.isDragging()
	})
})
```

#### item

The **item** prop lists the **ItemTypes** object which associates the draggable component to its respective target component.

#### collect

The **collect** prop uses a method which *collects* data by **monitoring** the dragged component. In this example, storing it to the **isDragging** property.

The **isDragging** property returns a *Boolean* value of **true** while the component is being dragged, where in this example, it is typically used to change the opacity of component.

```javascript
const style = {
	cursor: 'move',
	opacity: isDragging ? 0.5 : 1
}
```

### useDrop Hook

The **useDrop** hook is used in the component that will *accept* the draggable component (**Square.js** in this example)

```javascript
import { useDrop } from 'react-dnd'
import ItemTypes from '../utils/ItemTypes'
```

To identify the *target* element, include the ```ref={drop}``` attribute to that element.

In this example, the target **div**, which wraps the **Flag** component, is referenced as the ```drop``` element:

```javascript
<div ref={drop} id={id} style={style}>
	{isFlag && <Flag />}
</div>
```

The **useDrop** hook is used as follows:

```javascript
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
```

#### accept

The **accept** prop identifies the draggable component with the item ```ItemTypes.FLAG``` variable.

Meaning, it will only accept a component referencing this item type.

> The **accept** prop can also passes other properties down from the draggable component as well, if required.

#### drop

The **drop** prop passes a method when a draggable component is *dropped* in the target element.

In this prop you can define whichever event you want to call for action, when the component is dropped.

In this example, a **dispatch** method is called which passes the **id** of the **Square** component (where the **Flag** was dropped) to the app wide state **selectedSquareId**, and sets the local state **isFlag** to **true**, which in turn switches the **Flag** component *on*.

#### canDrop

The **canDrop** prop passes a method which identifies instances where the draggable component *cannot* be dropped, by returning a **false** to the **canDrop** property.

In this example, the **Flag** component cannot be dropped in a *black square* when the app wide **placedInWhiteSquare** state is set to **true** (activate when the *Place in white squares only* is chekced)

```javascript
const canDropHere = () => {
	let result = true
	if (placedInWhiteSquare && black == true) result = false
	return result
}
```

### collect
The **collect** prop uses a method which *collects* data by **monitoring** the dragged component, in this example, storing it to the:

- **isOver** property which returns a **Boolean** value when the draggable component passes over **this** component, and
- **canDrop** property returns a **Boolean** value of based on the **canDrop** prop defined above.

In this example, the **isOver** and the **canDrop** props are used to give different highlight colours for when the app wide state **placedInWhiteSquare** is set to **true**.

```javascript
const backgroundColor = () => {
	if (placedInWhiteSquare) {
		if (isOver && !canDrop) return 'red'
		if (!isOver && canDrop) return 'yellow'
		if (isOver && canDrop) return 'green'
	} else {
		return ''
	}
}
```

### DragPreviewImage Component

For a nicer effect, you can change the image of the draggable component simply by placing a **DragPreviewImage** component before the referenced element.

```javascript
<DragPreviewImage connect={preview} src={Pin} />
<div style={style} ref={drag}>
	<FlagSvg width='40px' height='40px' />
</div>
```

The **DragPreviewImage** component requires 2 props:

- a **connect** prop which is an output from the **useDrop** hook (theough **preview** property), and
- a **src** (source) prop, which is the image source used to replace the original dragged component.

In this example, the source image, ``Pin``, is an imported SVG file:

```javascript
import Pin from '../svg/pin.svg'
```

> NOTE: Changing the size of the preview image can be a little challenging, so for the sake of simplicity, the size of the SVG file was changed by adding the ```width="40px" height="40px"``` in the SVG tag, in the file itself.

The output **preview** property is extracted from the **useDrag** hook to be used for the connect prop as follows:

```javascript
const [{ isDragging }, drag, preview] = useDrag({
	item: { type: ItemTypes.FLAG },
	collect: monitor => ({
		isDragging: !!monitor.isDragging()
	})
})
```
