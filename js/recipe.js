// dom elem
// list section
const recipeListElem = document.querySelector(".recipe-list");
const recipeModal = document.querySelector("#recipeModal");

// selector section
const prepTimeSelector = document.querySelector('#prep-time-selector')
const prepSelectField = prepTimeSelector.querySelector('#prepSelectField')
const prepSelectFieldtExt = prepTimeSelector.querySelector('#prepSelectField p')
const prepOptionList = prepTimeSelector.querySelector('.prep-option-list')
const prepOption = prepTimeSelector.querySelectorAll('.prep-option')

const cookTimeSelector = document.querySelector('#cook-time-selector')
const cookSelectField = cookTimeSelector.querySelector('#cookSelectField')
const cookSelectFieldtExt = cookTimeSelector.querySelector('#cookSelectField p')
const cookOptionList = cookTimeSelector.querySelector('.cook-option-list')
const cookOption = cookTimeSelector.querySelectorAll('.cook-option')

// search section
const recipeSearchInput = document.querySelector(".recipe-search-input");
// const cookTimeSelect = document.querySelector('#cook-time')

// modal section
const recipeModalImg = recipeModal.querySelector(".recipeModal-img img");
const recipeModalTitle = recipeModal.querySelector(".recipeModal-title");
const recipeModalType = recipeModal.querySelector(".recipeModal-type");
const recipeModalServing = recipeModal.querySelector(".serving");
const recipeModalPreptime = recipeModal.querySelector(".prep-time");
const recipeModalCooktime = recipeModal.querySelector(".cook-time");
const recipeIngredients = recipeModal.querySelector(".recipe-ingredients ul");
const recipeInstruction = recipeModal.querySelector(".recipe-instruction ol");
const closeModalBtn = recipeModal.querySelector(".close-modal");



// data array
let recipeList = [];

// api call to get data
async function getRecipe() {
  try {
    // Await the API call
    const response = await fetch("https://dummyjson.com/recipes");

    // Check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse JSON
    const data = await response.json();

    // Use the data
    recipeList = [...data.recipes] || [];
    loadRecipeList(recipeList);
  } catch (error) {
    // Handle errors
    console.error("Error fetching meals:", error);
  }
}

getRecipe();

// function to display recipes list
function loadRecipeList(list) {
  const recipes = list.recipes || list;
  
  // empty list
  recipeListElem.innerHTML = "";

  // check for undefined or empt list
  if(!recipes || recipes.length === 0){
    recipeListElem.innerHTML = `
    <div class='error-msg'>
    <h2>No recipes found .</h2>

      <p>Try searching with different keywords or check popular recipes below.</p>
          </div>
    `;
    return;

  }

  recipes.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("recipe-card", "flex");
    // or div.className = 'recipe-card flex';

    div.innerHTML = `
        <div class="recipe-img">
            <img src=${item.image} alt="">
        </div>
        <h4 class="recipe-title">${item.name}</h4>
                <p class="recipe-type">Meal Type: ${item.mealType}</p>
                <p class="serving"><i class="fa-solid fa-circle-user"></i> Serving: ${item.servings}</p>
                <div class="time">
                    <p class="prep-time"><i class="fa-solid fa-alarm-clock"></i> Prep time: ${item.prepTimeMinutes}min</p>
                    <p class="cook-time"><i class="fa-solid fa-utensils"></i> Cook time: ${item.cookTimeMinutes}min</p>
                </div>
        <button onclick='viewRecipe(${item.id})' class="view-recipe">view recipe</button>
        `;
    recipeListElem.appendChild(div);
  });
}

// view recipe modal on btn click
async function viewRecipe(recipeID) {
  recipeModal.showModal();
  const recipeData = await getSingleRecipe(recipeID);

  recipeModalImg.src = recipeData.image;
  recipeModalTitle.innerHTML = recipeData.name;
  recipeModalType.innerHTML = recipeData.mealType;
  recipeModalServing.innerHTML = `Serving: ${recipeData.servings}`;

  // empty instruction and ingredient list
  recipeIngredients.innerHTML = "";
  recipeInstruction.innerHTML = "";

  recipeData.ingredients.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = item;
    recipeIngredients.appendChild(li);
  });

  recipeData.instructions.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = item;
    recipeInstruction.appendChild(li);
  });
}

async function getSingleRecipe(recipeID) {
  // fetch data
  try {
    // Await the API call
    const response = await fetch(`https://dummyjson.com/recipes/${recipeID}`);

    // Check if response is OK
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse JSON
    const data = await response.json();

    // Use the data
    return data;
  } catch (error) {
    // Handle errors
    console.error("Error fetching meals:", error);
  }
}

// close modal
closeModalBtn.addEventListener("click", function () {
  recipeModal.close();
});

// search any recipe
recipeSearchInput.addEventListener("input", function (e) {
  debounceSearch(e.target.value).then((data) => {
    // show in ui
    loadRecipeList(data);
  });
});

const debounceSearch = debounce(searchRecipes);

// debounce function
function debounce(fn, delay = 500) {
  let timer; //store timeout id
  let reslovePromise; // store sesolver

  return function (...args) {
    // clear prev timer if fn called again
    clearTimeout(timer);

    //must return a promse as searchrcipe returnig a promise
    return new Promise((resolve) => {
      //reslovePromise = resolve;

      // schedule new execution
      timer = setTimeout(() => {
        const result = fn.apply(this, args);// this fn return a promise
        resolve(result || []);
      }, delay);
    });
  };
}

function searchRecipes(query) {
  // step1 - filter in existing data
  const result = recipeList.filter((recipe) =>
    recipe.name.toLowerCase().includes(query.toLowerCase()) ||
    recipe.ingredients.some(ingredient =>
    ingredient.toLowerCase().includes(query.toLowerCase())
  )

  );

  // step2 - if no local result, then hit api for fresh data
  if (result.length > 0) {
    return Promise.resolve(result);
  } else {
    return fetch(`https://dummyjson.com/recipes/search?q=${query}`).then(
      (res) => res.json(),
    );
  }
}





// // sort time function
function sortTime(value){
  // value
  const prepTime = Number(value);

  // filter array, if prep time is equal and less than
  const filteredData = recipeList.filter((item) => 
    item.cookTimeMinutes <= prepTime 
  )

  loadRecipeList(filteredData)
}





// select prep time
prepSelectField.addEventListener('click', function(){
  console.log('ok')
  prepOptionList.classList.toggle('hidden')
});


for(option of prepOption){
  option.onclick = function(){
    prepSelectFieldtExt.innerHTML = this.textContent;
    prepOptionList.classList.add('hidden')
    // sort function
    sortTime(this.value)
  }
}

cookSelectField.addEventListener('click', function(){
  cookOptionList.classList.toggle('hidden')
})

for(option of cookOption){
  option.onclick = function(){
    cookSelectFieldtExt.innerHTML = this.textContent;
    cookOptionList.classList.add('hidden')
    // sort function
    sortTime(this.value)
  }
}


// close selector if user click outside
document.addEventListener('click', function(e){
  if(!prepTimeSelector.contains(e.target)){
    prepOptionList.classList.add('hidden')
  }

  if(!cookTimeSelector.contains(e.target)){
    cookOptionList.classList.add('hidden')
  }
})