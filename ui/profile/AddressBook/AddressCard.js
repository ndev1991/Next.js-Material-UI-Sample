import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Delete, Edit } from '@material-ui/icons';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 4
  },
  nowLoadingDiv: {
    textAlign: 'center'
  },
  message: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: 18,
    textAlign: 'center',
    margin: theme.spacing.unit * 2
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary
  },
  card: {
    padding: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    boxShadow: theme.shadows[5],
    outline: 'none',
    borderRadius: 3
  },
  cardActions: {
    justifyContent: 'flex-end',
    marginRight: -theme.spacing.unit * 2,
    marginTop: -theme.spacing.unit * 5.5
  },
  content: {
    padding: 0,
    paddingBottom: `${theme.spacing.unit}px !important`
  },
  title: {
    padding: 0,
    fontFamily: 'Oswald',
    fontSize: 24,
    color: theme.palette.primary.main,
    maxWidth: 210
  },
  button: {
    height: 40,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    margin: '0 auto',
    width: '90%',
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: 600,
    padding: `8px ${theme.spacing.unit * 1.5}px`,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  action: {
    paddingTop: theme.spacing.unit * 2,
    flexWrap: 'wrap'
  },
  icon: {
    cursor: 'pointer'
  },
  cancel: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    border: `1px solid ${theme.palette.secondary.main}`,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.secondary.main,
    margin: '0 auto',
    width: '90%',
    '&:hover': {
      backgroundColor: theme.palette.common.white
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  link: {
    width: '45%',
    margin: '0 auto',
    color: theme.palette.secondary.main,
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: 600,
    textTransform: 'unset',
    '&:hover': {
      backgroundColor: 'unset',
      textDecoration: 'underline'
    }
  },
  body: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#707070'
  }
});
const handleEdit = () => {};
const handleCancel = () => {};
const Addresses = ({ classes, address }) => (
  <Card className={classes.card}>
    <CardContent className={classes.content}>
      <Typography variant="body1" className={classes.title}>
        {address.firstName} {address.lastName}
      </Typography>
    </CardContent>
    <CardActions className={classes.cardActions}>
      <Edit className={classes.icon} onClick={() => handleEdit()} />
      <Delete className={classes.icon} onClick={() => handleCancel(false)} />
    </CardActions>
    <CardContent className={classes.content}>
      <Typography variant="body1">{address.address1}</Typography>
      <Typography variant="body1">{address.address2}</Typography>
      <Typography variant="body1">{address.address3}</Typography>
      {address.isCampus && (
        <>
          <Typography variant="body1">{address.campusResHall}</Typography>
          <Typography variant="body1">{address.campusRoomNo}</Typography>
          <Typography variant="body1">{address.campusBox}</Typography>
        </>
      )}
      <Typography variant="body1">
        {address.postalCode} {address.city}, {address.stateProvince}
      </Typography>
      <Typography variant="body1">{address.phone1}</Typography>
      <Typography variant="body1">{address.phone2}</Typography>
      <Typography variant="body1">{address.ref1}</Typography>
      <Typography variant="body1">{address.ref2}</Typography>
    </CardContent>
  </Card>
);

export default withStyles(styles)(Addresses);
