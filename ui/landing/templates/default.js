import React from 'react';
import propTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Products from '../../category/Products';
import BoostedProduct from './BoostedProduct';
import { Router } from '../../../routes';
import { gtmProductClick } from '../../../src/gtm/product';

const styles = {
  root: {
    width: '100%'
  },
  noProducts: {
    padding: 20,
    textAlign: 'center',
    fontFamily: 'Rubik',
    fontSize: 32
  }
};
const handleProductClick = (product, schoolCode) => {
  gtmProductClick({
    id: product.id,
    name: product.source.title,
    brand: product.source.brand,
    price: product.source.sale_price + product.source.price_modifier_low,
    lineOfBusiness: product.lob,
    position: 1,
    pageNumber: 1,
    list: 'boosted item category landing page'
  });
  return Router.pushRoute(`/${schoolCode}${product.source.url}`);
};

const Default = ({ classes, items, boostOptions }) => {
  const transformedProducts = {
    edges:
      items &&
      items.map((i, k) => ({
        cursor: k,
        node: {
          id: i.id,
          source: {
            title: i.name,
            description: i.description,
            brand: i.vendorName,
            price: i.priceMSRP,
            sale_price: i.priceBase,
            price_modifier_low: i.priceModifierLow,
            number_of_reviews: i.reviewCount,
            avg_rating: i.averageRating,
            images: i.imageIds,
            url2: i.pdpUrl,
            url: i.canonicalUrl,
            // These are addons for BoostedProduct
            ...boostOptions
          }
        }
      }))
  };
  const boostedProduct =
    transformedProducts.edges && transformedProducts.edges.shift();

  return (
    <div className={classes.root}>
      {boostedProduct && (
        <BoostedProduct
          product={boostedProduct.node}
          handleProductClick={handleProductClick}
        />
      )}
      {transformedProducts.edges && transformedProducts.edges.length > 0 ? (
        <Products
          products={transformedProducts}
          routeQuery={`${items[0].lob}/ / `}
        />
      ) : (
        <div className={classes.noProducts}>
          No products set in this category
        </div>
      )}
    </div>
  );
};

Default.propTypes = {
  items: propTypes.array,
  boostOptions: propTypes.shape({
    actionText: propTypes.string
  })
};

Default.defaultProps = {
  items: [],
  boostOptions: {
    actionText: 'Shop Now'
  }
};

export default withStyles(styles)(Default);
