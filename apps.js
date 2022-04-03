//#region Psuedo code - 1st Draft
/*
1. Get Data
    1.1 Connect with API
        - We need our apikey=[yourkey]&                           
        - end-point: /movie
        - Final url: https://api.themoviedb.org/3/movie/76341?api_key=<<api_key>>
    1.2 Get user's name to invite to play quiz game --(STRETCH)
2. Use Data (inside a loop)
    2. Determine our questions
    2. Select one random movie
    2. Get correct answer and store as a array
    2. Get 4 incorrect answers and store in another array
    2. Do a check with user answer for correct stored variable answer
        - If answer is correct them score++
        - Go to next question
        - If question number is equal 10: End game and send to end game page
        -Else: Next question
3. Display Data
    3.1 Display data into the question page
    3.1 Display green icon for correct answers
    3.2 Display red cross for incorrect answers
    3.3 Display score in question page
    3.4 Display final score into end game page
*/
//#endregion



// Creating the Namespace Object
const app = {};
//#region specific functions
app.getRandomNumber = (maxId) => {
    return Math.floor(Math.random() * maxId);
}

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


//#endregion



//#region The Game
app.startGame = () => {
    //event listener for the start button
    app.startButtonElement.addEventListener("click", function(){
        // 1.2 get the userName
        app.getUserName();

        // 2. use Data
        for(let i = 1; i <= 10; i++){
            // console.log(`question ${i}`);
            // our code will be here
        }

        // 2.1 get Question
        const quest = app.getQuestion();
        console.log(quest);

        // 2.2 select Random Movie
        const movie = app.getMovie();
        console.log("movie", movie);

        // selecting poster with random movie
        const poster = app.getPoster();
        console.log("poster", poster);

        // 2.3 storing correct answer in a variable
        if(quest === app.questionType1){
            const answer = 1985;
            const answerArray = [answer];
            console.log(answerArray);
            console.log("type1");

            // generate for incorrect answers
            for(let j = 1; j < 5; j++){
                const newWrongAnswer = app.getRandomNumberFromInterval(answer-10, answer+10);
                // needs to check if wrong answer already exists in the array
                while (answerArray.includes(newWrongAnswer)){
                    newWrongAnswer = app.getRandomNumberFromInterval(answer-10, answer+10);
                }
                answerArray.push(newWrongAnswer);
            }
            console.log(answerArray);

        } else {
            console.log("otherType");
        }
    })
}
//#endregion



app.getMovie = () => {
    app.movieId = app.getRandomNumber(200000);
    app.apiUrl = `https://api.themoviedb.org/3/movie/${app.movieId}`;
    app.apiKey = "00c9d839153d1b6c3b376514c7334065";
    

    const url = new URL(app.apiUrl);
    url.search = new URLSearchParams({
        api_key: app.apiKey,
    })
    
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            console.log (jsonResponse);
            // console.log(jsonResponse.original_title);
            // console.log(jsonResponse.release_date);
            // console.log(jsonResponse.release_date.substring(0, 4));
            // console.log(parseInt(jsonResponse.release_date.substring(0, 4)) + 1);
            // app.displayTitle("just checking", jsonResponse.original_title);

            const titleParent = document.querySelector('.homeParent');
            const randomTitle = document.createElement('p');

            randomTitle.innerHTML = `
                <span>
                ${jsonResponse.original_title}
                </span>
            `
            titleParent.appendChild(randomTitle);
        })
};

app.getPoster = () => {
    app.moviePosterUrl = `${app.apiUrl}/images`;

    const posterUrl = new URL(app.moviePosterUrl);
    posterUrl.search = new URLSearchParams({
        api_key: app.apiKey,
    })

    fetch(posterUrl)
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            // console.log("poster here!", jsonResponse.posters[0]);

            const filePath = jsonResponse.posters[0].file_path;
            const posterPath = `${posterUrl}${filePath}`;
            console.log("posters!", posterPath);
            // const posterParent = document.querySelector('.homeParent');
            // const randomPoster = document.createElement('img');

            // randomPoster.src = posterPath;
            // randomPoster.alt = "random movie poster here";

            // posterParent.appendChild(randomPoster);
        })
}

app.init = () => {
    app.userName;
    app.userNameElement = document.querySelector('input');
    app.startButtonElement = document.getElementById('startButton');
    
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

    app.startGame();
    // app.getMovie();
}

app.init();