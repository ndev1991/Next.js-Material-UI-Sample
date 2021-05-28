import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';

import { Photos, ProductStarRating as StarRating } from '../../../components';
import Title from '../../../components/typography/ItemTitle';
import Description from '../../../components/typography/ItemDescription';
import Price from '../../../components/widgets/Price';
import IncludesLink from './IncludesLink';

const descriptionTitle = 'Description';

const styles = theme => ({
  container: {
    marginBottom: theme.spacing.unit * 3
  },
  productStyle: {
    fontSize: 14,
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2
    }
  },
  mobilePriceContainer: {
    marginBottom: theme.spacing.unit * 3
  },
  mobileStarRatingContainer: {
    marginBottom: theme.spacing.unit
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 500,
    marginBottom: theme.spacing.unit * 2
  },
  divider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  gridHiddenXs: {
    [theme.breakpoints.only('xs')]: {
      padding: `0px !important`
    }
  }
});

const InfoSection = ({
  classes,
  theme,
  product,
  photos,
  salePrice,
  initialPrice,
  selectedPhoto,
  setSelectedPhoto
}) => (
  <div className={classes.container}>
    <Grid container spacing={24}>
      <Grid item xs={12} lg={7} xl={8}>
        <Title title={product.name} />
        <Hidden smUp implementation="css">
          {product && product.includedItems && <IncludesLink />}
          <div className={classes.mobilePriceContainer}>
            <Price
              salePrice={salePrice}
              initialPrice={initialPrice}
              freeShipping={product.isFreeShipping}
            />
          </div>
          {product && product.reviews && product.reviews.length > 0 && (
            <div className={classes.mobileStarRatingContainer}>
              <StarRating
                displayReviewCount
                displayRating
                reviewCount={product.reviewCount}
                count={5}
                value={product.averageRating}
                edit={false}
                size={24}
                color1={theme.palette.common.grey[100]}
                color2={theme.palette.common.grey[800]}
              />
            </div>
          )}
          <Photos
            photos={photos}
            selectedPhoto={selectedPhoto}
            onSetSelectedPhoto={setSelectedPhoto}
          />
        </Hidden>
        <Hidden only="xs" implementation="css">
          {product && product.includedItems && <IncludesLink />}
          {product && product.reviews && product.reviews.length > 0 && (
            <StarRating
              displayReviewCount
              displayRating
              reviewCount={product.reviewCount}
              count={5}
              value={product.averageRating}
              edit={false}
              size={24}
              color1={theme.palette.common.grey[100]}
              color2={theme.palette.primary.main}
            />
          )}
        </Hidden>
      </Grid>
      <Grid item sm={12} lg={5} xl={4} classes={{ item: classes.gridHiddenXs }}>
        <Hidden only="xs" implementation="css">
          <Price
            salePrice={salePrice}
            initialPrice={initialPrice}
            freeShipping={product.isFreeShipping}
          />
        </Hidden>
      </Grid>
    </Grid>
    <Divider variant="fullWidth" className={classes.divider} />
    <Hidden smUp implementation="css">
      <Typography
        className={classes.descriptionTitle}
        variant="h4"
        gutterBottom
      >
        {`${descriptionTitle}`}
      </Typography>
    </Hidden>
    <Description description={product.description} />
    <Divider variant="fullWidth" className={classes.divider} />
  </div>
);

InfoSection.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  product: PropTypes.object,
  salePrice: PropTypes.number.isRequired,
  initialPrice: PropTypes.number
};

InfoSection.defaultProps = {
  product: {}
};

export default withStyles(styles, { withTheme: true })(InfoSection);
