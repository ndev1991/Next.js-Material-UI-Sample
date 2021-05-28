import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loading = () => (
  <Grid container justify="center">
    <CircularProgress size={80} thickness={7} />
  </Grid>
);

export default Loading;
