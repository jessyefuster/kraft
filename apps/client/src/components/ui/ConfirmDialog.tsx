import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import type { MouseEvent } from 'react';
import { useCallback } from 'react';

export interface Props {
  title: string;
  description: string;
  isOpen?: boolean;
  onClose: (confirm?: boolean) => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
  confirmType?: 'destructive' | 'default';
}

const ConfirmDialog = ({
  title,
  description,
  onClose,
  onConfirm,
  isOpen = false,
  cancelText = 'Retour',
  confirmText = 'OK',
  confirmType = 'default'
}: Props) => {
  const onDialogClose = useCallback((event: Event) => {
    event.stopPropagation();
    onClose();
  }, [onClose]);
  const onDialogCancel = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    onClose(false);
  }, [onClose]);
  const onDialogConfirm = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    onClose(true);
    onConfirm && onConfirm();
  }, [onClose, onConfirm]);

  return (
    <Dialog
      open={isOpen}
      onClose={onDialogClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDialogCancel}>{cancelText}</Button>
        <Button
          onClick={onDialogConfirm}
          color={confirmType === 'destructive' ? 'error' : undefined}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
