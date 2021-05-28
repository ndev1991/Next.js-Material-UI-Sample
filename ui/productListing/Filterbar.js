import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import NativeSelectBox from '../../components/widgets/NativeSelectBox';

const styles = theme => ({
  root: {
    backgroundColor: '#f4f4f4',
    padding: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center',
    marginLeft: -theme.spacing.unit * 3,
    marginRight: -theme.spacing.unit * 3,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center'
    }
  },
  title: {
    fontSize: 36,
    fontWeight: 400,
    fontFamily: 'Montserrat',
    color: '#707070',
    marginRight: theme.spacing.unit * 4,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      width: 'unset',
      textAlign: 'center',
      fontSize: 30,
      lineHeight: 1,
      marginRight: 0
    }
  },
  filter: {
    marginLeft: theme.spacing.unit * 10,
    [theme.breakpoints.down('md')]: {
      marginLeft: theme.spacing.unit * 3
    }
  },
  select: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  }
});

const Filterbar = ({ classes, sort, handleSort, category }) => (
  <div className={classes.root}>
    {category && (
      <Typography className={classes.title} component="h2">
        {category}
      </Typography>
    )}
    <NativeSelectBox
      value={sort}
      name="sort"
      handleSelect={handleSort}
      label="Sort by"
      className={classes.select}
    >
      <option value="relevance">Relevance</option>
      <option value="price_ASC">Price - Low to High</option>
      <option value="price_DESC">Price - High to Low</option>
      <option value="rating_ASC">Customer Rating</option>
      <option value="created_at_ASC">Newest</option>
    </NativeSelectBox>

    {/* <NativeSelectBox
      value={filter}
      name="filter"
      handleSelect={handleFilter}
      className={ClassNames(classes.filter, classes.select)}
      label="Filter by Rating"
    >
      <option value="*-5.0">All</option>
      <option value="4.0-*">4 Stars & Up</option>
      <option value="3.0-*">3 Stars & Up</option>
      <option value="2.0-*">2 Stars & Up</option>
    </NativeSelectBox> */}
  </div>
);

export default withStyles(styles)(Filterbar);
