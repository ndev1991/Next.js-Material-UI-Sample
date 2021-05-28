import { useState, useContext } from 'react';
import WizardBanner from './WizardBanner';
import WizardModal from './WizardModal';
import SiteContext from '../../../lib/siteContext';

export default () => {
  const [isOpen, handleModal] = useState(false);
  const siteData = useContext(SiteContext);

  const renderWizard =
    siteData &&
    siteData.site &&
    siteData.site.navigation &&
    siteData.site.navigation.children &&
    siteData.site.navigation.children.filter(x => x.url === '/dorm-life')[0];
  if (!renderWizard) return null;

  return (
    <>
      <WizardBanner onClick={() => handleModal(true)} />
      <WizardModal isOpen={isOpen} handleModal={handleModal} />
    </>
  );
};
