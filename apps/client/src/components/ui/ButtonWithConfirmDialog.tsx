import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import type { MouseEvent, PropsWithChildren } from 'react';
import { useCallback, useState } from 'react';

import type { Props as DialogProps } from './ConfirmDialog';
import ConfirmDialog from './ConfirmDialog';

export interface Props extends Omit<ButtonProps, 'onClick'> {
  onConfirm: DialogProps['onClose'];
  icon?: React.ReactNode;
  dialogOptions: Omit<DialogProps, 'isOpen' | 'onClose'>;
}

const ButtonWithConfirmDialog = ({ onConfirm, icon, dialogOptions, children, ...buttonProps }: PropsWithChildren<Props>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const onClick = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    setDialogOpen(true);
  }, []);
  const onDialogClose = useCallback(() => setDialogOpen(false), []);

  return (
    <>
      {icon
        ? <IconButton {...buttonProps} onClick={onClick}>{icon}</IconButton>
        : <Button {...buttonProps} onClick={onClick}>{children}</Button>
      }
      <ConfirmDialog
        {...dialogOptions}
        isOpen={dialogOpen}
        onClose={onDialogClose}
        onConfirm={onConfirm}
      />
    </>
  );
};

export default ButtonWithConfirmDialog;
