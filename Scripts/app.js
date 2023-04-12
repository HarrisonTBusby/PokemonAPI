import { saveToLocalStorageByName, getLocalStorage, removeFromLocalStorage } from "./localStorage.js";



let regularPokemonBtn = document.getElementById('regularPokemonBtn');
let actualPokemon = document.getElementById('actualPokemon');
let randomBtn = document.getElementById('randomBtn');
let shinyPokemonBtn = document.getElementById('shinyPokemonBtn');
let bodyBackground = document.getElementById('bodyBackground');
let homePageTitle = document.getElementById('homePageTitle');
let homeBtn = document.getElementById('homeBtn');
let abilityDropdown = document.getElementById('abilityDropdown');
let abilityDropdownLabel = document.getElementById('abilityDropdownLabel');
let moveDropdown = document.getElementById('moveDropdown');
let moveDropdownLabel = document.getElementById('moveDropdownLabel');
let searchBtn = document.getElementById('searchBtn');
let pokemonShown = document.getElementById('pokemonShown');
let pokemonSpriteShown = document.getElementById('pokemonSpriteShown');
let pokemonSpriteShinyShown = document.getElementById('pokemonSpriteShinyShown');
let pokemonSpriteName = document.getElementById('pokemonSpriteName');
let pokemonHabitat = document.getElementById('pokemonHabitat');
let pokemonTyping = document.getElementById('pokemonTyping');
let pokemonTyping2 = document.getElementById('pokemonTyping2');
let over650 = document.getElementById('over650');
let favoriteBtn = document.getElementById('favoriteBtn');
let addBtn = document.getElementById('addBtn');
let evolutionChain = document.getElementById('evolutionChain');
let favorites1 = document.getElementById('favorites1');
let favorites2 = document.getElementById('favorites2');
let favorites3 = document.getElementById('favorites3');
let favorites4 = document.getElementById('favorites4');
let favorites5 = document.getElementById('favorites5');
let favoritesSideBar = document.getElementById('favoritesSideBar');






//Variables

let boolTrue = true;
let asyncPokemonAPI;
let pokemonNumber;
let randomPokemon;





//EVENT LISTENERS
homeBtn.addEventListener('click', function(){
    window.location.reload();
    
    
})

addBtn.addEventListener('click', function(){

    if(actualPokemon.value == ''){

    }else{
        saveToLocalStorageByName(actualPokemon.value);
    }


})

searchBtn.addEventListener('click', function(){
    
    AsyncGetPokemon(actualPokemon.value, pokemonNumber);
    

})




regularPokemonBtn.addEventListener('click', function(){
    if(boolTrue){

        bodyBackground.className = 'pokemonPagesBackground';
        homePageTitle.className = 'hide';
        homeBtn.classList.remove('hide');
        addBtn.classList.remove('hide');
        addBtn.classList.add('center');
        regularPokemonBtn.classList.add('hide');
        randomBtn.classList.remove('hide');
        abilityDropdown.classList.remove('hide');
        abilityDropdownLabel.classList.remove('hide');
        moveDropdown.classList.remove('hide');
        moveDropdownLabel.classList.remove('hide');
        actualPokemon.classList.remove('hide');
        searchBtn.classList.remove('hide');
        pokemonShown.classList.remove('hide');
        pokemonShown.classList.add('center');
        favoriteBtn.classList.remove('hide');
        

    }
    
    
})

//Random Button



randomBtn.addEventListener('click', function(){
    randomPokemon = Math.floor(Math.random() * 649);
    AsyncGetPokemon(randomPokemon);

})

//Favorites

favoriteBtn.addEventListener('click', function(){
    favoritesSideBar.classList.remove('hide');
    let localStorageData = getLocalStorage();
    CreateElements();
})
function CreateElements(){
  let favorites = getLocalStorage();

  favorites.map(actualPokemon => {
      let p = document.createElement('p');
      p.textContent = actualPokemon;
      p.value = actualPokemon;
      favorites1.addEventListener('click', function(){
          if(p.value === ''){
      
          }else{
              AsyncGetPokemon(p.value);
              }
          console.log(p.value);
      })

      let deleteBtn = document.createElement('button');
      deleteBtn.className = 'pokemonNameBackground3';
      deleteBtn.textContent = 'Delete';
      deleteBtn.type = 'button';

      deleteBtn.addEventListener('click', function(){
          removeFromLocalStorage(actualPokemon);
          p.remove;
      })



      favorites1.appendChild(p);
      favorites1.appendChild(deleteBtn);
  })
}

//--------------------------------------------------------------------------------------------------------------------

//FETCH FUNCTIONS

async function AsyncGetPokemon(actualPokemon){
    var letters = /^[a-zA-Z]+$/
    over650.textContent = '';
    
    if(actualPokemon <= 649 || actualPokemon.match(letters)){
    
    
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${actualPokemon}`);
    const data = await promise.json();
    asyncPokemonAPI = data;
    console.log(data);
    let pokemonNumber = asyncPokemonAPI.id;
    let pokemonName = asyncPokemonAPI.name;

    
    //------------------------------------------------------------------------------------------------------------

    //Pokemon Evolution

    const promiseName = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
    const dataName = await promiseName.json();  
    let pokemonEvolution = dataName.evolution_chain.url;

    const promiseEvolution = await fetch(pokemonEvolution);
    const dataEvolution = await promiseEvolution.json();

    console.log(dataEvolution);

    if(dataEvolution.chain.evolves_to == 0){
        evolutionChain.textContent = 'N/A';
        
    }else if(dataEvolution.chain.evolves_to[0].evolves_to.length > 0){
        let firstEvo = dataEvolution.chain.species.name;
        let secondEvo = dataEvolution.chain.evolves_to[0].species.name;
        let thirdEvo = dataEvolution.chain.evolves_to[0].evolves_to[0].species.name;
        evolutionChain.textContent = firstEvo + ', ' + secondEvo + ', ' + thirdEvo;
        
    }else{
        let firstEvo = dataEvolution.chain.species.name;
        const arrayEvoEevee = dataEvolution.chain.evolves_to.map(x => x.species).map(x => x.name).join(', ');
        const mapEvoEevee = arrayEvoEevee;
        evolutionChain.textContent = mapEvoEevee;
        console.log(evolutionChain);
        
    }    

    //--------------------------------------------------------------------------------------------------------------------------

    //Location
    const promise2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/encounters`);
    const data2 = await promise2.json();
    

    if(data2.length == 0){
        pokemonHabitat.textContent = 'N/A';
    }else{
    pokemonHabitat.textContent = 'Locale: ' + data2[0].location_area.name;
    }

    
    //Name + Dex Id
    pokemonSpriteName.textContent = asyncPokemonAPI.name.toUpperCase() + ' : Dex ID : ' + asyncPokemonAPI.id;

    //Abilities

    const array1 = asyncPokemonAPI.abilities;

    // Pass a function to map
    const map1 = array1.map(x => x.ability.name);
    abilityDropdownLabel.textContent = map1.join(', ')  ;
    

    //Moves

    const movesArray = asyncPokemonAPI.moves;
    const map2 = movesArray.map(x => x.move.name);
    moveDropdownLabel.textContent = map2.join(', ');

    
    //Typing
  
    
    if(asyncPokemonAPI.types.length == 1){
        pokemonTyping.textContent = '';
        pokemonTyping2.textContent = '';
        pokemonTyping.textContent = asyncPokemonAPI.types[0].type.name.toUpperCase();

        
    if(asyncPokemonAPI.types[0].type.name == 'poison'){
        pokemonTyping.className = 'poisonType';
    }

    if(asyncPokemonAPI.types[0].type.name == 'normal'){
        pokemonTyping.className = 'normalType';     
        
    }

    if(asyncPokemonAPI.types[0].type.name == 'fire'){
        pokemonTyping.className = 'fireType';
        pokemonTyping2.className = '';
      
    }

    if(asyncPokemonAPI.types[0].type.name == 'water'){
        pokemonTyping.className = 'waterType';
        pokemonTyping2.className = '';
        
    }

    if(asyncPokemonAPI.types[0].type.name == 'grass'){
        pokemonTyping.className = 'grassType';
        pokemonTyping2.className = '';
        
    }

    if(asyncPokemonAPI.types[0].type.name == 'electric'){
        pokemonTyping.className = 'electricType';
        pokemonTyping2.className = '';
        
    }
    
    if(asyncPokemonAPI.types[0].type.name == 'ice'){
        pokemonTyping.className = 'iceType';
        pokemonTyping2.className = '';
      
    }
    
    if(asyncPokemonAPI.types[0].type.name == 'dark'){
        pokemonTyping.className = 'darkType';
        pokemonTyping2.className = '';
        
    }
    
    if(asyncPokemonAPI.types[0].type.name == 'psychic'){
        pokemonTyping.className = 'psychicType';
        pokemonTyping2.className = '';

    }
    
    if(asyncPokemonAPI.types[0].type.name == 'ghost'){
        pokemonTyping.className = 'ghostType';
        pokemonTyping2.className = '';
       
    }
    
    if(asyncPokemonAPI.types[0].type.name == 'steel'){
        pokemonTyping.className = 'steelType';
        pokemonTyping2.className = '';
       
    }
    
    if(asyncPokemonAPI.types[0].type.name == 'rock'){
        pokemonTyping.className = 'rockType';
        pokemonTyping2.className = '';
        
    }
    
    if(asyncPokemonAPI.types[0].type.name == 'ground' ){
        pokemonTyping.className = 'groundType';
        pokemonTyping2.className = '';
       
    }
    
    if(asyncPokemonAPI.types[0].type.name == 'dragon' ){
        pokemonTyping.className = 'dragonType';
        pokemonTyping2.className = '';
    
    }
    
    if(asyncPokemonAPI.types[0].type.name == 'fairy'){
        pokemonTyping.className = 'fairyType';
        pokemonTyping2.className = '';
       
    }
    
    if(asyncPokemonAPI.types[0].type.name == 'fighting' ){
        pokemonTyping.className = 'fightingType';
        pokemonTyping2.className = '';
        
    }
    
    if(asyncPokemonAPI.types[0].type.name == 'bug'){
        pokemonTyping.className = 'bugType';
        pokemonTyping2.className = '';
       
    }
    
    if(asyncPokemonAPI.types[0].type.name == 'flying'){
        pokemonTyping.className = 'flyingType';
        pokemonTyping2.className = '';
        
    }

        
    }else{
        pokemonTyping.textContent = asyncPokemonAPI.types[0].type.name.toUpperCase() + '/';
        pokemonTyping2.textContent = asyncPokemonAPI.types[1].type.name.toUpperCase();


        if(asyncPokemonAPI.types[0].type.name == 'poison'){
            pokemonTyping.className = 'poisonType';
            
    
            
        }
    
        if(asyncPokemonAPI.types[0].type.name == 'normal'){
            pokemonTyping.className = 'normalType';
           
            
        }
    
        if(asyncPokemonAPI.types[0].type.name == 'fire'){
            pokemonTyping.className = 'fireType';
          
        }
    
        if(asyncPokemonAPI.types[0].type.name == 'water'){
            pokemonTyping.className = 'waterType';
            
        }
    
        if(asyncPokemonAPI.types[0].type.name == 'grass'){
            pokemonTyping.className = 'grassType';
            
        }
    
        if(asyncPokemonAPI.types[0].type.name == 'electric'){
            pokemonTyping.className = 'electricType';
            
        }
        
        if(asyncPokemonAPI.types[0].type.name == 'ice'){
            pokemonTyping.className = 'iceType';
          
        }
        
        if(asyncPokemonAPI.types[0].type.name == 'dark'){
            pokemonTyping.className = 'darkType';
            
        }
        
        if(asyncPokemonAPI.types[0].type.name == 'psychic'){
            pokemonTyping.className = 'psychicType';
    
        }
        
        if(asyncPokemonAPI.types[0].type.name == 'ghost'){
            pokemonTyping.className = 'ghostType';
           
        }
        
        if(asyncPokemonAPI.types[0].type.name == 'steel'){
            pokemonTyping.className = 'steelType';
           
        }
        
        if(asyncPokemonAPI.types[0].type.name == 'rock'){
            pokemonTyping.className = 'rockType';
            
        }
        
        if(asyncPokemonAPI.types[0].type.name == 'ground' ){
            pokemonTyping.className = 'groundType';
           
        }
        
        if(asyncPokemonAPI.types[0].type.name == 'dragon' ){
            pokemonTyping.className = 'dragonType';
        
        }
        
        if(asyncPokemonAPI.types[0].type.name == 'fairy'){
            pokemonTyping.className = 'fairyType';
           
        }
        
        if(asyncPokemonAPI.types[0].type.name == 'fighting' ){
            pokemonTyping.className = 'fightingType';
            
        }
        
        if(asyncPokemonAPI.types[0].type.name == 'bug'){
            pokemonTyping.className = 'bugType';
           
        }
        
        if(asyncPokemonAPI.types[0].type.name == 'flying'){
            pokemonTyping.className = 'flyingType';
            
        }

        // Typing 2

        if(asyncPokemonAPI.types[1].type.name == 'poison'){
            pokemonTyping2.className = 'poisonType';
            
        }
    
        if(asyncPokemonAPI.types[1].type.name == 'normal'){
            pokemonTyping2.className = 'normalType';
           
            
        }
    
        if(asyncPokemonAPI.types[1].type.name == 'fire'){
            pokemonTyping2.className = 'fireType';
          
        }
    
        if(asyncPokemonAPI.types[1].type.name == 'water'){
            pokemonTyping2.className = 'waterType';
            
        }
    
        if(asyncPokemonAPI.types[1].type.name == 'grass'){
            pokemonTyping2.className = 'grassType';
            
        }
    
        if(asyncPokemonAPI.types[1].type.name == 'electric'){
            pokemonTyping2.className = 'electricType';
            
        }
        
        if(asyncPokemonAPI.types[1].type.name == 'ice'){
            pokemonTyping2.className = 'iceType';
          
        }
        
        if(asyncPokemonAPI.types[1].type.name == 'dark'){
            pokemonTyping2.className = 'darkType';
            
        }
        
        if(asyncPokemonAPI.types[1].type.name == 'psychic'){
            pokemonTyping2.className = 'psychicType';
    
        }
        
        if(asyncPokemonAPI.types[1].type.name == 'ghost'){
            pokemonTyping2.className = 'ghostType';
           
        }
        
        if(asyncPokemonAPI.types[1].type.name == 'steel'){
            pokemonTyping2.className = 'steelType';
           
        }
        
        if(asyncPokemonAPI.types[1].type.name == 'rock'){
            pokemonTyping2.className = 'rockType';
            
        }
        
        if(asyncPokemonAPI.types[1].type.name == 'ground' ){
            pokemonTyping2.className = 'groundType';
           
        }
        
        if(asyncPokemonAPI.types[1].type.name == 'dragon' ){
            pokemonTyping2.className = 'dragonType';
        
        }
        
        if(asyncPokemonAPI.types[1].type.name == 'fairy'){
            pokemonTyping2.className = 'fairyType';
           
        }
        
        if(asyncPokemonAPI.types[1].type.name == 'fighting' ){
            pokemonTyping2.className = 'fightingType';
            
        }
        
        if(asyncPokemonAPI.types[1].type.name == 'bug'){
            pokemonTyping2.className = 'bugType';
           
        }
        
        if(asyncPokemonAPI.types[1].type.name == 'flying'){
            pokemonTyping2.className = 'flyingType';
            
        }
    }



    


    //Sprites



    let img = document.createElement('img');
    let img2 = document.createElement('img');
    img.src = asyncPokemonAPI.sprites.front_default;
    img2.src = asyncPokemonAPI.sprites.front_shiny;
    img.style.width= '300px';
    img2.style.width = '300px';
    pokemonSpriteShinyShown.innerHTML = '';
    pokemonSpriteShown.innerHTML = '';
    pokemonSpriteShinyShown.appendChild(img2);
    pokemonSpriteShown.appendChild(img);
}else{
    
    over650.textContent = 'Please input a Pokemon before Generation 6';
    
    }

}

