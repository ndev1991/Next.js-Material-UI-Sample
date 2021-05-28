import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Image } from 'cloudinary-react';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import { SchoolConsumer } from '../../../lib/schoolContext';
import StarRating from '../../../components/widgets/StarRating';

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
    position: 'relative',
    maxWidth: 552,
    paddingLeft: theme.spacing.unit * 5,
    paddingRight: theme.spacing.unit * 3,
    backgroundColor: '#f4f4f4',
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
    display: 'flex',
    justifyContent: 'center'
  },
  title: {
    fontFamily: 'Rubik',
    fontSize: 48,
    fontWeight: 700,
    color: theme.palette.common.grey[900],
    textTransform: 'uppercase',
    lineHeight: 1.2,
    [theme.breakpoints.down('sm')]: {
      fontSize: 36
    }
  },
  description: {
    color: theme.palette.common.grey[900],
    fontSize: 18,
    lineHeight: 1.2,
    fontFamily: 'Rubik',
    overflow: 'hidden',
    position: 'relative',
    maxHeight: '5.834em',
    textAlign: 'justify',
    paddingRight: '1em',
    '&:before': {
      content: '"..."',
      position: 'absolute',
      right: 0,
      bottom: 0
    }
    // '&:after': {
    //   content: '""',
    //   position: 'absolute',
    //   right: 0,
    //   width: '1em',
    //   height: '1em',
    //   marginTop: '0.2em'
    // }
  },
  media: {
    maxWidth: 400,
    maxHeight: 400,
    [theme.breakpoints.down('xs')]: {
      maxWidth: 250,
      maxHeight: 250
    }
  },
  rating: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    paddingBottom: 10
  },
  price: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'left',
    paddingBottom: 10
  },
  newPrice: {
    fontSize: 24,
    color: theme.palette.common.grey[900],
    fontFamily: 'Oswald'
  },
  oldPrice: {
    textDecoration: 'line-through',
    fontSize: 13,
    color: '#b1b1b1',
    [theme.breakpoints.down('xs')]: {
      fontSize: 11
    }
  },
  boost: {
    top: 0,
    right: 0,
    position: 'absolute',
    zIndex: 0,
    [theme.breakpoints.down('md')]: {
      top: 0,
      right: 0
    }
  },
  boostMedia: {
    maxWidth: 200,
    maxHeight: 200,
    [theme.breakpoints.down('md')]: {
      maxWidth: 100,
      maxHeight: 100
    }
  },
  addCart: {
    height: 40,
    paddingLeft: theme.spacing.unit * 1.5,
    paddingRight: theme.spacing.unit * 1.5,
    margin: '0 auto',
    backgroundColor: theme.palette.common.grey[600],
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Montserrat',
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
  action: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit
  }
});

const BoostedProduct = ({ classes, theme, product, handleProductClick }) => {
  // https://res.cloudinary.com/ocm/image/upload/v1555252925/spa/home/seal-no-1-parent-choice-cp.png
  const boostImg = 'spa/home/seal-no-1-parent-choice-cp.png';
  return (
    <SchoolConsumer>
      {value => (
        <div className={classes.root}>
          <div className={classes.imageLayout}>
            <Image
              publicId={`${product.source.images[0]}`}
              className={classes.media}
            />
          </div>
          <div className={classes.contentLayout}>
            <Typography className={classes.title}>
              {product.source.title}
            </Typography>
            <div className={classes.price}>
              <Typography variant="h4" className={classes.newPrice}>
                {`$${(
                  product.source.sale_price + product.source.price_modifier_low
                ).toFixed(2)}`}
              </Typography>
              {product.source.sale_price !== product.source.price && (
                <Typography variant="body1" className={classes.oldPrice}>
                  {`Reg: $${(
                    product.source.price + product.source.price_modifier_low
                  ).toFixed(2)}`}
                </Typography>
              )}
            </div>
            <div className={classes.rating}>
              <StarRating
                reviewCount={product.source.number_of_reviews}
                count={5}
                value={product.source.avg_rating}
                edit={false}
                size={18}
                color1={theme.palette.common.grey[100]}
                color2={theme.palette.primary.main}
              />
            </div>
            <Typography className={classes.description}>
              {product.source.description || ''}
            </Typography>
            <div className={classes.action}>
              <Button
                variant="contained"
                className={classNames(
                  classes.addCart,
                  String(value).toLowerCase() !== 'ocm'
                    ? classes.endorsedButton
                    : ''
                )}
                disableRipple
                onClick={() => handleProductClick(product, value)}
              >
                {product.source.actionText}
              </Button>
            </div>
            <div className={classes.boost}>
              <Image publicId={`${boostImg}`} className={classes.boostMedia} />
            </div>
          </div>
        </div>
      )}
    </SchoolConsumer>
  );
};

export default withStyles(styles, { withTheme: true })(BoostedProduct);
