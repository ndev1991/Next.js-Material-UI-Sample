import { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, SvgIcon, Typography } from '@material-ui/core';

import GiftMessageModal from '../../components/widgets/GiftMessage';

const styles = theme => ({
  typoButton: {
    color: theme.palette.common.grey['800'],
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: 14,

    '&:hover': {
      fontWeight: 400
    }
  },
  icon: {
    marginRight: theme.spacing.unit,
    fontSize: 18
  }
});

const GiftMessage = props => {
  const { classes, giftMessage } = props;
  const [showModal, setShowModal] = useState(false);

  const giftIcon = (
    <SvgIcon className={classes.icon} viewBox="0 0 512 512">
      <path
        d="M467,120h-61.041C415.397,107.456,421,91.871,421,75c0-41.355-33.645-75-75-75c-24.911,0-43.28,8.925-57.809,28.087
        C276.036,44.119,267.148,66.503,256,94.785c-11.148-28.283-20.036-50.666-32.191-66.698C209.28,8.925,190.911,0,166,0
        c-41.355,0-75,33.645-75,75c0,16.871,5.603,32.456,15.041,45H45c-24.813,0-45,20.187-45,45v30c0,19.555,12.541,36.228,30,42.42
        V467c0,24.813,20.187,45,45,45h362c24.813,0,45-20.187,45-45V237.42c17.459-6.192,30-22.865,30-42.42v-30
        C512,140.187,491.813,120,467,120z M283.534,106.74C306.513,48.442,315.249,30,346,30c24.813,0,45,20.187,45,45s-20.187,45-45,45
        h-67.713C280.125,115.385,281.878,110.942,283.534,106.74z M166,30c30.751,0,39.487,18.442,62.466,76.74
        c1.656,4.202,3.409,8.645,5.247,13.26H166c-24.813,0-45-20.187-45-45S141.187,30,166,30z M196,482H75c-8.271,0-15-6.729-15-15V240
        h136V482z M196,210H45c-8.271,0-15-6.729-15-15v-30c0-8.271,6.729-15,15-15h151V210z M286,482h-60V150c3.143,0,42.76,0,60,0V482z
        M452,467c0,8.271-6.729,15-15,15H316V240h136V467z M482,195c0,8.271-6.729,15-15,15H316v-60h151c8.271,0,15,6.729,15,15V195z"
      />
    </SvgIcon>
  );

  const handleShowModal = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      {!giftMessage.to && (
        <Button onClick={handleShowModal}>
          {giftIcon}
          Gift Message Available
        </Button>
      )}
      {giftMessage.to && (
        <Typography onClick={handleShowModal} className={classes.typoButton}>
          Edit
        </Typography>
      )}
      <GiftMessageModal open={showModal} onClose={handleClose} {...props} />
    </>
  );
};

export default withStyles(styles)(GiftMessage);
