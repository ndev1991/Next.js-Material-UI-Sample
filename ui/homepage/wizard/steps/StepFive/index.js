import React, { Fragment, useContext, useState } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Typography
} from '@material-ui/core';
import { ImageWithZoom, Recommendations } from '../../../../../components';
import { SchoolConsumer } from '../../../../../lib/schoolContext';
import { url, CloudinaryContext } from '../../../../../lib/cloudinary';
import { Router, Link } from '../../../../../routes';

const styles = theme => ({
  container: {
    flexDirection: 'column'
  },
  root: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: theme.spacing.unit * 2.5,
    margin: theme.spacing.unit * 2.5,
    border: `1px solid ${theme.palette.common.grey[400]}`
  },
  content: {
    padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 2}px`
  },
  mainTitle: {
    fontFamily: 'Oswald',
    fontSize: 28,
    color: theme.palette.primary.main,
    textTransform: 'uppercase'
  },
  image: {
    width: '100%',
    cursor: 'pointer'
  },
  button: {
    marginLeft: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      margin: '4px 0'
    }
  },
  buttonSecondary: {
    marginLeft: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.secondary.main}`,
    '&:hover': {
      border: `1px solid ${theme.palette.secondary.main}`,
      backgroundColor: theme.palette.common.white
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      margin: '4px 0'
    }
  },
  subTitle: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: theme.palette.primary.default,
    paddingTop: theme.spacing.unit / 2,
    display: 'flex',
    lineHeight: 1.5
  },
  bold: {
    fontWeight: 500,
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: theme.palette.primary.default,
    paddingLeft: theme.spacing.unit
  },
  customerSection: {
    padding: `${theme.spacing.unit * 1.5}px 0 ${theme.spacing.unit * 2}px 0`,
    [theme.breakpoints.down('xs')]: {
      padding: 0,
      marginLeft: theme.spacing.unit / 2,
      marginRight: theme.spacing.unit / 2
    }
  },
  card: {
    width: '25%',
    borderRadius: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
    padding: `${theme.spacing.unit}px 5%`,
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing.unit / 2
    }
  },
  media: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  selectedMedia: {
    outline: `2px solid ${theme.palette.primary.highlight}`
  },
  link: {
    margin: `${theme.spacing.unit * 2}px auto`,
    color: theme.palette.secondary.main,
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'unset',
    '&:hover': {
      backgroundColor: 'unset',
      textDecoration: 'underline'
    }
  },
  linkEndorsed: {
    color: theme.palette.primary.main
  }
});

const StepFiveComponent = props => {
  const { product, variant, configuration, trunk, classes, closeModal } = props;
  const { cloudName, imagePath } = useContext(CloudinaryContext);

  const title = "GREAT! HERE'S YOUR PAK.";

  const pakImageUrl =
    product.images && product.images.length > 0
      ? url(cloudName, `${imagePath}/${product.images[0]}`, {
          width: 1000,
          crop: 'fit'
        })
      : '';

  const configurationImageUrl = configuration ? configuration[0].imageUrl : '';

  const trunkImageUrl = trunk
    ? url(cloudName, `${imagePath}/${trunk.variants[0].images[0]}`, {
        width: 1000,
        crop: 'fit'
      })
    : '';

  const trunkConfigurationImageUrl =
    trunk && trunk.configurations[0]
      ? url(cloudName, `${imagePath}/${trunk.configurations[0].imageUrl}`, {
          width: 1000,
          crop: 'fit'
        })
      : '';

  const [selectedImage, setSelectedImage] = useState(pakImageUrl);

  return (
    <SchoolConsumer>
      {value => {
        const endorsed = value.toLowerCase() !== 'ocm';
        return (
          <Fragment>
            <Grid container spacing={0}>
              <Grid item sm={4} xs={12}>
                <ImageWithZoom
                  imageUrl={selectedImage}
                  zoomedImageUrl={selectedImage}
                  zoomedImageWidth={1000}
                  zoomedImageHeight={1000}
                  label="Roll over to zoom"
                />
              </Grid>
              <Grid item sm={8} xs={12}>
                <Grid container spacing={0} className={classes.container}>
                  <div className={[classes.root, classes.container]}>
                    <Typography className={classes.mainTitle}>
                      {title}
                    </Typography>
                    <div className={classes.content}>
                      <div className={classes.subTitle}>
                        PAK:
                        <Typography className={classes.bold}>
                          {product.name}
                        </Typography>
                      </div>
                      {variant && (
                        <div className={classes.subTitle}>
                          STYLE:
                          <Typography className={classes.bold}>
                            {variant[0].name}
                          </Typography>
                        </div>
                      )}
                      {configuration && (
                        <div className={classes.subTitle}>
                          UPGRADE:
                          <Typography className={classes.bold}>
                            {configuration[0].name}
                          </Typography>
                        </div>
                      )}
                      {trunk && (
                        <div className={classes.subTitle}>
                          TRUNK:
                          <Typography className={classes.bold}>
                            {`${trunk.variants[0].name} ${
                              trunk.configurations[0] ? 'with wheels' : ''
                            }`}
                          </Typography>
                        </div>
                      )}
                    </div>
                    <div className={classes.root}>
                      <Card className={classes.card}>
                        <CardActionArea
                          onClick={() => setSelectedImage(pakImageUrl)}
                        >
                          <CardMedia
                            component="img"
                            alt={product.name}
                            className={classNames(
                              pakImageUrl === selectedImage &&
                                classes.selectedMedia,
                              classes.media
                            )}
                            image={pakImageUrl}
                            title={product.name}
                          />
                        </CardActionArea>
                      </Card>
                      {configuration && (
                        <Card className={classes.card}>
                          <CardActionArea
                            onClick={() =>
                              setSelectedImage(configurationImageUrl)
                            }
                          >
                            <CardMedia
                              component="img"
                              alt={configuration[0].name}
                              className={classNames(
                                configurationImageUrl === selectedImage &&
                                  classes.selectedMedia,
                                classes.media
                              )}
                              image={configurationImageUrl}
                              title={configuration[0].name}
                            />
                          </CardActionArea>
                        </Card>
                      )}
                      {trunk && (
                        <>
                          <Card className={classes.card}>
                            <CardActionArea
                              onClick={() => setSelectedImage(trunkImageUrl)}
                            >
                              <CardMedia
                                component="img"
                                alt={trunk.variants[0].name}
                                className={classNames(
                                  trunkImageUrl === selectedImage &&
                                    classes.selectedMedia,
                                  classes.media
                                )}
                                image={trunkImageUrl}
                                title={trunk.variants[0].name}
                              />
                            </CardActionArea>
                          </Card>
                          {trunk.configurations[0] && (
                            <Card className={classes.card}>
                              <CardActionArea
                                onClick={() =>
                                  setSelectedImage(trunkConfigurationImageUrl)
                                }
                              >
                                <CardMedia
                                  component="img"
                                  alt={trunk.variants[0].name}
                                  className={classNames(
                                    trunkConfigurationImageUrl ===
                                      selectedImage && classes.selectedMedia,
                                    classes.media
                                  )}
                                  image={trunkConfigurationImageUrl}
                                  title={trunk.configurations[0].name}
                                />
                              </CardActionArea>
                            </Card>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <Grid
                    container
                    spacing={0}
                    justify="center"
                    alignContent="center"
                    item
                    xs={12}
                  >
                    <Link
                      route={
                        endorsed ? `/${value.toLowerCase()}/cart` : '/cart'
                      }
                      prefetch
                    >
                      <Button
                        className={classes.buttonSecondary}
                        disableTouchRipple
                      >
                        VIEW CART
                      </Button>
                    </Link>
                    <Link
                      route={
                        endorsed
                          ? `/${value.toLowerCase()}/checkout`
                          : '/checkout'
                      }
                      prefetch
                    >
                      <Button className={classes.button} disableTouchRipple>
                        CHECK OUT
                      </Button>
                    </Link>
                  </Grid>
                  <Grid
                    container
                    spacing={0}
                    justify="center"
                    alignContent="center"
                    item
                    xs={12}
                  >
                    <Button
                      component="a"
                      disableRipple
                      variant="text"
                      className={classNames(
                        classes.link,
                        endorsed ? classes.linkEndorsed : ''
                      )}
                      onClick={() => closeModal()}
                    >
                      CONTINUE SHOPPING >
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {product && (
              <div className={classes.customerSection}>
                <Recommendations
                  // forceVariableWidth
                  // halfSize
                  schoolCode={value}
                  gtmList="wizard"
                  title="DORM ROOM ESSENTIALS"
                  className={classes.recommendationSection}
                  id={product.id}
                  type="UPSELL"
                  buttonOptions={{
                    label: 'View Detail',
                    action: item => {
                      Router.push(
                        `${value !== 'OCM' ? `/${value}` : ''}${
                          item.pdpUrl.includes('/product')
                            ? item.pdpUrl
                            : `/product${item.pdpUrl
                                .replace(/\/$/, '')
                                .substr(item.pdpUrl.lastIndexOf('/'))}`
                        }`
                      );
                    }
                  }}
                />
              </div>
            )}
          </Fragment>
        );
      }}
    </SchoolConsumer>
  );
};

export default withStyles(styles)(StepFiveComponent);
