import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';
import { Image } from 'cloudinary-react';

const styles = theme => ({
  layout: {
    backgroundColor: '#7b7b7b',
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingRight: theme.spacing.unit * 4,
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  main: {
    alignSelf: 'center',
    display: 'flex'
  },
  action: {
    alignSelf: 'center',
    textAlign: 'right'
  },
  title: {
    color: '#ffffff',
    fontFamily: 'Oswald',
    fontSize: 38,
    fontWeight: 700
  },
  description: {
    color: '#ffffff',
    fontFamily: 'Montserrat',
    fontSize: 16
  },
  media: {
    width: '100%',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit
  },
  logo: {
    width: 120,
    alignSelf: 'center'
  },
  button: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    fontWeight: 600,
    backgroundColor: '#e2e2e2',
    border: '1px solid #sdsdsd',
    color: '#707070'
  }
});

const PromtRow = ({ classes }) => (
  <Grid container className={classes.layout}>
    <Grid item sm={12} md={9} className={classes.main}>
      <div className={classes.logo}>
        <Image
          publicId="http://placehold.it/400x200/ffffff/c0392b"
          className={classes.media}
        />
      </div>
      <div className={classes.content}>
        <Typography variant="h5" className={classes.title}>
          COMPLETE YOUR ROOM IN 3 EASY STEPS!
        </Typography>
        <Typography variant="body1" className={classes.description}>
          All products can be delivered directly to your dorm or move-in day.
        </Typography>
      </div>
    </Grid>
    <Grid item sm={12} md={3} className={classes.action}>
      <Button variant="contained" disableRipple className={classes.button}>
        GET STARTED
      </Button>
    </Grid>
  </Grid>
);

export default withStyles(styles)(PromtRow);
