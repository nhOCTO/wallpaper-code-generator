/* eslint-disable no-undef */
const wallpaper = document.getElementsByClassName('wallpaper-container')[0];
const ui = document.getElementsByClassName('ui-container')[0];
const textarea = document.getElementsByTagName('textarea')[0];
let pre;
const code = document.getElementsByClassName('wallpaper-code')[0];
const codeTheme = document.getElementsByClassName('code-theme')[0];
const dropdownCodeTheme = document.getElementsByClassName('dropdown-code-theme')[0].children[0];
const downloadButton = document.getElementsByClassName('download-button')[0];
const dropdownButtons = document.querySelectorAll('.dropdown-toggle');

const focusedValue = 1;
const notFocusedValue = 0.3;

repositionWallpaper();
toggleDropdowns(false);

downloadButton.addEventListener('click', () => {
	wallpaper.style.opacity = focusedValue;

	html2canvas(wallpaper, {
		width: window.screen.width,
		height: window.screen.height,
	})
		.then(canvas => {
			document.body.appendChild(canvas);
		})
		.then(() => {
			const canvas = document.getElementsByTagName('canvas')[0];
			canvas.style.display = 'none';
			const image = canvas.toDataURL('image/png');

			const a = document.createElement('a');
			a.setAttribute('download', 'wallpaper.png');
			a.setAttribute('href', image);
			a.click();
			canvas.remove();

			wallpaper.style.opacity = notFocusedValue;
		});
});

// ******************************
// UI interactions
// ******************************
wallpaper.addEventListener('mouseover', () => {
	ui.style.opacity = notFocusedValue;
	wallpaper.style.opacity = focusedValue;
});

wallpaper.addEventListener('mouseleave', () => {
	ui.style.opacity = focusedValue;
	wallpaper.style.opacity = notFocusedValue;
});


// ******************************
// Configuration panel references
// ******************************
const backgroundColor = document.getElementById('backgroundColor');
const codeWidth = document.getElementById('codeWidth');
const lineHeight = document.getElementById('lineHeight');
const letterSpacing = document.getElementById('letterSpacing');
const codePadding = document.getElementById('codePadding');
const toggleWhitespaceButton = document.getElementById('toggleWhitespace');
const toggleAutoWidth = document.getElementById('toggleAutoWidth');
const toggleThemingButton = document.getElementById('toggleTheming');
toggleThemingButton.checked = true;
codeWidth.disabled = !toggleAutoWidth.checked;

toggleAutoWidth.checked = true;
code.style.width = 'max-content';

toggleWhitespaceButton.checked = true;

const codeObj = {};

toggleWhitespaceButton.addEventListener('change', () => {
	updateCode();
});

toggleThemingButton.addEventListener('change', () => {
	if (toggleThemingButton.checked) {
		codeTheme.disabled = false;
		dropdownCodeTheme.disabled = false;
	} else {
		codeTheme.disabled = true;
		dropdownCodeTheme.disabled = true;
	}
});

function updateCode() {
	let codeText = code.innerHTML;

	if (toggleWhitespaceButton.checked) {
		codeText = codeObj.withWhitespace;
	} else {
		codeText = codeObj.withoutWhitespace;
	}

	code.innerHTML = codeText;

	hljs.highlightBlock(code);
}

toggleAutoWidth.addEventListener('change', () => {
	codeWidth.disabled = toggleAutoWidth.checked;
	code.style.width = 'max-content';
});

backgroundColor.addEventListener('input', () => {
	const hex = backgroundColor.value;
	wallpaper.style.backgroundColor = hex;
});

codeWidth.addEventListener('input', () => {
	const pixels = codeWidth.value;
	pre.style.width = pixels + 'px';
});

lineHeight.addEventListener('input', () => {
	const pixels = lineHeight.value;
	pre.style.lineHeight = pixels + 'px';
});

letterSpacing.addEventListener('input', () => {
	const pixels = letterSpacing.value;
	pre.style.letterSpacing = pixels + 'px';
});

codePadding.addEventListener('input', () => {
	const pixels = codePadding.value;
	pre.style.padding = pixels + 'px';
});

// ******************************
// Code
// ******************************
const boldButton = document.getElementsByClassName('fa-bold')[0];
const italicButton = document.getElementsByClassName('fa-italic')[0];

boldButton.addEventListener('click', function() {
	this.classList.toggle('active');
	toggleCodeStyles();
});
italicButton.addEventListener('click', function() {
	this.classList.toggle('active');
	toggleCodeStyles();
});

function toggleCodeStyles() {
	if (boldButton.classList.contains('active')) {
		code.style.fontWeight = 'bold';
	} else {
		code.style.fontWeight = 'normal';
	}

	if (italicButton.classList.contains('active')) {
		code.style.fontStyle = 'italic';
	} else {
		code.style.fontStyle = 'normal';
	}
}

let currentFont;
$(document).ready(function() {
	$('.dropdown-item.theme').on('click', function() {
		codeTheme.href = 'themes/' + this.textContent + '.css';
	});

	$('.dropdown-item.font').on('click', function() {
		currentFont = this.textContent;
		code.style.fontFamily = this.textContent;

		toggleCodeStyles();
	});

	$('.dropdown-item.font-size').on('click', function() {
		pre.style.fontSize = this.textContent;
	});

	$('.dropdown-item.code-position').on('click', function() {
		const position = this.textContent;

		code.style.position = 'absolute';
		const codeHeightString = getComputedStyle(code).height;
		const codeHeight = codeHeightString.substring(0, codeHeightString.length - 2);

		switch(position) {
		case 'Middle':
			code.style.removeProperty('bottom');
			code.style.top = '50%';
			code.style.transform = 'translateY(-50%)';
			code.style.left = '0';
			code.style.right = '0';
			code.style.margin = '0 auto';
			break;
		case 'Middle Left':
			code.style.removeProperty('bottom');
			code.style.removeProperty('right');
			code.style.top = '50%';
			code.style.transform = 'translateY(-50%)';
			code.style.left = ((codePadding.value) ? codePadding.value : 0) + 'px';
			code.style.margin = '0 auto';
			break;
		case 'Middle Right':
			code.style.removeProperty('bottom');
			code.style.removeProperty('left');
			code.style.top = '50%';
			code.style.transform = 'translateY(-50%)';
			code.style.right = ((codePadding.value) ? codePadding.value : 0) + 'px';
			code.style.margin = '0 auto';
			break;
		case 'Middle Top':
			code.style.removeProperty('top');
			code.style.removeProperty('bottom');
			code.style.removeProperty('transform');
			code.style.paddingTop = '0';
			code.style.top = ((codePadding.value) ? codePadding.value : 0) + 'px';
			code.style.left = '0';
			code.style.right = '0';
			code.style.margin = '0 auto';
			break;
		case 'Middle Bottom':
			code.style.removeProperty('top');
			code.style.removeProperty('bottom');
			code.style.removeProperty('transform');
			code.style.bottom = ((codePadding.value) ? parseInt(codePadding.value) : 0) + 'px';
			code.style.left = '0';
			code.style.right = '0';
			code.style.margin = '0 auto';
			break;
		case 'Top Left':
			code.style.removeProperty('top');
			code.style.removeProperty('right');
			code.style.removeProperty('bottom');
			code.style.removeProperty('transform');
			code.style.top = ((codePadding.value) ? parseInt(codePadding.value) + codeHeight / 2 : 0 + codeHeight / 2);
			code.style.left = '0';
			break;
		case 'Top Right':
			code.style.removeProperty('top');
			code.style.removeProperty('left');
			code.style.removeProperty('bottom');
			code.style.removeProperty('transform');
			code.style.top = ((codePadding.value) ? parseInt(codePadding.value) + codeHeight / 2 : 0 + codeHeight / 2);
			code.style.right = '0';
			break;
		case 'Bottom Right':
			code.style.removeProperty('left');
			code.style.removeProperty('top');
			code.style.removeProperty('bottom');
			code.style.removeProperty('transform');
			code.style.bottom = ((codePadding.value) ? parseInt(codePadding.value) : 0) + 'px';
			code.style.right = '0';
			break;
		case 'Bottom Left':
			code.style.removeProperty('right');
			code.style.removeProperty('top');
			code.style.removeProperty('bottom');
			code.style.removeProperty('transform');
			console.log(codeHeight);
			code.style.bottom = ((codePadding.value) ? parseInt(codePadding.value) : 0) + 'px';
			code.style.left = '0';
			break;
		}
	});
});

function repositionWallpaper() {
	wallpaper.style.width = window.screen.width + 'px';
	wallpaper.style.height = window.screen.height + 'px';
}

// Whenever the window resizes it will reposition the wallpaper's
// configuration to be relative to the new window size
$(window).resize(function() {
	repositionWallpaper();
});

textarea.addEventListener('change', () => {
	let textAreaCode = textarea.value;
	code.innerHTML = textAreaCode;
	codeObj.withoutHighlight = textAreaCode;
	if (toggleThemingButton.checked) {
		hljs.highlightBlock(code);
	}

	codeObj.withoutWhitespace = code.innerHTML;

	textAreaCode = textAreaCode.split(' ').join('<span class="spaceDot">·</span>');
	code.innerHTML = textAreaCode;
	if (toggleThemingButton.checked) {
		hljs.highlightBlock(code);
	}
	codeObj.withWhitespace = code.innerHTML;

	pre = document.getElementsByClassName('hljs')[0];

	// Toggling dropdown items
	// *****************
	pre.style.background = 'rgba(255, 255, 255, 0)';
	if (code.textContent.length == 0) {
		toggleDropdowns(false);
	} else {
		toggleDropdowns(true);
	}
	// *****************

	if (currentFont != undefined) {
		code.style.fontFamily = currentFont;

		toggleCodeStyles();
	}

	updateCode();
});

function toggleDropdowns(toggle) {
	for (let i = 0; i < dropdownButtons.length; i++) {
		const button = dropdownButtons[i];

		button.disabled = !toggle;
	}
}