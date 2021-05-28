import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Item from './Item';

const styles = {
  layout: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  }
};

const StepOne = ({ classes, products, handleNext, handleSelected }) => (
  <Fragment>
    <div className={classes.layout}>
      {products
        .filter((p, i) => i < 4)
        .map(product => (
          <Item
            key={product.id}
            product={product}
            handleNext={handleNext}
            handleSelected={handleSelected}
          />
        ))}
    </div>
  </Fragment>
);

StepOne.propTypes = {
  classes: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  handleNext: PropTypes.func.isRequired
};

export default withStyles(styles)(StepOne);
