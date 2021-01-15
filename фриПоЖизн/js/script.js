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

        // раб при наличии опред атрибута datы, сейчас ajax
        if (rating.dataset.ajax) {
          // "Отправить" на сервер. при выборе оценки, с помощью ajax данные будут отправ на условный сервер и возвр некое значение
          setRatingValue(ratingItem.value, rating);
        } else {
          // Отобразить указанную оценку. выбор оценки (сразу отображается) и отправка формы.
          ratingValue.innerHTML = index + 1;
          setRatingActiveWidth();
        }
      });
    }
  }
  // ??? не раб функц. ошибки Fetch API cannot load + Failed to fetch. (должен отправ запрос)
  // асинхр функц (потому что fetch(запрос на получение данных)). приним value(`значение` нажатого объекта) которое отправим на сервер, rating (всю оболочку)
  async function setRatingValue(value, rating) {
    // перед запуском проверка на отсутст доп класса, от повторных нажатий
    if (!rating.classList.contains("rating_sending")) {
      // в момент отправки добав класс rating_sending для подскази что идёт обработка запроса
      rating.classList.add("rating_sending");

      // Отправика данных (value) на сервер. файл rating.json - замена сервера (ответ 3.7)
      let response = await fetch("rating.json", {
        // т.к. json то метод GET
        method: "GET",

        // // реальная отправка на сервер
        //body: JSON.stringify({
        // // в перемен userRating будет отправ value
        //	userRating: value
        //}),
        //headers: {
        //	'content-type': 'application/json'
        //}
      });

      // если ответ от сервера есть
      if (response.ok) {
        // получ json ответ от сервера в переменную
        const result = await response.json();

        // Получаем новый рейтинг. из rating.json
        const newRating = result.newRating;

        // Вывод нового среднего результата. в цифры
        ratingValue.innerHTML = newRating;

        // Обновление активных звезд
        setRatingActiveWidth();

        // убирает доп класс для повторного голосования
        rating.classList.remove("rating_sending");
      } else {
        // если нет ответа от сервера - ошибка, убрать доп класс
        alert("Ошибка");
        rating.classList.remove("rating_sending");
      }
    }
  }
}
