import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODEL_CLS_PER_SEC } from './config.js';

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1); //Getting id from URL
    if (!id) return;

    // 0) Update selected search result recipe
    resultView.update(model.getSearchResultPage());

    bookmarkView.update(model.state.bookmarks); // Update the bookmark

    // 1) Loading Spinner
    recipeView.renderSpinner();

    // 2) Load Data form api
    await model.loadRecipe(id);
    console.log(model.state.recipe);

    // 3) Render Recipe on Container
    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // Load Spinner
    resultView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2) Load search results
    await model.loadSearchResult(query);

    // 2) Render results
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultPage());

    paginationView.render(model.state.search);
  } catch (error) {
    resultView.renderError();
  }
};

const controlPagination = function (goto) {
  resultView.render(model.getSearchResultPage(goto));

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/Del bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update bookmarks button
  recipeView.update(model.state.recipe);

  // 3) Add bookmark to bookmark list
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlUpload = async function (recipe) {
  try {
    // Render Spinner
    addRecipeView.renderSpinner();

    // 1) Uploading the recipe
    await model.uploadRecipe(recipe);
    console.log(model.state.recipe);

    // 2) Render the Recipe
    recipeView.render(model.state.recipe);

    // 3) Render Success Message
    addRecipeView.renderMessage();

    // 4) Render Bookmark
    bookmarkView.render(model.state.bookmarks);

    // 5) Update Url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // 6) Close Form After Seconds
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODEL_CLS_PER_SEC * 1000);
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlUpload);
};
init();
