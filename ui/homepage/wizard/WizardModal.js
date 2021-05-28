import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  withMobileDialog,
  withStyles
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import Wizard from './WizardWithData';

const styles = theme => ({
  dialogPaper: {
    minWidth: '93vw'
  },
  content: {
    padding: 0,
    marginTop: '-65px'
  },
  closeIcon: {
    [theme.breakpoints.down('xs')]: {
      color: theme.palette.common.white
    }
  }
});

const WizardModal = ({ classes, fullScreen, isOpen, handleModal }) => (
  <Dialog
    open={isOpen}
    scroll="body"
    onClose={() => handleModal(false)}
    fullScreen={fullScreen}
    classes={{ paper: classes.dialogPaper }}
  >
    <DialogActions>
      <IconButton aria-label="Close" onClick={() => handleModal(false)}>
        <CloseIcon className={classes.closeIcon} />
      </IconButton>
    </DialogActions>
    <DialogContent className={classes.content}>
      <Wizard handleModal={handleModal} />
    </DialogContent>
  </Dialog>
);

WizardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func.isRequired
};

const WizardModalMobileEnhaced = withMobileDialog()(WizardModal);

export default withStyles(styles)(WizardModalMobileEnhaced);
