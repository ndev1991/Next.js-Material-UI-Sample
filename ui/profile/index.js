import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid, Typography, IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import { Query } from 'react-apollo';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Orders from './Orders';
// import AddressBook from './AddressBook';
import { Router } from '../../routes';
import { justMe } from '../../src/graphql/user';
import { logout } from '../../lib/auth';
import { OverlayProgress } from '../../components';
import ProfileInfo from './ProfileInfo';
import UpdateProfile from './UpdateProfile';
import ChangePassword from './ChangePassword';

const styles = theme => ({
  root: {
    margin: '0 auto',
    alignItems: 'center',
    padding: theme.spacing.unit * 2
  },
  expandedRoot: {
    padding: theme.spacing.unit / 2,
    margin: '0 auto'
  },
  profileButton: {
    textTransform: 'inherit',
    [theme.breakpoints.down('xs')]: {
      fontSize: 10
    }
  },
  icon: {
    color: theme.palette.secondary.main
  },
  logoutButton: {
    paddingTop: 5
  },
  title: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: 18,
    color: theme.palette.common.grey[900],
    cursor: 'default',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  nowLoading: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: 18,
    margin: theme.spacing.unit * 2,
    textAlign: 'center'
  },
  profileHeader: {
    alignItems: 'center',
    paddingBottom: theme.spacing.unit
  },
  button: {
    height: 40,
    minWidth: 180,
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    margin: '0 auto',
    backgroundColor: theme.palette.secondary.main,
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Montserrat',
    fontWeight: 600,
    '&:hover': {
      backgroundColor: theme.palette.secondary.main
    }
  }
});

const handleLogout = (schoolCode = '') => {
  logout();
  if (process.browser) Router.pushRoute(`/${schoolCode}`);
  return <OverlayProgress />;
};

const Profile = ({ classes, schoolCode }) => {
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [thankyouOpen, setThankyouOpen] = useState(false);

  const handleChangePasswordModal = flag => {
    setChangePasswordOpen(flag);
  };

  const handleThankyouModal = flag => {
    if (flag) {
      setChangePasswordOpen(false);
    }
    setThankyouOpen(flag);
  };

  return (
    <Query query={justMe}>
      {({ data, loading, error, refetch }) => {
        if (loading)
          return (
            <>
              <Typography
                component="h1"
                className={classes.nowLoading}
                color="textPrimary"
              >
                Loading your account information...
              </Typography>
              <OverlayProgress />
            </>
          );
        if (error) {
          return handleLogout(schoolCode);
        }
        const { me } = data && data;

        return (
          <Grid container className={classes.root}>
            <Grid item container xs={10} className={classes.profileHeader}>
              <Grid item container xs={10} className={classes.profileHeader}>
                <Grid item xs={12} sm={5} md={4} lg={3} xl={2}>
                  <Typography className={classes.title} color="textPrimary">
                    My Profile Information
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={7} md={8} lg={9} xl={10}>
                  <Button
                    onClick={() => setShowUpdateProfile(!showUpdateProfile)}
                    className={classes.profileButton}
                  >
                    <EditIcon fontSize="small" className={classes.icon} />
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleChangePasswordModal(true)}
                    className={classes.profileButton}
                  >
                    <LockIcon fontSize="small" className={classes.icon} />
                    Change Password
                  </Button>
                  <ChangePassword
                    changePasswordOpen={changePasswordOpen}
                    thankyouOpen={thankyouOpen}
                    handleModal={handleChangePasswordModal}
                    handleThankyouModal={handleThankyouModal}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={2}
              container
              justify="flex-end"
              alignContent="center"
            >
              <IconButton
                onClick={() => handleLogout(schoolCode)}
                className={classes.logoutButton}
              >
                <LogoutIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <ProfileInfo profile={me} />
              <UpdateProfile
                me={me}
                open={showUpdateProfile}
                handleModal={open => {
                  refetch();
                  setShowUpdateProfile(open);
                }}
                handleCancel={open => setShowUpdateProfile(open)}
              />
            </Grid>
            <Grid item xs={12}>
              {/* <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.title}>
                    My Address Book
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.expandedRoot}>
                  <AddressBook />
                </ExpansionPanelDetails>
              </ExpansionPanel> */}
              <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.title}>My Orders</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.expandedRoot}>
                  <Orders />
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
          </Grid>
        );
      }}
    </Query>
  );
};

export default withStyles(styles)(Profile);
