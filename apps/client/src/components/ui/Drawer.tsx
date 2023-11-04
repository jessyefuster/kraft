import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import type { DrawerProps } from '@mui/material/Drawer';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useCallback, type PropsWithChildren } from 'react';

type DrawerSize = 'small' | 'medium' | 'large';

const drawerSizes: Record<DrawerSize, string> = {
  small: '300px',
  medium: '400px',
  large: '500px'
};

interface StyledDrawerProps {
  $size: DrawerSize;
}

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (propName: PropertyKey) => !propName.toString().startsWith('$')
})<StyledDrawerProps>(({ theme, $size }) => ({
  '.MuiDrawer-paper': {
    borderTopLeftRadius: '24px',
    borderBottomLeftRadius: '24px',
    width: drawerSizes[$size],
    maxWidth: '50%'
  }
}));

const DrawerHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '24px'
});

const DrawerContent = styled(Box)({
  flex: 1,
  padding: '24px',
  overflowX: 'auto'
});

const DrawerActions = styled(Box)({
  padding: '24px'
});

interface Props extends Omit<DrawerProps, 'onClose'> {
  title: string;
  isOpen?: boolean;
  onClose: (confirm?: boolean) => void;
  onConfirm?: () => void;
  actions?: React.ReactNode | null;
  cancelText?: string;
  confirmText?: string;
  size?: StyledDrawerProps['$size'];
}

const Drawer = ({
  title,
  onClose,
  onConfirm,
  children,
  actions,
  isOpen = false,
  cancelText = 'Retour',
  confirmText = 'Valider',
  anchor = 'right',
  size = 'medium',
  ...rest
}: PropsWithChildren<Props>) => {
  const onDrawerClose = useCallback(() => onClose(), [onClose]);
  const onDrawerConfirm = useCallback(() => {
    onClose(true);
    onConfirm && onConfirm();
  }, [onClose, onConfirm]);

  return (
    <StyledDrawer
      {...rest}
      anchor={anchor}
      open={isOpen}
      onClose={onDrawerClose}
      $size={size}
    >
      <DrawerHeader>
        <Typography variant="h5" flexGrow={1}>{title}</Typography>
        <IconButton
          size="large"
          aria-label="Fermer"
          onClick={onDrawerClose}
        >
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <DrawerContent>
        {children}
      </DrawerContent>
      {actions !== null && (
        <>
          <Divider />
          <DrawerActions>
            {actions ??
              <>
                <Button onClick={onDrawerConfirm} variant="contained">{confirmText}</Button>
                <Button onClick={onDrawerClose} variant="outlined" sx={{ ml: 2 }}>{cancelText}</Button>
              </>
            }
          </DrawerActions>
        </>
      )}
    </StyledDrawer>
  );
};

export default Drawer;
