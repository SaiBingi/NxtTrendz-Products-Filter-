import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    clickCategoryItem,
    clickRatingImage,
    activeCategoryId,
    activeRatingId,
    submitSearchTitle,
    changeTitleSearch,
    removeAllFilters,
    titleSearch,
  } = props

  let activeCategoryClassName
  let activeRatingClassName

  const onClickCategory = categoryId => {
    clickCategoryItem(categoryId)
  }

  const onClickRating = ratingId => {
    clickRatingImage(ratingId)
  }

  const onSubmitTitleSearch = event => {
    if (event.key === 'Enter') {
      submitSearchTitle(event.target.value)
    }
  }

  const onChangeTitleSearch = event => {
    changeTitleSearch(event.target.value)
  }

  const onClickClearFilters = () => {
    removeAllFilters()
  }

  return (
    <div className="filters-group-container">
      <div className="search-input-container">
        <input
          type="search"
          className="search-input"
          value={titleSearch}
          onKeyDown={onSubmitTitleSearch}
          onChange={onChangeTitleSearch}
          placeholder="Search"
        />
        <BsSearch className="search-icon" />
      </div>
      <h1 className="product-filter-heading">Category</h1>
      {categoryOptions.map(eachCategory => {
        if (eachCategory.categoryId === activeCategoryId) {
          activeCategoryClassName = 'active-category'
        } else {
          activeCategoryClassName = ''
        }

        return (
          <div>
            <p
              type="button"
              key={eachCategory.categoryId}
              className={`${activeCategoryClassName} each-category-button`}
              onClick={() => onClickCategory(eachCategory.categoryId)}
            >
              {eachCategory.name}
            </p>
          </div>
        )
      })}
      <h1 className="product-filter-heading">Rating</h1>
      {ratingsList.map(eachRating => {
        if (eachRating.ratingId === activeRatingId) {
          activeRatingClassName = 'active-rating'
        } else {
          activeRatingClassName = ''
        }

        return (
          <div>
            <button
              type="button"
              key={eachRating.ratingId}
              className="each-rating-button"
              onClick={() => onClickRating(eachRating.ratingId)}
            >
              <img
                src={eachRating.imageUrl}
                className="rating-image"
                alt={`rating ${eachRating.ratingId}`}
              />
              <p className={`${activeRatingClassName} rating-text`}>& up</p>
            </button>
          </div>
        )
      })}
      <button
        type="button"
        className="clear-filters-button"
        onClick={onClickClearFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
