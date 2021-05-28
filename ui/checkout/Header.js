import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Step,
  StepLabel,
  Stepper,
  Typography,
  Popover,
  Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const routes = require('next-routes')();

const getSteps = () => {
  return ['DELIVERY', 'PAYMENT', 'PLACE ORDER'];
};

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  image: {
    maxWidth: '100%'
  },
  button: {
    height: 40,
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.common.grey[600],
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: theme.palette.common.grey[600]
    }
  },
  endorsedButton: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },
  secondary: {
    height: 40,
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.common.white,
    color: '#21B6A8',
    border: '1px solid #21B6A8',
    fontSize: 13,
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: theme.palette.common.white
    }
  },
  secondaryEndorsed: {
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`
  },
  icon: {
    cursor: 'pointer'
  },
  popover: {
    padding: '10px 20px',
    textAlign: 'center'
  },
  stepLabel: {
    fontSize: '1rem',
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontWeight: 400
  },
  typography: {
    padding: 20,
    fontSize: '1rem',
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontWeight: 400
  },
  hasUnderline: {
    borderBottom: `1px solid rgba(0, 0, 0, 0.62)`,
    marginBottom: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit
  }
});

const CheckoutHeader = props => {
  const { currentStep, classes, schoolcode, logo, setCurrentStep } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const steps = getSteps();
  const endorsed = schoolcode.toLowerCase() !== 'ocm';

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid
      className={classNames(classes.root, classes.hasUnderline)}
      container
      spacing={8}
      justify="center"
    >
      <Grid item md={4}>
        <Typography
          className={classes.icon}
          aria-owns={open ? 'simple-popper' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          variant="h6"
        >
          <img className={classes.image} src={logo} alt="logo" />
        </Typography>
        <Popover
          id="simple-popper"
          className={classes.popover}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <Typography className={classes.typography}>
            Are you sure you want to return to your Shopping Cart?
          </Typography>
          <Button
            className={classNames(
              classes.button,
              endorsed ? classes.endorsedButton : ''
            )}
            disableRipple
            onClick={handleClose}
          >
            Stay in checkout
          </Button>
          <Button
            className={classNames(
              classes.secondary,
              endorsed ? classes.secondaryEndorsed : ''
            )}
            disableRipple
            onClick={() =>
              routes.Router.push(
                `/${
                  schoolcode.toLowerCase() !== 'ocm' ? `${schoolcode}/` : ''
                }cart`
              )
            }
          >
            Return to Cart
          </Button>
        </Popover>
      </Grid>
      <Grid item md={8} xs={12}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label, id) => (
            <Step key={label}>
              <StepLabel
                className={classes.stepLabel}
                onClick={setCurrentStep(id)}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Grid>
    </Grid>
  );
};

CheckoutHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  currentStep: PropTypes.number
};

export default withStyles(styles, { withTheme: true })(CheckoutHeader);
