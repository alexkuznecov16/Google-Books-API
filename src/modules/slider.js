// eslint-disable-next-line require-jsdoc
const slideData = [
  {
    img: './assets/banner1.png',
    url: '#1.com',
  },
  {
    img: './assets/banner2.png',
    url: '#2.com',
  },
  {
    img: './assets/banner3.png',
    url: '#3.com',
  }];

// navigation variables
const dotLink1 = document.getElementById('dot1');
const dotLink2 = document.getElementById('dot2');
const dotLink3 = document.getElementById('dot3');
const image = document.getElementById('slide');
const imageLink = document.getElementById('slideURL');

// current slide variable
let currentSlide = 0;
let animationTimeout;

/**
 * Change styles of dots
 */
function dotCheck() {
  if (currentSlide === 0) {
    dotLink1.classList.add('active');
    dotLink2.classList.remove('active');
    dotLink3.classList.remove('active');
  } else if (currentSlide === 1) {
    dotLink2.classList.add('active');
    dotLink1.classList.remove('active');
    dotLink3.classList.remove('active');
  } else {
    dotLink3.classList.add('active');
    dotLink1.classList.remove('active');
    dotLink2.classList.remove('active');
  }
}

/**
 * Do animation and change images
 */
function animation() {
  dotCheck();
  image.style.animationName = 'slideAnimation';
  image.style.animationDuration = '3s';
  image.setAttribute('src', slideData[currentSlide].img);
  setTimeout(() => {
    imageLink.setAttribute('href', `${slideData[currentSlide].url}`);
    image.style.animationName = '';
    image.style.opacity = 1;
    dotCheck();
  }, 3000);
}


/**
 * Изменяет стили точек в зависимости от текущего слайда.
 */
if (dotLink1 && dotLink2 && dotLink3) {
  dotLink1.addEventListener('click', () => {
    clearTimeout(animationTimeout);
    dotLink1.classList.add('active');
    dotLink2.classList.remove('active');
    dotLink3.classList.remove('active');
    currentSlide = 0;
    animation();
    autoAnimation();
  });

  dotLink2.addEventListener('click', () => {
    clearTimeout(animationTimeout);
    dotLink1.classList.remove('active');
    dotLink2.classList.add('active');
    dotLink3.classList.remove('active');
    currentSlide = 1;
    animation();
    autoAnimation();
  });

  dotLink3.addEventListener('click', () => {
    clearTimeout(animationTimeout);
    dotLink1.classList.remove('active');
    dotLink2.classList.remove('active');
    dotLink3.classList.add('active');
    currentSlide = 2;
    animation();
    autoAnimation();
  });
} else {
  console.error('One or more dot links are not found.');
}

/**
 * Every 5 seconds will bnext slide
 */
function autoAnimation() {
  clearTimeout(animationTimeout);
  animationTimeout = setTimeout(() => {
    currentSlide = (currentSlide + 1) % slideData.length;
    animation();
    autoAnimation();
  }, 5000);
}

autoAnimation();
