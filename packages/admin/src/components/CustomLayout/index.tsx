import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  toggleSidebar,
  setSidebarVisibility,
  usePermissions,
  useTranslate,
  Layout,
  LayoutProps,
  UserMenu,
  MenuItemLink,
  AppBarProps,
  LoadingIndicator,
  HideOnScroll,
} from 'react-admin';
import {
  AppBar as MuiAppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  Theme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import SettingsIcon from '@material-ui/icons/Settings';

type MyUserMenuProps = {
  logout: React.ReactElement | null | undefined;
};

const MyUserMenu = (props: MyUserMenuProps): JSX.Element => {
  const userData = usePermissions();
  const toConfiguration = '/configurations/base/show';
  let toProfile = '/';
  let showConfiguration = false;
  if (userData && userData.permissions) {
    toProfile = `/users/${userData.permissions.id}/show`;
    if (userData.permissions.isAdmin) {
      showConfiguration = true;
    }
  }

  return (
    <UserMenu {...props}>
      <MenuItemLink
        to={toProfile}
        primaryText="Profile"
        leftIcon={<PersonIcon />}
        sidebarIsOpen={false}
        tooltipProps={{ open: false, children: <></>, title: '' }}
      />
      {showConfiguration ? (
        <MenuItemLink
          to={toConfiguration}
          primaryText="Configuration"
          leftIcon={<SettingsIcon />}
          sidebarIsOpen={false}
          tooltipProps={{ open: false, children: <></>, title: '' }}
        />
      ) : null}
    </UserMenu>
  );
};

const useStyles = makeStyles(
  (theme) => ({
    toolbar: {
      paddingRight: 24,
    },
    menuButton: {
      marginLeft: '0.5em',
      marginRight: '0.5em',
    },
    menuButtonIconClosed: {
      transition: theme.transitions.create(['transform'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      transform: 'rotate(0deg)',
    },
    menuButtonIconOpen: {
      transition: theme.transitions.create(['transform'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      transform: 'rotate(180deg)',
    },
    title: {
      flex: 1,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
  }),
  { name: 'RaAppBar' },
);

type MyAppBarProps = AppBarProps;

const MyAppBar = (props: MyAppBarProps): JSX.Element => {
  const {
    children,
    classes: classesOverride,
    className,
    color = 'secondary',
    logout,
    open: baseOpen,
    title,
    userMenu,
    ...rest
  } = props;
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const isXSmall = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down('xs'),
  );
  const translate = useTranslate();
  const userData = usePermissions();
  let showMenuIcon = false;
  let open = false;
  if (userData && userData.permissions && !userData.permissions.isAgent) {
    showMenuIcon = true;
    open = !!baseOpen;
  }
  const logoutFixed = logout as React.ReactElement;

  useEffect(() => {
    if (open !== baseOpen) {
      dispatch(setSidebarVisibility(open));
    }
  }, [dispatch, open, baseOpen]);

  return (
    <HideOnScroll>
      <MuiAppBar className={className} color={color} {...rest}>
        <Toolbar
          disableGutters
          variant={isXSmall ? 'regular' : 'dense'}
          className={classes.toolbar}
        >
          {showMenuIcon ? (
            <Tooltip
              title={translate(
                open ? 'ra.action.close_menu' : 'ra.action.open_menu',
                {
                  _: 'Open/Close menu',
                },
              )}
              enterDelay={500}
            >
              <IconButton
                color="inherit"
                onClick={() => dispatch(toggleSidebar())}
                className={classes.menuButton}
              >
                <MenuIcon
                  classes={{
                    root: open
                      ? classes.menuButtonIconOpen
                      : classes.menuButtonIconClosed,
                  }}
                />
              </IconButton>
            </Tooltip>
          ) : null}
          {React.Children.count(children) === 0 ? (
            <Typography
              variant="h6"
              color="inherit"
              className={classes.title}
              id="react-admin-title"
            />
          ) : (
            children
          )}
          <LoadingIndicator />
          <MyUserMenu logout={logoutFixed} />
        </Toolbar>
      </MuiAppBar>
    </HideOnScroll>
  );
};

export const MyLayout = (props: LayoutProps) => (
  <Layout {...props} appBar={MyAppBar} />
);

export default MyLayout;
