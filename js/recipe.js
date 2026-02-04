// data array
let recipeList = [];

// list section
const recipeListElem = document.querySelector(".recipe-list");
const recipeModal = document.querySelector("#recipeModal");

// filter section
const recipeSearchInput = document.querySelector(".recipe-search-input");
const prepTimeSelect = document.querySelector('#prep-time')
const cookTimeSelect = document.querySelector('#cook-time')
console.log(cookTimeSelect)

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
    recipeList = [...data.recipes];
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
    <div>
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
    console.log(data);
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



// select prep time
prepTimeSelect.addEventListener('change', function(e){
  console.log(e.target.value)
  // value
  const prepTime = Number(e.target.value);
  console.log(typeof prepTime)

  // filter array, if prep time is equal and less than
  const filteredData = recipeList.filter((item) => 
      item.prepTimeMinutes <= prepTime 
  )

  console.log(filteredData)
  loadRecipeList(filteredData)
})

cookTimeSelect.addEventListener('change', function(e){
  console.log(e.target.value)
  // value
  const prepTime = Number(e.target.value);
  console.log(typeof prepTime)

  // filter array, if prep time is equal and less than
  const filteredData = recipeList.filter((item) => 
      item.cookTimeMinutes <= prepTime 
  )

  console.log(filteredData)
  loadRecipeList(filteredData)
})