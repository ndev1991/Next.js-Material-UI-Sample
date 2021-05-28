import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { Router } from '../../routes';
import { gtmProductClick } from '../../src/gtm/product';
import ProductItem from '../productListing/ProductItem';
import { stringConvert } from '../../lib/product-listing';

const styles = () => ({
  root: {},
  infinite: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%'
  }
});

class Products extends React.Component {
  state = {
    currentPage: 1
  };

  handleLoadMore = () => {
    const { fetchMore } = this.props;
    const { currentPage } = this.state;
    fetchMore(currentPage + 1);
    this.setState({
      currentPage: currentPage + 1
    });
  };

  handleProductClick = (id, url) => {
    const { products } = this.props;
    let { routeQuery } = this.props;
    const { currentPage } = this.state;

    const { edges } = products;
    const product = edges.find(item => item.node.id === id);

    const position = edges.findIndex(item => item.node.id === id);

    routeQuery = routeQuery.split('/');
    const routeLineOfBusiness = stringConvert(routeQuery[0]);
    const routeCategory = stringConvert(routeQuery[1]);
    const routeSubCategory = stringConvert(routeQuery[2]);

    gtmProductClick({
      id: product.node.id,
      name: product.node.source.title,
      brand: product.node.source.brand,
      price:
        product.node.source.sale_price + product.node.source.price_modifier_low,
      lineOfBusiness: routeLineOfBusiness,
      category: routeCategory,
      subCategory: routeSubCategory,
      position,
      pageNumber: currentPage,
      list: 'category landing page'
    });

    return Router.pushRoute(url);
  };

  render() {
    const { classes, products } = this.props;
    const { edges, pageInfo } = products;

    const detailsProducts = edges.map(product => {
      const newProduct = product;
      if (typeof product.node.source === 'string') {
        newProduct.node.source = JSON.parse(product.node.source);
      }
      return newProduct;
    });
    return (
      <div className={classes.root}>
        <InfiniteScroll
          dataLength={edges.length}
          next={this.handleLoadMore}
          hasMore={
            pageInfo && pageInfo.hasNextPage ? pageInfo.hasNextPage : null
          }
          loader=""
          endMessage=""
          className={classes.infinite}
        >
          {detailsProducts.map(item => {
            return (
              <Grid item xs={6} sm={6} md={4} lg={3} key={item.cursor}>
                <div className={classes.item}>
                  <ProductItem
                    product={item}
                    handleProductClick={this.handleProductClick}
                  />
                </div>
              </Grid>
            );
          })}
        </InfiniteScroll>
      </div>
    );
  }
}

export default withStyles(styles)(Products);
