import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  IconButton,
  DialogTitle,
  DialogContent,
  Typography,
  withStyles
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import { Variants } from '../../../../../components';

const styles = theme => ({
  dialogPaper: {
    minWidth: '80vw'
  },
  galleryTitle: {
    fontFamily: 'Oswald',
    fontSize: '30px',
    color: theme.palette.primary.highlight,
    textAlign: 'center'
  },
  galleryDescription: {
    fontFamily: 'Montserrat',
    fontSize: '16px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px'
    },
    color: theme.palette.primary.default,
    textAlign: 'center',
    marginBottom: `${theme.spacing.unit * 2}px`
  }
});

const StyleModal = ({
  classes,
  isModalOpen,
  handleModal,
  product,
  variants
}) => (
  <Dialog
    open={isModalOpen}
    onClose={() => handleModal(false)}
    classes={{ paper: classes.dialogPaper }}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogActions>
      <IconButton aria-label="Close" onClick={() => handleModal(false)}>
        <CloseIcon />
      </IconButton>
    </DialogActions>
    <DialogTitle disableTypography id="alert-dialog-title">
      <Typography variant="h2" className={classes.galleryTitle}>
        {product.name}
      </Typography>
    </DialogTitle>
    <DialogContent>
      <Typography variant="body2" className={classes.galleryDescription}>
        {product.description}
      </Typography>
      <Variants
        variants={product.variants}
        selectedVariants={variants.selectedVariants}
        onSetSelectedVariants={variants.handleVariantSelection}
        onSetProductPhotos={variants.updatePhotos}
        display="card"
      />
    </DialogContent>
  </Dialog>
);

StyleModal.propTypes = {
  classes: PropTypes.object.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  handleModal: PropTypes.func.isRequired,
  product: PropTypes.object.isRequired,
  variants: PropTypes.shape({
    selectedVariants: PropTypes.array,
    handleVariantSelection: PropTypes.func.isRequired,
    updatePhotos: PropTypes.func.isRequired
  }).isRequired
};

export default withStyles(styles)(StyleModal);
