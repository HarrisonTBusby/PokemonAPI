function saveToLocalStorageByName(actualPokemon){
    //Get current values that are saved into Local Storage
    //Create an array of values to store into local storage

    let favorites = getLocalStorage();

    //Add new name to our favorites array

    favorites.push(actualPokemon);

    //save updated array to local storage
    localStorage.setItem('Favorites', JSON.stringify(favorites));


}


function getLocalStorage(){

    //get all fo the values that are stored in Favorites in local storage

    let localStorageData = localStorage.getItem('Favorites');

    if(localStorageData === null){
        return [];
    }

    return JSON.parse(localStorageData);

}


function removeFromLocalStorage(actualPokemon){

    //Day 2: Remove an element from local storage

    let favorites = getLocalStorage();

    //Find the index of the name in local storage
    let nameIndex = favorites.indexOf(actualPokemon);


    //remove the name from the array using the splice method
    favorites.splice(nameIndex, 1);

    //Save our updated array to local storage
    localStorage.setItem('Favorites', JSON.stringify(favorites));


}

export { saveToLocalStorageByName, getLocalStorage, removeFromLocalStorage };
