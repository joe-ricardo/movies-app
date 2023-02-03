(async () => {
  "use strict";
  // This is the entry point for your application. Write all of your code here.
  // Before you can use the database, you need to configure the "db" object
  // with your team name in the "js/movies-api.js" file.

  //generates initial movie list
  await getMovieList();

  //generates initial dropdown menu for delete
  await deleteDropdown();

  //generates initial dropdown menu for update
  await updateDropdown();

  //adds movie when the add button is clicked
  $("#addMovie").on("click", async function () {
    await addMovieToList();
  });

  //deletes movie when the delete button is clicked
  $("#deleteMovie").on("click", async function () {
    await deleteMovieItem($("#deleteDropdown").val());
  });

  //updates a specific movie when the button is selected
  $("#updateMovieButton").on("click", async function () {
    await updateMovieObject($('#updateDropdown').val());
  });

  //event that fires off when update dropdown option changes
  $("#updateDropdown").on("change", async function () {
    await movieUpdateSelected($("#updateDropdown").val());
  });

  /** getMovieList
   * when called, uses the getMovies function to retrieve a list of the movies
   * the function formats the information in an html format
   * @returns {Promise<void>}
   */
  async function getMovieList() {
    let movieList = await getMovies();

    let movieHTML = "";

    for (let movie of movieList) {
      movieHTML += `
        ${movie.title},<br>
        ${movie.genre},<br>
        ${movie.director},<br>
        ${movie.actors},<br>
        ${movie.rating},<br>
        ${movie.year} 
        <br><br>`;
    }
    $("#movies").html(movieHTML);
  }

  /** addMovieToList
   * when called, uses the addMovie function to add a movie to the database
   * after adding the movie, the new list is regenerated
   * @param newMovie an object with movie information
   * @returns {Promise<void>}
   */
  async function addMovieToList() {
    let movieObject = {
      title: $("#movieTitleField").val(),
      year: $("#movieYearField").val(),
      director: $("#movieDirectorField").val(),
      rating: $("#movieRatingField").val(),
      genre: $("#movieGenreField").val(),
      actors: $("#movieActorField").val(),
    };

    $("#movieTitleField").val(''),
    $("#movieYearField").val(''),
    $("#movieDirectorField").val(''),
    $("#movieRatingField").val(''),
    $("#movieGenreField").val(''),
    $("#movieActorField").val(''),

    await addMovie(movieObject);
    await getMovieList();
    await deleteDropdown();
    await updateDropdown();

  }

  /** deleteMovieItem
   * when called, uses the deleteMovie function to delete the movie from the list using the movie index
   * afterwards, it regenerates the dropdown and movie list
   * @param movieIndex index of the movie in the movielist we are going to remove
   * @returns {Promise<void>}
   */
  async function deleteMovieItem(movieIndex) {
    let movieList = await getMovies();

    await deleteMovie(movieList[movieIndex]);
    await getMovieList();
    await deleteDropdown();
    await updateDropdown();
  }

  /** deleteDropdown
   * when called, uses the getMovies function to generate a dropdown list to be used with the delete button
   * @returns {Promise<void>}
   */
  async function deleteDropdown() {
    let movieList = await getMovies();

    let movieHTML = '<option value="blank" selected hidden></option>';

    for (let i = 0; i < movieList.length; i++) {
      movieHTML += `
        <option value="${i}">${movieList[i].title}</option>
        `;
    }

    $("#deleteDropdown").html(movieHTML);
  }

  async function updateDropdown() {
    let movieList = await getMovies();

    let movieHTML = '<option value="blank" selected hidden></option>';

    for (let i = 0; i < movieList.length; i++) {
      movieHTML += `
        <option value="${i}">${movieList[i].title}</option>
        `;
    }

    $("#updateDropdown").html(movieHTML);
  }

  async function updateMovieObject(index) {
    let movieList = await getMovies();
    movieList[index].title = $("#updateMovieTitle").val();
    movieList[index].genre = $("#updateMovieGenre").val();
    movieList[index].director = $("#updateMovieDirector").val();
    movieList[index].actors = $("#updateMovieActors").val();
    movieList[index].rating = $("#updateMovieRating").val();
    movieList[index].year = $("#updateMovieYear").val();
    console.log(index);
    console.log(movieList[index].actors);
    await updateMovie(movieList[index]);
    await getMovieList();
    await deleteDropdown();
  }

  async function movieUpdateSelected(index) {
    let movieList = await getMovies();
    $("#updateMovieTitle").val(movieList[index].title);
    $("#updateMovieGenre").val(movieList[index].genre);
    $("#updateMovieDirector").val(movieList[index].director);
    $("#updateMovieActors").val(movieList[index].actors);
    $("#updateMovieRating").val(movieList[index].rating);
    $("#updateMovieYear").val(movieList[index].year);    
  }
})();
