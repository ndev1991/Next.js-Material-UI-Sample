import React, { Fragment, useContext } from 'react';
import { Divider, Hidden, withStyles } from '@material-ui/core';
import SchoolContext from '../../../lib/schoolContext';
import Desktop from './Desktop';
import Mobile from './Mobile';

const style = theme => ({
  footer: {
    padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit / 2}px
    ${theme.spacing.unit * 3}px ${theme.spacing.unit / 2}px`,
    [theme.breakpoints.up(1440)]: {
      paddingLeft: theme.spacing.unit * 14,
      paddingRight: theme.spacing.unit * 14
    }
  },
  divider: {
    margin: `${theme.spacing.unit * 4}px 0px`
  }
});

export default withStyles(style)(({ classes, navOptions }) => {
  if (!navOptions) return '';
  const schoolCode = useContext(SchoolContext);

  const processedNavOptions = navOptions.children.map(nav => ({
    ...nav,
    id: nav.name.toLowerCase().replace(' ', ''),
    children: nav.children.map(child => ({
      ...child,
      url:
        schoolCode.toLowerCase() !== 'ocm'
          ? `${schoolCode}/${child.url}`
          : child.url,
      name: child.name.replace('&amp;', '&')
    })),
    url:
      schoolCode.toLowerCase() !== 'ocm' ? `${schoolCode}/${nav.url}` : nav.url
  }));

  return (
    <Fragment>
      <footer className={classes.footer}>
        <Divider />
        <Hidden smDown implementation="css">
          <Desktop navOptions={processedNavOptions} />
        </Hidden>
        <Hidden mdUp implementation="css">
          <Mobile navOptions={processedNavOptions} />
        </Hidden>
      </footer>
    </Fragment>
  );
});
