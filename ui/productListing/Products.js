import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Drawer from '@material-ui/core/Drawer';
import InfiniteScroll from 'react-infinite-scroll-component';
import Numeral from 'numeral';
import Head from 'next/head';

import { Router } from '../../routes';
import Breadcrumb from '../../components/widgets/Breadcrumb';
import ProductItem from './ProductItem';
import Filterbar from './Filterbar';
import FilterbarMobile from './FilterbarMobile';
import Sidebar from '../../components/widgets/Sidebar';
import ThankYouSignupModal from '../../components/forms/ThankYouSignupModal';

import { gtmProductClick, gtmSortBy } from '../../src/gtm/product';
import { queryNavigation } from '../../src/graphql/product-listing';

import { stringConvert } from '../../lib/product-listing';

const drawerWidth = 240;
const PRODUCTS_PER_PAGE = 25;

const styles = theme => ({
  layout: {
    paddingTop: theme.spacing.unit,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth + theme.spacing.unit * 5}px)`
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    marginRight: theme.spacing.unit * 5,
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  drawerContainer: {
    width: '100%'
  },
  paper: {
    width: '100%'
  },
  drawer: {
    width: '100%',
    padding: theme.spacing.unit
  },
  infiniteContainer: {
    display: 'block'
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    maxWidth: 1500,
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing.unit * 1.5
    }
  },
  infinite: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%'
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  pageInfoLabel: {
    fontSize: 18,
    color: theme.palette.common.grey[500],
    display: 'flex',
    alignItems: 'center'
  },
  arrowIcon: {
    fontSize: 24
  },
  facetContainer: {
    textAlign: 'center',
    padding: theme.spacing.unit / 2,
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'block'
    }
  },
  facetButton: {
    backgroundColor: '#e2e2e2',
    color: '#707070'
  }
});

class ProductListing extends React.Component {
  state = {
    mobileOpen: false,
    modalOpen: false,
    sidebarOpen: false,
    currentPage: 1
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  handleModal = flag => {
    this.setState({
      modalOpen: flag
    });
  };

  toggleDrawer = open => {
    this.setState({
      sidebarOpen: open
    });
  };

  handleSort = event => {
    const { handleSort, searchProducts } = this.props;
    let param;
    switch (event.target.value) {
      case 'relevance':
        param = 'Relevance';
        break;
      case 'price_ASC':
        param = 'Price - Low to High';
        break;
      case 'price_DESC':
        param = 'Price - High to Low';
        break;
      case 'rating_ASC':
        param = 'Customer Rating';
        break;
      case 'created_at_ASC':
        param = 'Newest';
        break;
      default:
        break;
    }
    gtmSortBy({
      param,
      numberOfResult: searchProducts.total
    });
    handleSort(event);
  };

  handleLoadMore = () => {
    const { loadMoreRows } = this.props;
    if (loadMoreRows) {
      const { currentPage } = this.state;
      loadMoreRows(currentPage + 1);
      this.setState({
        currentPage: currentPage + 1
      });
    }
  };

  renderPageStatus = () => {
    const { currentPage } = this.state;
    const { searchProducts, classes } = this.props;
    const total =
      searchProducts && searchProducts.total ? searchProducts.total : 0;

    return (
      <div className={classes.pageInfo}>
        <Typography className={classes.pageInfoLabel} variant="body1">
          <NavigateBeforeIcon className={classes.arrowIcon} />
          {` Page ${currentPage}/${Math.ceil(total / PRODUCTS_PER_PAGE)} `}
          <NavigateNextIcon className={classes.arrowIcon} />
        </Typography>
      </div>
    );
  };

  handleProductClick = (id, url) => {
    const { searchProducts, routeQuery } = this.props;
    const { currentPage } = this.state;

    const { edges: products } = searchProducts;
    const product = products.find(item => item.node.id === id);

    const listingPage = routeQuery.lineOfBusiness && routeQuery.category;
    const position = products.findIndex(item => item.node.id === id);

    if (listingPage) {
      const routeLineOfBusiness = stringConvert(routeQuery.lineOfBusiness);
      const routeCategory = stringConvert(routeQuery.category);
      const routeSubCategory = stringConvert(routeQuery.subCategory);

      gtmProductClick({
        id: product.node.id,
        name: product.node.source.title,
        brand: product.node.source.brand,
        price:
          product.node.source.sale_price +
          product.node.source.price_modifier_low,
        lineOfBusiness: routeLineOfBusiness,
        category: routeCategory,
        subCategory: routeSubCategory,
        position,
        pageNumber: currentPage,
        list: 'product listing page'
      });
    } else {
      let catInfo = product.node.source.categories;
      catInfo =
        catInfo && catInfo.length > 0
          ? catInfo[0].path.split('/')
          : ['', '', '', ''];
      gtmProductClick({
        id: product.node.id,
        name: product.node.source.title,
        brand: product.node.source.brand,
        price:
          product.node.source.sale_price +
          product.node.source.price_modifier_low,
        lineOfBusiness: catInfo[1],
        category: catInfo[2],
        subCategory: catInfo[3],
        position,
        pageNumber: currentPage,
        list: 'search page'
      });
    }

    return Router.pushRoute(url);
  };

  render() {
    const {
      classes,
      searchProducts,
      sort,
      filter,
      handleFilter,
      handleCategories,
      routeQuery,
      handleClear
    } = this.props;

    let products = [];
    let detailsProducts = [];
    let categories = [];
    let mobileCategories = [];
    let pageInfo;

    if (!routeQuery) return null;

    const listingPage = routeQuery.lineOfBusiness && routeQuery.category;

    const bcCategories = [];
    let routeLineOfBusiness;
    let routeCategory;
    let routeSubCategory;

    const categoryList = [
      'categories',
      'color_facet_colors',
      'size_labels',
      'price_ranges'
    ];

    const mobileCategoryList = [
      'categories',
      'color_facet_colors',
      'size_labels',
      'price_ranges'
    ];

    if (listingPage) {
      routeLineOfBusiness = routeQuery.lineOfBusiness;
      routeCategory = routeQuery.category;
      routeSubCategory = routeQuery.subCategory;
      if (!routeSubCategory.includes('shop-all')) {
        categoryList.shift();
        mobileCategoryList.shift();
      }
      routeLineOfBusiness = stringConvert(routeLineOfBusiness);
      routeCategory = stringConvert(routeCategory);
      routeSubCategory = stringConvert(routeSubCategory);

      bcCategories.push({
        title: routeLineOfBusiness
      });
      bcCategories.push({
        title: routeCategory,
        url: `${routeQuery.school ? `/${routeQuery.school}` : ''}/${
          routeQuery.lineOfBusiness
        }/${routeQuery.category}`
      });
      bcCategories.push({
        title: routeSubCategory
      });
    }

    if (searchProducts && !searchProducts.error) {
      products = searchProducts.edges;
      // const appliedCategories = this.props.categories;
      detailsProducts = products.map(product => {
        const newProduct = product;
        if (typeof product.node.source === 'string') {
          newProduct.node.source = JSON.parse(product.node.source);
        }

        return newProduct;
      });

      categories = searchProducts.aggs;
      categories = categories.filter(category => {
        let checkFlag = false;
        category.buckets.map(bucket => {
          if (bucket.docCount > 0) {
            checkFlag = true;
          }
          return checkFlag;
        });
        return checkFlag;
      });

      mobileCategories = categories.filter(category =>
        mobileCategoryList.includes(category.name)
      );
      categories = categories.filter(category =>
        categoryList.includes(category.name)
      );
      categories.sort(
        (a, b) => categoryList.indexOf(a.name) - categoryList.indexOf(b.name)
      );
      mobileCategories.sort(
        (a, b) =>
          mobileCategoryList.indexOf(a.name) -
          mobileCategoryList.indexOf(b.name)
      );
      pageInfo = searchProducts.pageInfo;

      if (!listingPage) {
        const totalCount = Numeral(searchProducts.total).format('0,0');
        bcCategories.push({
          title: `${totalCount} products found for "${routeQuery.q}"`
        });
      }
    }

    let seoCopy = '';
    let seoName = '';
    let seoKeywords = '';
    if (this.props.navigation && this.props.navigation.navigation) {
      const { lineOfBusiness, category, subCategory } = routeQuery;
      const school = routeQuery.school || 'OCM';
      let children = this.props.navigation.navigation.children || [];
      children = children.find(item => item.url === `/${lineOfBusiness}`);
      children =
        children && children.children
          ? children.children.find(
              item => item.url === `/${lineOfBusiness}/${category}`
            )
          : undefined;
      children =
        children && children.children
          ? children.children.find(
              item =>
                item.url === `/${lineOfBusiness}/${category}/${subCategory}`
            )
          : undefined;
      seoCopy =
        children && children.seoCopy
          ? children.seoCopy
              .replace(/@@School Name@@/g, school)
              .replace(/@@SchoolName@@/g, school)
          : '';
      seoKeywords =
        children && children.seoKeywords
          ? children.seoKeywords
              .replace(/@@School Name@@/g, school)
              .replace(/@@SchoolName@@/g, school)
          : '';
      seoName =
        children && children.seoName
          ? children.seoName
              .replace(/@@School Name@@/g, school)
              .replace(/@@SchoolName@@/g, school)
          : '';
    }

    const renderChild = (
      <Grid container>
        <div className={classes.drawerPaper} variant="permanent" open>
          <Sidebar
            categories={categories}
            handleCategories={handleCategories}
            selected={this.props.categories}
            handleClear={handleClear}
          />
        </div>
        <div className={classes.layout}>
          <ThankYouSignupModal
            open={this.state.modalOpen}
            handleModal={this.handleModal}
          />
          <Grid container className={classes.infiniteContainer}>
            <InfiniteScroll
              dataLength={products.length}
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
                  <Grid item xs={6} sm={6} md={4} lg={4} key={item.cursor}>
                    <div className={classes.item}>
                      <ProductItem
                        product={item}
                        queryString={routeQuery}
                        handleProductClick={this.handleProductClick}
                      />
                    </div>
                  </Grid>
                );
              })}
            </InfiniteScroll>
          </Grid>
        </div>
      </Grid>
    );

    let title = listingPage
      ? `${routeLineOfBusiness} ${routeCategory} ${routeSubCategory}`
      : 'Search';
    if (listingPage && seoName !== '') {
      title = seoName;
    }

    return (
      <div className={classes.content}>
        <Head>
          <title>{title}</title>
          <meta name="description" content={seoCopy} />
          <meta name="keywords" content={seoKeywords} />
        </Head>
        <Grid container>
          <Grid item xs={12}>
            <Drawer
              classes={{
                root: classes.drawerContainer,
                paper: classes.paper
              }}
              open={this.state.sidebarOpen}
              onClose={() => this.toggleDrawer(false)}
            >
              <div className={classes.drawer}>
                <Button onClick={() => this.toggleDrawer(false)} disableRipple>
                  Back
                </Button>
                <Sidebar
                  categories={mobileCategories}
                  handleCategories={handleCategories}
                  selected={this.props.categories}
                />
              </div>
            </Drawer>
            <div className={classes.topbar}>
              <Breadcrumb categories={bcCategories} handleClear={handleClear} />
            </div>
            <Filterbar
              category={routeSubCategory}
              sort={sort}
              filter={filter}
              handleSort={this.handleSort}
              handleFilter={handleFilter}
            />
            <FilterbarMobile
              sort={sort}
              filter={filter}
              handleSort={this.handleSort}
              handleFilter={handleFilter}
              toggleDrawer={this.toggleDrawer}
            />
          </Grid>
        </Grid>
        {renderChild}
      </div>
    );
  }
}

ProductListing.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  graphql(queryNavigation, {
    name: 'navigation',
    skip: props => {
      const { routeQuery } = props;
      return !(routeQuery.lineOfBusiness && routeQuery.category);
    },
    options: props => {
      const { routeQuery } = props;
      const school = routeQuery.school || 'ocm';
      return {
        variables: {
          schoolCode: school
        }
      };
    }
  }),
  withStyles(styles)
)(ProductListing);
