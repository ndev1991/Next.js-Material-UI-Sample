import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { graphql, compose } from 'react-apollo';
import UpdateForm from './UpdateForm';
import NotificationsContext from '../../../lib/notificationsContext';
import { userUpdate } from '../../../src/graphql/user';

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
  return re.test(email);
}

const styles = theme => ({
  root: {
    maxWidth: 1500,
    padding: theme.spacing.unit / 2,
    margin: '0 auto'
  }
});

const UpdateProfile = ({
  classes,
  me,
  open,
  userUpdate: updateProfile,
  handleModal,
  handleCancel
}) => {
  const { showNotification } = useContext(NotificationsContext);
  const handleSubmit = async value => {
    const { firstName, lastName, email, iam } = value;
    try {
      const response = await updateProfile({
        variables: {
          account: {
            firstName,
            lastName,
            email,
            iam
          }
        }
      });
      const { errorMessage, success } = response.data.userUpdate;
      if (errorMessage && errorMessage.length > 0)
        showNotification({ type: 'error', message: errorMessage.join(',') });
      if (success) handleModal();
    } catch (err) {
      const message = 'Profile update has failed. Please try again.';
      showNotification({
        type: 'error',
        message
      });
      console.error(err.message);
    }
  };

  const handleValidate = value => {
    const { firstName, lastName, iam, email } = value;
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

    if (!iam || iam === '') {
      error.iam = 'Must select a who I am.';
    }

    return error;
  };

  return (
    <div className={classes.root}>
      <UpdateForm
        me={me}
        open={open}
        onSubmit={handleSubmit}
        handleCancel={handleCancel}
        handleValidate={handleValidate}
        handleModal={handleModal}
      />
    </div>
  );
};

export default compose(
  graphql(userUpdate, { name: 'userUpdate' }),
  withStyles(styles)
)(UpdateProfile);
