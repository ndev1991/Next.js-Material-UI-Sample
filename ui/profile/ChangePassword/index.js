import { useState, useContext } from 'react';
import { graphql, compose } from 'react-apollo';
import OverlayProgress from '../../../components/progress/OverlayProgress';
import NotificationsContext from '../../../lib/notificationsContext';
import { changePassword } from '../../../src/graphql/user';
import ChangePasswordModal from './ChangePasswordModal';
import ThankyouModal from './ThankyouModal';

const ChangePassword = props => {
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const { showNotification } = useContext(NotificationsContext);

  const handleValidate = value => {
    const { password, currentPassword, confirmPassword } = value;
    const error = {};

    if (!currentPassword) {
      error.currentPassword = 'CurrentPassword required!';
    }

    if (!password) {
      error.password = 'Password required!';
    } else if (password && password.length < 6) {
      error.password =
        'Minimum length of this field must be equal or greater than 6 symbols.';
    }

    if (confirmPassword && confirmPassword !== password) {
      error.confirmPassword = 'Password should be match.';
    }

    return error;
  };

  const handleSubmit = async value => {
    setChangePasswordLoading(true);
    const { password, currentPassword } = value;

    try {
      const response = await props.changePassword({
        variables: {
          password: {
            oldPassword: currentPassword,
            newPassword: password
          }
        }
      });

      const { errorMessage, success } = response.data.changePassword;

      if (errorMessage && errorMessage.length > 0) {
        const message = errorMessage.join(',');
        showNotification({
          type: 'error',
          message
        });
      }

      if (success) {
        const message = 'Change password successfully';
        showNotification({
          type: 'success',
          message
        });
        props.handleThankyouModal(true);
      }
    } catch (err) {
      const message = 'Change Password failed. Please try again.';
      showNotification({
        type: 'error',
        message
      });

      console.error(err.message);
    }
    setChangePasswordLoading(false);
  };

  return (
    <>
      {changePasswordLoading && <OverlayProgress />}
      <ChangePasswordModal
        open={props.changePasswordOpen}
        onSubmit={handleSubmit}
        handleValidate={handleValidate}
        handleModal={props.handleModal}
      />
      <ThankyouModal
        open={props.thankyouOpen}
        handleModal={props.handleThankyouModal}
      />
    </>
  );
};

export default compose(
  graphql(changePassword, {
    name: 'changePassword',
    options: { errorPolicy: 'ignore' }
  })
)(ChangePassword);
