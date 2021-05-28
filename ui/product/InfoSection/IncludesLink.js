import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';

const includesLinkLabel = "See what's included";

const styles = theme => ({
  includesLink: {
    fontSize: 16,
    color: theme.palette.common.grey[800]
  },
  includesLinkTypography: {
    [theme.breakpoints.only('xs')]: {
      marginBottom: theme.spacing.unit * 3
    },
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing.unit
    }
  }
});

const IncludesLink = ({ classes }) => (
  <a href="#tab-content" className={classes.includesLink}>
    <Typography variant="body1" className={classes.includesLinkTypography}>
      {includesLinkLabel}
    </Typography>
  </a>
);

IncludesLink.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(IncludesLink);
