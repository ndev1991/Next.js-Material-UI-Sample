import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardActions,
  CardMedia,
  CardHeader,
  Grid,
  Typography,
  withStyles,
  Dialog,
  DialogActions,
  IconButton,
  DialogTitle,
  DialogContent
} from '@material-ui/core';
import { Close as CloseIcon, ZoomIn as ZoomIcon } from '@material-ui/icons';
import { url, CloudinaryContext } from '../../../../../lib/cloudinary';
import IncludesTab from '../../../../../components/widgets/IncludesTab';
import {
  arisProductInitiallySelectedItem,
  calculateVariantsPriceModification,
  calculateConfigurationsPriceModification
} from '../../../../../src/helpers/products';

const styles = theme => ({
  card: {
    maxWidth: '20%',
    width: '20%',
    borderRadius: 0,
    boxShadow: 'none',
    margin: `${theme.spacing.unit}px 2.5%`,
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
      width: '100%'
    }
  },
  media: {
    height: 0,
    paddingTop: '56.25%'
  },
  title: {
    fontSize: '20px',
    height: 50,
    overflowWrap: 'break-word',
    textTransform: 'uppercase',
    textAlign: 'center',
    overflow: 'hidden',
    fontFamily: 'Oswald',
    fontWeight: 500,
    color: theme.palette.common.grey[800],
    cursor: 'pointer',
    display: '-webkit-box',
    lineClamp: 2,
    boxOrient: 'vertical'
  },
  startingAt: {
    fontFamily: 'Montserrat',
    fontSize: '12px',
    textTransform: 'uppercase',
    lineHeight: 1
  },
  price: {
    fontFamily: 'Oswald',
    fontSize: '35px',
    lineHeight: 1
  },
  action: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#ffffff'
  },
  buttons: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    margin: '0 auto',
    fontFamily: 'Montserrat',
    fontSize: 13,
    width: '100%',
    fontWeight: 600,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.5}px`,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  },
  zoomIcon: {
    marginRight: theme.spacing.unit
  },
  explorePakTitle: {
    fontFamily: 'Oswald',
    fontSize: '44px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '30px'
    },
    color: theme.palette.primary.highlight,
    textAlign: 'center'
  },
  explorePakDescription: {
    fontFamily: 'Montserrat',
    fontSize: '16px',
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px'
    },
    color: theme.palette.primary.default,
    textAlign: 'center'
  },
  dialogPaper: {
    minWidth: '80vw'
  }
});

const Item = ({ classes, product, handleNext, handleSelected }) => {
  const { cloudName, imagePath } = useContext(CloudinaryContext);
  const [isModalOpen, handleModal] = useState(false);

  const handleClick = () => {
    handleSelected(product.id);
    return handleNext();
  };

  const initiallySelectedVariants = arisProductInitiallySelectedItem(
    product,
    'variants'
  );
  const initiallySelectedConfigurations = arisProductInitiallySelectedItem(
    product,
    'configurations'
  );

  const configurationsPriceModification = calculateConfigurationsPriceModification(
    initiallySelectedConfigurations
  );
  const variantsPriceModification = calculateVariantsPriceModification(
    initiallySelectedVariants
  );

  const finalPrice =
    product.priceBase +
    variantsPriceModification +
    configurationsPriceModification;

  return (
    <>
      <Card className={classes.card}>
        <CardHeader title={product.name} classes={{ title: classes.title }} />
        <CardMedia
          className={classes.media}
          image={url(cloudName, `${imagePath}/${product.images[0]}`, {
            width: 150
          })}
          title={product.name}
        />
        <CardActions className={classes.action}>
          <Button onClick={() => handleModal(true)} disableTouchRipple>
            <ZoomIcon className={classes.zoomIcon} />
            Explore Pak
          </Button>
        </CardActions>
        <CardActions>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            style={{ marginRight: '10px' }}
            item
            xs={4}
            sm={12}
          >
            <Typography className={classes.startingAt}>Starting at</Typography>
            <Typography className={classes.price}>${finalPrice}</Typography>
          </Grid>
          <Grid container spacing={0} justify="flex-end" item xs={8} sm={12}>
            <Button
              size="small"
              color="primary"
              variant="contained"
              className={classes.buttons}
              onClick={() => handleClick()}
              disableTouchRipple
            >
              PICK THIS PACK
            </Button>
          </Grid>
        </CardActions>
      </Card>
      <Dialog
        open={isModalOpen}
        onClose={() => handleModal(false)}
        classes={{ paper: classes.dialogPaper }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        scroll="body"
      >
        <DialogActions>
          <IconButton aria-label="Close" onClick={() => handleModal(false)}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogTitle disableTypography id="alert-dialog-title">
          <Typography variant="h2" className={classes.explorePakTitle}>
            {product.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" className={classes.explorePakDescription}>
            {product.description}
          </Typography>
          <IncludesTab product={product} />
        </DialogContent>
      </Dialog>
    </>
  );
};

Item.propTypes = {
  classes: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired
};

export default withStyles(styles)(Item);
