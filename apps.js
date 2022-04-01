//#region Psuedo code - 1st Draft
/*
1. Get Data
    1.1 Connect with API
        - We need our apikey=[yourkey]&                           
        - end-point: /movie
        - Final url: https://api.themoviedb.org/3/movie/76341?api_key=<<api_key>>
    1.2 Get user's name to invite to play quiz game --(STRETCH)
2. Use Data (inside a loop)
    2. Determine our questions and append to page
    2. Select one random movie
    2. Get correct answer and store as a variable
    2. Select 4 random movies as "incorrect answers/decoys"
            Get 4 incorrect answers from random movies and store in another variable
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




const app = {};

app.apiUrl = "https://api.themoviedb.org/3/movie/76341";
app.apiKey = "00c9d839153d1b6c3b376514c7334065";

app.getMovies = () => {
    const url = new URL(app.apiUrl);
    url.search = new URLSearchParams({
        api_key: app.apiKey,
    })

    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((jsonResponse) => {
            console.log(jsonResponse);
        })
};

app.init = () => {
    app.getMovies();
}

app.init();