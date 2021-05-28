import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import lifecycle from 'react-pure-lifecycle';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import {
  disableBodyScroll,
  enableBodyScroll,
  clearAllBodyScrollLocks
} from 'body-scroll-lock';
import { Router } from '../../routes';
import InfoSection from './InfoSection';
import CartSection from './CartSection';
import TabsSection from './TabsSection';
import {
  AddToCartModal,
  Configurations,
  Photos,
  Recommendations,
  Variants
} from '../../components';
import OverlayProgress from '../../components/progress/OverlayProgress';
import NotificationsContext from '../../lib/notificationsContext';
import {
  gtmProductLoad,
  gtmAddToCart,
  gtmSelectVariant,
  gtmSelectConfiguration
} from '../../src/gtm/product';
import { addCartItem } from '../../src/graphql/cart';
import SessionContext from '../../lib/sessionContext';
import SiteContext from '../../lib/siteContext';

import {
  arisProductInitiallySelectedItem,
  calculateVariantsPriceModification,
  calculateConfigurationsPriceModification,
  toAddedToCartModel
} from '../../src/helpers/products';

import {
  mapVariantsToCartOptions,
  mapConfigurationsToCartOptions
} from '../../src/helpers/cart';

const defaultSchoolCode = 'OCM';
const colorName = 'Color';
const fleeceColorName = 'Fleece Color';

const styles = theme => ({
  container: {
    // color not in palette
    backgroundColor: '#EDEDED',
    padding: theme.spacing.unit * 3
  },
  image: {
    width: 300
  },
  recommendationContainer: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  }
});

const getInitiallySelectedItems = arisProductInitiallySelectedItem;

const calculatePrice = (
  basePrice,
  variantsModification,
  configurationsModification
) => {
  return basePrice + variantsModification + configurationsModification;
};

const getCartItemId = (result, productId) => {
  if (
    result &&
    result.data &&
    result.data.addCartItem &&
    result.data.addCartItem.items &&
    result.data.addCartItem.items.length > 0
  ) {
    const cartItem = result.data.addCartItem.items.filter(
      element => element.productId === productId
    )[0];

    if (cartItem) return cartItem.id;
  }

  return null;
};

const getCartModalUpgrades = (result, productId) => {
  if (
    result &&
    result.data &&
    result.data.addCartItem &&
    result.data.addCartItem.items &&
    result.data.addCartItem.items.length > 0
  ) {
    let upgrades = [];
    result.data.addCartItem.items
      .filter(element => element.productId === productId)
      .forEach(element => {
        if (
          element &&
          element.configurations &&
          element.configurations.length > 0
        ) {
          upgrades = element.configurations;
        }
      });

    return upgrades;
  }

  return [];
};

const getCampusDelivery = (schoolCode, site, product) => {
  if (site && !site.isCampusDelivery) {
    return false;
  }

  if (!schoolCode || schoolCode === defaultSchoolCode) {
    return false;
  }

  if (
    site &&
    site.seasons &&
    site.seasons.length > 0 &&
    product &&
    product.season
  ) {
    let hasCampusDelivery = false;
    site.seasons
      .filter(element => element.isCurrent)
      .forEach(element => {
        if (element.seasonName === product.season) {
          hasCampusDelivery = true;
        }
      });
    if (hasCampusDelivery) return true;
  }

  if (product && product.isCampusShipping) return true;

  return false;
};

// create your lifecycle methods
const componentWillUnmount = () => {
  clearAllBodyScrollLocks();
};

// make them properties on a standard object
const methods = {
  componentWillUnmount
};

const Product = props => {
  const { classes, product, schoolCode, domain } = props;

  const [quantity, setQuantity] = useState(1);
  const [photos, setProductPhotos] = useState(product.images);
  const [selectedPhoto, setSelectedPhoto] = useState(photos[0]);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(null);
  const { showNotification } = useContext(NotificationsContext);
  const { sessionId, browserId } = useContext(SessionContext);
  const { site } = useContext(SiteContext);

  const updatePhotos = newPhotos => {
    setProductPhotos(newPhotos);
    setSelectedPhoto(newPhotos[0]);
  };

  const initiallySelectedVariants = getInitiallySelectedItems(
    product,
    'variants',
    [colorName, fleeceColorName]
  );
  const initiallySelectedConfigurations = getInitiallySelectedItems(
    product,
    'pdpConfigurations'
  );

  const [selectedVariants, setSelectedVariants] = useState(
    initiallySelectedVariants
  );

  const [selectedConfigurations, setSelectedConfigurations] = useState(
    initiallySelectedConfigurations
  );

  const [variantsPriceModification, setVariantsPriceModification] = useState(
    calculateVariantsPriceModification(initiallySelectedVariants)
  );

  const [
    configurationsPriceModification,
    setConfigurationsPriceModification
  ] = useState(
    calculateConfigurationsPriceModification(initiallySelectedConfigurations)
  );

  const handleVariantSelection = (variants, info) => {
    setSelectedVariants(variants);
    const modification = calculateVariantsPriceModification(variants);
    setVariantsPriceModification(modification);

    gtmSelectVariant({
      product,
      price: calculatePrice(
        product.priceBase,
        modification,
        configurationsPriceModification
      ),
      variantName: product.variants[info.index].name,
      variantValue: info.selected
    });
  };

  const handleConfigurationSelection = (configurations, info) => {
    setSelectedConfigurations(configurations);
    const modification = calculateConfigurationsPriceModification(
      configurations
    );
    setConfigurationsPriceModification(modification);

    gtmSelectConfiguration({
      product,
      price: calculatePrice(
        product.priceBase,
        variantsPriceModification,
        modification
      ),
      configurationName: product.configurations[info.index].name,
      configurationValue: info.selected
    });
  };

  const campusDelivery = getCampusDelivery(schoolCode, site, product);

  useEffect(() => {
    gtmProductLoad({
      product,
      price: calculatePrice(
        product.priceBase,
        variantsPriceModification,
        configurationsPriceModification
      ),
      schoolCode,
      selectedVariants,
      selectedConfigurations
    });
  }, []);

  const disableScroll = () => {
    const modal = document.getElementById('add-cart-card');
    if (modal) {
      document.body.style.overflow = 'unset';
      disableBodyScroll(modal);
    } else {
      setTimeout(disableScroll, 500);
    }
  };

  useEffect(() => {
    if (addedToCart) {
      setTimeout(disableScroll, 500);
    }
  }, [addedToCart]);

  const addToCart = async () => {
    // The # of variants should match the # of selected variants
    if (
      product.variants.length !==
      selectedVariants.filter(e => e !== null).length
    ) {
      return showNotification({
        type: 'school',
        message: 'Select your color to continue'
      });
    }

    if (!addToCartLoading) {
      setAddToCartLoading(true);

      const variantOptions = mapVariantsToCartOptions(
        selectedVariants,
        product
      );
      const configurationOptions = mapConfigurationsToCartOptions(
        selectedConfigurations
      );

      const options = [...variantOptions, ...configurationOptions];
      const variables = {
        sessionId,
        browserId,
        schoolcode: schoolCode,
        domain,
        cartItem: {
          cartId: 0,
          schoolCode,
          productId: product.id,
          quantity,
          options
        }
      };

      try {
        const result = await props.addCartItem({
          variables
        });

        gtmAddToCart({
          product,
          price: calculatePrice(
            product.priceBase,
            variantsPriceModification,
            configurationsPriceModification
          ),
          selectedVariants,
          selectedConfigurations,
          quantity
        });

        const cartItemId = getCartItemId(result, product.id);
        const upgrades = getCartModalUpgrades(result, product.id);

        setAddedToCart(
          toAddedToCartModel(
            product,
            selectedPhoto,
            quantity,
            cartItemId,
            upgrades
          )
        );
      } catch (err) {
        const message =
          'An error occured when adding product to cart. Please try again.';
        showNotification({
          type: 'error',
          message
        });

        console.error(err.message);
      }

      setAddToCartLoading(false);
    }
    return true;
  };

  const handleModalClose = () => {
    setAddedToCart(null);
    const modal = document.getElementById('add-cart-card');
    enableBodyScroll(modal);
  };

  return (
    <div>
      <div className={classes.container}>
        <Grid container spacing={24}>
          <Grid item sm={12} md={7} lg={5} xl={4}>
            <Hidden only="xs" implementation="css">
              <Photos
                photos={photos}
                selectedPhoto={selectedPhoto}
                onSetSelectedPhoto={setSelectedPhoto}
              />
            </Hidden>
          </Grid>

          <Grid item xs={12} md={5} lg={7} xl={8}>
            <InfoSection
              product={product}
              photos={photos}
              selectedPhoto={selectedPhoto}
              salePrice={calculatePrice(
                product.priceBase,
                variantsPriceModification,
                configurationsPriceModification
              )}
              initialPrice={calculatePrice(
                product.priceMSRP,
                variantsPriceModification,
                configurationsPriceModification
              )}
              onSetSelectedPhoto={setSelectedPhoto}
            />
            <Variants
              variants={product.variants}
              selectedVariants={selectedVariants}
              onSetSelectedVariants={handleVariantSelection}
              onSetProductPhotos={updatePhotos}
            />
            <CartSection
              campusDelivery={campusDelivery}
              giftOptions={
                product.hasSimpleGiftMessaging || product.hasCardGiftMessaging
              }
              onUpdateQuantity={setQuantity}
              onAddToCart={addToCart}
            />
          </Grid>
        </Grid>
      </div>
      {product &&
        product.configurations &&
        product.configurations.length > 0 && (
          <Configurations
            configurations={product.pdpConfigurations}
            selectedConfigurations={selectedConfigurations}
            onSetSelectedConfigurations={handleConfigurationSelection}
          />
        )}
      <TabsSection product={product} />
      <div className={classes.recommendationContainer}>
        <Recommendations
          schoolCode={schoolCode}
          gtmList="pdp"
          title="Other Items to consider..."
          id={product.id}
          type="CROSS_SELL"
          buttonOptions={{
            label: 'View Detail',
            action: item => {
              Router.push(
                `${schoolCode !== 'OCM' ? `/${schoolCode}` : ''}${
                  item.pdpUrl.includes('/product')
                    ? item.pdpUrl
                    : `/product${item.pdpUrl
                        .replace(/\/$/, '')
                        .substr(item.pdpUrl.lastIndexOf('/'))}`
                }`
              );
            }
          }}
        />
      </div>
      <AddToCartModal
        schoolCode={schoolCode}
        domain={domain}
        open={!!addedToCart}
        product={addedToCart ? addedToCart.product : null}
        cartId={addedToCart ? addedToCart.cartId : null}
        handleClose={handleModalClose}
        upgrades={addedToCart ? addedToCart.upgrades : []}
      />
      {addToCartLoading && <OverlayProgress />}
    </div>
  );
};

Product.propTypes = {
  classes: PropTypes.object.isRequired,
  product: PropTypes.object,
  schoolCode: PropTypes.string.isRequired,
  domain: PropTypes.string.isRequired
};

Product.defaultProps = {
  product: {}
};

export default compose(
  graphql(addCartItem, {
    name: 'addCartItem'
  }),
  withStyles(styles)
)(lifecycle(methods)(Product));
