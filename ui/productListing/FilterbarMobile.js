import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import ArroDownIcon from '@material-ui/icons/KeyboardArrowDown';
import NativeSelectBox from '../../components/widgets/NativeSelectBox';

const styles = theme => ({
  root: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'space-between',
      display: 'flex',
      alignItems: 'center'
    }
  },
  filter: {
    marginLeft: theme.spacing.unit * 2
  },
  select: {
    [theme.breakpoints.down('xs')]: {
      width: '48%',
      display: 'grid'
    }
  },
  facetButton: {
    width: '48%',
    display: 'flex',
    justifyContent: 'left',
    border: '1px solid #707070',
    backgroundColor: '#fff',
    borderRadius: theme.spacing.unit / 4,
    paddingTop: theme.spacing.unit / 2,
    paddingBottom: theme.spacing.unit / 4,
    paddingLeft: theme.spacing.unit,
    fontSize: 15,
    lineHeight: '19px',
    boxShadow: 'none',
    fontFamily: 'Montserrat',
    fontWeight: 400,
    color: '#878787',
    textTransform: 'none'
  },
  icon: {
    backgroundColor: '#878787',
    top: 0,
    right: 0,
    position: 'absolute',
    pointerEvents: 'none',
    color: '#e2e2e2',
    width: 26,
    height: 26
  }
});

const FilterbarMobile = ({ classes, sort, handleSort, toggleDrawer }) => (
  <div className={classes.root}>
    <NativeSelectBox
      value={sort}
      name="sort"
      handleSelect={handleSort}
      className={classes.select}
    >
      <option value="relevance">Sort</option>
      <option value="price_ASC">Price - Low to High</option>
      <option value="price_DESC">Price - High to Low</option>
      <option value="rating_ASC">Customer Rating</option>
      <option value="created_at_ASC">Newest</option>
    </NativeSelectBox>

    <Button
      onClick={() => toggleDrawer(true)}
      className={classes.facetButton}
      variant="contained"
      disableRipple
    >
      Filters
      <ArroDownIcon className={classes.icon} />
    </Button>
  </div>
);

export default withStyles(styles)(FilterbarMobile);
