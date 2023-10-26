import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import type { TableCellProps } from '@mui/material/TableCell';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import type { LabelDisplayedRowsArgs } from '@mui/material/TablePagination';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useCallback } from 'react';

type NodeRecord = Record<string, React.ReactNode>;

export interface Column extends TableCellProps {}

export interface Item<T> {
  key: string;
  data: T;
}

export interface TableProps {
  label: string;
  columns: Column[];
  items: Item<NodeRecord>[];
  containerProps?: BoxProps;
}

const Table = ({ label, columns, items, containerProps }: TableProps) => {
  const defaultLabelDisplayedRows = useCallback(
    ({ count }: LabelDisplayedRowsArgs)=> `${count} élément${count > 1 ? 's' : ''}`
  , []);

  return (
    <Box
      {...containerProps}
      display="flex"
      flexDirection="column"
      width="100%"
    >
      <TableContainer sx={{ flex: 1 }}>
        <MuiTable stickyHeader={!!containerProps?.height} aria-label={label}>
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
      <TablePagination
        count={items.length}
        page={0}
        labelDisplayedRows={defaultLabelDisplayedRows}
        rowsPerPage={-1}
        rowsPerPageOptions={[-1]}
        onPageChange={() => {}}
        component="div"
      />
    </Box>
  );
};

export default Table;
