import React from 'react';
import PropTypes from 'prop-types';
import { graphql, compose } from 'react-apollo';
import { Divider, Grid, Typography, Modal } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import {
  addCampusAddress,
  addBusinessAddress,
  addResidentialAddress,
  zipcode
} from '../../src/graphql/checkout';
import ShippingAddress from './ShippingAddress';

const styles = theme => ({
  container: {
    height: 'fit-content',
    maxHeight: '91%',
    overflow: 'auto',
    backgroundColor: 'white',
    position: 'absolute',
    width: '98%',
    maxWidth: 800,
    padding: theme.spacing.unit * 4,
    boxShadow: theme.shadows[5],
    outline: 'none',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,

    [theme.breakpoints.down('sm')]: {
      height: '100%'
    }
  },
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`,
    backgroundColor: 'rgba(0, 0, 0, 0.62)',

    '&.dotted': {
      border: '0.3px dashed rgba(0, 0, 0, 0.12)',
      backgroundColor: 'transparent'
    }
  },
  fullWidth: {
    width: '100%'
  },
  formControl: {
    width: '100%',
    height: 44,
    border: `1px solid ${theme.palette.common.grey['900']}`,
    color: theme.palette.common.grey['700'],
    borderRadius: '4px',
    fontSize: 20,

    '&:active, &:focus': {
      borderColor: theme.palette.common.grey['900'],
      color: theme.palette.common.grey['800']
    },

    '&:hover > fieldset': {
      border: 'none'
    }
  },
  group: {
    flexDirection: 'row'
  },
  select: {
    marginLeft: 0
  },
  primaryButton: {
    backgroundColor: theme.palette.common.grey['800'],
    color: 'white',
    textTransform: 'none',
    borderRadius: 0,

    '&:hover': {
      backgroundColor: theme.palette.common.grey['100']
    }
  },
  button: {
    height: 40,
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    backgroundColor: theme.palette.common.grey[600],
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: theme.palette.common.grey[600]
    }
  },
  endorsedButton: {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.main
    }
  },
  textField: {
    height: 44,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    padding: theme.spacing.unit,
    width: '100%',
    border: `1px solid ${theme.palette.common.grey['900']}`,
    borderRadius: '4px',
    fontSize: 20,

    '& > fieldset': {
      border: 'none'
    },

    '& > input': {
      padding: 0,
      fontSize: 20,
      color: theme.palette.common.grey['900']
    },

    '&.error': {
      border: `1px solid ${theme.palette.common.error}`,
      color: theme.palette.common.error,
      '& > input': {
        color: theme.palette.common.error
      }
    }
  },
  wrapper: {
    '& > div': {
      width: '100%'
    }
  },
  icon: {
    cursor: 'pointer',
    fontSize: 24
  },
  nooverflow: {
    maxWidth: '100%',
    border: `1px solid ${theme.palette.common.grey['900']}`,
    color: theme.palette.common.grey['700'],
    borderRadius: '4px',
    fontSize: 20,

    '&:active, &:focus': {
      borderColor: theme.palette.common.grey['900'],
      color: theme.palette.common.grey['800']
    }
  },
  error: {
    color: theme.palette.common.error
  }
});

class ShippingAddressModal extends React.Component {
  // componentDidUpdate(prevProps) {
  //   if (prevProps.shipment.addressId !== this.props.shipment.addressId) {
  //     const shippingAddress =
  //       this.props.usedAddresses.filter(
  //         addr => parseInt(addr.id, 10) === this.props.shipment.addressId
  //       ) || [];
  //     if (shippingAddress[0] && this.props.shipment.addressId !== 0) {
  //       // Find selected address id
  //       let i = 0;
  //       for (; i < this.props.usedAddresses.length; i += 1) {
  //         if (shippingAddress[0].id === this.props.usedAddresses[i].i) {
  //           break;
  //         }
  //       }
  //       // eslint-disable-next-line react/no-did-update-set-state
  //       this.setState(
  //         {
  //           selectedAddress: i,
  //           type: shippingAddress[0].type,
  //           ...shippingAddress[0].address,
  //           ...shippingAddress[0].student,
  //           ...shippingAddress[0].campusInfo
  //         },
  //         () => this.validateFields()
  //       );
  //     }

  //     if (this.props.shipment.addressId === 0) {
  //       // eslint-disable-next-line react/no-did-update-set-state
  //       this.setState({
  //         selectedAddress: -1,
  //         ...(shippingAddress[0] || {}).student,
  //         address: '',
  //         apt: '',
  //         company: '',
  //         city: '',
  //         state: '',
  //         zip: '',
  //         resHall: '',
  //         residence: '',
  //         schoolInfo: '',
  //         campusBox: '',
  //         roomNo: '',
  //         dobError: false,
  //         phoneError: false,
  //         emailError: false,
  //         zipError: false,
  //         isGoodToGo: false
  //       });
  //     }
  //   }

  //   if (
  //     prevProps.shipment.id !== this.props.shipment.id &&
  //     this.props.shipment.addressId === 0
  //   ) {
  //     // eslint-disable-next-line react/no-did-update-set-state
  //     this.setState({
  //       type: JSON.stringify(
  //         this.props.shippingOptions[this.props.shipment.id][0]
  //       ),
  //       selectedAddress: -1,
  //       address: '',
  //       apt: '',
  //       company: '',
  //       city: '',
  //       state: '',
  //       zip: '',
  //       resHall: '',
  //       residence: '',
  //       schoolInfo: '',
  //       campusBox: '',
  //       roomNo: '',
  //       dobError: false,
  //       phoneError: false,
  //       emailError: false,
  //       zipError: false,
  //       isGoodToGo: false
  //     });
  //   }
  // }

  render() {
    const { classes, open, handleClose, ...otherProps } = this.props;

    return (
      <Modal open={open} onClose={handleClose}>
        <form onSubmit={this.onUseThisAddress} className={classes.container}>
          <Grid container direction="column" spacing={16}>
            <Grid
              item
              md={12}
              xs={12}
              container
              alignItems="center"
              justify="space-between"
            >
              <Typography variant="h5">Enter a delivery address</Typography>
              <CloseIcon className={classes.icon} onClick={handleClose} />
            </Grid>
            <Grid item>
              <Divider className={classes.divider} />
            </Grid>
            <ShippingAddress
              needTitle={false}
              setCompleted={handleClose}
              {...otherProps}
            />
          </Grid>
        </form>
      </Modal>
    );
  }
}

ShippingAddressModal.propTypes = {
  classes: PropTypes.object.isRequired
};

export default compose(
  graphql(addBusinessAddress, { name: 'addBusinessAddress' }),
  graphql(addResidentialAddress, { name: 'addResidentialAddress' }),
  graphql(addCampusAddress, { name: 'addCampusAddress' }),
  graphql(zipcode, { name: 'zipcode' }),
  withStyles(styles)
)(ShippingAddressModal);
