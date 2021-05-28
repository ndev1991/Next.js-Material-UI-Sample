import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Button,
  // Checkbox,
  // RadioGroup,
  // Radio,
  Grid,
  Divider,
  Hidden
  // Select,
  // MenuItem,
  // OutlinedInput,
  // FormControl,
  // FormControlLabel,
  // InputLabel
  // ExpansionPanel,
  // ExpansionPanelSummary,
  // ExpansionPanelActions,
  // ExpansionPanelDetails
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import classNames from 'classnames';
import numeral from 'numeral';

import { url, CloudinaryContext } from '../../lib/cloudinary';
import SchoolLogo from '../../static/img/icons/SchoolLogo';
// import UpgradeIcon from '../../static/img/icons/upgrade.png';
import NumberInput from '../../components/forms/NumberInput';

const routes = require('next-routes')();

// const QUANTITIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const styles = theme => ({
  button: {
    background: 'grey',
    textTransformation: 'none',
    color: 'white'
  },
  redTypo: {
    color: 'red'
  },
  select: {
    height: 44
  },
  logo: {
    width: 42,
    height: 42
  },
  transButton: {
    textTransform: 'none',
    textDecoration: 'underline',
    color: theme.palette.secondary.main,
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: 14,
    paddingLeft: 0,

    '&:hover': {
      fontWeight: 600,
      textDecoration: 'underline'
    }
  },
  checkbox: {
    alignItems: 'flex-start'
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  blackImg: {
    background: 'transparent',
    width: 100,
    height: 100,
    maxWidth: '100%',

    [theme.breakpoints.down('sm')]: {
      width: 85,
      height: 85
    },

    '&.small': {
      width: 80,
      height: 80
    },

    '& > img': {
      width: '100%',
      maxWidth: '100%',
      paddingBottom: '75%'
    }
  },
  secondaryButton: {
    backgroundColor: theme.palette.common.grey['100'],
    color: 'white',
    textTransform: 'none',
    borderRadius: 0,
    marginTop: theme.spacing.unit
  },
  schoolLogo: {
    [theme.breakpoints.down('sm')]: {
      width: 30,
      height: 30
    }
  },
  primaryButton: {
    backgroundColor: theme.palette.common.grey['800'],
    color: 'white',
    textTransform: 'none',
    borderRadius: 0
  },
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',

    '&.dotted': {
      border: '0.3px dashed rgba(0, 0, 0, 0.12)',
      backgroundColor: 'transparent'
    }
  },
  group: {
    flexDirection: 'row'
  },
  method: {
    border: '1px solid grey',
    padding: theme.spacing.unit,
    margin: theme.spacing.unit
  },
  typoButton: {
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: 18,
    fontFamily: 'Montserrat',
    fontWeight: 'bold'
  },
  summary: {
    background: theme.palette.grey['700'],
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    svg: {
      fill: 'white'
    }
  },
  title: {
    margin: theme.spacing.unit,
    color: 'white'
  },
  formControl: {
    width: '50%'
  },
  miniLogo: {
    width: 30,
    height: 30
  }
});

const ItemShipment = props => {
  const {
    classes,
    item,
    onRemoveItem,
    onUpdateItem,
    color,
    schoolcode
  } = props;
  const [quantity, setQuantity] = useState(item.quantity);
  const endorsed = schoolcode.toLowerCase() !== 'ocm';

  useEffect(() => {
    setQuantity(item.quantity);
  }, [props.item.id]);

  const { cloudName, imagePath } = useContext(CloudinaryContext);
  // const [upgradableItems, setUpgradableItems] = useState(UPGRADABLE);// eslint-disable-line
  // const [subItems, setSubItems] = useState(item.subItems);// eslint-disable-line

  const updateCartItemCount = count => {
    onUpdateItem(item.id, {
      ...item,
      quantity: count
    });
  };

  const renderMoveInDelivery = () => (
    <Grid
      item
      md={12}
      sm={6}
      container
      alignItems="center"
      justify="center"
      spacing={8}
    >
      <Grid item className={classes.miniLogo} md={2} xs={2}>
        <SchoolLogo color={color} />
      </Grid>
      <Grid item md={10} xs={10}>
        <Typography>Campus Delivery Available</Typography>
      </Grid>
    </Grid>
  );

  const renderOptions = () => {
    if (item.items && item.items.length) {
      return (
        <Grid item container spacing={16} direction="column">
          <Hidden smDown>
            <Grid item>
              <Divider className={classNames(classes.divider, 'dotted')} />
            </Grid>
          </Hidden>
          {item.items.map(subItem => (
            <Grid key={subItem.id} item container spacing={8}>
              <Hidden smDown>
                <Grid item>
                  <div className={classNames(classes.blackImg, 'small')}>
                    <img
                      src={url(cloudName, `${imagePath}/${subItem.itemImage}`, {
                        width: 80,
                        crop: 'fit'
                      })}
                      alt={subItem.itemImage}
                    />
                  </div>
                </Grid>
              </Hidden>
              <Grid item>
                <Typography variant="subtitle2">{subItem.itemTitle}</Typography>
                {subItem.options &&
                  subItem.options.map(option => (
                    <Typography key={option.optionId}>
                      {`${option.groupName}: ${option.optionName}`}
                    </Typography>
                  ))}
                <Typography gutterBottom>
                  {`SKU: ${subItem.itemSku}`}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Grid>
      );
    }

    return null;
  };

  const itemUrl = endorsed ? `/${schoolcode}${item.itemUrl}` : item.itemUrl;

  return (
    <Grid container>
      <Grid item container spacing={16}>
        <Grid
          item
          md={2}
          xs={4}
          className={classes.typoButton}
          onClick={() => routes.Router.push(itemUrl)}
        >
          <div className={classes.blackImg}>
            <img
              src={url(cloudName, `${imagePath}/${item.itemImage}`, {
                width: 100,
                crop: 'fit'
              })}
              alt={item.itemImage}
            />
          </div>
        </Grid>
        <Grid item container md={10} xs={8}>
          <Grid item container spacing={8}>
            <Grid item container md={6}>
              <Grid item>
                <Typography
                  variant="subtitle2"
                  className={classes.typoButton}
                  onClick={() => routes.Router.push(itemUrl)}
                >
                  {item.itemTitle}
                </Typography>
                <Hidden smUp>
                  <Typography
                    variant="subtitle2"
                    align="center"
                    className={classes.redTypo}
                  >
                    {numeral(item.unitPrice * item.quantity).format('$0,0.00')}
                  </Typography>
                </Hidden>
                {item.options &&
                  item.options.map(option => (
                    <Typography key={option.optionId}>
                      {`${option.groupName}: ${option.optionName}`}
                    </Typography>
                  ))}
                <Typography gutterBottom>{`SKU: ${item.itemSku}`}</Typography>
              </Grid>
              {endorsed && item.canShipToSchool && renderMoveInDelivery()}
            </Grid>
            <Hidden smUp>{renderOptions()}</Hidden>
            <Grid item container md={3} sm={12} xs={12} direction="column">
              {endorsed && (
                <Hidden smUp>
                  <Grid item>
                    <Typography>Fulfilled by OCM</Typography>
                  </Grid>
                </Hidden>
              )}
              <Grid item>
                <NumberInput
                  initial={quantity}
                  min={1}
                  onUpdate={updateCartItemCount}
                />
              </Grid>
              <Grid item>
                <Hidden xsDown implementation="css">
                  <Button
                    className={classes.transButton}
                    onClick={onRemoveItem}
                  >
                    <ClearIcon className={classes.leftIcon} />
                    Remove
                  </Button>
                </Hidden>
                <Hidden smUp implementation="css">
                  <Button
                    className={classes.secondaryButton}
                    onClick={onRemoveItem}
                    fullWidth
                  >
                    Remove
                  </Button>
                </Hidden>
              </Grid>
            </Grid>
            <Hidden xsDown>
              <Grid item md={3} sm={6}>
                <Typography variant="subtitle2" align="center" gutterBottom>
                  {numeral(item.unitPrice * item.quantity).format('$0,0.00')}
                </Typography>
              </Grid>
            </Hidden>
          </Grid>
          <Hidden xsDown>{renderOptions()}</Hidden>
          {/* {item.isUpgradable && (
                <Grid item>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      className={classes.summary}
                      expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                    >
                      <img src={UpgradeIcon} alt="upgrade_icon" />
                      <Typography className={classes.title}>
                        Upgrades Available
                      </Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
                      {upgradableItems.map((upItem, id) => {
                        const divider =
                          id < upgradableItems.length - 1 ? <Divider /> : null;

                        let selectedOption = 0;
                        let isIncluded = false;
                        for (let i = 0; i < subItems.length; i += 1) {
                          if (subItems[i].sku === upItem.sku) {
                            isIncluded = true;
                            for (let j = 0; j < upItem.options.length; j += 1) {
                              if (
                                subItems[i].price === upItem.options[j].price
                              ) {
                                selectedOption = j;
                              }
                            }
                            break;
                          }
                        }

                        return (
                          <React.Fragment key={id}>
                            <FormControlLabel
                              className={classes.checkbox}
                              control={
                                <Checkbox
                                  checked={!!isIncluded}
                                  onChange={() => {}}
                                  value={upItem.sku}
                                  color="primary"
                                />
                              }
                              label={
                                <Grid container direction="column">
                                  <Grid item>
                                    <Typography>{upItem.title}</Typography>
                                  </Grid>
                                  <Grid
                                    item
                                    container
                                    direction="row"
                                    spacing={8}
                                  >
                                    <Grid item md={8}>
                                      <Typography>
                                        {upItem.description}
                                      </Typography>
                                    </Grid>
                                    <Grid item md={4}>
                                      <RadioGroup
                                        aria-label={`Options${id}`}
                                        name={`options${id}`}
                                        className={classes.group}
                                        value={selectedOption}
                                        onChange={() => {}}
                                        disabled={!!isIncluded}
                                      >
                                        {upItem.options.map((option, idx) => (
                                          <FormControlLabel
                                            key={idx}
                                            value={idx}
                                            control={<Radio />}
                                            label={`${option.name} Upgrade (+$${
                                              option.price
                                            })`}
                                          />
                                        ))}
                                      </RadioGroup>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              }
                            />
                            {divider}
                          </React.Fragment>
                        );
                      })}
                    </ExpansionPanelDetails>
                    <ExpansionPanelActions>
                      <Button>Update Cart</Button>
                    </ExpansionPanelActions>
                  </ExpansionPanel>
                </Grid>
              )} */}
        </Grid>
      </Grid>
      {item.isCampus && (
        <Hidden smUp>
          <Grid item container direction="column">
            <Grid item md={12}>
              <Divider className={classNames(classes.divider, 'dotted')} />
            </Grid>
            {renderMoveInDelivery()}
          </Grid>
        </Hidden>
      )}
    </Grid>
  );
};

ItemShipment.propTypes = {
  classes: PropTypes.object.isRequired,
  item: PropTypes.object
};

export default withStyles(styles)(ItemShipment);
