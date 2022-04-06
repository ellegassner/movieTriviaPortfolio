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
2.3 Get correct and wrong answers and store to an answerArray
2.4 Get 4 incorrect answers and store to the answerArray
2.5 Do a check with user answer for correct stored variable answer
   - If answer is correct them score++
   - Confirm your answer (button)
   - If question number is equal 10: Send to end game page
   - Else: Next question
3. Display Data
3.1 Display data into the question page
3.2 Display green icon for correct answers
3.3 Display red cross for incorrect answers
3.4 Display score in question page
3.5 Display final score into end game page
*/
//#endregion



// Creating the Namespace Object
const app = {};

// Global Variables

app.apiUrl = "https://api.themoviedb.org/3"; // added these here so they are avaiable to all 
app.apiKey = "00c9d839153d1b6c3b376514c7334065";
app.movieId;

//#region specific functions
// Method to return a random number until a max value
app.getRandomNumber = (maxId) => {
  return Math.floor(Math.random() * maxId);
}

// Method to return a random number inside a range
app.getRandomNumberFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

app.getUserName = () => {
  app.userName = app.userNameElement.value;
  // console.log(app.userName);
  return app.userName;
}

app.getQuestion = () => {
  const index = app.getRandomNumber(app.questions.length - 1);
  return app.questions[index];
}

// Method to get 5 Answers. 1 correct and 4 incorrect
app.getAnswers = (movie) => {
  // 2.3 Get correct and wrong options and store to an answerArray
  app.answer = parseInt(movie.release_date.substring(0, 4));
  app.answerArray.push(app.answer);

  // 2.4 generate 4 incorrect answers
  for (let wa = 1; wa <= 4; wa++) {
    let newWrongAnswer = app.getRandomNumberFromInterval(app.answer - 10, app.answer + 10);
    // Check if wrong answer already exists in the array
    while (app.answerArray.includes(newWrongAnswer)) {
      newWrongAnswer = app.getRandomNumberFromInterval(app.answer - 10, app.answer + 10);
    }
    app.answerArray.push(newWrongAnswer);
  }
  app.answerArray.sort();
  return app.answerArray;
}

// Method to display the Question and the 5 answer options and the buttons
app.displayQandA = (movie) => {
  // Clean div.quiz
  app.quizDivElement.innerHTML = '';

  // Calling the app.getAnswers()
  const answersOptions = app.getAnswers(movie);
  console.log('Answer Options:', answersOptions);


  //Display Options
  const movieDescription = `    
    <section class="quizParent" id="quizParent">
      <h3>When was the release date for this movie poster shown?</h3>
      <h4>${movie.title}</h4>
      <div class="quizChild">
        <img src="" alt="" id="moviePoster" class="moviePoster">
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
        </div>
        </section>
  `
  // REMOVED FROM movieDescription AS WE ARE USING THE SAME BUTTON
  //   <div class="submitOptions">
  //     <button id="nextQuestion">Next Question</button>
  //   </div>

  app.quizDivElement.innerHTML = movieDescription;
  //app.quizDivElement.appendChild(movieDescription);               //WHY WE DON'T NEED THIS LINE
}

//Method to Get Player's answer
app.getPlayerAnswer = () => {
  const playerAnswer = document.querySelector('input[name="choice"]:checked').value;
  console.log("Player's Answer:", playerAnswer);
}

//#endregion

//#region TheGame
//#region startGame
app.startGame = (movie) => {
  //event listener for the start button
  app.startButtonElement.addEventListener("click", function () {
    console.log('Game Started');
    // 1.2 get the userName
    app.getUserName();
    console.log('Player Name:', app.getUserName());

    // 2.1 get Question
    const quest = app.getQuestion();


    // Append Question
    const question = document.createElement('h2');
    question.innerText = quest;
    console.log('Question:', question.innerText);

    // Call 1st Question - Done in init()
    console.log(movie);
    
    
    // selecting poster with random movie
    const poster = app.getPoster();
    console.log("poster", poster);

    // Display QandA
    app.displayQandA(movie);

    //Change ID and InnerText of the button
    app.startButtonElement.id = 'nextQuestion';
    app.startButtonElement.innerText = 'Next Question';

    // Empty the answerArray
    app.answerArray = [];

    document.querySelectorAll(".choiceOption").checked = "false";            // REMOVE JUST TO CHECK CODE WORKING ??????
  });
}
//#endregion

//#region Next Question

//#endregion
//#endregion

//#region Get Popular Movies
async function getPopularMovies() {
  //GETTING RANDOM NUMBER FOR THE PAGE
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

  const movieSelection = await fetch(movieUrl)
  const movieData = await movieSelection.json();


  //2.2 select random movie
  app.popularMovies = movieData.results;
  const randomMovieObj = app.popularMovies[Math.floor(Math.random() * app.popularMovies.length)];
  app.movieId = randomMovieObj.id;

  console.log('movie id', app.movieId);

  // app.getPoster();
  
  //console.log("randomMovie", randomMovieObj); // RETURNS A RANDOM MOVIE OBJ
  //////app.startGame(randomMovieObj);

  // //DESTRUCTURING THE RANDOM MOVIE OBJ TO GET SPECIFIC DATA
  // const { id, original_title, overview, poster_path, release_date } = randomMovieObj;
  // //return { id, original_title, overview, poster_path, release_date } = randomMovieObj;

// }




//#region Get 1 Movie
// app.getMovie = () => {
//     app.movieId = app.getRandomNumber(200000);
//     app.apiUrl = `https://api.themoviedb.org/3/movie/${app.movieId}`;
//     app.apiKey = "00c9d839153d1b6c3b376514c7334065";


//     const url = new URL(app.apiUrl);
//     url.search = new URLSearchParams({
//         api_key: app.apiKey,
//     })

//     fetch(url)
//         .then((response) => {
//             return response.json();
//         })
//         .then((jsonResponse) => {
//             console.log (jsonResponse);
//             // console.log(jsonResponse.original_title);
//             // console.log(jsonResponse.release_date);
//             // console.log(jsonResponse.release_date.substring(0, 4));
//             // console.log(parseInt(jsonResponse.release_date.substring(0, 4)) + 1);
//             // app.displayTitle("just checking", jsonResponse.original_title);
//             return jsonResponse;

//             //TESTING APPENDING FOR CLICK EVENT
//             // const titleParent = document.querySelector('.homeParent');
//             // const randomTitle = document.createElement('p');

//             // randomTitle.innerHTML = `
//             //     <span>
//             //     ${jsonResponse.original_title}
//             //     </span>
//             // `
//             // titleParent.appendChild(randomTitle);
//         })
// };
//#endregion


  // console.log(id);
  // console.log(original_title);
  // console.log(overview);
  // console.log(poster_path);
  // console.log(release_date);   

  //NOW THAT WE HAVE THE DATA AVAILABLE, CALL POSTER IN HERE

  //------ THEO
  app.startGame(randomMovieObj);
  //app.nextQuestion(randomMovieObj);
  return (randomMovieObj);

}
//#endregion

//#region OLD GETMOVIE 
// app.getMovie = () => {
//     app.movieId = app.getRandomNumber(200000);
//     app.apiUrl = `https://api.themoviedb.org/3/movie/${app.movieId}`;
//     app.apiKey = "00c9d839153d1b6c3b376514c7334065";


//     const url = new URL(app.apiUrl);
//     url.search = new URLSearchParams({
//         api_key: app.apiKey,
//     })

//     fetch(url)
//         .then((response) => {
//             return response.json();
//         })
//         .then((jsonResponse) => {
//             console.log (jsonResponse);
//             // console.log(jsonResponse.original_title);
//             // console.log(jsonResponse.release_date);
//             // console.log(jsonResponse.release_date.substring(0, 4));
//             // console.log(parseInt(jsonResponse.release_date.substring(0, 4)) + 1);
//             // app.displayTitle("just checking", jsonResponse.original_title);
//             return jsonResponse;

//             //TESTING APPENDING FOR CLICK EVENT
//             // const titleParent = document.querySelector('.homeParent');
//             // const randomTitle = document.createElement('p');

//             // randomTitle.innerHTML = `
//             //     <span>
//             //     ${jsonResponse.original_title}
//             //     </span>
//             // `
//             // titleParent.appendChild(randomTitle);
//         })
// };
//#endregion

//#region GETPOSTER
app.getPoster = () => {
  app.moviePosterUrl = `${app.apiUrl}/154400/images`; //${app.movieID} will have to move in here
  // app.posterApiKey = 'd60732eee81090082315176607fd09e7'; // Don't think this is needed

  const posterUrl = new URL(app.moviePosterUrl);
  posterUrl.search = new URLSearchParams({
    api_key: app.apiKey
  })

  fetch(posterUrl)
    .then((response) => {
      return response.json();
    })
    .then((results) => {
      console.log("json!", results);

      const filePath = results.posters[0].file_path;
      console.log("filePath!", filePath);

      const posterPath = `https://image.tmdb.org/t/p/original/${filePath}`;
      console.log("posters Path!", posterPath);

      const posterParent = document.querySelector('.homeParent');
      const randomPoster = document.createElement('img');

      randomPoster.src = posterPath;
      randomPoster.alt = "random movie poster here";

      posterParent.appendChild(randomPoster);
    })


    // .then((results) => {
    //   console.log("json!", results);

    //   const filePath = results.posters[0].file_path;
    //   console.log("filePath!", filePath);

    //   const posterPath = `https://image.tmdb.org/t/p/original/${filePath}`;
    //   console.log("posters Path!", posterPath);






//   app.moviePosterUrl = `${app.apiUrl}/images`;
//   app.posterApiKey = 'd60732eee81090082315176607fd09e7';

//   const posterUrl = new URL(app.moviePosterUrl);
//   posterUrl.search = new URLSearchParams({
//     api_key: app.posterApiKey
//   })

//   fetch(posterUrl)
//     .then((response) => {
//       return response.json();
  



//       const posterParent = document.querySelector('.homeParent');
//       const randomPoster = document.createElement('img');

//       randomPoster.src = posterPath;
//       randomPoster.alt = "random movie poster here";

//       posterParent.appendChild(randomPoster);
//     })


}
//#endregion


app.init = () => {
  getPopularMovies();
  app.popularMovies = [];

  //Global Variables
  app.userName;
  app.answer;
  app.answerArray = [];




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


  // THERE IS A NAME FOR THIS ???????????????
  app.userNameElement = document.querySelector('input');

  app.startButtonElement = document.getElementById('startButton');
  app.nextButtonElement = document.getElementById('nextQuestion');

  app.quizDivElement = document.getElementById('quiz');
  app.errorElement = document.getElementById('errorMessage');

  app.questionElement = document.querySelector('h3');







  //app.startGame();
  // app.getMovie();

}

app.init();