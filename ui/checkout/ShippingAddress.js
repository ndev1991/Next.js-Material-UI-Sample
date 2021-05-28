import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Divider,
  Grid,
  Select,
  TextField,
  Typography,
  FormControl,
  OutlinedInput
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import InputMask from 'react-input-mask';
import classNames from 'classnames';

import InputField from '../../components/forms/InputField';
import DeliveryLocation from './DeliveryLocation';

const zipFormat = RegExp('^[0-9]{5}$|^[0-9]{5}-[0-9]{4}$');

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //eslint-disable-line
  return re.test(email);
}

function sortByWithDays(o1, o2) {
  const lowDays1 = o1.withDaysLow || 0;
  const highDays1 = o1.withDaysHigh || 0;
  const lowDays2 = o2.withDaysLow || 0;
  const highDays2 = o2.withDaysHigh || 0;

  if (lowDays1 < lowDays2) {
    return 1;
  }

  if (lowDays1 > lowDays2) {
    return -1;
  }

  if (highDays1 <= highDays2) {
    return 1;
  }

  return -1;
}

function sortOptionsByPrice(arr) {
  return [
    ...arr
      .filter(opt => opt.price.toLowerCase() === 'free')
      .sort((o1, o2) => sortByWithDays(o1, o2)),
    ...arr
      .filter(opt => opt.price.toLowerCase() !== 'free')
      .sort((o1, o2) => {
        const price1 = parseFloat(o1.price.slice(1));
        const price2 = parseFloat(o2.price.slice(1));

        if (price1 > price2) {
          return 1;
        }

        if (price1 < price2) {
          return -1;
        }

        return sortByWithDays(o1, o2);
      })
  ];
}

const monthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const styles = theme => ({
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
  error: {
    color: theme.palette.common.error
  },
  normalText: {
    fontFamily: 'Montserrat, Oswald, Roboto',
    fontWeight: 400,
    fontSize: 20,
    color: theme.palette.common.grey['800']
  }
});

class ShippingAddress extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: JSON.stringify({}),
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthday: '',
      school: '',
      schoolCode: props.schoolcode,
      address: '',
      resHall: 'unknown',
      roomNo: '',
      campusBox: '',
      company: '',
      apt: '',
      city: '',
      state: '',
      zip: '',
      isGoodToGo: false,
      isValidForm: false,
      isValidZip: false,
      errorMsg: 'Please fill out all required fields.',
      dobError: false,
      phoneError: false,
      emailError: false,
      zipError: false,
      residence: '',
      schoolInfo: ''
    };
  }

  componentDidMount() {
    const shippingAddress =
      this.props.usedAddresses.filter(
        addr => parseInt(addr.id, 10) === this.props.shipment.addressId
      ) || [];

    if (shippingAddress[0]) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        {
          type: shippingAddress[0].type,
          ...shippingAddress[0].address,
          ...shippingAddress[0].student,
          ...shippingAddress[0].campusInfo
        },
        () => this.validateFields()
      );
    } else if (this.props.shippingOptions[this.props.shipment.id]) {
      this.setState({
        type: JSON.stringify(
          this.props.shippingOptions[this.props.shipment.id][0]
        )
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.shippingOptions !== this.props.shippingOptions) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        type: JSON.stringify(
          this.props.shippingOptions[this.props.shipment.id][0]
        )
      });
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value }, () => this.validate());
  };

  handleSchoolChange = event => {
    const school = JSON.parse(event.target.value);

    this.setState({
      schoolInfo: event.target.value,
      school: school.name,
      schoolCode: school.code
    });
  };

  handleResHallChange = event => {
    const residence = JSON.parse(event.target.value);

    this.setState(
      {
        residence: event.target.value,
        resHall: residence.name,
        address: residence.address,
        state: residence.state,
        zip: residence.zip,
        city: residence.city
      },
      () => this.validateFields()
    );
  };

  initAddressInfo = () => {
    this.setState(
      {
        address: '',
        apt: '',
        company: '',
        city: '',
        state: '',
        zip: '',
        resHall: '',
        residence: '',
        schoolInfo: '',
        campusBox: '',
        roomNo: '',
        dobError: false,
        phoneError: false,
        emailError: false,
        zipError: false,
        isValidForm: false,
        isValidZip: false,
        isGoodToGo: false
      },
      () => this.validateFields()
    );
  };

  handleShippingOptionChange = event => {
    this.setState({ type: event.target.value }, () => this.initAddressInfo());
  };

  zipValidate = async (isValid, errorMsg) => {
    const { zip, type, city, state } = this.state;
    let shippingOption = {};
    let noShipping = false;

    try {
      shippingOption = JSON.parse(type);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('No Shipping Options.');
      noShipping = true;
    }

    const { isCampusDelivery } = shippingOption;
    let zipErr = false;
    let ct = city;
    let st = state;

    if (!isCampusDelivery) {
      if (zipFormat.test(zip)) {
        // Mailing address validation
        const zipRes = await this.props.zipcode({
          variables: {
            zip: zip.slice(0, 5)
          }
        });

        if (!zipRes.data.zip) {
          zipErr = true;
        } else {
          ct = zipRes.data.zip.city;
          st = zipRes.data.zip.state;
        }
      } else {
        zipErr = true;
      }
    }

    let errMsg = '';
    if (noShipping) {
      errMsg = 'No Shipping Options.';
    } else if (zipErr) {
      errMsg = 'Invalid Zip Code.';
      ct = '';
      st = '';
    } else {
      errMsg =
        '*Please fill out all required fields and correct invalid inputs.';
    }

    this.setState(
      {
        isValidZip: !(zipErr || noShipping),
        zipError: zipErr,
        city: ct,
        state: st,
        errorMsg: isValid ? errMsg : errorMsg
      },
      () => this.checkIfValid()
    );
  };

  validate = () => {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      birthday,
      company,
      type,
      zip
    } = this.state;
    let shippingOption = {};
    let noShipping = false;

    try {
      shippingOption = JSON.parse(type);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('No Shipping Options.');
      noShipping = true;
    }

    const { isCampusDelivery } = shippingOption;
    let birthErr = false;
    let phoneErr = false;
    let emailErr = false;
    let empty = false;

    const v1 = parseInt(birthday.split('/')[0], 10);
    const v2 = parseInt(birthday.split('/')[1], 10);

    if (
      birthday &&
      // eslint-disable-next-line no-restricted-globals
      (isNaN(v1) || isNaN(v2) || v1 < 1 || v1 > 12 || v2 > monthDays[v1 - 1])
    ) {
      birthErr = true;
    }

    if (!validateEmail(email)) {
      emailErr = true;
    }

    if (phone && phone.replace(/[^0-9]/g, '').length < 10) {
      phoneErr = true;
    }

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      (!isCampusDelivery && (!address || !zip)) ||
      (type === 'Business Address' && !company)
    ) {
      empty = true;
    }

    let errMsg = '';
    if (noShipping) {
      errMsg = 'No Shipping Options.';
    } else if (empty) {
      errMsg = '*Please fill out all required fields.';
    } else if (phoneErr) {
      errMsg = 'Invalid Phone Number.';
    } else if (birthErr) {
      errMsg = 'Invalid Birthday.';
    } else if (emailErr) {
      errMsg = 'Invalid Email Format.';
    } else {
      errMsg =
        '*Please fill out all required fields and correct invalid inputs.';
    }

    this.setState(
      {
        isValidForm: !(birthErr || phoneErr || emailErr || empty || noShipping),
        dobError: birthErr,
        phoneError: phoneErr,
        emailError: emailErr,
        errorMsg: errMsg
      },
      () => this.checkIfValid()
    );

    return {
      isValid: !(birthErr || phoneErr || emailErr || empty || noShipping),
      errorMsg: errMsg
    };
  };

  checkIfValid = () => {
    const { isValidForm, isValidZip } = this.state;
    this.setState({
      isGoodToGo: isValidForm && isValidZip
    });
  };

  validateFields = () => {
    const { isValid, errorMsg } = this.validate();

    this.zipValidate(isValid, errorMsg);
  };

  handleZipChange = event => {
    this.setState({ zip: event.target.value }, () => this.validateFields());
  };

  onUseThisAddress = async e => {
    e.preventDefault();

    const {
      type,
      firstName,
      lastName,
      email,
      birthday,
      company,
      school,
      phone,
      address,
      apt,
      city,
      state,
      zip,
      resHall,
      campusBox,
      roomNo,
      residence,
      schoolInfo,
      schoolCode
    } = this.state;
    const addressInput = {
      firstName,
      lastName,
      email1: email,
      phone1: phone,
      city: city.trim(),
      stateProvince: state,
      postalCode: zip
    };
    const campusAddressInput = {
      ...addressInput,
      campusResHall: resHall,
      campusBox,
      campusRoomNo: roomNo,
      address1: address
    };
    const { addNewAddress, shipment, onNext, setCompleted } = this.props;
    const { isCampusDelivery, name } = JSON.parse(type);

    if (!isCampusDelivery) {
      // Mailing address validation
      const zipRes = await this.props.zipcode({
        variables: {
          zip: zip.slice(0, 5)
        }
      });

      if (!zipRes.data.zip) {
        this.setState({
          isGoodToGo: false,
          errorMsg: 'Invalid zip code.'
        });
        return;
      }

      if (
        city.trim().toUpperCase() !== zipRes.data.zip.city ||
        state !== zipRes.data.zip.state
      ) {
        this.setState({
          isGoodToGo: false,
          errorMsg: 'Input correct city and state.'
        });
        return;
      }
    }

    let addressId;
    let res;

    if (isCampusDelivery) {
      res = await this.props.addCampusAddress({
        variables: {
          address: campusAddressInput
        }
      });
      addressId = res.data.addCampusAddress;
    } else {
      res = await this.props.addResidentialAddress({
        variables: {
          address: { ...addressInput, address1: address, address2: apt }
        }
      });
      addressId = res.data.addResidentialAddress;
    }

    const addressSummary = isCampusDelivery
      ? `${resHall}, ${roomNo}, ${campusBox}`
      : `${address}, ${city.trim()}, ${state}, ${zip}`;

    const bSuccessAddAddress = await addNewAddress({
      id: addressId,
      consignmentId: shipment.id,
      name: `${firstName} ${lastName}, ${name},  ${addressSummary}`,
      type,
      address: {
        address,
        apt,
        city: city.trim(),
        company,
        state,
        zip,
        resHall,
        campusBox,
        roomNo
      },
      student: {
        firstName,
        lastName,
        email,
        phone,
        birthday,
        school
      },
      campusInfo: {
        schoolInfo,
        residence,
        schoolCode
      }
    });

    if (bSuccessAddAddress) {
      setCompleted(0);
      onNext();
    }
  };

  renderAddressOptions = type => {
    const { classes, residenceHalls, schoolcode } = this.props;
    const {
      address,
      apt,
      city,
      state,
      zip,
      isValidZip,
      company,
      residence,
      schoolInfo,
      campusBox,
      schoolCode,
      roomNo
    } = this.state;

    let shippingOption;

    try {
      shippingOption = JSON.parse(type);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('No Shipping Options.');
      return null;
    }

    const { isCampusDelivery, deliveryLocation, deliveryCopy } = shippingOption;

    if (isCampusDelivery) {
      return (
        <DeliveryLocation
          deliveryLocation={deliveryLocation}
          deliveryCopy={deliveryCopy}
          orgSchoolcode={schoolcode}
          schoolCode={schoolCode}
          school={schoolInfo}
          residenceHalls={residenceHalls}
          handleSchoolChange={this.handleSchoolChange}
          handleChange={this.handleChange}
          handleResHallChange={this.handleResHallChange}
          resHall={residence}
          campusBox={campusBox}
          roomNo={roomNo}
        />
      );
    }

    return (
      <Grid item container direction="row" justify="space-between" spacing={8}>
        {type === 'Business Address' && (
          <Grid item md={12} xs={12}>
            <InputField
              placeholder="Company*"
              input={{
                onChange: this.handleChange('company'),
                value: company
              }}
              required
            />
          </Grid>
        )}
        <Grid item md={12} xs={12}>
          <InputField
            placeholder="Address*"
            input={{
              onChange: this.handleChange('address'),
              value: address
            }}
            required
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <InputField
            placeholder="Apt/Suite/Floor"
            input={{
              onChange: this.handleChange('apt'),
              value: apt
            }}
          />
        </Grid>
        <Grid item md={4} xs={12}>
          <InputField
            placeholder="Zip*"
            input={{
              onChange: this.handleZipChange,
              value: zip,
              className: classNames(
                classes.textField,
                this.state.zipError && 'error'
              )
            }}
            required
          />
        </Grid>
        {isValidZip && (
          <Grid item container md={8} xs={12} alignItems="center">
            <Typography className={classes.normalText}>
              {`${city}, ${state}`}
            </Typography>
          </Grid>
        )}
      </Grid>
    );
  };

  initDeliveryInfo = () => {
    this.setState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthday: '',
      address: '',
      apt: '',
      company: '',
      city: '',
      state: '',
      zip: '',
      resHall: '',
      residence: '',
      schoolInfo: '',
      campusBox: '',
      roomNo: '',
      dobError: false,
      phoneError: false,
      emailError: false,
      zipError: false,
      isGoodToGo: false
    });
  };

  selectAddress = () => {
    const { selectedAddress } = this.state;
    const { usedAddresses } = this.props;

    // eslint-disable-next-line eqeqeq
    if (selectedAddress == -1) {
      this.initDeliveryInfo();
    } else {
      const usedType = usedAddresses[selectedAddress].type;
      const { label } = JSON.parse(usedType);

      if (
        this.props.shippingOptions[this.props.shipment.id].filter(
          option => option.label === label
        ).length > 0
      ) {
        this.setState(
          {
            type: usedAddresses[selectedAddress].type,
            ...usedAddresses[selectedAddress].address,
            ...usedAddresses[selectedAddress].student,
            ...usedAddresses[selectedAddress].campusInfo
          },
          () => this.validateFields()
        );
      } else {
        this.setState(
          {
            ...usedAddresses[selectedAddress].address,
            ...usedAddresses[selectedAddress].student,
            ...usedAddresses[selectedAddress].campusInfo
          },
          () => this.validateFields()
        );
      }
    }
  };

  handleAddressChange = event => {
    this.setState({ selectedAddress: event.target.value }, () =>
      this.selectAddress()
    );
  };

  render() {
    const {
      classes,
      shipment,
      shippingOptions,
      schoolcode,
      usedAddresses,
      needTitle
    } = this.props;
    const {
      type,
      firstName,
      lastName,
      email,
      birthday,
      phone,
      isGoodToGo,
      errorMsg,
      emailError,
      selectedAddress
    } = this.state;
    const endorsed = schoolcode.toLowerCase() !== 'ocm';

    return (
      <form onSubmit={this.onUseThisAddress}>
        <Grid container direction="column" spacing={16}>
          {needTitle && (
            <>
              <Grid item>
                <Typography variant="h5">Enter a delivery address</Typography>
              </Grid>
              <Grid item>
                <Divider className={classes.divider} />
              </Grid>
            </>
          )}
          {usedAddresses.length > 0 && (
            <Grid item md={12} xs={12} container spacing={8}>
              <Grid item md={6} xs={12}>
                <Typography variant="h6">
                  Use previously entered one:
                </Typography>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl className={classes.formControl}>
                  <Select
                    className={classes.formControl}
                    native
                    value={selectedAddress}
                    onChange={this.handleAddressChange}
                    input={
                      <OutlinedInput name="prev-address" id="prev-address" />
                    }
                  >
                    {usedAddresses.map((add, id) => (
                      <option key={id} value={id}>
                        {add.name}
                      </option>
                    ))}
                    <option value={-1}>Add New Address...</option>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
          <Grid item container spacing={8}>
            <Grid item md={12} xs={12}>
              <Typography variant="h6" gutterBottom>
                Student Detail:
              </Typography>
            </Grid>
            <Grid item md={6} xs={12}>
              <InputField
                placeholder="Student First Name*"
                value={firstName}
                input={{
                  onChange: this.handleChange('firstName'),
                  value: firstName
                }}
                required
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <InputField
                placeholder="Student Last Name*"
                input={{
                  onChange: this.handleChange('lastName'),
                  value: lastName
                }}
                required
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <InputField
                placeholder="Student Email*"
                input={{
                  error: emailError,
                  onChange: this.handleChange('email'),
                  value: email
                }}
                required
              />
              {emailError && (
                <Typography className={classes.error}>
                  Enter a valid email.
                </Typography>
              )}
            </Grid>
            <Grid item md={6} xs={12} className={classes.wrapper}>
              <InputMask
                mask="(999) 999 - 9999"
                maskChar=" "
                value={phone}
                onChange={this.handleChange('phone')}
              >
                {() => (
                  <TextField
                    variant="outlined"
                    error={this.state.phoneError}
                    InputProps={{
                      className: classNames(
                        classes.textField,
                        this.state.phoneError && 'error'
                      )
                    }}
                    placeholder="Phone*"
                    required
                  />
                )}
              </InputMask>
              {this.state.phoneError && (
                <Typography className={classes.error}>
                  Enter a valid phone number.
                </Typography>
              )}
            </Grid>
            <Grid item md={6} xs={12} className={classes.wrapper}>
              <InputMask
                mask="99 / 99"
                maskChar=" "
                value={birthday}
                onChange={this.handleChange('birthday')}
              >
                {() => (
                  <TextField
                    variant="outlined"
                    error={this.state.dobError}
                    InputProps={{
                      className: classNames(
                        classes.textField,
                        this.state.dobError && 'error'
                      )
                    }}
                    placeholder="Birthday (mm / dd)"
                  />
                )}
              </InputMask>
              {this.state.dobError && (
                <Typography className={classes.error}>
                  Enter a valid birthday.
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid item md={12} xs={12}>
            <Typography variant="h6" gutterBottom>
              Delivery:
            </Typography>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" className={classes.fullWidth}>
              <Select
                className={classes.formControl}
                native
                value={type}
                onChange={this.handleShippingOptionChange}
                input={<OutlinedInput name="type" id="address-type" />}
              >
                {shippingOptions &&
                  shippingOptions[shipment.id] &&
                  sortOptionsByPrice(shippingOptions[shipment.id]).map(
                    (option, id) => (
                      <option key={id} value={JSON.stringify(option)}>
                        {`${option.label} (${option.price})`}
                      </option>
                    )
                  )}
              </Select>
            </FormControl>
          </Grid>
          {this.renderAddressOptions(type)}
          <Grid item>
            <Divider className={classes.divider} />
          </Grid>
          <Grid
            item
            container
            justify="flex-end"
            alignItems="center"
            spacing={8}
          >
            {!isGoodToGo && (
              <Grid item md={6} xs={12}>
                <Typography variant="subtitle2" className={classes.error}>
                  {errorMsg}
                </Typography>
              </Grid>
            )}
            <Grid item md={6} xs={12}>
              <Button
                className={classNames(
                  classes.button,
                  endorsed ? classes.endorsedButton : ''
                )}
                variant="contained"
                type="submit"
                disabled={!isGoodToGo}
                fullWidth
              >
                Continue
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    );
  }
}

ShippingAddress.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ShippingAddress);
