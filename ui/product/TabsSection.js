import React, { Fragment, useState } from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

import IncludesTab from '../../components/widgets/IncludesTab';
import ReviewsTab from './ReviewsTab';
import Tabs from '../../components/tabs/Tabs';
import Tab from '../../components/tabs/Tab';

const includesLabel = 'Includes';
const reviewsPluralLabel = 'Reviews';
const reviewsSingularLabel = 'Review';

const styles = () => ({
  tabContent: {
    minHeight: 240
  }
});

const getReviewsLabel = reviews => {
  if (!reviews || (reviews && reviews.length === 0)) return reviewsPluralLabel;

  if (reviews.length === 1) return `1 ${reviewsSingularLabel}`;

  return `${reviews.length} ${reviewsPluralLabel}`;
};

const TabsSection = ({ classes, product }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  function handleTabChange(_, value) {
    setSelectedTab(value);
  }

  return (
    <Fragment>
      <Tabs value={selectedTab} centered onChange={handleTabChange}>
        {product && product.includedItems && <Tab label={includesLabel} />}
        <Tab label={getReviewsLabel(product.reviews)} />
      </Tabs>
      <div className={classes.tabContent} id="tab-content">
        {product && product.includedItems && selectedTab === 0 && (
          <IncludesTab product={product} />
        )}
        {((product.includedItems && selectedTab === 1) ||
          (!product.includedItems && selectedTab === 0)) && (
          <ReviewsTab
            reviews={product.reviews}
            averageRating={product.averageRating}
          />
        )}
      </div>
    </Fragment>
  );
};

TabsSection.propTypes = {
  classes: PropTypes.object.isRequired,
  product: PropTypes.object
};

TabsSection.defaultProps = {
  product: {}
};

export default withStyles(styles)(TabsSection);
