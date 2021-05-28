import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Query } from 'react-apollo';
import Breadcrumb from '../../components/widgets/Breadcrumb';
import MainCategory from './MainCategory';
import SubTabs from './SubTabs';
import Products from './Products';

import Progress from '../../components/progress/OverlayProgress';
import { gtmProductsImpression } from '../../src/gtm/product';

import { categoryProducts as categoryProductsGQL } from '../../src/graphql/product-listing';
import { stringConvert } from '../../lib/product-listing';

const PRODUCTS_PER_PAGE = 25;

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    maxWidth: 1500,
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing.unit * 1.5
    }
  }
});

const Category = ({ navigation, schoolCode, urlInfo, classes }) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [allProducts, setAllProducts] = useState(undefined);
  const [gtmSent, setGtmSent] = useState(false);

  const bcCategories = [];
  bcCategories.push({
    title: stringConvert(urlInfo.lineOfBusiness)
  });
  bcCategories.push({
    title: stringConvert(urlInfo.category)
  });

  let category =
    navigation && navigation.children && navigation.children.length > 0
      ? navigation.children[selectedCategory].url
      : '';
  category = category.split('/').map(item => stringConvert(item));
  category = category.join('/');

  useEffect(() => {
    if (allProducts) {
      if (allProducts.length > 0) {
        const isClient = typeof document !== 'undefined';
        if (!isClient) return;
        let { lineOfBusiness, category: CAT } = urlInfo;

        lineOfBusiness = stringConvert(lineOfBusiness);
        CAT = stringConvert(CAT);
        const subCategory =
          category.split('/').length > 0
            ? category.split('/')[category.split('/').length - 1]
            : '';
        gtmProductsImpression({
          products: allProducts,
          lob: lineOfBusiness,
          cat: CAT,
          subcat: subCategory,
          list: 'category page',
          pageNumber: 1,
          productPerPage: PRODUCTS_PER_PAGE
        });
      }
      setGtmSent(true);
    }
  }, [allProducts]);

  const handleCategory = (event, value) => {
    setSelectedCategory(value);
  };

  return (
    <div className={classes.root}>
      <Breadcrumb categories={bcCategories} />
      <MainCategory navigation={navigation} />
      <SubTabs
        value={selectedCategory}
        handleChange={handleCategory}
        tabs={navigation.children || []}
      />
      <Query
        query={categoryProductsGQL}
        variables={{
          q: '',
          school: schoolCode,
          fields:
            'id,brand,title,price,sale_price,price_modifier_low,avg_rating,images,url,url2,short_description,number_of_reviews,color,color_style_codes,color_facet_colors,categories',
          withAggs: false,
          categories: category,
          first: PRODUCTS_PER_PAGE,
          orderBy: {
            field: 'categories.rank',
            direction: 'ASC'
          }
        }}
      >
        {props => {
          if (props.loading) {
            return <Progress />;
          }
          if (!props || !props.data || !props.data.searchProducts.edges) {
            return null;
          }

          if (
            !gtmSent ||
            (props.data.searchProducts.edges !== allProducts &&
              props.data.searchProducts.edges.length <= PRODUCTS_PER_PAGE)
          ) {
            setAllProducts(props.data.searchProducts.edges);
          }

          const loadMoreRows = currentPage => {
            return props.fetchMore({
              variables: {
                after: props.data.searchProducts.pageInfo.endCursor
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                const newEdges = fetchMoreResult.searchProducts.edges;

                const isClient = typeof document !== 'undefined';
                if (isClient) {
                  let { lineOfBusiness, category: CAT } = urlInfo;

                  lineOfBusiness = stringConvert(lineOfBusiness);
                  CAT = stringConvert(CAT);
                  const subCategory =
                    category.split('/').length > 0
                      ? category.split('/')[category.split('/').length - 1]
                      : '';
                  gtmProductsImpression({
                    products: newEdges,
                    lob: lineOfBusiness,
                    cat: CAT,
                    subcat: subCategory,
                    list: 'category page',
                    pageNumber: currentPage,
                    productPerPage: PRODUCTS_PER_PAGE
                  });
                }

                return {
                  // By returning `cursor` here, we update the `loadMore` function
                  // to the new cursor.
                  searchProducts: {
                    ...fetchMoreResult.searchProducts,
                    edges: [...previousResult.searchProducts.edges, ...newEdges]
                  }
                };
              }
            });
          };
          return (
            <Products
              products={props.data.searchProducts}
              fetchMore={loadMoreRows}
              updateQuery={props.updateQuery}
              routeQuery={category}
            />
          );
        }}
      </Query>
    </div>
  );
};

export default withStyles(styles)(Category);
