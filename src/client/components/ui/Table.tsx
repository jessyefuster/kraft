import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { TableCellProps } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

type NodeRecord = Record<string, React.ReactNode>;

export interface Column extends TableCellProps {}

export interface Item<T extends NodeRecord> {
  key: string;
  data: T;
}

interface Props<T extends NodeRecord> {
  label: string;
  columns: Column[];
  items: Item<T>[];
}

const Table = <T extends NodeRecord>({ label, columns, items }: Props<T>) => {
  return (
    <TableContainer sx={{ marginTop: 2 }}>
      <MuiTable aria-label={label}>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.title || 'unknown'} {...column}>{column.title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(({ key, data }) => (
            <TableRow
              key={key}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {Object.entries(data).map(([dataKey, value], index) => (
                <TableCell key={`item-${key}-column-${dataKey}`} align={columns[index].align}>{value}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default Table;
