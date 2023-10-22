import Button from '@mui/material/Button';
import type { DialogProps } from '@mui/material/Dialog';
import MuiDialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import type { PropsWithChildren } from 'react';
import { useCallback } from 'react';

export interface Props extends Omit<DialogProps, 'onClose' | 'open'> {
  title: string;
  isOpen?: boolean;
  onClose: (confirm?: boolean) => void;
  onConfirm?: () => void;
  actions?: React.ReactNode | null;
  cancelText?: string;
  confirmText?: string;
}

const Dialog = ({
  title,
  onClose,
  onConfirm,
  children,
  actions,
  isOpen = false,
  cancelText = 'Retour',
  confirmText = 'OK',
  ...rest
}: PropsWithChildren<Props>) => {
  const onDialogClose = useCallback(() => onClose(), [onClose]);
  const onDialogCancel = useCallback(() => onClose(false), [onClose]);
  const onDialogConfirm = useCallback(() => {
    onClose(true);
    onConfirm && onConfirm();
  }, [onClose, onConfirm]);

  return (
    <MuiDialog
      {...rest}
      open={isOpen}
      onClose={onDialogClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      {actions !== null && (
        <DialogActions>
          {actions ??
            <>
              <Button onClick={onDialogCancel}>{cancelText}</Button>
              <Button onClick={onDialogConfirm} variant="contained">{confirmText}</Button>
            </>
          }
        </DialogActions>
      )}
    </MuiDialog>
  );
};

export default Dialog;
