import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { Image, Transformation } from 'cloudinary-react';
import Carousel from 'nuka-carousel';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { Form, Field } from 'react-final-form';

import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';

import SignupForm from '../components/forms/SignupForm';
import ThankYouSignupModal from '../components/forms/ThankYouSignupModal';
import ImageSelectItem from '../components/forms/ImageSelectItem';
import ImageSelect from '../components/forms/ImageSelect';
import Select from '../components/forms/Select';
import TextField from '../components/forms/TextField';
import AddToCart from '../components/widgets/AddToCart/AddToCart';
import BaseModal from '../components/modals/BaseModal';

const sectionStyles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

const Section = withStyles(sectionStyles)(({ children, title, classes }) => (
  <Grid item>
    <Paper elevation={2} className={classNames(classes.root)}>
      <Typography variant="h5" component="h3">
        {title}
      </Typography>

      {children}
    </Paper>
  </Grid>
));

const sections = [];
const Intro = () => (
  <Section title="Component Library">
    <Typography component="p">
      The OCM component library is initially based on the Material UI library.
      <br />
      <a href="https://material-ui.com/demos/app-bar/">
        https://material-ui.com/demos/app-bar/
      </a>
    </Typography>
  </Section>
);
sections.push(Intro);

const Type = () => (
  <Section title="Text">
    <Typography component="p">
      All text should be wrapped in a Typography component.
    </Typography>
  </Section>
);
sections.push(Type);

const Layout = () => (
  <Section title="Layout">
    <Typography component="p">
      Grid component should handle the majority of layout concerns.
    </Typography>
  </Section>
);
sections.push(Layout);

const Buttons = () => (
  <Section title="Buttons">
    <Grid container spacing={8}>
      <Grid item>
        <Button variant="contained" color="primary">
          Test!
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="secondary">
          Test!
        </Button>
      </Grid>
      <Grid item>
        <Button variant="contained" color="primary" disabled>
          Disabled
        </Button>
      </Grid>
      <Grid item>
        <Button color="primary">Text Button</Button>
      </Grid>
    </Grid>
  </Section>
);
sections.push(Buttons);

const Images = () => (
  <Section title="Images">
    <Typography component="p">
      Images are driven by cloudinary. We use the cloudinary react component to
      provide images.
    </Typography>

    <Typography component="p">
      For more info checkout
      <br />
      <a href="https://github.com/cloudinary/cloudinary-react">
        cloudinary-react
      </a>
    </Typography>
    <Image publicId="http://placehold.it/1000x400/ffffff/c0392b" />
  </Section>
);
sections.push(Images);

//
// Forms!
//
const ExampleForm = ({ onSubmit }) => (
  <Form onSubmit={onSubmit}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={16}>
          <Grid item container>
            <Grid item sm={3}>
              <Field
                name="firstName"
                label="First Name"
                component={TextField}
              />
            </Grid>
            <Grid item sm={3}>
              <Field name="lastName" label="Last Name" component={TextField} />
            </Grid>
          </Grid>

          <Grid item sm={3}>
            <Field
              name="totallyOrganizedBundle"
              label="Add Totally Organized Bundle"
              autoWidth
              component={Select}
            >
              <MenuItem value="Hello">World</MenuItem>
            </Field>
          </Grid>

          <Grid item>
            <Field
              name="fleeceColor"
              label="Select a fleece color"
              component={ImageSelect}
            >
              <ImageSelectItem value="Purple" title="Purple" subtitle="$20">
                <Image
                  publicId="http://placehold.it/1000x400/ffffff/c0392b/&text=Purple"
                  width={100}
                  height={100}
                />
              </ImageSelectItem>

              <ImageSelectItem
                value="PolkaDot"
                title="PolkaDot and lorem ipsum dolor"
                subtitle="+$3"
              >
                <Image
                  publicId="http://placehold.it/1000x400/ffffff/c0392b/&text=PolkaDot"
                  height={100}
                  width={100}
                />
              </ImageSelectItem>

              <ImageSelectItem
                value="Obergiene"
                title="Obergiene"
                subtitle="$2"
              >
                <Image
                  publicId="http://placehold.it/1000x400/ffffff/c0392b/&text=Some%20Other%20Value"
                  width={100}
                  height={100}
                />
              </ImageSelectItem>

              <ImageSelectItem value="Xanadu" title="Xanadu" subtitle="$5">
                <Image
                  publicId="http://placehold.it/1000x400/ffffff/c0392b/&text=Xanadu"
                  width={100}
                  height={100}
                />
              </ImageSelectItem>

              <ImageSelectItem
                value="Vacuum"
                title="Vacuum"
                subtitle="+20,000 MA"
              >
                <Image
                  publicId="http://placehold.it/1000x400/ffffff/c0392b/&text=Vacuum"
                  width={100}
                  height={100}
                />
              </ImageSelectItem>
            </Field>
          </Grid>

          <Grid item>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    )}
  </Form>
);

const Forms = () => (
  <Section title="Forms">
    <Typography component="p" />

    <ExampleForm onSubmit={d => alert(JSON.stringify(d))} />
  </Section>
);
sections.push(Forms);

class SignupFormSection extends React.Component {
  state = {
    modalOpen: false
  };

  handleModal = flag => {
    this.setState({
      modalOpen: flag
    });
  };

  render() {
    return (
      <Section title="SignupForm">
        <SignupForm handleModal={this.handleModal} />
        <ThankYouSignupModal
          open={this.state.modalOpen}
          handleModal={this.handleModal}
        />
      </Section>
    );
  }
}

sections.push(SignupFormSection);

//
// Modals!!!
//
class Modals extends React.Component {
  state = {
    baseModalOpen: false
  };

  openModal = name => () => {
    this.setState({ [name]: true });
  };

  closeModal = () => {
    this.setState({
      baseModalOpen: false
    });
  };

  render() {
    const { baseModalOpen } = this.state;

    return (
      <Section title="Modals">
        <Grid container spacing={8}>
          <Grid item>
            <Button
              variant="contained"
              onClick={this.openModal('baseModalOpen')}
            >
              Open BaseModal
            </Button>
          </Grid>
          <BaseModal open={baseModalOpen} handleClose={this.closeModal}>
            <Typography variant="title">This is BaseModal!</Typography>
          </BaseModal>
        </Grid>
      </Section>
    );
  }
}
sections.push(Modals);

const CarouselSection = () => (
  <Section title="Carousels">
    <Typography component="p" />

    <Grid container direction="column">
      <Grid item>
        <Carousel>
          <Image
            publicId="http://placehold.it/1000x400/ffffff/c0392b/&text=slide1"
            height="500"
          >
            <Transformation height="500" />
          </Image>
          <Image
            publicId="http://placehold.it/1000x400/ffffff/c0392b/&text=slide2"
            height="500"
          >
            <Transformation height="500" />
          </Image>
          <Image
            publicId="http://placehold.it/1000x400/ffffff/c0392b/&text=slide3"
            height="500"
          >
            <Transformation height="500" />
          </Image>
        </Carousel>
      </Grid>

      <Grid item>
        <Carousel vertical heightMode="max">
          <Image publicId="http://placehold.it/1000x400/ffffff/c0392b/&text=slide1">
            <Transformation height="500" />
          </Image>
          <Image publicId="http://placehold.it/1000x400/ffffff/c0392b/&text=slide2">
            <Transformation height="500" />
          </Image>
          <Image publicId="http://placehold.it/1000x400/ffffff/c0392b/&text=slide3">
            <Transformation height="500" />
          </Image>
        </Carousel>
      </Grid>
    </Grid>
  </Section>
);
sections.push(CarouselSection);

// eslint-disable-next-line
class AddToCartSection extends React.Component {
  state = {
    modalOpen: false
  };

  handleModal = flag => {
    this.setState({
      modalOpen: flag
    });
  };

  onSubmit = d => {
    this.handleModal(false);
    this.handleThanksModal(true);
    alert(JSON.stringify(d));
  };

  render() {
    return (
      <Section title="AddToCart Section">
        <Button variant="contained" onClick={() => this.handleModal(true)}>
          Add To Cart
        </Button>
        <AddToCart handleModal={this.handleModal} open={this.state.modalOpen} />
      </Section>
    );
  }
}

sections.push(AddToCartSection);

const OtherTopics = () => (
  <Section title="Other Dev Topics">
    <Typography component="p">
      Find additional information regarding development in README.md.
    </Typography>
  </Section>
);
sections.push(OtherTopics);

const style = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  }
});

const Page = withStyles(style)(({ classes }) => (
  <div className={classes.root}>
    <Head>
      <title>Product Listing Page</title>
      <link
        href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Oswald:400,700"
        rel="stylesheet"
      />
    </Head>
    <CssBaseline />
    <main>
      <Grid
        container
        direction="column"
        spacing={24}
        className={classNames(classes.layout)}
      >
        {sections.map((S, i) => (
          <S key={i} />
        ))}
      </Grid>
    </main>
  </div>
));

export default Page;
