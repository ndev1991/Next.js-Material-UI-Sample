import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import PromoBar from '../../../components/widgets/PromoBar';
import HeroCarousel from '../../../components/widgets/HeroCarousel';
import FeaturedCollections from '../../../components/widgets/FeaturedCollections';

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 2,
    overflowX: 'hidden'
  },
  content: {
    color: theme.palette.primary.main
  }
});

const parsePromoBars = (promobars, group, className) =>
  promobars.map((pb, k) =>
    pb.image === '' || pb.group !== group ? null : (
      <PromoBar key={k} imgURL={pb.image} linkURL={pb.link}>
        <div
          className={className}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: pb.html }}
        />
      </PromoBar>
    )
  );

const Template1 = props => {
  const { classes, templateOptions } = props;
  // console.log(templateOptions);
  return (
    <Grid item container className={classes.container}>
      <Grid item xs={12}>
        {parsePromoBars(templateOptions.promoBars.promos, '1', classes.content)}
      </Grid>
      <Grid item xs={12}>
        <HeroCarousel {...templateOptions.heroCarousel} />
      </Grid>
      <Grid item xs={12}>
        {parsePromoBars(templateOptions.promoBars.promos, '2', classes.content)}
      </Grid>
      <Grid item xs={12}>
        <FeaturedCollections featuredItems={templateOptions.featuredItems} />
      </Grid>
    </Grid>
  );
};

Template1.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

Template1.defaultProps = {};

export default withStyles(styles, { withTheme: true })(Template1);
