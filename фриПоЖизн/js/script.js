"use strict";

// получ все ratings в массив
const ratings = document.querySelectorAll(".rating");
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

  // Инициализация конкретного рейтинга
  function initRating(rating) {
    initRatingVars(rating);
    setRatingActiveWidth();
    // для самостоятельного указания рейтинга. возможность указывать рейтинг только при наличии опред класса у родителя (rating_set)
    // .contains - проверика наличия класса
    if (rating.classList.contains("rating_set")) {
      setRating(rating);
    }
  }

  // Инициализация переменных
  function initRatingVars(rating) {
    // активная полоса
    ratingActive = rating.querySelector(".rating__active");
    // значение цифры
    ratingValue = rating.querySelector(".rating__value");
  }

  // Изменение ширины активных звёзд (отображается на актив полосе). По умолч индекс равен указаным цифрам (rating__value - 4.3)
  function setRatingActiveWidth(index = ratingValue.innerHTML) {
    // вычисление процента. 5 звезд / на 0.05
    const ratingActiveWidth = index / 0.05;
    // заполняем width полученым значением в %
    ratingActive.style.width = `${ratingActiveWidth}%`;
  }

  // Возможность указывать оценку
  function setRating(rating) {
    // получ объектов каждого rating
    const ratingItems = rating.querySelectorAll(".rating__item");
    for (let index = 0; index < ratingItems.length; index++) {
      // константа каждой radio кнопки
      const ratingItem = ratingItems[index];

      // Навешиваем События

      // наведение мышью на каждую radio кнопку
      ratingItem.addEventListener("mouseenter", function (e) {
        // Обновление переменных для понимание на каком из них находимся
        initRatingVars(rating);
        // Обновление активных звезд (активной полосы). передаём value из html наведённого объекта
        setRatingActiveWidth(ratingItem.value);
      });

      // Убираем мышь
      ratingItem.addEventListener("mouseleave", function (e) {
        // Обновление активных звезд. станет значение по умолчанию
        setRatingActiveWidth();
      });

      // клик
      ratingItem.addEventListener("click", function (e) {
        // Обновление переменных
        initRatingVars(rating);

        if (rating.dataset.ajax) {
          // "Отправить" на сервер. при выборе оценки, с помощью ajax данные будут отправ на условный сервер и возвр некое значение
          setRatingValue(ratingItem.value, rating);
        } else {
          // Отобразить указанную оцнку. выбор оценки (сразу отображается) и отправка формы.
          ratingValue.innerHTML = index + 1;
          setRatingActiveWidth();
        }
      });
    }
  }
}
