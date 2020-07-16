/* eslint-disable no-undef */
const wallpaper = document.getElementsByClassName('wallpaper-container')[0];
const ui = document.getElementsByClassName('ui-container')[0];
const textarea = document.getElementsByTagName('textarea')[0];
let pre;
const code = document.getElementsByClassName('wallpaper-code')[0];
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
			// TODO: Set the size of the image to the monitor of the user
			document.body.appendChild(canvas);
		})
		.then(() => {
			const canvas = document.getElementsByTagName('canvas')[0];
			canvas.style.display = 'none';
			const image = canvas.toDataURL('image/png');

			const a = document.createElement('a');
			a.setAttribute('download', 'myImage.png');
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
let currentFont;
$(document).ready(function() {
	$('.dropdown-item.font').on('click', function() {
		currentFont = this.textContent;
		code.style.fontFamily = this.textContent;
	});

	$('.dropdown-item.font-size').on('click', function() {
		pre.style.fontSize = this.textContent;
	});

	$('.dropdown-item.code-position').on('click', function() {
		const position = this.textContent;

		pre.style.position = 'absolute';
		switch(position) {
		case 'Middle':
			pre.style.removeProperty('bottom');
			pre.style.top = '50%';
			pre.style.transform = 'translateY(-50%)';
			pre.style.left = '0';
			pre.style.right = '0';
			pre.style.margin = '0 auto';
			break;
		case 'Middle Left':
			pre.style.removeProperty('bottom');
			pre.style.removeProperty('right');
			pre.style.top = '50%';
			pre.style.transform = 'translateY(-50%)';
			pre.style.left = '0';
			pre.style.margin = '0 auto';
			break;
		case 'Middle Right':
			pre.style.removeProperty('bottom');
			pre.style.removeProperty('left');
			pre.style.top = '50%';
			pre.style.transform = 'translateY(-50%)';
			pre.style.right = '0';
			pre.style.margin = '0 auto';
			break;
		case 'Middle Top':
			pre.style.removeProperty('bottom');
			pre.style.removeProperty('transform');
			pre.style.paddingTop = '0';
			pre.style.top = codePadding.value + 'px';
			pre.style.left = '0';
			pre.style.right = '0';
			pre.style.margin = '0 auto';
			break;
		case 'Middle Bottom':
			pre.style.removeProperty('top');
			pre.style.removeProperty('transform');
			pre.style.top = '00';
			pre.style.bottom = '0';
			pre.style.left = '0';
			pre.style.right = '0';
			pre.style.margin = '0 auto';
			break;
		case 'Top Left':
			pre.style.removeProperty('right');
			pre.style.removeProperty('bottom');
			pre.style.removeProperty('transform');
			pre.style.paddingTop = '0';
			pre.style.top = codePadding.value + 'px';
			pre.style.left = '0';
			break;
		case 'Top Right':
			pre.style.removeProperty('left');
			pre.style.removeProperty('bottom');
			pre.style.removeProperty('transform');
			pre.style.paddingTop = '0';
			pre.style.top = codePadding.value + 'px';
			pre.style.right = '0';
			break;
		case 'Bottom Right':
			pre.style.removeProperty('left');
			pre.style.removeProperty('top');
			pre.style.removeProperty('transform');
			pre.style.bottom = '0';
			pre.style.right = '0';
			break;
		case 'Bottom Left':
			pre.style.removeProperty('right');
			pre.style.removeProperty('top');
			pre.style.removeProperty('transform');
			pre.style.bottom = '0';
			pre.style.left = '0';
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
	const textAreaCode = textarea.value;
	code.textContent = textAreaCode;
	hljs.highlightBlock(code);

	pre = document.getElementsByClassName('hljs')[0];
	pre.style.background = 'rgba(255, 255, 255, 0)';
	toggleDropdowns(true);

	if (currentFont != undefined) {
		code.style.fontFamily = currentFont;
	}
});

function toggleDropdowns(toggle) {
	for (let i = 0; i < dropdownButtons.length; i++) {
		const button = dropdownButtons[i];

		button.disabled = !toggle;
	}
}