import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import CloseIcon from '@material-ui/icons/Close';

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
    marginRight: -theme.spacing.unit * 4
  },
  content: {
    padding: 0
  },
  title: {
    padding: 0,
    fontFamily: 'Oswald',
    fontSize: 30,
    color: '#4e4e4e',
    textAlign: 'center'
  },
  button: {
    height: 40,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    margin: '0 auto',
    fontFamily: 'Montserrat',
    fontSize: 13,
    width: '100%',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  label: {
    justifyContent: 'left'
  },
  action: {
    paddingTop: theme.spacing.unit * 3,
    flexWrap: 'wrap',
    width: '100%',
    margin: '0 auto'
  },
  icon: {
    cursor: 'pointer'
  },
  body: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#707070',
    textAlign: 'center'
  }
});

const ThankYouRegisterModal = ({ classes, handleModal, open }) => {
  return (
    <Modal open={open} onClose={() => handleModal(false)}>
      <Card className={classes.card}>
        <CardActions className={classes.closeAction}>
          <CloseIcon
            className={classes.icon}
            onClick={() => handleModal(false)}
          />
        </CardActions>
        <CardContent className={classes.content}>
          <Typography variant="h6" className={classes.title}>
            THANKS FOR REGISTERING
          </Typography>
          <Typography variant="body1" className={classes.body}>
            Welcome to OCM! It's great to have you on board. Now let's create
            your happy space!
          </Typography>
        </CardContent>
        <CardActions className={classes.action}>
          <Button className={classes.button} onClick={() => handleModal(false)}>
            CONTINUE...
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

export default withStyles(styles)(ThankYouRegisterModal);
