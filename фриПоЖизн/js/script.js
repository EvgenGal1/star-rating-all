"use script";

// получ все ratings в массив
const ratings = document.querySelectorAll(".ratings");
if (ratings.length > 0) {
  initRatings();
}

// Основная функц
function initRatings() {
  let ratingActive, ratingValue;
  // пробегаемся по всем ratings для работы с ними
  for (let index = 0; index < ratings.length; index++) {
    // конст ratings каждого из объектов
    const rating = ratings[index];
    // отправл в др. функц
    initRating(rating);
  }
}
