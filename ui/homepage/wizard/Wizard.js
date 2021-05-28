import { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { OverlayProgress } from '../../../components';

import {
  mapVariantsToCartOptions,
  mapConfigurationsToCartOptions
} from '../../../src/helpers/cart';
import Navigation from './steps/Navigation';
import StepOne from './steps/StepOne';
import StepTwo from './steps/StepTwo';
import StepThree from './steps/StepThree';
import StepFour from './steps/StepFour';
import StepFive from './steps/StepFive';

const styles = theme => ({
  paper: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 3.5}px ${theme
      .spacing.unit * 3.5}px ${theme.spacing.unit * 2.5}px`,
    boxShadow: theme.shadows[5],
    outline: 'none',
    borderRadius: 3,
    borderLeft: `24px solid ${theme.palette.primary.highlight}`,
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing.unit,
      border: `1px solid ${theme.palette.primary.highlight}`,
      borderRadius: 0
    }
  }
});

const steps = [
  'PICK YOUR PAK',
  'FIND YOUR STYLE',
  'UPGRADE YOUR COMFORT',
  'PACK FOR SCHOOL',
  'COMPLETE YOUR ROOM'
];

const mobileSteps = ['PAKS', 'STYLE', 'UPGRADE', 'TRUNKS', 'MORE'];

class Wizard extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    addCartMutation: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    // notification: PropTypes.func.isRequired,
    session: PropTypes.shape({
      sessionId: PropTypes.string,
      browserId: PropTypes.string
    }).isRequired,
    schoolCode: PropTypes.string.isRequired
  };

  state = {
    activeStep: 0,
    selectedPak: null,
    selectedVariant: null,
    selectedConfiguration: null,
    selectedTrunk: null,
    skipped: new Set()
  };

  get paks() {
    return (
      this.props.data && this.props.data.wizard && this.props.data.wizard.paks
    );
  }

  get product() {
    return (
      this.props.data &&
      this.props.data.wizard &&
      this.props.data.wizard.paks &&
      this.props.data.wizard.paks.filter(
        p => p.id === this.state.selectedPak
      )[0]
    );
  }

  get trunk() {
    return (
      this.props.data &&
      this.props.data.wizard &&
      this.props.data.wizard.addons &&
      this.props.data.wizard.addons[0]
    );
  }

  handleSelectedPak = selected => this.setState({ selectedPak: selected });

  handleSelectedVariant = selected =>
    this.setState({ selectedVariant: selected });

  handleSelectedConfiguration = selected =>
    this.setState({ selectedConfiguration: selected });

  handleSelectedTrunk = selected => this.setState({ selectedTrunk: selected });

  addToCart = async (product, variants, configurations) => {
    const variant = mapVariantsToCartOptions(variants, product);
    const configuration = mapConfigurationsToCartOptions(configurations);

    const options = [...variant, ...configuration];

    const variables = {
      sessionId: this.props.session.sessionId,
      browserId: this.props.session.browserId,
      schoolcode: this.props.schoolCode,
      domain: window.location.hostname,
      cartItem: {
        cartId: 0,
        schoolCode: this.props.schoolCode,
        productId: product.id,
        quantity: 1,
        options
      }
    };

    await this.props.addCartMutation({
      variables
    });
  };

  handleNextStepFour = async skip => {
    if (!skip) {
      await this.addToCart(
        this.trunk,
        this.state.selectedTrunk.variants,
        this.state.selectedTrunk.configurations
      );
    } else {
      this.handleSelectedTrunk(null);
    }

    this.handleNext();
  };

  handleNext = async () => {
    const { activeStep } = this.state;
    let { skipped } = this.state;
    let increment = 1;

    if (this.isStepSkipped(activeStep)) {
      skipped = new Set(skipped.values());
      skipped.delete(activeStep);
    }

    // if there's no configuration, skip step
    if (activeStep === 1) {
      if (!this.product.configurations) {
        increment = 2;
        if (!this.trunk) increment = 3;

        // add to cart here
        await this.addToCart(
          this.product,
          this.state.selectedVariant,
          this.state.selectedConfiguration
        );
      }
    }

    // if there's no trunk, skip step
    if (activeStep === 2) {
      if (!this.trunk) increment = 2;

      // add to cart when moving from 3 to 4
      await this.addToCart(
        this.product,
        this.state.selectedVariant,
        this.state.selectedConfiguration
      );
    }

    this.setState({
      activeStep: activeStep + increment,
      skipped
    });
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1
    }));
  };

  isStepOptional = step => step === 10;

  handleSkip = () => {
    const { activeStep } = this.state;
    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    this.setState(state => {
      const skipped = new Set(state.skipped.values());
      skipped.add(activeStep);
      return {
        activeStep: state.activeStep + 1,
        skipped
      };
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
      selectedPak: null,
      selectedVariant: null,
      selectedConfiguration: null
    });
  };

  handleStep = step => () => {
    this.setState({
      activeStep: step
    });
  };

  isStepSkipped = step => {
    return this.state.skipped.has(step);
  };

  renderStepContent = step => {
    if (this.props.loading) return <OverlayProgress />;
    if (this.props.error)
      return <h1 style={{ color: 'red' }}>Error querying endpoint.</h1>;

    switch (step) {
      case 0:
        return (
          <StepOne
            products={this.paks}
            handleNext={this.handleNext}
            handleSelected={this.handleSelectedPak}
          />
        );
      case 1:
        return (
          <StepTwo
            product={this.product}
            handleNext={this.handleNext}
            handleSelected={this.handleSelectedVariant}
          />
        );
      case 2:
        return (
          <StepThree
            product={this.product}
            handleNext={this.handleNext}
            handleSelected={this.handleSelectedConfiguration}
          />
        );
      case 3:
        return (
          <StepFour
            product={this.trunk}
            handleNext={this.handleNextStepFour}
            handleSelected={this.handleSelectedTrunk}
          />
        );
      case 4:
        return (
          <StepFive
            product={this.product}
            variant={this.state.selectedVariant}
            configuration={this.state.selectedConfiguration}
            trunk={this.state.selectedTrunk}
            handleNext={this.handleNext}
            handleStep={this.handleStep}
            closeModal={() => this.props.handleModal(false)}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  render() {
    const { classes } = this.props;
    const { activeStep } = this.state;

    return (
      <Fragment>
        <div className={classes.paper}>
          <Navigation
            steps={steps}
            mobileSteps={mobileSteps}
            activeStep={activeStep}
            isStepOptional={this.isStepOptional}
            isStepSkipped={this.isStepSkipped}
            handleNext={this.handleNext}
            handleStep={this.handleStep}
          />
          {this.renderStepContent(activeStep)}
        </div>
      </Fragment>
    );
  }
}
export default withStyles(styles)(Wizard);
