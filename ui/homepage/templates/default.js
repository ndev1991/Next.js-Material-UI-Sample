import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import PromoBar from '../../../components/widgets/PromoBar';
import HeroCarousel from '../../../components/widgets/HeroCarousel';
import StaticImageList from '../../../components/widgets/StaticImageList';
import { Router } from '../../../routes';
import Recommendations from '../../../components/widgets/Recommendations';

const gtmList = 'homepage-default';

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    overflowX: 'hidden'
  },
  content: {
    color: theme.palette.primary.main
  },
  static: {
    paddingTop: 15,
    paddingBottom: 15
  },
  recommendations: {
    marginTop: theme.spacing.unit * 2
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

const DefaultHomepage = ({ classes, schoolCode, templateOptions }) => (
  <Grid item container className={classes.container}>
    <Grid item xs={12}>
      {parsePromoBars(templateOptions.promoBars.promos, '1', classes.content)}
    </Grid>
    <Grid item xs={12}>
      <HeroCarousel
        {...templateOptions.heroCarousel}
        wrapAround
        schoolCode={schoolCode}
        gtmList={gtmList}
        position={1}
      />
    </Grid>
    <Grid item container xs={12} alignItems="flex-start">
      <StaticImageList
        gtmList={gtmList}
        position={2}
        items={templateOptions.staticImages}
        schoolCode={schoolCode}
      />
    </Grid>
    <Grid item container xs={12} alignItems="center">
      <Recommendations
        search
        schoolCode={schoolCode}
        options={templateOptions.bestSellers}
        title="Shop Trending Products"
        gtmList={gtmList}
        searchTerm="default_hom3p4g3_sh0p_tr3nd1ng"
        className={classes.recommendations}
        buttonOptions={{
          label: 'Shop now',
          iconName: '',
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
    </Grid>
  </Grid>
);

DefaultHomepage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

DefaultHomepage.defaultProps = {};

export default withStyles(styles, { withTheme: true })(DefaultHomepage);
