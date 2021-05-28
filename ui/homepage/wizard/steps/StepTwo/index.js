import { Fragment, useState, useEffect, useContext } from 'react';
import { Button, Grid, withStyles } from '@material-ui/core';
import { Apps as AppsIcon } from '@material-ui/icons';
import { ItemTitle, Photos, Variants } from '../../../../../components';
import StyleModal from './StyleModal';
import NotificationsContext from '../../../../../lib/notificationsContext';

const styles = theme => ({
  button: {
    backgroundColor: theme.palette.primary.default,
    color: theme.palette.common.white,
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: 600,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.5}px`,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.default
    }
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  confirmButton: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: 600,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.5}px`,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginTop: theme.spacing.unit
    },
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  }
});

const StepTwo = ({ classes, product, handleNext, handleSelected }) => {
  const { showNotification } = useContext(NotificationsContext);

  const [isModalOpen, handleModal] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState(null);
  const [photos, setProductPhotos] = useState(product.images);
  const [selectedPhoto, setSelectedPhoto] = useState(photos[0]);

  useEffect(() => {
    handleSelected(selectedVariants);
  }, []);

  const updatePhotos = newPhotos => {
    setProductPhotos(newPhotos);
    setSelectedPhoto(newPhotos[0]);
  };

  const handleVariantSelection = variants => {
    setSelectedVariants(variants);
    if (isModalOpen) handleModal(false);
    return handleSelected(variants);
  };

  const handleNextSelection = () => {
    if (!selectedVariants)
      return showNotification({
        type: 'school',
        message: 'Choose your color to continue'
      });

    return handleNext();
  };

  return (
    <Fragment>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={6}>
          <Photos
            photos={photos}
            selectedPhoto={selectedPhoto}
            onSetSelectedPhoto={setSelectedPhoto}
          />
        </Grid>
        <Grid item xs={12} sm={1} />
        <Grid item xs={12} sm={5}>
          <ItemTitle title={product.name} />
          <Variants
            variants={product.variants}
            selectedVariants={selectedVariants}
            onSetSelectedVariants={handleVariantSelection}
            onSetProductPhotos={updatePhotos}
            display="no-carousel"
          />
        </Grid>
      </Grid>
      <Grid container spacing={0}>
        <Grid
          container
          spacing={0}
          justify="center"
          alignContent="center"
          item
          sm={4}
        />
        <Grid
          container
          spacing={0}
          justify="center"
          alignContent="center"
          item
          sm={4}
          xs={12}
        >
          <Button
            className={classes.button}
            onClick={() => handleModal(true)}
            variant="contained"
            disableTouchRipple
          >
            <AppsIcon className={classes.leftIcon} />
            STYLE GALLERY
          </Button>
        </Grid>
        <Grid
          container
          spacing={0}
          justify="flex-end"
          alignContent="center"
          item
          sm={4}
          xs={12}
        >
          <Button
            className={classes.confirmButton}
            onClick={handleNextSelection}
            variant="contained"
            disableTouchRipple
          >
            SELECT STYLE
          </Button>
        </Grid>
      </Grid>
      <StyleModal
        isModalOpen={isModalOpen}
        handleModal={handleModal}
        product={product}
        variants={{
          selectedVariants,
          handleVariantSelection,
          updatePhotos
        }}
      />
    </Fragment>
  );
};

export default withStyles(styles)(StepTwo);
