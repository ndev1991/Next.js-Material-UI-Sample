import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { Image } from 'cloudinary-react';
// import ZoomInIcon from '@material-ui/icons/ZoomIn';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';

import { SchoolConsumer } from '../../lib/schoolContext';
import StarRating from '../../components/widgets/StarRating';

const styles = theme => ({
  layout: {
    padding: theme.spacing.unit * 2,
    maxWidth: 260,
    margin: '0 auto',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing.unit / 2
    }
  },
  title: {
    fontSize: 16,
    height: 35,
    overflowWrap: 'break-word',
    lineHeight: '17px',
    overflow: 'hidden',
    fontFamily: 'Oswald',
    fontWeight: 500,
    color: theme.palette.common.grey[800],
    cursor: 'pointer',
    display: '-webkit-box',
    lineClamp: 2,
    boxOrient: 'vertical'
  },
  endorsedTitle: {
    color: theme.palette.primary.main
  },
  imageContainer: {
    position: 'relative',
    cursor: 'pointer'
  },
  zoomLabelContainer: {
    visibility: 'hidden',
    display: 'flex',
    backgroundColor: theme.palette.common.grey[900],
    color: '#ffffff',
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    pointerEvents: 'none'
  },
  zoomIcon: {
    transform: 'rotateY(180deg)'
  },
  zoomInLabel: {
    color: theme.palette.common.white,
    fontSize: 15,
    fontWeight: 600,
    paddingLeft: theme.spacing.unit
  },
  media: {
    width: '100%',
    '&:hover ~ $zoomLabelContainer': {
      visibility: 'inherit'
    }
  },
  action: {
    textAlign: 'center',
    paddingTop: theme.spacing.unit
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
  price: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
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
  link: {
    textDecoration: 'none'
  }
});

const ProductItem = ({
  classes,
  product,
  queryString,
  handleProductClick,
  theme
}) => {
  if (!product) {
    return <div className={classes.layout}>Loading...</div>;
  }
  const node = product.node;
  const productDetail = node.source;
  // const zoomSection = (
  //   <div className={classes.zoomLabelContainer}>
  //     <ZoomInIcon className={classes.zoomIcon} />
  //     <Typography className={classes.zoomInLabel} variant="subtitle1">
  //       View Details
  //     </Typography>
  //   </div>
  // );

  let imageUrl = productDetail.images[0];
  if (queryString && queryString.q) {
    const { q } = queryString;
    productDetail.color.map(item => {   // eslint-disable-line
      if (item.style_code && item.style_code.length > 0) {
        if (
          item.style_code.findIndex(
            code => code.toLowerCase() === q.replace(/%20/g, ' ').toLowerCase()
          ) !== -1
        ) {
          imageUrl = item.image_url || imageUrl;
        }
      }
    });
  }
  // if (productDetail.color[0] && productDetail.color[0].image_url) {
  //   imageUrl = productDetail.color[0].image_url;
  // } else {
  //   imageUrl = productDetail.images ? productDetail.images[0] : null;
  // }

  const {
    url2,
    title,
    number_of_reviews: numberOfReviews,
    avg_rating: avgRating,
    sale_price: salePrice,
    price,
    price_modifier_low: priceModifierLow
  } = productDetail;

  return (
    <SchoolConsumer>
      {value => {
        const url = value.toLowerCase() === 'ocm' ? url2 : `/${value}${url2}`;

        return (
          <div
            role="button"
            tabIndex={0}
            className={classes.layout}
            onClick={() => handleProductClick(node.id, url)}
          >
            <div className={classes.imageContainer}>
              <Image publicId={`${imageUrl}`} className={classes.media} />
              {/* {zoomSection} */}
            </div>
            <Typography
              component="h2"
              variant="h5"
              className={classNames(
                classes.title,
                String(value).toLowerCase() !== 'ocm'
                  ? classes.endorsedTitle
                  : ''
              )}
              align="center"
            >
              {title}
            </Typography>
            <StarRating
              reviewCount={numberOfReviews}
              count={5}
              value={avgRating}
              edit={false}
              size={18}
              color1={theme.palette.common.grey[100]}
              color2={theme.palette.primary.main}
              // color1="#BDBDBD"
              // color2="#782455"
            />
            <div className={classes.price}>
              <Typography variant="h4" className={classes.newPrice}>
                {`$${(salePrice + priceModifierLow).toFixed(2)}`}
              </Typography>
              {salePrice !== price && (
                <Typography variant="body1" className={classes.oldPrice}>
                  {`Reg: $${(price + priceModifierLow).toFixed(2)}`}
                </Typography>
              )}
            </div>
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
              >
                Shop Now
              </Button>
            </div>
          </div>
        );
      }}
    </SchoolConsumer>
  );
};

export default withStyles(styles, { withTheme: true })(ProductItem);
