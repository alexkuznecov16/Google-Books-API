const header = document.getElementById('header');

function scroll() {
	const scrollPos = document.documentElement.scrollTop;

	if (scrollPos > 300) {
		header.style.top = 0;
		header.style.border = `2px solid`;
		header.style.background = `rgba(255,255,255, .7)`;
		header.style.position = 'fixed';
		header.style.zIndex = 2000;
	} else if (scrollPos < 300) {
		header.style.top = '';
		header.style.border = ``;
		header.style.background = `#ffffff)`;
		header.style.width = `100%`;
		header.style.position = '';
		header.style.zIndex = '';
	}
}

window.addEventListener('scroll', scroll);
