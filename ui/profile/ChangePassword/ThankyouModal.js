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

const ThankyouModal = ({ classes, open, handleModal }) => {
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
            THANK YOU
          </Typography>
          <Typography variant="body1" className={classes.body}>
            Your password has been changed.
          </Typography>
        </CardContent>
        <CardActions className={classes.action}>
          <Button
            className={classes.button}
            onClick={() => handleModal(false)}
            disableRipple
          >
            CONTINUE...
          </Button>
        </CardActions>
      </Card>
    </Modal>
  );
};

export default withStyles(styles)(ThankyouModal);
