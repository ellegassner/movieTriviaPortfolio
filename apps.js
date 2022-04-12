//#region Psuedo code - 1st Draft
/*
1. Get Data
1.1 Connect with API
   - We need our apikey=[yourkey]&
   - end-point: /movie
   - Final url: https://api.themoviedb.org/3/movie/76341?api_key=<<api_key>>
1.2 Get user's name to invite to play quiz game --(STRETCH)
2. Use Data (inside a loop)
2.1 Determine our questions
2.2 Select one random movie
  - Get Poster from second API endpoint with random movie ID
2.3 Get correct and wrong answers and store to an answerArray
2.4 Get 4 incorrect answers and store to the answerArray
2.5 Do a check with user answer for correct stored variable answer
   - If answer is correct them score++
   - Confirm your answer (button)
   - & Next question
3. Display Data
3.1 Display data into the question page
3.2 Display text & score for correct answers
3.3 Display text & score for incorrect answers
*/
//#endregion



// Creating the Namespace Object
const app = {};

// Global Variables

app.apiUrl = "https://api.themoviedb.org/3";
app.apiKey = "00c9d839153d1b6c3b376514c7334065";

app.player = {
  name: 'player1',
  score: 0,
}
app.questionNumber = 0;

//#region specific functions
// Method to return a random number until a max value
app.getRandomNumber = (maxId) => {
  return Math.floor(Math.random() * maxId);
}

// Method to return a random number inside a range
app.getRandomNumberFromInterval = (min) => {
  return Math.floor(Math.random() * (2022 - min + 1) + min);
}

// Method to get a Player's name
app.getPlayerName = () => {
  if(app.playerNameElement.value.length !== 0){
    app.player.name = app.playerNameElement.value;
  } else {
    app.player.name = 'player one';
  } 
  return app.player.name; 
}

// Method to get a question
app.getQuestion = () => {
  const index = app.getRandomNumber(app.questions.length - 1);
  app.questionNumber++;    
  return app.questions[index];
}

// Method to get 5 Answers. 1 correct and 4 incorrect
app.getAnswers = (movie) => {
  // 2.3 Get correct and wrong options and store to an answerArray
  app.answerArray = [];
  app.answer = parseInt(movie.release_date.substring(0, 4));
  app.answerArray.push(app.answer);
  // 2.4 generate 4 incorrect answers
  for (let wa = 1; wa <= 4; wa++) {
    let newWrongAnswer = app.getRandomNumberFromInterval(app.answer - 10);
    // Check if wrong answer already exists in the array
    while (app.answerArray.includes(newWrongAnswer)) {
      newWrongAnswer = app.getRandomNumberFromInterval(app.answer - 10);
    }
    app.answerArray.push(newWrongAnswer);
  }
  app.answerArray.sort();
  return app.answerArray;
}

app.checkAnswers = () => {
  if (parseInt(app.playerAnswer) === app.answer) {  
    // Increase score
    app.player.score++;
    // Append message
    app.messageH4.innerHTML = `Congrats ${app.player.name}, you are super smart! Your score now is ${app.player.score}`
    app.messageParent.appendChild(app.messageH4);
  } else {
    // Append message
    app.messageH4.innerHTML = `Sorry ${app.player.name}, wrong answer. The correct answer was ${app.answer}. Your score remains the same: ${app.player.score} - try again!`
    app.messageParent.appendChild(app.messageH4);
  }
}


// Method to display the Question and the 5 answer options and the buttons
app.displayQandA = (movie) => {
  // Clean div.quiz
  app.startButtonElement.classList.add('btnDisappear');
  app.nextButtonElement.classList.add('btnAppear');
  app.quizDivElement.innerHTML = '';
  app.answerArray = [];      
  const answersOptions = app.getAnswers(movie);
  // Setting the poster
  app.getPoster(movie);

  //Display Options
  const movieDescription = `    
    <section class="quizParent" id="quizParent">
      <h3>When was this movie released?</h3>
      <h4>${app.movieTitle}</h4>
      <div class="quizChild">
        <div class="moviePoster">
          <img id="moviePoster" src="" alt="" >
        </div>
        <div class="quizOptions">
          <div class="quizChoices">
            <input type="radio" id="choiceText1" class="choiceOption" name="choice" value="${app.answerArray[0]}">
            <label for="choiceText1">${app.answerArray[0]}</label>
          </div>
          <div class="quizChoices">
            <input type="radio" id="choiceText2" class="choiceOption" name="choice" value="${app.answerArray[1]}">
            <label for="choiceText2">${app.answerArray[1]}</label>
          </div>
          <div class="quizChoices">
            <input type="radio" id="choiceText3" class="choiceOption" name="choice" value="${app.answerArray[2]}">
            <label for="choiceText3">${app.answerArray[2]}</label>
          </div>
          <div class="quizChoices">
            <input type="radio" id="choiceText4" class="choiceOption" name="choice" value="${app.answerArray[3]}">
            <label for="choiceText4">${app.answerArray[3]}</label>
          </div>
          <div class="quizChoices">
            <input type="radio" id="choiceText5" class="choiceOption" name="choice" value="${app.answerArray[4]}">
            <label for="choiceText5">${app.answerArray[4]}</label>
          </div>   
          <div class="textConfirmation">
              <p id="answerConfirmation">${app.player.name} select an option!</p>
          </div> 
        </div>
        </section>
  `

  app.quizDivElement.innerHTML = movieDescription;
  app.checkPlayersRadioButtonSelection(); 
}

//#endregion
//#region GameLogic
app.startGame = () => {
  //event listener for the start button
  // 1.2 get the player's name
  app.getPlayerName();
  document.querySelector('h2').innerHTML = '';
  app.messageH4.innerHTML = '';
  const movie = app.getPopularMovies();
  // 2.1 get Question
  const quest = app.getQuestion();
  // Append Question
  const question = document.createElement('h2');
  question.innerText = quest;
}

app.nextQuestion = () => {
  // //Check answer
  app.checkAnswers();     
   // 2.1 get Question
  app.nextButtonElement.disabled = true; 
  app.nextButtonElement = document.getElementById('nextQuestion');
  // Get 2nd+ movie;
  app.newMovieObject = app.getPopularMovies();
}

// Check players answers with correct answer values
app.checkPlayersRadioButtonSelection = () => {
  document.querySelector('.quizOptions').addEventListener('change', function (event) {
    let usersOptionInForm = event.target;
  
    app.anwserConfirmationElement = document.getElementById('answerConfirmation');
    app.anwserConfirmationElement.innerText = `${app.player.name}, you have selected ${usersOptionInForm.value}. To check your answer please press Next Question.`;
    app.nextButtonElement.disabled = false; 
    app.playerAnswer = usersOptionInForm.value;
  });
}
//#endregion
//#region Get Popular Movies
app.getPopularMovies = () => {
  //Getting random number for the page
  const pageNumber = app.getRandomNumber(100);
  const movieEndPoint = `${app.apiUrl}/discover/movie`;
  const movieUrl = new URL(movieEndPoint);
  movieUrl.search = new URLSearchParams({
    api_key: app.apiKey,
    language: 'en-US',
    sort_by: 'popularity.desc',
    include_adult: false,
    include_video: false,
    page: pageNumber,
  });
  fetch(movieUrl)
    .then((response) => {
      return response.json();
    })
    .then((movieData) => {
      //2.2 select random movie
      app.popularMovies = movieData.results;
      let  randomMovieObj = app.popularMovies[app.getRandomNumber(app.popularMovies.length)];
      // Creating movieId and movieTitle variable to reuse for poster data
      app.movieId = randomMovieObj.id;
      app.movieTitle = randomMovieObj.title;
      //Display Movie
      app.displayQandA(randomMovieObj);      
    });
}
//#endregion

//#region GetPoster
// Getting poster from random movie ID
app.getPoster = () => {
  app.moviePosterUrl = `${app.apiUrl}/movie/${app.movieId}/images`; 

  const posterUrl = new URL(app.moviePosterUrl);
  posterUrl.search = new URLSearchParams({
    api_key: app.apiKey,
  })

  fetch(posterUrl)
    .then((response) => {
      return response.json();
    })
    .then((results) => {
      const filePath = results.posters[0].file_path;
      const posterPath = `https://image.tmdb.org/t/p/original/${filePath}`;
      const randomPoster = document.getElementById('moviePoster');

      randomPoster.src = posterPath;
      randomPoster.alt = `${app.movieTitle} poster image.`;

      randomPoster.append();
    })
}
//#endregion
app.init = () => {
  app.popularMovies = [];
  app.questionType1 = "When was the release date for this movie poster shown?";
  app.questionType2 = "abc";
  app.questionType3 = "def";
  app.questionType4 = "ghi";

  app.questions = [
    app.questionType1,
    app.questionType2,
    app.questionType3,
    app.questionType4,
  ];

  // Caching Selectors
  app.playerNameElement = document.querySelector('input');
  app.mainForm = document.querySelector('form')
  //Removed start button and replaced with form
  app.startButtonElement = document.getElementById('startButton');
  app.nextButtonElement = document.getElementById('nextQuestion');
  app.nextButtonElement.classList.add('btnDisappear');
  app.quizDivElement = document.getElementById('quiz');
  app.errorElement = document.getElementById('errorMessage');
  app.questionElement = document.querySelector('h3');
  app.messageParent = document.querySelector('.quizResult');
  app.messageH4 = document.createElement('h4');

  // Applying Event handlers
  app.mainForm.addEventListener("submit", function (e) {
    e.preventDefault();
    app.startGame();
  });

  app.nextButtonElement.addEventListener("click", function (e) {
    e.preventDefault();
    app.nextQuestion();
  });
}

app.init();