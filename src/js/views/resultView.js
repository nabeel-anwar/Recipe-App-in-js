import previewView from './previewView.js';
import { View } from './view.js';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `No recipe found. Please try another one :)`;
  _message = ``;

  _generateMarkup() {
    console.log(this._data);
    return this._data
      .map(bookmark => previewView._generateMarkup(bookmark))
      .join('');
  }
}

export default new ResultView();
