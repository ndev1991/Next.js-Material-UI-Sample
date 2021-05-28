import PropTypes from 'prop-types';
import {
  Grid,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
  withStyles
} from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import { Image } from 'cloudinary-react';

const styles = theme => ({
  stepper: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  stepperInner: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  step: {
    borderBottom: 2,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      padding: '0 2px'
    }
  },
  stepInner: {
    marginTop: `${theme.spacing.unit * 2.5}px`
  },
  editButton: {
    color: theme.palette.primary.main,
    fontSize: '12px'
  },
  image: {
    marginTop: `${theme.spacing.unit * 2}px`,
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },
  mobileStepper: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexGrow: 1,
      padding: theme.spacing.unit / 2
    }
  },
  mobileRoot: {
    margin: 0,
    padding: 0
  },
  mobileLabel: {
    fontFamily: 'Oswald'
  },
  iconContainer: {
    paddingRight: 2
  },
  mobileEdit: {
    fontFamily: 'Oswald',
    fontSize: 14
  },
  mobileHeader: {
    display: 'none',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      backgroundColor: theme.palette.primary.highlight,
      width: '100vw',
      marginLeft: -theme.spacing.unit,
      marginRight: -theme.spacing.unit,
      marginTop: -theme.spacing.unit,
      padding: theme.spacing.unit,
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  },
  mobileHeaderLabel: {
    fontFamily: 'Oswald',
    color: theme.palette.common.white,
    fontSize: 28
  },
  containerWrap: {
    flexWrap: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap'
    }
  }
});

const Navigation = ({
  steps,
  mobileSteps,
  activeStep,
  isStepOptional,
  isStepSkipped,
  classes,
  handleStep
}) => (
  <Grid container className={classes.containerWrap}>
    <Image
      className={classes.image}
      publicId="https://res.cloudinary.com/ocm/image/upload/spa/home/icn_value-pack-01.png"
      height="50"
      responsive
      width="auto"
    />
    <Stepper
      activeStep={activeStep}
      className={classes.stepper}
      classes={{
        root: classes.stepperInner
      }}
    >
      {steps.map((label, index) => {
        const props = {};
        const labelProps = {};

        if (isStepOptional(index)) {
          labelProps.optional = (
            <Typography variant="body2">Optional</Typography>
          );
        }

        if (isStepSkipped(index)) {
          props.completed = false;
        }

        const isDisabled = activeStep > 2 && (index <= 2 || index === 3);
        return (
          <Step
            key={label}
            {...props}
            className={classes.step}
            completed={index < activeStep || steps.length - 1 === activeStep}
            disabled={isDisabled}
          >
            {index < activeStep && !isDisabled ? (
              <StepButton onClick={handleStep(index)}>
                <div className={classes.stepInner}>
                  {label}
                  <Typography variant="body1" className={classes.editButton}>
                    <EditIcon className={classes.editButton} /> Edit
                  </Typography>
                </div>
              </StepButton>
            ) : (
              <StepLabel {...labelProps}>
                <div className={classes.stepInner}>
                  {label}
                  <Typography
                    variant="body1"
                    style={{ color: 'white', fontSize: '12px' }}
                  >
                    <EditIcon style={{ color: 'white', fontSize: '12px' }} />{' '}
                    Edit
                  </Typography>
                </div>
              </StepLabel>
            )}
          </Step>
        );
      })}
    </Stepper>
    <div className={classes.mobileHeader}>
      <Typography className={classes.mobileHeaderLabel}>
        {`${activeStep + 1}. ${steps[activeStep]}`}
      </Typography>
    </div>
    <Stepper activeStep={activeStep} className={classes.mobileStepper}>
      {mobileSteps.map((label, index) => {
        const props = {};
        const labelProps = {};
        if (isStepOptional(index)) {
          labelProps.optional = (
            <Typography variant="body2">Optional</Typography>
          );
        }
        if (isStepSkipped(index)) {
          props.completed = false;
        }
        const isDisabled = activeStep > 2 && (index <= 2 || index === 3);
        return (
          <Step
            key={label}
            {...props}
            className={classes.step}
            completed={index < activeStep || steps.length - 1 === activeStep}
            disabled={isDisabled}
          >
            {index < activeStep && !isDisabled ? (
              <StepButton
                classes={{
                  root: classes.mobileRoot
                }}
                onClick={handleStep(index)}
              >
                <StepLabel
                  classes={{
                    root: classes.mobileRoot,
                    label: classes.mobileLabel,
                    iconContainer: classes.iconContainer
                  }}
                >
                  {label}
                  <Typography className={classes.mobileEdit} variant="body1">
                    Edit
                  </Typography>
                </StepLabel>
              </StepButton>
            ) : (
              <StepLabel
                classes={{
                  root: classes.mobileRoot,
                  label: classes.mobileLabel,
                  iconContainer: classes.iconContainer
                }}
              >
                {label}
                <Typography style={{ color: 'white' }} variant="body1">
                  Edit
                </Typography>
              </StepLabel>
            )}
          </Step>
        );
      })}
    </Stepper>
    {/* <MobileStepper
      steps={steps.length}
      position="static"
      activeStep={activeStep}
      className={classes.mobileStepper}
      nextButton={
        <Button
          size="small"
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
        >
          Next
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      }
      backButton={
        <Button
          size="small"
          onClick={handleStep(activeStep - 1)}
          disabled={activeStep === 0}
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
          Back
        </Button>
      }
    /> */}
  </Grid>
);

Navigation.propTypes = {
  activeStep: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  handleStep: PropTypes.func.isRequired,
  isStepOptional: PropTypes.func.isRequired,
  isStepSkipped: PropTypes.func.isRequired,
  steps: PropTypes.array.isRequired
};

export default withStyles(styles, { withTheme: true })(Navigation);
