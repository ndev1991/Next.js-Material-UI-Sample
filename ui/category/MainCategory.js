import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { SchoolConsumer } from '../../lib/schoolContext';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: 0,
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column'
    }
  },
  contentLayout: {
    minWidth: 452,
    maxWidth: 552,
    paddingLeft: theme.spacing.unit * 5,
    paddingRight: theme.spacing.unit * 3,
    backgroundColor: '#f4f4f4',
    height: 400,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      height: 'auto',
      minWidth: 'unset',
      padding: theme.spacing.unit * 2
    }
  },
  imageLayout: {
    width: '100%',
    maxWidth: '900px',
    backgroundPosition: 'center',
    [theme.breakpoints.down('xs')]: {
      height: 250,
      backgroundSize: 'cover'
    }
  },
  title: {
    fontFamily: 'Rubik',
    fontSize: 48,
    fontWeight: 700,
    color: theme.palette.common.grey[900],
    textTransform: 'uppercase',
    lineHeight: 1.2,
    [theme.breakpoints.down('xs')]: {
      fontSize: 30
    }
  },
  description: {
    fontFamily: 'Rubik',
    fontSize: 20,
    color: theme.palette.common.grey[900],
    lineHeight: 1.1,
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  },
  image: {
    maxHeight: 400,
    minHeight: 400
  }
});

const MainCategory = ({ classes, navigation }) => {
  if (!navigation.imageUrlCat || !navigation.title) {
    return null;
  }
  const imgUrl = navigation.imageUrlCat;
  // https://res.cloudinary.com/ocm/image/upload/v1554250698/spa/category/testImageForCategoryLanding.jpg
  return (
    <SchoolConsumer>
      {value => {
        const title = navigation.title
          .replace(/@@School Name@@/g, value)
          .replace(/@@SchoolName@@/g, value);
        return (
          <div className={classes.root}>
            <div className={classes.contentLayout}>
              <Typography className={classes.title}>{title}</Typography>
              <Typography className={classes.description}>
                {navigation.description || ''}
              </Typography>
            </div>
            <div
              className={classes.imageLayout}
              style={{ backgroundImage: `url(${imgUrl})` }}
            />
          </div>
        );
      }}
    </SchoolConsumer>
  );
};

export default withStyles(styles)(MainCategory);
