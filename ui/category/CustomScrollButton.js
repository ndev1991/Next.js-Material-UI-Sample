import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ButtonBase from '@material-ui/core/ButtonBase';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';

const styles = () => ({
  icon: {
    fontSize: 56
  }
});

const CustomScrollButton = ({
  className,
  direction,
  visible,
  onClick,
  classes
}) => {
  if (visible === false) return null;
  return (
    <ButtonBase
      direction={direction}
      onClick={onClick}
      visible={undefined}
      className={classNames(className, classes.buttonBase)}
    >
      {direction === 'right' ? (
        <ChevronRight className={classes.icon} />
      ) : (
        <ChevronLeft className={classes.icon} />
      )}
    </ButtonBase>
  );
};

export default withStyles(styles)(CustomScrollButton);
