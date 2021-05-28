import { Fragment, useState, useEffect } from 'react';
import { Button, Grid, Typography, withStyles } from '@material-ui/core';
import {
  Configurations,
  ItemTitle,
  Photos,
  Variants
} from '../../../../../components';
import {
  arisProductInitiallySelectedItem,
  calculateVariantsPriceModification,
  calculateConfigurationsPriceModification
} from '../../../../../src/helpers/products';

const styles = theme => ({
  noThanksButton: {
    color: theme.palette.primary.default,
    marginRight: `${theme.spacing.unit * 2}px`,
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: 600,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.5}px`,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  confirmButton: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: 600,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.5}px`,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  itemDescription: {
    fontFamily: 'Rubik',
    whiteSpace: 'pre-line',
    fontSize: '14px',
    marginBottom: `-${theme.spacing.unit * 2}px`
  }
});

const StepFourComponent = ({
  classes,
  product,
  handleNext,
  handleSelected
}) => {
  const initiallySelectedVariants = arisProductInitiallySelectedItem(
    product,
    'variants'
  );

  const initiallySelectedConfigurations = arisProductInitiallySelectedItem(
    product,
    'configurations'
  );

  const configurationsPriceModification = calculateConfigurationsPriceModification(
    initiallySelectedConfigurations
  );
  const variantsPriceModification = calculateVariantsPriceModification(
    initiallySelectedVariants
  );

  const finalPrice =
    product.priceBase +
    variantsPriceModification +
    configurationsPriceModification;

  const [selectedVariants, setSelectedVariants] = useState(
    initiallySelectedVariants
  );

  const [photos, setProductPhotos] = useState([
    initiallySelectedVariants[0].images.length > 0
      ? initiallySelectedVariants[0].images
      : product.images
  ]);
  const [selectedPhoto, setSelectedPhoto] = useState(photos[0]);

  const [selectedConfigurations, setSelectedConfigurations] = useState(
    initiallySelectedConfigurations
  );

  useEffect(() => {
    handleSelected({
      variants: selectedVariants,
      configurations: selectedConfigurations
    });
  }, []);

  const updatePhotos = newPhotos => {
    setProductPhotos(newPhotos);
    setSelectedPhoto(newPhotos[0]);
  };

  const handleVariantSelection = variants => {
    setSelectedVariants(variants);
    handleSelected({
      variants,
      configurations: selectedConfigurations
    });
  };

  const handleConfigurationSelection = configurations => {
    setSelectedConfigurations(configurations);
    handleSelected({
      variants: selectedVariants,
      configurations
    });
  };

  const handleSelection = () => handleNext(false);

  return (
    <Fragment>
      <Grid container spacing={0}>
        <Grid item sm={4} xs={12}>
          <Photos
            photos={photos}
            selectedPhoto={selectedPhoto}
            onSetSelectedPhoto={setSelectedPhoto}
          />
        </Grid>
        <Grid item sm={8} xs={12}>
          <ItemTitle title={`THE BEST TRUNK ON CAMPUS: $${finalPrice}`} />
          <Typography className={classes.itemDescription} variant="body1">
            {product.description}
          </Typography>
          {selectedVariants && selectedVariants.length > 0 && (
            <Variants
              variants={product.variants}
              selectedVariants={selectedVariants}
              onSetSelectedVariants={handleVariantSelection}
              onSetProductPhotos={updatePhotos}
              display="no-carousel"
            />
          )}
          {product &&
            product.configurations &&
            product.configurations.length > 0 && (
              <Configurations
                configurations={product.configurations}
                selectedConfigurations={selectedConfigurations}
                onSetSelectedConfigurations={handleConfigurationSelection}
                display="dropdown"
              />
            )}
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        justify="flex-end"
        alignContent="center"
        item
        xs={12}
      >
        <Button
          className={classes.noThanksButton}
          onClick={() => handleNext(true)}
          disableTouchRipple
        >
          NO, THANKS
        </Button>
        <Button
          variant="contained"
          className={classes.confirmButton}
          onClick={handleSelection}
          disableTouchRipple
        >
          PACK IT!
        </Button>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(StepFourComponent);
