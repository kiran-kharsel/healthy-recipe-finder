// data array
let recipeList = [];

const recipeListElem = document.querySelector('.recipe-list')
const recipeModal = document.querySelector('#recipeModal')
console.log(recipeModal)

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
    recipeList = [...data.recipes]
    loadRecipeList(recipeList)

  } catch (error) {
    // Handle errors
    console.error("Error fetching meals:", error);
  }
}

getRecipe();


// function to display recipes list
function loadRecipeList(list){
    console.log(list)
    list.forEach((item) => {
        const div = document.createElement('div')
        div.classList.add('recipe-card', 'flex')
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
        <button onclick='viewRecipe()' class="view-recipe">view recipe</button>
        `;
        recipeListElem.appendChild(div)

    });
}



// view recipe on btn click
function viewRecipe(){
  console.log('view recipe')
  recipeModal.showModal()
}