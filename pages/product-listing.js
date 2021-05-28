import React from 'react';

import { Page } from '../components';
import ProductListingWithProducts from '../ui/productListing';

class ProductListingPage extends React.Component {
  state = {
    sort: 'relevance',
    filter: '*-5.0',
    categories: {}
  };

  static async getInitialProps({ query }) {
    return {
      query
    };
  }

  componentWillReceiveProps(props) {
    if (this.props.query !== props.query) {
      this.handleCategories({});
    }
  }

  handleSort = event => {
    this.setState({
      sort: event.target.value
    });
  };

  handleFilter = event => {
    this.setState({
      filter: event.target.value
    });
  };

  handleCategories = categories => {
    this.setState({
      categories
    });
    window.scrollTo(0, 0);
  };

  handleClear = () => {
    this.setState({
      categories: {}
    });
  };

  render() {
    const { sort, filter, categories } = this.state;
    return (
      <Page>
        <ProductListingWithProducts
          sort={sort}
          filter={filter}
          categories={categories}
          handleSort={this.handleSort}
          handleFilter={this.handleFilter}
          handleCategories={this.handleCategories}
          routeQuery={this.props.query}
          handleClear={this.handleClear}
        />
      </Page>
    );
  }
}

export default ProductListingPage;
