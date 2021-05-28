import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import Reviews from '../../components/widgets/Reviews';

const styles = theme => ({
  container: {
    padding: theme.spacing.unit * 3,
    maxWidth: 1100,
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});

const ReviewsTab = ({ classes, reviews, averageRating }) => {
  return (
    <div className={classes.container}>
      <Reviews reviews={reviews} averageRating={averageRating} />
    </div>
  );
};

ReviewsTab.propTypes = {
  classes: PropTypes.object.isRequired,
  reviews: PropTypes.array,
  averageRating: PropTypes.number
};

ReviewsTab.defaultProps = {
  reviews: [],
  averageRating: 0
};

export default withStyles(styles)(ReviewsTab);
