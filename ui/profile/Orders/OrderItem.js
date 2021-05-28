import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Grid } from '@material-ui/core';
import { Image /* ,Transformation  */ } from 'cloudinary-react';
import { CloudinaryContext } from '../../../lib/cloudinary';

const styles = theme => ({
  container: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit
  },
  title: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: theme.palette.primary.main,
    textTransform: 'capitalize',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  },
  newPrice: {
    fontSize: 20,
    [theme.breakpoints.down('md')]: {
      fontSize: 16
    },
    color: theme.palette.common.grey[900],
    fontFamily: 'Oswald'
  },
  style: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#343434',
    paddingTop: theme.spacing.unit / 2
  },
  quantity: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    color: '#343434',
    paddingTop: theme.spacing.unit * 1.5
  },
  layout: {
    backgroundSize: 'contain',
    cursor: 'pointer'
  }
});

const OrderItem = ({ classes, item }) => {
  const { imagePath } = useContext(CloudinaryContext);
  return (
    <Grid item container>
      <Grid item container className={classes.container} xs={12} sm={4}>
        <Grid item xs={12}>
          <div role="button" tabIndex={0} className={classes.layout}>
            <Image
              publicId={`${imagePath}/${item.itemImage}`}
              width={100}
              responsive
            >
              {/* <Transformation width="100" crop="fit" /> */}
            </Image>
          </div>
        </Grid>
      </Grid>
      <Grid item container className={classes.container} xs={12} sm={8}>
        <Grid item xs={12}>
          <Typography
            variant="body1"
            component="span"
            className={classes.title}
          >
            {item.itemTitle}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {item.unitPrice && (
            <Typography variant="h5" className={classes.newPrice}>
              {`$${item.unitPrice.toFixed(2)}`}
            </Typography>
          )}
          {item.options &&
            item.options.map(option => (
              <Typography
                variant="body1"
                className={classes.style}
                key={`option-${option.optionId}`}
              >
                {`${option.groupName}: ${option.optionName}`}
              </Typography>
            ))}
          <Typography variant="body1" className={classes.style}>
            {`Style: #${item.itemSku}`}
          </Typography>
          {item.quantity && (
            <Typography variant="body1" className={classes.style}>
              {`Qty: ${item.quantity}`}
            </Typography>
          )}
        </Grid>
        {item.items &&
          item.items.map((i, k) => (
            <OrderItem item={i} classes={classes} key={`subitem-${k}`} />
          ))}
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(OrderItem);
