

window.focalpointLoad = load

function load(id) {

	const json = document.getElementById('focalpoint-json-' + id)
	const meta = json && JSON.parse(json.textContent)
	const modal = json.closest('.media-frame-content')
	
	if (!modal || !meta.file || !meta.width || !meta.height) return

	const image = modal && slot(
		modal.querySelector('.details-image') || modal.querySelector('.thumbnail-image')
	)
	const actions = modal && slot(
		modal.querySelector('.attachment-actions') || modal.querySelector('.attachment-info .details'), true
	)

	// save values to wp db

	function save(newX, newY) {
		const x = modal.querySelector('input[name=attachments\\[' + id + '\\]\\[x\\]]')
		const y = modal.querySelector('input[name=attachments\\[' + id + '\\]\\[y\\]]')
		x.value = (typeof newX === 'number') ? newX.toFixed(2) : newX
		y.value = (typeof newY === 'number') ? newY.toFixed(2) : newY
		jQuery(x).trigger('change')
		jQuery(y).trigger('change')
	}
	
	// add components to dom

	const action = Actions(meta.x, meta.y, onActionAdd, onActionRemove)
	const screen = Screen(meta.x, meta.y, meta, onScreenUpdate, onScreenSave)

	empty(actions).appendChild(action)
	empty(image).appendChild(screen)

	function onActionAdd() {
		save(50, 50)
		screen.update(50, 50)
		action.update(50, 50)
	}

	function onActionRemove() {
		save('', '')
		screen.update('', '')
		action.update('', '')
	}

	function onScreenUpdate(newX, newY) {
		action.update(newX, newY)	
	}

	function onScreenSave(newX, newY) {
		save(newX, newY)
		action.update(newX, newY)
	}
}

function Actions(x, y, onAdd, onRemove) {

	const state = { x: x, y: y }

	const buttonText = (x, y) => hasCoords(x, y) ? 'Remove focal point' : 'Add focal point';
	const statusText = (x, y) => hasCoords(x, y) ? `${parseInt(x)}% ${parseInt(y)}%` : ''
	
	const dom = html(`
		<div class="focalpoint-actions">
			<button class="button">${buttonText(state.x, state.y)}</button>
			<span class="focalpoint-actions__status">${statusText(state.x, state.y)}</span>
		</div>
	`)

	const button = dom.querySelector('button')
	const status = dom.querySelector('span')
	button.addEventListener('click', () => hasCoords(state.x, state.y) ? onRemove() : onAdd())

	dom.update = function(x, y) {
		state.x = x
		state.y = y
		button.innerHTML = buttonText(x, y)
		status.innerHTML = statusText(x, y)
	}

	return dom
}

function Screen(x, y, meta, onChange, onSave) {

	const screencss = `max-width:${meta.width}px;max-height:${meta.height}px;`;
	const aspectcss = meta.width + '/' + meta.height
	const dotcss = (x, y) => hasCoords(x, y) ? `left:${parseFloat(x)}%;top:${parseFloat(y)}%;` : `display:none`

	const dom = html(`
		<div class="focalpoint-screen" style="${screencss}">
			<div class="focalpoint-screen__aspect-ratio" style="aspect-ratio:${aspectcss};">
				<img class="object-fit-absolute" src="${meta.baseurl + meta.file}" draggable="false">
				<div class="focalpoint-screen__dot" style="${dotcss(x, y)}"></div>
			</div>
		</div>
	`)

	const dot = dom.querySelector('.focalpoint-screen__dot')
	const aspect = dom.querySelector('.focalpoint-screen__aspect-ratio')

	const onMove = (x, y, percentX, percentY) => {
		dot.style.left = x + 'px';
		dot.style.top = y + 'px';
		dot.style.display = ''
		onChange && onChange(percentX, percentY)
	}
	const onEnd = (x, y, percentX, percentY) => {
		dot.style.left = percentX + '%';
		dot.style.top = percentY + '%';
		dot.style.display = ''
		onChange && onChange(percentX, percentY)
		onSave && onSave(percentX, percentY)
	}

	drag(dot, aspect, onMove, onEnd)

	dom.update = function(x, y) {
		dot.setAttribute('style', dotcss(x, y))
	}
	
	return dom
}

// helpers


function html(string) {
    const template = document.createElement('template')
    if ('content' in template) {
        template.innerHTML = string
        return document.importNode(template.content, true).firstElementChild
    }
    return document.createFragment()
}

function empty(node) {
	while (node.hasChildNodes()) node.removeChild(node.lastChild)
	return node
}

function slot(node, append = false) {
	const slot = document.createElement('div')
	slot.className = 'slot'
	if (!node || node.__slot) return slot
	node.__slot = slot
	if (append) {
		node.appendChild(slot)
		return slot
	} else {
		node.style.display = 'none';
		node.parentNode.insertBefore(slot, node.nextSibling)
		return slot
	}
}

function drag(drag, canvas, onMove, onEnd) {

	let pageX, pageY
	let canvasX, canvasY, canvasWidth, canvasHeight

	[drag, canvas].map(el => {
		el.addEventListener('mousedown', down)
		el.addEventListener('touchstart', down)
	})

	function down(event) {
		event.preventDefault()
		const canvasRect = canvas.getBoundingClientRect()
		const canvasOffset = offset(canvasRect)
	
		pageX = event.pageX
		pageY = event.pageY
		canvasX = canvasOffset.left
		canvasY = canvasOffset.top
		canvasWidth = canvasRect.width
		canvasHeight = canvasRect.height

		document.addEventListener("mousemove", move)
		document.addEventListener("touchmove", move)
		document.addEventListener("mouseup", end)
		document.addEventListener("touchend", end)
	}

	function move(event) {
		const x = minmax(0, canvasWidth, event.pageX - canvasX)
		const y = minmax(0, canvasHeight, event.pageY - canvasY)
		const percentX = x / canvasWidth * 100
		const percentY = y / canvasHeight * 100
		onMove && onMove(x, y, percentX, percentY)
	}

	function end(event) {
		const x = minmax(0, canvasWidth, event.pageX - canvasX)
		const y = minmax(0, canvasHeight, event.pageY - canvasY)
		const percentX = x / canvasWidth * 100
		const percentY = y / canvasHeight * 100
		onEnd && onEnd(x, y, percentX, percentY)

		document.removeEventListener("mouseup", end)
		document.removeEventListener("touchend", end)
		document.removeEventListener("mousemove", move)
		document.removeEventListener("touchmove", move)
	}
}

function offset(rect) {
	return {
		top: rect.top + window.pageYOffset,
		left: rect.left + window.pageXOffset,
	}
}

function minmax(min, max, val) {
	return Math.max(min, Math.min(max, val))
}

function hasCoords(x, y) {
	return !isNaN(parseFloat(x)) && !isNaN(parseFloat(y))
}

