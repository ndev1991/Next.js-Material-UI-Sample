import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Checkout from '../ui/checkout';
import { CloudinaryContext } from '../lib/cloudinary';
import Notification from '../components/notifications/Notification';
import NotificationsContext from '../lib/notificationsContext';
import SessionContext from '../lib/sessionContext';
import customTheme from '../src/theme';

const defaultSchoolCode = 'ocm';
const siteQuery = gql`
  query getSite($schoolcode: String!) {
    site(schoolcode: $schoolcode) {
      cloudinaryImagePath
      cloudinaryCloudName
      logoUrl
      color
      menu {
        id
        name
        url
        children {
          id
          name
          url
          children {
            id
            name
            url
          }
        }
      }
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

const CheckoutPage = ({ query, domain }) => {
  const schoolcode = query.school || defaultSchoolCode;
  const { browserId, sessionId } = useContext(SessionContext);
  const { type, message, resetNotification } = useContext(NotificationsContext);

  return (
    <Query query={siteQuery} variables={{ schoolcode }}>
      {props => {
        if (props.error) return `Error! ${props.error.message}`;

        const {
          cloudinaryCloudName,
          cloudinaryImagePath,
          logoUrl,
          color,
          menu,
          residenceHalls
        } = props.data.site || {
          site: {},
          residenceHalls: []
        };

        if (color) {
          customTheme.palette.primary.main = color;
          if (schoolcode.toLowerCase() !== 'ocm') {
            customTheme.palette.primary.highlight = color;
            customTheme.palette.secondary.main = color;
            customTheme.overrides.MuiButton.containedSecondary[
              '&:hover'
            ].backgroundColor = color;
            customTheme.overrides.MuiButton.containedPrimary[
              '&:hover'
            ].backgroundColor = color;
          } else {
            customTheme.palette.primary.highlight = '#762256';
            customTheme.palette.secondary.main = '#21B6A8';
          }
        }

        return (
          <CloudinaryContext.Provider
            value={{
              cloudName: cloudinaryCloudName,
              imagePath: cloudinaryImagePath
            }}
          >
            <MuiThemeProvider theme={createMuiTheme(customTheme)}>
              <Checkout
                schoolcode={schoolcode}
                color={color}
                residenceHalls={residenceHalls}
                userId={null}
                browserId={browserId}
                sessionId={sessionId}
                logo={logoUrl}
                domain={domain}
                navOptions={menu}
              />
              <Notification
                type={type}
                message={message}
                onClose={resetNotification}
              />
            </MuiThemeProvider>
          </CloudinaryContext.Provider>
        );
      }}
    </Query>
  );
};

CheckoutPage.getInitialProps = ({ query }) => {
  return {
    query
  };
};

export default CheckoutPage;
