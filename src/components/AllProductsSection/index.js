import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiStatus: apiStatusConstants.initial,
    activeOptionId: sortbyOptions[0].optionId,
    titleSearch: '',
    activeCategoryId: '',
    activeRatingId: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  clickCategoryItem = activeCategoryId =>
    this.setState({activeCategoryId}, this.getProducts)

  clickRatingImage = activeRatingId =>
    this.setState({activeRatingId}, this.getProducts)

  submitSearchTitle = () => this.getProducts()

  removeAllFilters = () =>
    this.setState(
      {
        activeOptionId: sortbyOptions[0].optionId,
        titleSearch: '',
        activeCategoryId: '',
        activeRatingId: '',
      },
      this.getProducts,
    )

  changeTitleSearch = titleSearch => this.setState({titleSearch})

  getProducts = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const {titleSearch, activeCategoryId, activeRatingId} = this.state

    const {activeOptionId} = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${titleSearch}&rating=${activeRatingId}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      //   console.log(response)
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsListView = () => {
    const {productsList, activeOptionId} = this.state

    if (productsList.length === 0) {
      return (
        <div className="failure-view-or-no-products-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
            alt="no products"
            className="no-products-image-or-failure-image"
          />
          <h1 className="no-products-or-failure-heading">No Products Found</h1>
          <p className="no-products-or-failure-description">
            We could not find any products. Try other filters.
          </p>
        </div>
      )
    }

    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-or-no-products-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="no-products-image-or-failure-image"
      />
      <h1 className="no-products-or-failure-heading">
        Oops! Something Went Wrong
      </h1>
      <p className="no-products-or-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderAllProducts = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsListView()

      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    const {activeCategoryId, activeRatingId, titleSearch} = this.state

    return (
      <div className="all-products-section">
        <FiltersGroup
          ratingsList={ratingsList}
          categoryOptions={categoryOptions}
          clickCategoryItem={this.clickCategoryItem}
          clickRatingImage={this.clickRatingImage}
          activeCategoryId={activeCategoryId}
          activeRatingId={activeRatingId}
          titleSearch={titleSearch}
          submitSearchTitle={this.submitSearchTitle}
          changeTitleSearch={this.changeTitleSearch}
          removeAllFilters={this.removeAllFilters}
        />

        {this.renderAllProducts()}
      </div>
    )
  }
}

export default AllProductsSection
