import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import {
  Typography,
  Grid,
  FormControl,
  Select,
  OutlinedInput
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import InputField from '../../components/forms/InputField';
import { schools } from '../../src/graphql/site';

const AVAILABLE_FIELDS = {
  DormRoom: [1, 1, 0, 0, 0],
  DormBox: [1, 0, 1, 0, 0],
  DormMailroom: [1, 0, 0, 0, 0],
  DormRoomBox: [1, 1, 1, 0, 0],
  DormFront: [1, 0, 0, 0, 0],
  Bookstore: [0, 0, 0, 0, 1],
  ResidenceLife: [0, 0, 0, 0, 1],
  MailCenter: [0, 0, 0, 1, 0],
  PickUp: [0, 0, 0, 0, 1]
};

const styles = theme => ({
  formControl: {
    width: '100%',
    height: 44,
    border: `1px solid ${theme.palette.common.grey['900']}`,
    color: theme.palette.common.grey['900'],
    borderRadius: '4px',
    fontSize: 20,

    '&:active, &:focus': {
      borderColor: theme.palette.common.grey['900'],
      color: theme.palette.common.grey['800']
    }
  },
  fullWidth: {
    width: '100%'
  },
  typography: {
    padding: theme.spacing.unit
  }
});

const DeliveryLocation = props => {
  const {
    classes,
    deliveryLocation,
    deliveryCopy,
    schoolCode,
    orgSchoolcode,
    handleChange,
    resHall,
    school,
    campusBox,
    roomNo,
    handleResHallChange,
    handleSchoolChange
  } = props;
  const deliveryLoc = deliveryLocation || 'DormRoomBox';
  const availableFields = AVAILABLE_FIELDS[deliveryLoc];
  let schoolName;
  const site = props.site;
  const defaultResHall = {
    name: 'Unknown',
    address: 'Unknown',
    city: '',
    state: '',
    zip: ''
  };
  let resHalls = [];

  if (!site.loading) {
    const hasUnknown = !!site.site.residenceHalls.filter(res =>
      res.name.toLowerCase().includes('unknown')
    )[0];
    resHalls = site.site.residenceHalls;

    if (!hasUnknown) {
      resHalls.push(defaultResHall);
    }
  }

  if (!props.schools.loading) {
    const schooll = props.schools.schools.filter(
      sch => sch.code === schoolCode.toUpperCase()
    )[0] || { name: 'Your School' };
    schoolName = schooll.name;
  }

  const DeliveryCopy = deliveryCopy ? (
    <Typography className={classes.typography} gutterBottom>
      {deliveryCopy}
    </Typography>
  ) : (
    <>
      {(() => {
        switch (deliveryLocation) {
          case 'DormBox':
            return (
              <Typography className={classes.typography} gutterBottom>
                Sent straight to your room! <strong>{schoolName}</strong> is
                super student convenient!
              </Typography>
            );
          case 'DormMailroom':
            return (
              <Typography className={classes.typography} gutterBottom>
                Sent straight to your dorm! Conveniently available at your
                dorm's mailroom.
              </Typography>
            );
          case 'DormFront':
            return (
              <Typography className={classes.typography} gutterBottom>
                Sent straight to your dorm! Conveniently available at your
                dorm's front desk.
              </Typography>
            );
          case 'BookStore':
            return (
              <Typography className={classes.typography} gutterBottom>
                <strong>{schoolName}</strong> makes everything conveniently
                available at the central bookstore.
              </Typography>
            );
          case 'ResidenceLife':
            return (
              <Typography className={classes.typography} gutterBottom>
                <strong>{schoolName}</strong> makes everything conveniently
                available at the residence life office.
              </Typography>
            );
          case 'MailCenter':
            return (
              <Typography className={classes.typography} gutterBottom>
                <strong>{schoolName}</strong> makes everything conveniently
                available as the central mail center.
              </Typography>
            );
          case 'PickUp':
            return (
              <Typography className={classes.typography} gutterBottom>
                <strong>{schoolName}</strong> makes everything available for
                convenient on-campus pickup.
              </Typography>
            );
          case 'DormRoom':
            return (
              <Typography className={classes.typography} gutterBottom>
                Sent straight to your dorm! <strong>{schoolName}</strong> is
                super student convenient!
              </Typography>
            );
          case 'DormRoomBox':
          default:
            return (
              <Typography className={classes.typography} gutterBottom>
                Sent straight to your dorm! <strong>{schoolName}</strong> is
                super student convenient!
              </Typography>
            );
        }
      })()}
    </>
  );

  if (availableFields[4]) {
    return DeliveryCopy;
  }

  return (
    <Grid item container spacing={8} alignItems="center">
      {orgSchoolcode.toLowerCase() === 'ocm' && (
        <Grid item md={12} xs={12}>
          <FormControl variant="outlined" className={classes.fullWidth}>
            <Select
              className={classes.formControl}
              native
              value={school}
              onChange={handleSchoolChange}
              input={<OutlinedInput name="type" id="schools" />}
              required
            >
              <option value="">Select School*</option>
              {!props.schools.loading &&
                props.schools.schools
                  .filter(s => s.name)
                  .sort((s1, s2) =>
                    s1.name.toLowerCase() > s2.name.toLowerCase() ? 1 : -1
                  )
                  .map((res, id) => (
                    <option key={id} value={JSON.stringify(res)}>
                      {res.name}
                    </option>
                  ))}
            </Select>
          </FormControl>
        </Grid>
      )}
      {availableFields[0] === 1 && (
        <Grid item md={6} xs={12}>
          <FormControl variant="outlined" className={classes.fullWidth}>
            {/* <InputLabel htmlFor="residence-hall">Residence Hall</InputLabel> */}
            <Select
              className={classes.formControl}
              native
              value={resHall}
              onChange={handleResHallChange}
              input={<OutlinedInput name="type" id="residence-hall" />}
              required
            >
              <option value="">Select Residence Hall*</option>
              {resHalls.map((res, id) => (
                <option key={id} value={JSON.stringify(res)}>
                  {res.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>
      )}
      {availableFields[0] === 1 && (
        <Grid item md={6} xs={12}>
          <Typography>
            If you do not know the residence hall for your shipment, simply
            select "Unknown".
          </Typography>
        </Grid>
      )}
      {availableFields[1] === 1 && (
        <Grid item md={6} xs={12}>
          <InputField
            placeholder="Room Number (optional)"
            value={roomNo}
            input={{
              onChange: handleChange('roomNo')
            }}
          />
        </Grid>
      )}
      {(availableFields[2] === 1 || availableFields[3] === 1) && (
        <Grid item md={6} xs={12}>
          <InputField
            placeholder={
              deliveryLocation !== 'MailCenter'
                ? 'Campus Box (optional)'
                : 'Mail Stop (optional)'
            }
            value={campusBox}
            input={{
              onChange: handleChange('campusBox')
            }}
          />
        </Grid>
      )}
      {!props.schools.loading && DeliveryCopy}
    </Grid>
  );
};

// const siteQuery = gql`
//   query getSite($schoolcode: String!) {
//     site(schoolcode: $schoolcode) {
//       cloudinaryImagePath
//       cloudinaryCloudName
//       logoUrl
//       residenceHalls {
//         name
//         address
//         city
//         state
//         zip
//       }
//     }
//   }
// `;

const site = gql`
  query getSite($schoolCode: String!) {
    site(schoolcode: $schoolCode) {
      cloudinaryImagePath
      cloudinaryCloudName
      logoUrl
      residenceHalls {
        name
        address
        city
        state
        zip
      }
    }
  }
`;

export default compose(
  graphql(schools, { name: 'schools' }),
  graphql(site, { name: 'site' }),
  withStyles(styles)
)(DeliveryLocation);
