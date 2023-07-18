const cartItems = document.querySelector('.items-count');
const menuCart = document.querySelector('.add-menu-bag');
menuCart.appendChild(cartItems);

const IDsObject = {};

const booksLinks = document.querySelectorAll('.list-item > a');
booksLinks.forEach((link) => {
	link.addEventListener('click', async (event) => {
		const searchText = encodeURIComponent(event.target.textContent.trim());
		const API_KEY = 'AIzaSyA1ZDvV5hsNrqU5rZkZQCo-WhKuE1ptfa4';
		const URL = `https://www.googleapis.com/books/v1/volumes?q=${searchText}&key=${API_KEY}&printType=books&startIndex=0&maxResults=6&langRestrict=en`;
		const divBlock = document.querySelector('.books__block');
		divBlock.innerHTML = '';

		try {
			const response = await fetch(URL);
			const result = await response.json();

			console.log(URL);
			for (let i = 0; i < 6; i++) {
				console.log(result.items[i]);
				const divItem = document.createElement('div');
				divItem.setAttribute('class', 'book-item');
				const image = document.createElement('img');
				const volumeInfo = result.items[i].volumeInfo;
				if (volumeInfo.imageLinks && volumeInfo.imageLinks.thumbnail) {
					image.setAttribute('src', volumeInfo.imageLinks.thumbnail);
					image.setAttribute('alt', 'book image');
				} else {
					// Если изображение недоступно, можно установить пустое изображение или другую плейсхолдер-графику.
					image.setAttribute('src', './assets/placeholder.png');
					image.setAttribute('alt', 'No Image Available');
				}
				const divInfo = document.createElement('div');
				divInfo.setAttribute('class', 'book__info');
				const citeAuthor = document.createElement('cite');
				citeAuthor.setAttribute('class', 'book-author');
				if (!result.items[i].volumeInfo.authors || result.items[i].volumeInfo.authors.length === 0) {
					citeAuthor.textContent = 'Not mentioned';
				} else {
					citeAuthor.textContent = result.items[i].volumeInfo.authors;
				}
				const h3Title = document.createElement('h3');
				h3Title.setAttribute('class', 'book-title');
				h3Title.textContent = result.items[i].volumeInfo.title;
				const divReviews = document.createElement('div');
				divReviews.setAttribute('class', 'reviews');
				const divStars = document.createElement('div');
				divStars.setAttribute('class', 'stars');
				starsCheck(divStars, result.items[i].volumeInfo.averageRating);

				const spanRevCount = document.createElement('span');
				spanRevCount.setAttribute('class', 'reviews-count');
				if (result.items[i].volumeInfo.ratingsCount) {
					spanRevCount.textContent = `${result.items[i].volumeInfo.ratingsCount} reviews`;
				}

				const paraText = document.createElement('p');
				paraText.setAttribute('class', 'book-text');
				if (result.items[i].volumeInfo.description && result.items[i].volumeInfo.description.length > 100) {
					paraText.textContent = `${result.items[i].volumeInfo.description.substring(0, 100)} ...`;
				}

				const spanPrice = document.createElement('span');
				spanPrice.setAttribute('class', 'book-price');
				if (result.items[i].saleInfo && result.items[i].saleInfo.retailPrice && result.items[i].saleInfo.retailPrice.amount) {
					if (result.items[i].saleInfo.retailPrice.currencyCode === 'EUR') {
						spanPrice.innerHTML = `${result.items[i].saleInfo.retailPrice.amount} &#x20AC;`;
					} else {
						spanPrice.innerHTML = `${result.items[i].saleInfo.retailPrice.amount} &#36;`;
					}
				} else {
					spanPrice.innerHTML = 'Price not available';
				}

				const buyButton = document.createElement('button');
				buyButton.setAttribute('class', 'book-buy');
				buyButton.setAttribute('id', result.items[i].id);
				buyButton.textContent = 'Buy now';

				buyButton.addEventListener('click', () => {
					const itemID = buyButton.getAttribute('id'); // Получаем значение id кнопки

					localStorage.setItem('book', JSON.stringify(result.items[i]));

					if (buyButton.classList.contains('active')) {
						if (parseInt(cartItems.textContent) > 0) {
							cartItems.textContent = parseInt(cartItems.textContent) - 1;
							checkCartItems();
						}
						localStorage.removeItem('book');
						localStorage.setItem('bookCount', parseInt(cartItems.textContent));
						buyButton.classList.remove('active');
						delete IDsObject[itemID]; // Удаляем элемент из объекта по ключу
						localStorage.removeItem('activeButtons');
						buyButton.removeAttribute('id');
						localStorage.removeItem('buttonId');
						buyButton.textContent = 'Buy now';
					} else {
						cartItems.textContent = parseInt(cartItems.textContent) + 1;
						localStorage.setItem('bookCount', cartItems.textContent);
						checkCartItems();
						buyButton.classList.add('active');
						IDsObject[itemID] = true; // Добавляем элемент в объект по ключу
						localStorage.setItem('activeButtons', JSON.stringify(IDsObject));
						buyButton.textContent = 'In the cart';
						buyButton.setAttribute('id', itemID);
						localStorage.setItem('buttonId', JSON.stringify(itemID));
						checkActiveBtn();
					}
					checkActiveBtn();
				});
				checkActiveBtn();

				function checkCartItems() {
					if (parseInt(cartItems.textContent) > 0) {
						cartItems.style.display = 'block';
					} else if (parseInt(cartItems.textContent) <= 0) {
						cartItems.style.display = 'none';
					}
				}

				divInfo.appendChild(citeAuthor);
				divInfo.appendChild(h3Title);
				divInfo.appendChild(divReviews);
				divReviews.appendChild(divStars);
				divReviews.appendChild(spanRevCount);
				divInfo.appendChild(paraText);
				divInfo.appendChild(spanPrice);
				divInfo.appendChild(buyButton);
				divItem.appendChild(image);
				divItem.appendChild(divInfo);
				divBlock.appendChild(divItem);
			}
			checkActiveBtn();
		} catch (error) {
			console.log(error);
		}
		checkActiveBtn();
	});
});

function starsCheck(divStars, rating) {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= 0.5;

	for (let j = 0; j < fullStars; j++) {
		const starImg = document.createElement('img');
		starImg.setAttribute('src', './assets/StarGold.png');
		starImg.setAttribute('alt', 'Gold Star');
		divStars.appendChild(starImg);
	}

	if (hasHalfStar) {
		const halfStarImg = document.createElement('img');
		halfStarImg.setAttribute('src', './assets/StarHalf.png');
		halfStarImg.setAttribute('alt', 'Half Star');
		divStars.appendChild(halfStarImg);
	}

	const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
	for (let j = 0; j < remainingStars; j++) {
		const grayStarImg = document.createElement('img');
		grayStarImg.setAttribute('src', '../assets/StarGray.png');
		grayStarImg.setAttribute('alt', 'Gray Star');
		divStars.appendChild(grayStarImg);
	}
}

const listItems = document.querySelectorAll('.list-item');

listItems.forEach((item) => {
	item.addEventListener('click', () => {
		item.classList.add('active');
		listItems.forEach((otherItem) => {
			if (otherItem !== item) {
				otherItem.classList.remove('active');
			}
		});
	});
});

const savedBooks = localStorage.getItem('book');

function checkActiveBooksCount() {
	const savedBookCount = localStorage.getItem('bookCount');
	if (savedBookCount) {
		cartItems.textContent = savedBookCount;
		for (let x = 1; x < parseInt(savedBookCount); x++) {
			const savedBook = localStorage.getItem(`book${x}`);
			if (savedBook) {
				const book = JSON.parse(savedBook);
				console.log(`${x} : ${book.volumeInfo.id}`);
			}
		}
	}
}

window.addEventListener('DOMContentLoaded', () => {
	checkActiveBooksCount();
	if (savedBooks) {
		console.log(savedBooks);
	}
});

const activeBtns = localStorage.getItem('activeButtons'); // object of IDs
const IDValue = localStorage.getItem('buttonId'); // id

function checkActiveBtn() {
	if (activeBtns && IDValue) {
		console.log('ID Value:', IDValue);
		for (const key in activeBtns) {
			console.log('keys:  ' + key);
			if (key === IDValue) {
				const activeButtonElement = document.getElementById(key);
				activeButtonElement.classList.add('active');
				console.log('id value: ' + key);
			} else {
				console.log('error');
			}
		}
	} else {
		console.log('Error: activeBtns or IDValue is missing');
		console.log('activeBtns:', JSON.stringify(activeBtns));
		console.log('IDValue:', JSON.stringify(IDValue));
	}
}

checkActiveBtn();
