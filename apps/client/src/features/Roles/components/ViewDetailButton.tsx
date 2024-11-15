import ReadMoreIcon from '@mui/icons-material/ReadMore';
import IconButton from '@mui/material/IconButton';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  id: string;
}

const ViewDetailButton = ({ id }: Props) => {
  const navigate = useNavigate();

  const onClick = useCallback(() => {
    navigate(`/roles/${id}`);
  }, [id, navigate]);

  return (
    <IconButton onClick={onClick}>
      <ReadMoreIcon />
    </IconButton>
  );
};

export default ViewDetailButton;
