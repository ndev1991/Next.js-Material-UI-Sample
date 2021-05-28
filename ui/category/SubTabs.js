import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import classNames from 'classnames';
import { SchoolConsumer } from '../../lib/schoolContext';
import CustomScrollButton from './CustomScrollButton';

const styles = theme => ({
  layout: {
    marginTop: theme.spacing.unit * 2
  },
  indicator: {
    backgroundColor: theme.palette.primary.main
  },
  tab: {
    fontFamily: 'Rubik',
    fontSize: 20,
    color: theme.palette.common.grey[800],
    fontWeight: 400,
    maxWidth: 'unset'
  },
  selected: {
    fontWeight: 700,
    color: theme.palette.primary.main
  },
  endorsedSelected: {
    color: theme.palette.primary.main
  },
  label: {
    height: 35,
    display: 'block',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  labelContainer: {
    borderBottom: '1px solid #707070',
    marginBottom: theme.spacing.unit
  },
  wrapper: {
    borderBottom: `2px solid transparent`,
    '&:hover': {
      fontWeight: 700,
      color: theme.palette.common.grey[800],
      borderBottom: `2px solid ${theme.palette.primary.main}`
    }
  },
  textColorInherit: {
    opacity: 1
  },
  scrollButtons: {
    color: theme.palette.primary.main
  },
  icon: {
    fontSize: 56
  }
});

const SubTabs = ({ classes, value, handleChange, tabs }) => (
  <SchoolConsumer>
    {school => {
      const endorsed = school.toLowerCase() !== 'ocm';

      return (
        <Tabs
          value={value}
          onChange={handleChange}
          classes={{
            root: classes.layout,
            indicator: classes.indicator,
            scrollButtons: classes.scrollButtons
          }}
          ScrollButtonComponent={CustomScrollButton}
          variant="scrollable"
        >
          {tabs.map((tab, index) => (
            <Tab
              classes={{
                root: classes.tab,
                selected: classNames(
                  classes.selected,
                  endorsed ? classes.endorsedSelected : ''
                ),
                label: classes.label,
                labelContainer: classes.labelContainer,
                wrapper: classes.wrapper,
                textColorInherit: classes.textColorInherit
              }}
              label={tab.name}
              key={index}
              disableRipple
            />
          ))}
        </Tabs>
      );
    }}
  </SchoolConsumer>
);

export default withStyles(styles)(SubTabs);
