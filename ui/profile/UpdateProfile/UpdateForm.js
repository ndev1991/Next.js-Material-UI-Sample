import { withStyles } from '@material-ui/core/styles';
import { Modal, DialogContent } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import CloseIcon from '@material-ui/icons/Close';
import { Form } from 'react-final-form';

import FieldInput from '../../../components/forms/FieldInput';
import FieldSelect from '../../../components/forms/FieldSelect';

const styles = theme => ({
  root: {
    [theme.breakpoints.down('xs')]: {
      height: '100vh'
    }
  },
  formControl: {
    width: '100%',
    height: 44,
    border: `1px solid ${theme.palette.common.grey['900']}`,
    color: theme.palette.common.grey['900'],
    borderRadius: '4px',
    fontSize: 20,
    '&:active, &:focus': {
      borderColor: theme.palette.common.grey['900'],
      color: theme.palette.common.grey['800']
    }
  },
  fullWidth: {
    width: '100%'
  },
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
    color: theme.palette.primary.main
  },
  button: {
    height: 40,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    margin: '0 auto',
    width: '90%',
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: 600,
    padding: `8px ${theme.spacing.unit * 1.5}px`,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  action: {
    paddingTop: theme.spacing.unit * 2,
    flexWrap: 'wrap'
  },
  icon: {
    cursor: 'pointer'
  },
  cancel: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    border: `1px solid ${theme.palette.secondary.main}`,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.secondary.main,
    margin: '0 auto',
    width: '90%',
    '&:hover': {
      backgroundColor: theme.palette.common.white
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  link: {
    width: '45%',
    margin: '0 auto',
    color: theme.palette.secondary.main,
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'unset',
    '&:hover': {
      backgroundColor: 'unset',
      textDecoration: 'underline'
    }
  },
  body: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#707070'
  }
});

const UpdateForm = ({
  classes,
  open,
  me,
  onSubmit,
  handleCancel,
  handleValidate
}) => (
  <Modal open={open} onClose={() => handleCancel(false)} keepMounted>
    <DialogContent className={classes.root}>
      <Form
        onSubmit={onSubmit}
        initialValues={{
          iam: me.iam,
          firstName: me.firstName,
          lastName: me.lastName,
          email: me.email
        }}
        validate={handleValidate}
        validateOnBlur
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Card className={classes.card}>
              <CardActions className={classes.closeAction}>
                <CloseIcon
                  className={classes.icon}
                  onClick={() => handleCancel(false)}
                />
              </CardActions>
              <CardContent className={classes.content}>
                <Typography variant="h6" className={classes.title}>
                  UPDATE PROFILE
                </Typography>
                <FieldInput
                  name="firstName"
                  required
                  placeholder="FirstName*"
                />
                <FieldInput name="lastName" placeholder="LastName*" />
                <FieldInput
                  name="email"
                  required
                  autoFocus
                  placeholder="Email*"
                />
                <FieldSelect name="iam" required placeholder="I am a...">
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
              </CardContent>
              <CardActions className={classes.action}>
                <Button className={classes.button} onClick={handleSubmit}>
                  UPDATE PROFILE
                </Button>
                <Button
                  className={classNames(classes.button, classes.cancel)}
                  onClick={() => handleCancel(false)}
                >
                  CANCEL
                </Button>
              </CardActions>
            </Card>
          </form>
        )}
      </Form>
    </DialogContent>
  </Modal>
);

UpdateForm.defaultProps = {
  open: false
};

export default withStyles(styles)(UpdateForm);
