/* eslint-disable no-undef */
const wallpaper = document.getElementsByClassName('wallpaper-container')[0];
const ui = document.getElementsByClassName('ui-container')[0];
const textarea = document.getElementsByTagName('textarea')[0];
let pre;
const code = document.getElementsByClassName('wallpaper-code')[0];
const codeTheme = document.getElementsByClassName('code-theme')[0];
const dropdownCodeTheme = document.getElementsByClassName('dropdown-code-theme')[0].children[0];
const downloadButton = document.getElementsByClassName('download-button')[0];
const uploadButton = document.getElementsByClassName('upload-button')[0];
const saveButton = document.getElementsByClassName('save-button')[0];
const dropdownButtons = document.querySelectorAll('.dropdown-toggle');

let currentPosition;

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

saveButton.addEventListener('click', () => {
	const config = {
		backgroundColor: backgroundColor.value,
		textColor: textColor.value,
		codeWidth: codeWidth.value,
		lineHeight: lineHeight.value,
		letterSpacing: letterSpacing.value,
		codePadding: codePadding.value,
		whitespace: toggleWhitespaceButton.checked,
		toggleAutoWidth: toggleAutoWidth.checked,
		toggleTheming: toggleThemingButton.checked,
		codeTheme: codeTheme.href,
		fontName: code.style.fontFamily,
		fontSize: pre ? pre.style.fontSize : '',
		position: currentPosition,
		code: textarea.value,
		bold: $(boldButton).hasClass('active'),
		italic: $(italicButton).hasClass('active'),
		textAlignLeft: $(leftAlignButton).hasClass('active'),
		textAlignMiddle: $(centerAlignButton).hasClass('active'),
		textAlignRight: $(rightAlignButton).hasClass('active'),
		transform: $(noTransformationButton).hasClass('active'),
		uppercase: $(uppercaseButton).hasClass('active'),
		lowercase: $(lowercaseButton).hasClass('active'),
		capitalize: $(capitalizeButton).hasClass('active'),
	};

	const data = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config));

	const a = document.createElement('a');
	a.setAttribute('download', 'config.json');
	a.setAttribute('href', data);
	a.click();
});

uploadButton.addEventListener('change', (event) => {
	const file = event.target.files[0];
	let config;

	if (file) {
		const reader = new FileReader();
		reader.readAsText(file, 'UTF-8');
		reader.onload = (e) => {
			config = JSON.parse(e.target.result);
			loadConfig(config);
		};
	}
});

function loadConfig(config) {
	$(textarea).val(config.code);
	code.innerHTML = config.code;

	wallpaper.style.background = config.backgroundColor;
	$(backgroundColor).val(config.backgroundColor);

	code.style.color = config.textColor;
	$(textColor).val(config.textColor);

	toggleDropdowns(true);
	// updateCode();

	pre = document.getElementsByClassName('hljs')[0];
	if (pre) {
		pre.style.width = config.codeWidth + 'px';
		pre.style.lineHeight = config.lineHeight + 'px';
		pre.style.letterSpacing = config.letterSpacing + 'px';
		pre.style.padding = config.codePadding + 'px';

		pre.style.fontSize = config.fontSize;
	}

	toggleWhitespaceButton.checked = config.whitespace;
	toggleAutoWidth.checked = config.toggleAutoWidth;
	toggleThemingButton.checked = config.toggleTheming;
	codeTheme.href = config.codeTheme;

	currentFont = config.fontName;
	code.style.fontFamily = currentFont;
	currentPosition = config.position;

	toggleCodeStyles();

	if (config.bold) {
		$(boldButton).addClass('active');
		code.style.fontWeight = 'bold';
	}
	if (config.italic) {
		$(italicButton).addClass('active');
		code.style.fontStyle = 'italic';
	}
	if (config.textAlignLeft) {
		$(leftAlignButton).addClass('active');
		code.style.textAlign = 'left';
	}
	if (config.textAlignMiddle) {
		$(centerAlignButton).addClass('active');
		code.style.textAlign = 'center';
	}
	if (config.textAlignRight) {
		$(rightAlignButton).addClass('active');
		code.style.textAlign = 'right';
	}
	if (config.transform) {
		$(noTransformationButton).addClass('active');
		code.style.textTransform = 'none';
	}
	if (config.uppercase) {
		$(uppercaseButton).addClass('active');
		code.style.textTransform = 'uppercase';
	}
	if (config.lowercase) {
		$(lowercaseButton).addClass('active');
		code.style.textTransform = 'lowercase';
	}
	if (config.capitalize) {
		$(capitalizeButton).addClass('active');
		code.style.textTransform = 'capitalize';
	}

	updatePosition();
	toggleCodeStyles();
	refreshCode();
}

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
const textColor = document.getElementById('textColor');
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
		code.style.removeProperty('color');
	} else {
		codeTheme.disabled = true;
		dropdownCodeTheme.disabled = true;

		const hex = textColor.value;
		code.style.color = hex;
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
	if (!toggleAutoWidth.checked) {
		code.style.position = 'absolute';
		pre.style.width = codeWidth.value + 'px';
	} else {
		code.style.width = 'max-content';
	}
});

backgroundColor.addEventListener('input', () => {
	const hex = backgroundColor.value;
	wallpaper.style.background = hex;
});

textColor.addEventListener('input', () => {
	if (toggleThemingButton.checked == false) {
		const hex = textColor.value;
		code.style.color = hex;
	}
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
const leftAlignButton = document.getElementsByClassName('left-align')[0];
const centerAlignButton = document.getElementsByClassName('center-align')[0];
const rightAlignButton = document.getElementsByClassName('right-align')[0];
const uppercaseButton = document.getElementsByClassName('uppercase')[0];
const lowercaseButton = document.getElementsByClassName('lowercase')[0];
const capitalizeButton = document.getElementsByClassName('capitalize')[0];
const noTransformationButton = document.getElementsByClassName('noTransformation')[0];

noTransformationButton.addEventListener('click', function() {
	this.classList.toggle('active');
	lowercaseButton.classList.remove('active');
	uppercaseButton.classList.remove('active');
	capitalizeButton.classList.remove('active');

	code.style.textTransform = 'none';
});
uppercaseButton.addEventListener('click', function() {
	this.classList.toggle('active');
	lowercaseButton.classList.remove('active');
	noTransformationButton.classList.remove('active');
	capitalizeButton.classList.remove('active');

	code.style.textTransform = 'uppercase';
});
lowercaseButton.addEventListener('click', function() {
	this.classList.toggle('active');
	uppercaseButton.classList.remove('active');
	noTransformationButton.classList.remove('active');
	capitalizeButton.classList.remove('active');

	code.style.textTransform = 'lowercase';
});
capitalizeButton.addEventListener('click', function() {
	this.classList.toggle('active');
	uppercaseButton.classList.remove('active');
	noTransformationButton.classList.remove('active');
	lowercaseButton.classList.remove('active');

	code.style.textTransform = 'capitalize';
});

leftAlignButton.addEventListener('click', function() {
	this.classList.toggle('active');
	rightAlignButton.classList.remove('active');
	centerAlignButton.classList.remove('active');

	code.style.textAlign = 'left';
});
rightAlignButton.addEventListener('click', function() {
	this.classList.toggle('active');
	leftAlignButton.classList.remove('active');
	centerAlignButton.classList.remove('active');

	code.style.textAlign = 'right';
});
centerAlignButton.addEventListener('click', function() {
	this.classList.toggle('active');
	leftAlignButton.classList.remove('active');
	rightAlignButton.classList.remove('active');

	code.style.textAlign = 'center';
});

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
	$('.dropdown-item.theme').on('keydown click', function(e) {
		let new_item;
		if (e.keyCode == 38) {
			new_item = $(this).prev();
		} else if (e.keyCode == 40) {
			new_item = $(this).next();
		} else {
			new_item = $(this);
		}
		new_item.focus();

		codeTheme.href = 'themes/' + new_item.html() + '.css';
	});

	$('.dropdown-item.font').on('keydown click', function(e) {
		let new_item;
		if (e.keyCode == 38) {
			new_item = $(this).prev();
		} else if (e.keyCode == 40) {
			new_item = $(this).next();
		} else {
			new_item = $(this);
		}
		new_item.focus();

		currentFont = new_item.html();
		code.style.fontFamily = new_item.html();

		toggleCodeStyles();
	});

	$('.dropdown-item.font-size').on('keydown click', function(e) {
		let new_item;
		if (e.keyCode == 38) {
			new_item = $(this).prev();
		} else if (e.keyCode == 40) {
			new_item = $(this).next();
		} else {
			new_item = $(this);
		}
		new_item.focus();

		pre.style.fontSize = new_item.html();
	});

	$('.dropdown-item.code-position').on('keydown click', function(e) {
		let new_item;
		if (e.keyCode == 38) {
			new_item = $(this).prev();
		} else if (e.keyCode == 40) {
			new_item = $(this).next();
		} else {
			new_item = $(this);
		}

		new_item.focus();

		const position = new_item.html();
		currentPosition = position;

		updatePosition();
	});
});

function updatePosition() {
	code.style.position = 'absolute';
	const codeHeightString = getComputedStyle(code).height;
	const codeHeight = codeHeightString.substring(0, codeHeightString.length - 2);

	switch(currentPosition) {
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
		code.style.bottom = ((codePadding.value) ? parseInt(codePadding.value) : 0) + 'px';
		code.style.left = '0';
		break;
	}
}

function repositionWallpaper() {
	wallpaper.style.width = window.screen.width + 'px';
	wallpaper.style.height = window.screen.height + 'px';
}

// Whenever the window resizes it will reposition the wallpaper's
// configuration to be relative to the new window size
$(window).resize(function() {
	repositionWallpaper();
});

textarea.addEventListener('input', () => {
	refreshCode();
});

function refreshCode() {
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
}

function toggleDropdowns(toggle) {
	for (let i = 0; i < dropdownButtons.length; i++) {
		const button = dropdownButtons[i];

		button.disabled = !toggle;
	}
}