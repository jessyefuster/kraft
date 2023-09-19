import { styled } from '@mui/material';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import { useLocation, useNavigate } from 'react-router-dom';

import { routes } from '../../app/constants/routes';
import { Route } from '../../app/models/route';

const drawerWidth = 300;

const StyledListItemButton = styled(ListItemButton)({
  borderRadius: 12
});

interface StyledListItemIconProps {
  $selected: boolean;
}

const StyledListItemIcon = styled(ListItemIcon, {
  shouldForwardProp: (propName: PropertyKey) => !propName.toString().startsWith('$')
})<StyledListItemIconProps>(({ theme, $selected }) => ({
  color: $selected ? theme.palette.primary.main : undefined
}));

interface Props {
  basePath?: string; 
}

const NavigationDrawer = ({ basePath = '/' }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const baseRoute = routes.find(route => route.path === basePath);
  const items = baseRoute?.children?.filter(childRoute => childRoute.path) || [];

  const getRoutePath = ({ path }: Route) => path && `${basePath}${path}`;

  const onClick = (route: Route) => {
    const routePath = getRoutePath(route);
    
    if (routePath) {
      navigate(routePath);
    }
  };

  return (
    <Paper sx={{ width: drawerWidth }}>
      <Toolbar />
      <Divider />
      <List>
        {items.map(item => {
          const isItemActive = location.pathname === getRoutePath(item);

          return (
            <ListItem key={item.path}>
              <StyledListItemButton
                selected={isItemActive}
                onClick={() => onClick(item)}
              >
                {item.meta?.iconElement &&
                  <StyledListItemIcon $selected={isItemActive}>
                    {item.meta.iconElement}
                  </StyledListItemIcon>
                }
                <ListItemText primary={item.meta?.title} />
              </StyledListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default NavigationDrawer;
