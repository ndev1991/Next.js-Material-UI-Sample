import React, { useEffect, useState } from 'react';
import { Query } from 'react-apollo';

import { searchProducts as SearchProductsGQL } from '../../src/graphql/product-listing';

import { Router } from '../../routes';
import Products from './Products';
import Progress from '../../components/progress/OverlayProgress';
import {
  gtmProductsImpression,
  gtmSearchProducts
} from '../../src/gtm/product';

import { stringConvert } from '../../lib/product-listing';

const PRODUCTS_PER_PAGE = 25;

const ProductListingWithData = pProps => {
  const [allProducts, setAllProducts] = useState(undefined);
  const [gtmSent, setGtmSent] = useState(false);
  const [searchTotal, setSearchTotal] = useState(0);

  const queryString = pProps.routeQuery;
  const listingPage = queryString.lineOfBusiness && queryString.category;

  useEffect(() => {
    if (allProducts) {
      if (allProducts.length > 0) {
        const isClient = typeof document !== 'undefined';
        if (!isClient) return;
        if (listingPage) {
          let { lineOfBusiness, category } = queryString;

          lineOfBusiness = stringConvert(lineOfBusiness);
          category = stringConvert(category);
          const subCategory = queryString.subCategory
            ? stringConvert(queryString.subCategory)
            : '';
          gtmProductsImpression({
            products: allProducts,
            lob: lineOfBusiness,
            cat: category,
            subcat: subCategory,
            list: 'product listing page',
            pageNumber: 1,
            productPerPage: PRODUCTS_PER_PAGE
          });
        } else {
          gtmProductsImpression({
            products: allProducts,
            lob: undefined,
            cat: undefined,
            subcat: undefined,
            list: 'search page',
            pageNumber: 1,
            productPerPage: PRODUCTS_PER_PAGE
          });
          gtmSearchProducts({
            query: queryString.q,
            numberOfResult: searchTotal
          });
        }
      }
      setGtmSent(true);
    }
  }, [allProducts]);

  const handleRedirect = redirectUrl => {
    Router.pushRoute(redirectUrl);
  };

  const after = pProps.endCursor || undefined;
  const orderByField = pProps.sort === 'relevance' ? undefined : 'price';
  let orderDirection;
  let orderBy;

  if (pProps.sort !== 'relevance') {
    orderDirection = pProps.sort === 'price_ASC' ? 'ASC' : 'DESC';
    orderBy = { field: orderByField, direction: orderDirection };
    if (pProps.sort === 'created_at_ASC') {
      orderBy = { field: 'created_at', direction: 'DESC' };
    } else if (pProps.sort === 'rating_ASC') {
      orderBy = { field: 'avg_rating', direction: 'DESC' };
    }
  } else if (listingPage) {
    orderBy = { field: 'categories.rank', direction: 'ASC' };
  }

  const categories = pProps.categories;
  let categoryString = [];
  let priceString = [];
  let colorString = [];
  let sizeString = [];
  let schoolCode;

  if (queryString && queryString.school) {
    schoolCode = queryString.school;
  }
  if (listingPage) {
    let { lineOfBusiness, category } = queryString;

    lineOfBusiness = stringConvert(lineOfBusiness);
    category = stringConvert(category);
    const subCategory = queryString.subCategory
      ? stringConvert(queryString.subCategory)
      : '';
    categoryString.push(
      `/${lineOfBusiness}/${category}/${subCategory}`
        .replace(/_/g, ' ')
        .replace(/-/g, ' ')
    );
  }

  if (categories.categories) {
    Object.keys(categories.categories).map(item =>
      categories.categories[item] ? categoryString.push(item) : null
    );
  }
  if (categoryString === []) categoryString = undefined;

  if (categories.price_ranges) {
    Object.keys(categories.price_ranges).map(item =>
      categories.price_ranges[item] ? priceString.push(item) : null
    );
  }
  if (priceString === []) priceString = undefined;

  if (categories.color_facet_colors) {
    Object.keys(categories.color_facet_colors).map(item =>
      categories.color_facet_colors[item] ? colorString.push(item) : null
    );
  }
  if (colorString === []) colorString = undefined;

  if (categories.size_labels) {
    Object.keys(categories.size_labels).map(item =>
      categories.size_labels[item] ? sizeString.push(item) : null
    );
  }
  if (sizeString === []) sizeString = undefined;

  return (
    <Query
      query={SearchProductsGQL}
      variables={{
        q: queryString && queryString.q ? queryString.q : '',
        school: schoolCode,
        fields:
          'id,brand,title,price,sale_price,price_modifier_low,avg_rating,images,url,url2,short_description,number_of_reviews,color,color_style_codes,color_facet_colors,categories',
        withAggs: true,
        orderBy,
        first: PRODUCTS_PER_PAGE,
        after,
        filter: pProps.filter,
        categories: categoryString,
        prices: priceString,
        colors: colorString,
        sizes: sizeString
      }}
    >
      {props => {
        if (props.loading) {
          return <Progress />;
        }
        if (!props || !props.data || !props.data.searchProducts.edges) {
          return null;
        }

        const { searchProducts } = props.data;

        let redirectToPDP = false;
        let redirectUrl;

        const gtmProductsImpressionEvent = (listing, page, products) => {
          const isClient = typeof document !== 'undefined';
          if (!isClient) return;
          if (listing) {
            let { lineOfBusiness, category } = queryString;

            lineOfBusiness = stringConvert(lineOfBusiness);
            category = stringConvert(category);
            const subCategory = queryString.subCategory
              ? stringConvert(queryString.subCategory)
              : '';
            gtmProductsImpression({
              products,
              lob: lineOfBusiness,
              cat: category,
              subcat: subCategory,
              list: 'product listing page',
              pageNumber: page,
              productPerPage: PRODUCTS_PER_PAGE
            });
          } else {
            gtmProductsImpression({
              products,
              lob: undefined,
              cat: undefined,
              subcat: undefined,
              list: 'search page',
              pageNumber: page,
              productPerPage: PRODUCTS_PER_PAGE
            });
          }
        };

        if (searchProducts && !searchProducts.error) {
          if (
            !gtmSent ||
            (searchProducts.edges !== allProducts &&
              searchProducts.edges.length <= PRODUCTS_PER_PAGE)
          ) {
            setSearchTotal(searchProducts.total);
            setAllProducts(searchProducts.edges);
          }

          if (searchProducts.total === 1 && listingPage) {
            const selectedCategories = pProps.categories;
            if (Object.keys(selectedCategories).length === 0) {
              searchProducts.edges.map(product => { // eslint-disable-line
                // eslint-disable-line
                const node = product.node;
                let productDetail = node.source;
                if (typeof product.node.source === 'string') {
                  productDetail = JSON.parse(node.source);
                }
                redirectToPDP = true;
                const url = productDetail.url2;
                redirectUrl = `${schoolCode ? `/${schoolCode}` : ''}${url}`;
              });
            }
          }
        }
        if (redirectToPDP) {
          const isClient = typeof document !== 'undefined';
          if (isClient) handleRedirect(redirectUrl);
          return <Progress />;
        }
        const loadMoreRows = currentPage => {
          return props.fetchMore({
            variables: {
              after: props.data.searchProducts.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.searchProducts.edges;
              gtmProductsImpressionEvent(listingPage, currentPage, newEdges);
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
            searchProducts={props.data.searchProducts}
            sort={pProps.sort}
            filter={pProps.filter}
            categories={pProps.categories}
            handleSort={pProps.handleSort}
            handleFilter={pProps.handleFilter}
            handleCategories={pProps.handleCategories}
            routeQuery={queryString}
            handleClear={pProps.handleClear}
            loadMoreRows={loadMoreRows}
          />
        );
      }}
    </Query>
  );
};

export default ProductListingWithData;
