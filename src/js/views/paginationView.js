import icons from 'url:../../img/icons.svg'; //Importing Icons
import { RES_PER_PAGE } from '../config.js';
import { View } from './view.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _curPage;
  _numOfPage;

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goto = +btn.dataset.goto;
      console.log(goto);
      handler(goto);
    });
  }

  _generateMarkup() {
    this._curPage = this._data.page;
    this._numOfPage = Math.ceil(this._data.results.length / RES_PER_PAGE);

    // Page 1 & other pages
    if (this._curPage === 1 && this._numOfPage > 1)
      return this._generateNextMarkup();

    // Last page
    if (this._curPage === this._numOfPage && this._numOfPage > 1)
      return this._generatePreviousMarkup();

    // Other pages
    if (this._curPage > 1)
      return `${this._generateNextMarkup()}${this._generatePreviousMarkup()}`;

    // Page 1 & no other pages
    return '';
  }

  _generatePreviousMarkup() {
    return `
    <button data-goto="${
      this._curPage - 1
    }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._curPage - 1}</span>
          </button>
    `;
  }
  _generateNextMarkup() {
    return `
    <button data-goto="${
      this._curPage + 1
    }" class="btn--inline pagination__btn--next">
            <span>Page ${this._curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
    `;
  }
}

export default new PaginationView();
