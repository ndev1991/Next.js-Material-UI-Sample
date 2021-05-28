import React, { useState, useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { graphql, compose } from 'react-apollo';

import RegisterForm from './RegisterForm';
import OverlayProgress from '../../components/progress/OverlayProgress';
import ThankYouRegisterModal from './ThankYouRegisterModal';
import NotificationsContext from '../../lib/notificationsContext';
import { setToken } from '../../lib/auth';
import { userCreate } from '../../src/graphql/user';

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
  return re.test(email);
}

const styles = theme => ({
  root: {
    maxWidth: 1500,
    padding: theme.spacing.unit * 3,
    margin: '0 auto'
  }
});

const Register = props => {
  const { classes } = props;

  const [userCreateSuccess, setUserCreateSuccess] = useState(false);
  const [userCreateLoading, setUserCreateLoading] = useState(false);
  const { showNotification } = useContext(NotificationsContext);

  const handleSubmit = async value => {
    setUserCreateLoading(true);
    const { firstName, lastName, password, email, iam } = value;

    try {
      const response = await props.userCreate({
        variables: {
          account: {
            firstName,
            lastName,
            password,
            email,
            iam
          }
        }
      });

      const { errorMessage, success, token } = response.data.userCreate;

      if (errorMessage && errorMessage.length > 0) {
        const message = errorMessage.join(',');
        showNotification({
          type: 'error',
          message
        });
      }

      if (success) {
        setToken(token);
        setUserCreateSuccess(true);
        const message = 'Registration success';
        showNotification({
          type: 'success',
          message
        });
      }
    } catch (err) {
      const message = 'Registration failed. Please try again.';
      showNotification({
        type: 'error',
        message
      });

      console.error(err.message);
    }
    setUserCreateLoading(false);
  };

  const handleCancel = () => {};

  const handleModal = flag => {
    setUserCreateSuccess(flag);
  };

  const handleValidate = value => {
    const { firstName, lastName, password, confirm, email } = value;
    const error = {};

    if (!firstName) {
      error.firstName = 'Firstname required!';
    }

    if (!lastName) {
      error.lastName = 'Lastname required!';
    }

    if (!email) {
      error.email = 'Email required!';
    } else if (email && !validateEmail(email)) {
      error.email = 'Input correct email!';
    }

    if (!password) {
      error.password = 'Password required!';
    } else if (password && password.length < 6) {
      error.password =
        'Minimum length of this field must be equal or greater than 6 symbols.';
    }

    if (confirm && confirm !== password) {
      error.confirm = 'Password should be match.';
    }

    return error;
  };

  return (
    <div className={classes.root}>
      <RegisterForm
        onSubmit={handleSubmit}
        handleCancel={handleCancel}
        handleValidate={handleValidate}
      />
      {userCreateLoading && <OverlayProgress />}
      {userCreateSuccess && (
        <ThankYouRegisterModal
          open={userCreateSuccess}
          handleModal={handleModal}
        />
      )}
    </div>
  );
};

export default compose(
  graphql(userCreate, { name: 'userCreate' }),
  withStyles(styles)
)(Register);
