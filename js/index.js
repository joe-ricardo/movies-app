(async () => {
  "use strict";
  // This is the entry point for your application. Write all of your code here.
  // Before you can use the database, you need to configure the "db" object
  // with your team name in the "js/movies-api.js" file.

  //generates initial movie list

let movieList = await getMovieList();

  console.log(movieList)
  //generates initial dropdown menu for delete
  await deleteDropdown();

  //generates initial dropdown menu for update
  await updateDropdown();

  //api search bar
  $("#apiSearchButton").on("click", async () => {
    let apiData = await apiCall($("#apiSearchInput").val());
    $("#movieTitleField").val(apiData.Title);
    $("#movieYearField").val(apiData.Year);
    $("#movieDirectorField").val(apiData.Director);
    $("#movieRatingField").val(apiData.imdbRating);
    $("#movieGenreField").val(apiData.Genre);
    $("#movieActorField").val(apiData.Actors);
  });

  //movie search bar
  $("#movieSearchButton").on("click", () => {
    let searchInput = $('#movieSearchInput').val()
    console.log(searchInput)
  });

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
    await updateMovieObject($("#updateDropdown").val());
  });

  //event that fires off when update dropdown option changes
  $("#updateDropdown").on("change", async function () {
    await movieUpdateSelected($("#updateDropdown").val());
  });

  /** getMovieList function
   * movieList: stores the list of movies retrieved by calling the getMovies function
   * movieHTML: the string that will store the html information to be stored in the div #movies
   * uses the getMovies function to retrieve a list of the movies,
   * generates an html string,
   * and populates html string to div #movies
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
    return movieList;
  }

  /** addMovieToList function
   * movieObject: object generated to store the movie's input values
   * stores movie information from the input fields into the movie object,
   * clears the input fields,
   * uses the addMovie function to add the movie object to the database
   * after adding the movie, the new list is regenerated with regenerateMovieInformation
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

    $("#movieTitleField").val("");
    $("#movieYearField").val("");
    $("#movieDirectorField").val("");
    $("#movieRatingField").val("");
    $("#movieGenreField").val("");
    $("#movieActorField").val("");

    await addMovie(movieObject);
    await regenerateMovieInformation();
  }

  /** deleteMovieItem function
   * when called, uses the deleteMovie function to delete the movie from the list using the movie index
   * afterwards, it regenerates the dropdown and movie list by calling regenerateMovieInformation
   * @param movieIndex index of the movie in the movieList we are going to remove
   * @returns {Promise<void>}
   */
  async function deleteMovieItem(movieIndex) {
    let movieList = await getMovies();

    await deleteMovie(movieList[movieIndex]);
    await regenerateMovieInformation();
  }

  /** deleteDropdown function
   * movieHTMLString: stores dropdown html string from generateDropDown
   * updates the dropdown list with retrieved html
   * @returns {Promise<void>}
   */
  async function deleteDropdown() {
    let movieHTMLString = await generateDropDown();

    $("#deleteDropdown").html(movieHTMLString);
  }

  /** updateDropdown function
   * movieHTMLString: stores dropdown html string from generateDropDown
   * updates the dropdown list with retrieved html
   * @returns {Promise<void>}
   */
  async function updateDropdown() {
    let movieHTMLString = await generateDropDown();

    $("#updateDropdown").html(movieHTMLString);
  }

  /** updateMovieObject function
   * movieList: stores the list of movies retrieved by calling the getMovies function
   * uses the index value to get the selected movie from the movieList
   * the selected movie values are updated based on what is in the input boxes
   * regenerateMovieInformation refreshes the movie list and dropdown menus
   * @param index is the index of the selected move to update
   * @returns {Promise<void>}
   */
  async function updateMovieObject(index) {
    let movieList = await getMovies();
    movieList[index].title = $("#updateMovieTitle").val();
    movieList[index].genre = $("#updateMovieGenre").val();
    movieList[index].director = $("#updateMovieDirector").val();
    movieList[index].actors = $("#updateMovieActors").val();
    movieList[index].rating = $("#updateMovieRating").val();
    movieList[index].year = $("#updateMovieYear").val();

    await updateMovie(movieList[index]);
    await regenerateMovieInformation();
  }

  /** movieUpdateSelected function
   * movieList: stores the list of movies retrieved by calling the getMovies function
   * uses the index value to get the selected movie from the movieList
   * populates the update information boxes with the selected movie's information
   * @param index is the index of the selected movie to proc the information for
   * @returns {Promise<void>}
   */
  async function movieUpdateSelected(index) {
    let movieList = await getMovies();

    $("#updateMovieTitle").val(movieList[index].title);
    $("#updateMovieGenre").val(movieList[index].genre);
    $("#updateMovieDirector").val(movieList[index].director);
    $("#updateMovieActors").val(movieList[index].actors);
    $("#updateMovieRating").val(movieList[index].rating);
    $("#updateMovieYear").val(movieList[index].year);
  }

  /** regenerateMovieInformation function
   * getMovieList: refreshes the movie list on the screen
   * deleteDropdown: refreshes the delete dropdown list
   * updateDropdown: refreshes the update dropdown list
   * @returns {Promise<void>}
   */
  async function regenerateMovieInformation() {
    await getMovieList();
    await deleteDropdown();
    await updateDropdown();
  }

  /** generateDropDown function
   * movieList: stores the list of movies retrieved by calling the getMovies function
   * movieHTML: the string that will store the html information to be stored in the dropdown menu
   * this function will retrieve the movieList
   * and store the HTML information with an index value and title
   * @returns {string} the HTML string generated
   */
  async function generateDropDown() {
    let movieList = await getMovies();

    let movieHTML = '<option value="blank" selected hidden></option>';

    for (let i = 0; i < movieList.length; i++) {
      movieHTML += `
        <option value="${i}">${movieList[i].title}</option>
        `;
    }
    return movieHTML;
  }
})();
