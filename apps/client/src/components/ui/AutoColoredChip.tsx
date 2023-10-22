import { styled } from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';
import Chip from '@mui/material/Chip';

const stringToColor = (str: string) => {
  let hash = 0;
  str.split('').forEach(char => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, '0');
  }

  return color;
};

interface ColoredCipsProps {
  $color: string;
}

const ColoredChip = styled(Chip, {
  shouldForwardProp: (propName: PropertyKey) => !propName.toString().startsWith('$')
})<ColoredCipsProps>(({ theme, variant, $color }) => (
  variant === 'outlined'
    ? {
        borderColor: $color,
        color: $color
      }
    : {
      backgroundColor: $color
    }
));

interface Props extends ChipProps {
  labelStr: string;
}

const AutoColoredChip = ({ labelStr, ...rest }: Props) => {
  const color = stringToColor(labelStr);

  return (
    <ColoredChip $color={color} {...rest} />
  );
};

export default AutoColoredChip;
