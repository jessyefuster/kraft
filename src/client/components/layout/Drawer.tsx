import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import PaletteIcon from '@mui/icons-material/Palette';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { useState } from 'react';
import { styled } from '@mui/material';

const drawerWidth = 300;

const StyledListItemButton = styled(ListItemButton)({
  borderRadius: 12
});

interface ListItemIconProps {
  $isSelected: boolean;
}

const StyledListItemIcon = styled(ListItemIcon)<ListItemIconProps>(({ theme, $isSelected }) => ({
  color: $isSelected ? theme.palette.primary.main : undefined
}));

const Drawer = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  return (
    <Paper sx={{ width: drawerWidth }}>
      <Toolbar />
      <Divider />
      <List>
        <ListItem>
          <StyledListItemButton
            selected={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0)}
          >
            <StyledListItemIcon $isSelected={selectedIndex === 0}>
              <LayersRoundedIcon />
            </StyledListItemIcon>
            <ListItemText primary='Apps' />
          </StyledListItemButton>
        </ListItem>
        <ListItem>
          <StyledListItemButton
            selected={selectedIndex === 1}
            onClick={(event) => handleListItemClick(event, 1)}
          >
            <StyledListItemIcon $isSelected={selectedIndex === 1}>
              <PeopleRoundedIcon />
            </StyledListItemIcon>
            <ListItemText primary='Utilisateurs' />
          </StyledListItemButton>
        </ListItem>
        <ListItem>
          <StyledListItemButton
            selected={selectedIndex === 2}
            onClick={(event) => handleListItemClick(event, 2)}
          >
            <StyledListItemIcon $isSelected={selectedIndex === 2}>
              <PaletteIcon />
            </StyledListItemIcon>
            <ListItemText primary='Personnalisation' />
          </StyledListItemButton>
        </ListItem>
        <ListItem>
          <StyledListItemButton
            selected={selectedIndex === 3}
            onClick={(event) => handleListItemClick(event, 3)}
          >
            <StyledListItemIcon $isSelected={selectedIndex === 3}>
              <SettingsIcon />
            </StyledListItemIcon>
            <ListItemText primary='Paramètres' />
          </StyledListItemButton>
        </ListItem>
      </List>
    </Paper>
  );
};

export default Drawer;
