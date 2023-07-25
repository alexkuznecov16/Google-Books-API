const cartItems = document.querySelector('.items-count');
const menuCart = document.querySelector('.add-menu-bag');
menuCart.appendChild(cartItems);

let IDsValues = [];
const booksInfo = [];

const booksLinks = document.querySelectorAll('.list-item > a');
booksLinks.forEach((link) => {
	link.addEventListener('click', async (event) => {
		checkListItems();
		const searchText = encodeURIComponent(event.target.textContent.trim());
		const API_KEY = 'AIzaSyA1ZDvV5hsNrqU5rZkZQCo-WhKuE1ptfa4';
		const URL = `https://www.googleapis.com/books/v1/volumes?q=${searchText}&key=${API_KEY}&printType=books&startIndex=0&maxResults=6&langRestrict=en`;
		const divBlock = document.querySelector('.books__block');
		divBlock.innerHTML = '';

		try {
			const response = await fetch(URL);
			const result = await response.json();

			function addNewBooks(y = 0, x = 6) {
				for (let i = y; i < x; i++) {
					console.log(result.items[i]);
					const divItem = document.createElement('div');
					divItem.setAttribute('class', 'book-item');
					const image = document.createElement('img');
					if (result.items[i].volumeInfo.imageLinks && result.items[i].volumeInfo.imageLinks.thumbnail) {
						image.setAttribute('src', result.items[i].volumeInfo.imageLinks.thumbnail);
						image.setAttribute('alt', 'book image');
					} else {
						// If img not available
						image.setAttribute('src', './assets/placeholder.png');
						image.setAttribute('alt', 'No Image Available');
					}
					image.setAttribute('class', 'book-thumbnail');
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
						spanPrice.innerHTML = '';
					}

					const buyButton = document.createElement('button');
					buyButton.setAttribute('class', 'book-buy');
					buyButton.setAttribute('id', result.items[i].id);
					buyButton.textContent = 'Buy now';

					buyButton.addEventListener('click', () => {
						const itemID = buyButton.getAttribute('id'); // Получаем значение id кнопки

						if (buyButton.classList.contains('active')) {
							if (parseInt(cartItems.textContent) > 0) {
								cartItems.textContent = parseInt(cartItems.textContent) - 1;
								checkCartItems();
							}
							localStorage.setItem('bookCount', parseInt(cartItems.textContent));
							buyButton.classList.remove('active');
							buyButton.textContent = 'Buy now';
							IDsValues.pop(itemID);
							booksInfo.pop(result.items[i]);
							localStorage.setItem('IDsValues', JSON.stringify(IDsValues));
							localStorage.setItem('book', JSON.stringify(booksInfo));
						} else {
							cartItems.textContent = parseInt(cartItems.textContent) + 1;
							localStorage.setItem('bookCount', cartItems.textContent);
							buyButton.classList.add('active');
							buyButton.textContent = 'In the cart';
							IDsValues.push(itemID);
							booksInfo.push(result.items[i]);
							localStorage.setItem('IDsValues', JSON.stringify(IDsValues));
							localStorage.setItem('book', JSON.stringify(booksInfo));
						}
						checkCartItems();
						checkSavedValues();
					});
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
			}
			addNewBooks();
		} catch (error) {
			console.log(error);
		}
		checkActiveBtn();
		getBooksInfo();
	});
});

// check book rating function
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

// check and change classes for items function
function checkListItems() {
	const listItems = document.querySelectorAll('.list-item'); // all list links

	// all items iterations
	listItems.forEach((item) => {
		item.addEventListener('click', () => {
			item.classList.add('active');
			// iteration of other items
			listItems.forEach((otherItem) => {
				if (otherItem !== item) {
					otherItem.classList.remove('active');
				}
			});
		});
	});
}

// saved books info function
function getBooksInfo() {
	savedBooks = localStorage.getItem('book'); // get info
	// something...
}

// Check saved book count function
function checkActiveBooksCount() {
	const savedBookCount = localStorage.getItem('bookCount'); // Saved book count
	if (savedBookCount) {
		cartItems.textContent = savedBookCount;
		for (let x = 1; x < parseInt(savedBookCount); x++) {
			const savedBook = localStorage.getItem(`book${x}`);
			if (savedBook) {
				book = JSON.parse(savedBook); // books count (string to object)
			}
		}
	}
}

// check saved IDs function
function checkSavedValues() {
	const savedIDsValues = localStorage.getItem('IDsValues'); // get IDs
	if (savedIDsValues) {
		IDsValues = JSON.parse(savedIDsValues);
		checkActiveBtn();
	}
	checkActiveBtn();
}

// check saved items count function
function checkCartItems() {
	if (parseInt(cartItems.textContent) > 0) {
		cartItems.style.display = 'block';
	} else if (parseInt(cartItems.textContent) == 0) {
		cartItems.style.display = 'none';
	}
}

// function after window load
window.addEventListener('DOMContentLoaded', () => {
	checkSavedValues();
	checkActiveBooksCount();
	checkCartItems();
});

// check active buttons function
function checkActiveBtn() {
	// active buttons
	const activeBtns = JSON.parse(localStorage.getItem('IDsValues')); // string to object
	if (activeBtns) {
		const values = Object.values(activeBtns); // get values of active buttons object
		// iteration
		for (const value of values) {
			if (IDsValues.includes(value)) {
				const btnItem = document.getElementById(value); // find button by ID
				if (btnItem) {
					btnItem.textContent = 'In the cart';
					btnItem.classList.add('active');
				}
			}
		}
	}
}
