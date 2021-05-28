import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Image } from 'cloudinary-react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import { Form } from 'react-final-form';
import { Router } from '../../routes';
import FieldInput from '../../components/forms/FieldInput';
import FieldSelect from '../../components/forms/FieldSelect';
import FieldCheckbox from '../../components/forms/FieldCheckbox';

const styles = theme => ({
  mainLayout: {
    [theme.breakpoints.down('xs')]: {
      order: 1
    }
  },
  otherLayout: {
    [theme.breakpoints.down('xs')]: {
      order: 0
    }
  },
  title: {
    padding: 0,
    fontFamily: 'Oswald',
    fontSize: 30,
    color: theme.palette.primary.main
  },
  button: {
    height: 40,
    backgroundColor: theme.palette.secondary.main,
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Montserrat',
    fontWeight: 600,
    width: '45%',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      margin: '0 auto'
    }
  },
  cancel: {
    border: `1px solid ${theme.palette.secondary.main}`,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.secondary.main,
    width: '45%',
    '&:hover': {
      backgroundColor: theme.palette.common.white
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  link: {
    width: '50%',
    margin: '0 auto',
    color: '#4e4e4e',
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'unset',
    '&:hover': {
      backgroundColor: 'unset',
      textDecoration: 'underline'
    }
  },
  media: {
    width: '100%',
    height: 'auto'
  },
  mainActionLayout: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    display: 'flex',
    justifyContent: 'space-between'
  },
  otherActionLayout: {
    paddingTop: theme.spacing.unit,
    borderTop: '1px solid #6f6d6d',
    [theme.breakpoints.down('xs')]: {
      border: 0
    }
  },
  body: {
    marginTop: theme.spacing.unit * 1.5,
    marginBottom: theme.spacing.unit * 2,
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#707070'
  }
});

const RegisterForm = ({ classes, onSubmit, handleCancel, handleValidate }) => (
  <Form
    onSubmit={onSubmit}
    initialValues={{ checkbox: true }}
    validate={handleValidate}
    validateOnBlur
  >
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <Grid container className={classes.layout} spacing={16}>
          <Grid item sm={6} className={classes.mainLayout}>
            <Typography variant="h6" className={classes.title}>
              REGISTER
            </Typography>
            <FieldInput name="email" required autoFocus placeholder="Email*" />
            <FieldInput name="firstName" required placeholder="FirstName*" />
            <FieldInput name="lastName" required placeholder="LastName*" />
            <FieldInput
              name="password"
              required
              placeholder="Password*"
              type="password"
            />
            <FieldInput
              name="confirm"
              required
              placeholder="Confirm Password*"
              type="password"
            />
            <FieldSelect name="iam" required placeholder="I am...">
              <option disabled value="">
                I am a...
              </option>
              <option value="Student">Student</option>
              <option value="Parent">Parent</option>
              <option value="Friend">Friend</option>
              <option value="Non Student">Non Student</option>
              <option value="Fan">Fan</option>
              <option value="Aunt">Aunt</option>
              <option value="Uncle">Uncle</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Cousin">Cousin</option>
              <option value="Grandparent">Grandparent</option>
              <option value="Family Friend">Family Friend</option>
            </FieldSelect>
            <Typography variant="body1" className={classes.body}>
              By registering, you agree to OCM.com's Terms & Conditions and
              Privacy Policy
            </Typography>
            <FieldCheckbox
              name="checkbox"
              label="Add me to the OCM email list."
            />
            <Grid item xs={12} className={classes.mainActionLayout}>
              <Button
                className={classes.button}
                onClick={handleSubmit}
                disableRipple
              >
                REGISTER ACCOUNT
              </Button>
              <Button
                className={classNames(classes.button, classes.cancel)}
                onClick={handleCancel}
                disableRipple
              >
                CANCEL
              </Button>
            </Grid>
            <Grid item xs={12} className={classes.otherActionLayout}>
              <Button
                component="a"
                disableRipple
                variant="text"
                className={classes.link}
                target="_blank"
                onClick={() => Router.pushRoute('/terms-and-conditions')}
              >
                Terms & Conditions
              </Button>
              <Button
                component="a"
                disableRipple
                variant="text"
                className={classes.link}
                target="_blank"
                onClick={() => Router.pushRoute('/privacy-policy')}
              >
                Privacy Policy
              </Button>
            </Grid>
          </Grid>
          <Grid item sm={6} className={classes.otherLayout}>
            <Image
              publicId="https://res.cloudinary.com/ocm/image/upload/v1553905663/spa/registration/registration-page-girl.jpg"
              className={classes.media}
            />
          </Grid>
        </Grid>
      </form>
    )}
  </Form>
);

RegisterForm.propTypes = {
  handleCancel: PropTypes.func.isRequired
};

export default withStyles(styles)(RegisterForm);
