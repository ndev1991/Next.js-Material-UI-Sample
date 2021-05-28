import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Query, graphql, compose } from 'react-apollo';
import { simpleWizarQuery } from '../../../src/graphql/wizard';
import { addCartItem } from '../../../src/graphql/cart';
import SchoolContext from '../../../lib/schoolContext';
import SessionContext from '../../../lib/sessionContext';
import NotificationsContext from '../../../lib/notificationsContext';
import { CloudinaryContext } from '../../../lib/cloudinary';
import Wizard from './Wizard';

const WizardWithData = props => {
  const schoolCode = useContext(SchoolContext);
  const { showNotification } = useContext(NotificationsContext);
  const { sessionId, browserId } = useContext(SessionContext);
  return (
    <CloudinaryContext.Provider
      value={{
        cloudName: 'ocm',
        imagePath: 'wws/products'
      }}
    >
      <Query
        query={simpleWizarQuery}
        variables={{
          schoolCode
        }}
      >
        {({ loading, error, data }) => {
          return (
            <Wizard
              addCartMutation={props.addCartItem}
              data={data}
              loading={loading}
              error={error}
              notification={showNotification}
              session={{ sessionId, browserId }}
              schoolCode={schoolCode}
              handleModal={props.handleModal}
            />
          );
        }}
      </Query>
    </CloudinaryContext.Provider>
  );
};

WizardWithData.propTypes = {
  addCartItem: PropTypes.func.isRequired
};

const ComposedComponent = compose(
  graphql(addCartItem, {
    name: 'addCartItem'
  })
)(WizardWithData);

export default ComposedComponent;
