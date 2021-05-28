import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { Form } from 'react-final-form';

import FieldInput from '../../../components/forms/FieldInput';

const styles = theme => ({
  card: {
    position: 'absolute',
    width: '98%',
    maxWidth: 500,
    padding: theme.spacing.unit * 4,
    paddingTop: theme.spacing.unit,
    boxShadow: theme.shadows[5],
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
    borderRadius: 3
  },
  closeAction: {
    justifyContent: 'flex-end',
    marginRight: -theme.spacing.unit * 4,
    color: theme.palette.common.grey[900]
  },
  content: {
    padding: 0
  },
  title: {
    padding: 0,
    fontFamily: 'Oswald',
    fontSize: 30,
    color: theme.palette.primary.main,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.unit * 2
  },
  button: {
    height: 40,
    width: '90%',
    margin: '0 auto',
    marginTop: theme.spacing.unit * 2,
    backgroundColor: theme.palette.secondary.main,
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Montserrat',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  action: {
    paddingTop: theme.spacing.unit * 2,
    flexWrap: 'wrap',
    flexDirection: 'column'
  },
  icon: {
    cursor: 'pointer'
  },
  body: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#707070',
    paddingBottom: theme.spacing.unit * 2
  }
});

const ChangePasswordModal = ({
  classes,
  open,
  handleModal,
  onSubmit,
  handleValidate
}) => {
  return (
    <Modal open={open} onClose={() => handleModal(false)}>
      <Form
        onSubmit={onSubmit}
        initialValues={{ checkbox: true }}
        validate={handleValidate}
        validateOnBlur
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Card className={classes.card}>
              <CardActions className={classes.closeAction}>
                <CloseIcon
                  className={classes.icon}
                  onClick={() => handleModal(false)}
                />
              </CardActions>
              <CardContent className={classes.content}>
                <Typography variant="h6" className={classes.title}>
                  CHANGE PASSWORD
                </Typography>
                <Typography variant="body1" className={classes.body}>
                  Please enter your current password and your new password.
                </Typography>
                <FieldInput
                  name="currentPassword"
                  required
                  placeholder="Current Password*"
                  type="password"
                />
                <FieldInput
                  name="password"
                  required
                  placeholder="New Password*"
                  type="password"
                />
                <FieldInput
                  name="confirmPassword"
                  required
                  placeholder="Confirm Password*"
                  type="password"
                />
              </CardContent>
              <CardActions className={classes.action}>
                <Button
                  className={classes.button}
                  onClick={handleSubmit}
                  disableRipple
                >
                  CHANGE PASSWORD
                </Button>
              </CardActions>
            </Card>
          </form>
        )}
      </Form>
    </Modal>
  );
};

export default withStyles(styles)(ChangePasswordModal);
