(async () => {
    "use strict";
    // This is the entry point for your application. Write all of your code here.
    // Before you can use the database, you need to configure the "db" object 
    // with your team name in the "js/movies-api.js" file.
    let newMovie = {
        "title": "the saint, The (La boîte noire)",
        "year": 2005,
        "director": "Genny Lottrington",
        "rating": 1,
        "genre": "Mystery|Thriller",
        "actor": "Genny"
    };

    //generates initial movie list
    await getMovieList();

    //generates initial dropdown menu for delete
    await deleteDropdown();

    //adds movie when the add button is clicked
    $('#addMovie').on('click', async function(){
        await addMovieToList(newMovie);
    });

    //deletes movie when the delete button is clicked
    $('#deleteMovie').on('click', async function(){
        await deleteMovieItem($('#deleteDropdown').val());
    })

    /** getMovieList
     * when called, uses the getMovies function to retrieve a list of the movies
     * the function formats the information in an html format
     * @returns {Promise<void>}
     */
    async function getMovieList(){
        let movieList = await getMovies();

        let movieHTML = "";

        for(let movie of movieList){
            movieHTML += `
        ${movie.title},<br>
        ${movie.genre},<br>
        ${movie.director},<br>
        ${movie.actors},<br>
        ${movie.rating},<br>
        ${movie.year} 
        <br><br>`;
        }
        $('div').html(movieHTML);
    }

    /** addMovieToList
     * when called, uses the addMovie function to add a movie to the database
     * after adding the movie, the new list is regenerated
     * @param newMovie an object with movie information
     * @returns {Promise<void>}
     */
    async function addMovieToList(newMovie){
         await addMovie(newMovie);
         await getMovieList();
         await deleteDropdown();
    }

    /** deleteMovieItem
     * when called, uses the deleteMovie function to delete the movie from the list using the movie index
     * afterwards, it regenerates the dropdown and movie list
     * @param movieIndex index of the movie in the movielist we are going to remove
     * @returns {Promise<void>}
     */
    async function deleteMovieItem(movieIndex){
        let movieList = await getMovies();

        await deleteMovie(movieList[movieIndex]);
        await getMovieList();
        await deleteDropdown();
    }

    /** deleteDropdown
     * when called, uses the getMovies function to generate a dropdown list to be used with the delete button
     * @returns {Promise<void>}
     */
    async function deleteDropdown(){
        let movieList = await getMovies();

        let movieHTML = "";

        for (let i=0; i < movieList.length; i++){
            movieHTML += `
        <option value="${i}">${movieList[i].title}</option>
        `;
        }

        // for(let movie of movieList){
        //     movieHTML += `
        // <option value="${movie.id}">${movie.title}</option>
        // `;
        // }
        $('#deleteDropdown').html(movieHTML);
    }
})();