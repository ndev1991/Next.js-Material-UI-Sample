import { Fragment, useState, useContext, useEffect } from 'react';
import { Button, Grid, withStyles } from '@material-ui/core';
import {
  Configurations,
  ItemDescription,
  ItemTitle,
  ImageWithZoom
} from '../../../../../components';
import { url, CloudinaryContext } from '../../../../../lib/cloudinary';
import { arisProductInitiallySelectedItem } from '../../../../../src/helpers/products';

const styles = theme => ({
  confirmButton: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: 600,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 1.5}px`,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  }
});

const StepThree = ({ classes, product, handleNext, handleSelected }) => {
  const { cloudName, imagePath } = useContext(CloudinaryContext);
  const productCopy = { ...product };
  productCopy.configurations = productCopy.configurations.map(conf => ({
    ...conf,
    items: conf.items.map(item => ({
      ...item,
      imageUrl: url(cloudName, `${imagePath}/${item.imageUrl}`, {
        width: 1000,
        crop: 'fit'
      })
    }))
  }));

  const initiallySelectedConfigurations = arisProductInitiallySelectedItem(
    productCopy,
    'configurations'
  );

  const [selectedConfigurations, setSelectedConfigurations] = useState(
    initiallySelectedConfigurations
  );

  useEffect(() => {
    handleSelected(selectedConfigurations);
  }, []);

  const handleConfigurationSelection = configurationItem => {
    setSelectedConfigurations(configurationItem);
    return handleSelected(configurationItem);
  };

  return (
    <Fragment>
      <Grid container spacing={0}>
        <Grid item sm={4} xs={12}>
          <ImageWithZoom
            imageUrl={selectedConfigurations[0].imageUrl}
            zoomedImageUrl={selectedConfigurations[0].imageUrl}
            zoomedImageWidth={1000}
            zoomedImageHeight={1000}
            label="Roll over to zoom"
          />
        </Grid>
        <Grid item sm={8} xs={12}>
          <ItemTitle title={productCopy.configurations[0].name} />
          <ItemDescription
            description={productCopy.configurations[0].description}
          />
          <Configurations
            configurations={productCopy.configurations}
            selectedConfigurations={selectedConfigurations}
            onSetSelectedConfigurations={handleConfigurationSelection}
            display="card"
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={0}
        justify="flex-end"
        alignContent="center"
        item
        xs={12}
      >
        <Button
          className={classes.confirmButton}
          onClick={handleNext}
          variant="contained"
          disableTouchRipple
        >
          CONFIRM COMFORT
        </Button>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(StepThree);
