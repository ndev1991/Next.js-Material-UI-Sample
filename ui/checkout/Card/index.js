import React from 'react';
import Head from 'next/head';
import Card from 'react-credit-cards';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate
} from './utils';

const styles = theme => ({
  container: {
    marginTop: theme.spacing.unit * 2
  },
  cardContainer: {
    '& > div': {
      maxWidth: '100%',

      '& > div': {
        maxWidth: '100%'
      }
    }
  },
  input: {
    padding: theme.spacing.unit,
    fontFamily: 'Montserrat, Oswald, Roboto',
    borderRadius: 4,
    border: `1px solid ${theme.palette.common.grey['900']}`,
    color: theme.palette.common.grey['900'],
    fontSize: 20,
    height: 44,
    width: '100%',
    '&::placeholder': {
      color: theme.palette.common.grey['200']
    },

    '&.error': {
      border: `1px solid ${theme.palette.common.error}`,
      color: theme.palette.common.error,
      '& > input': {
        color: theme.palette.common.error
      }
    }
  },
  error: {
    color: theme.palette.common.error
  }
});

class CreditCard extends React.Component {
  constructor(props) {
    super(props);

    const { paymentMethod } = props;
    const { cardInfo } = paymentMethod;

    this.state = {
      number: cardInfo.ccNumber || '',
      name: paymentMethod.nameCard || '',
      // expiry: `${cardInfo.ccExpMonth || ''}/${cardInfo.ccExpYear || ''}`,
      expiry: cardInfo.ccExpMonth
        ? `${cardInfo.ccExpMonth}/${cardInfo.ccExpYear - 2000}`
        : '',
      cvc: cardInfo.ccCvv || '',
      focused: 'number',
      issuer: cardInfo.paymentMethod || '',
      isValid: true
    };
  }

  handleCallback = ({ issuer }, isValid) => {
    if (isValid) {
      this.setState({ issuer, isValid: true }, this.setCardInfo);
    } else {
      this.setState({ isValid: false }, this.setCardInfo);
    }
  };

  setCardInfo = () => {
    const { number, name, expiry, cvc, issuer, isValid } = this.state;

    this.props.setCardInfo(number, name, expiry, cvc, issuer, isValid);
  };

  handleInputFocus = ({ target }) => {
    this.setState({
      focused: target.name
    });
  };

  handleInputChange = ({ target }) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value); //eslint-disable-line
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value); //eslint-disable-line
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value); //eslint-disable-line
    }

    this.setState({ [target.name]: target.value }, () => {
      const { number, name, expiry, cvc, issuer, isValid } = this.state;

      this.props.setCardInfo(number, name, expiry, cvc, issuer, isValid);
    });
  };

  render() {
    const { classes } = this.props;
    const { name, number, expiry, cvc, focused, isValid } = this.state;

    return (
      <Grid container direction="row" spacing={8} className={classes.container}>
        <Head>
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/css/creditcard.css"
          />
        </Head>
        <Grid item md={6} xs={12} className={classes.cardContainer}>
          <Card
            number={number}
            name={name}
            expiry={expiry}
            cvc={cvc}
            focused={focused}
            callback={this.handleCallback}
          />
        </Grid>
        <Grid item container md={6} xs={12} alignItems="center">
          <Grid item md={12} xs={12} container spacing={8} direction="column">
            <Grid item container md={12} xs={12}>
              <input
                type="tel"
                name="number"
                className={classNames(classes.input, !isValid && 'error')}
                placeholder="Card Number*"
                value={number}
                pattern="[\d| ]{16,22}"
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
              {!isValid && (
                <Typography className={classes.error}>
                  Enter a valid card number.
                </Typography>
              )}
            </Grid>
            <Grid item container md={12} xs={12}>
              <input
                type="text"
                name="name"
                value={name}
                className={classes.input}
                placeholder="Name*"
                required
                onChange={this.handleInputChange}
                onFocus={this.handleInputFocus}
              />
            </Grid>
            <Grid item container md={12} xs={12} justify="space-between">
              <Grid item md={6} xs={6}>
                <input
                  type="tel"
                  name="expiry"
                  value={expiry}
                  className={classes.input}
                  placeholder="Valid Through*"
                  pattern="\d\d/\d\d"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </Grid>
              <Grid item md={5} xs={6}>
                <input
                  type="password"
                  name="cvc"
                  className={classes.input}
                  value={cvc}
                  placeholder="CVC*"
                  pattern="\d{3,4}"
                  required
                  onChange={this.handleInputChange}
                  onFocus={this.handleInputFocus}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(CreditCard);
