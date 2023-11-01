import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import type { TableCellProps } from '@mui/material/TableCell';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import type { LabelDisplayedRowsArgs } from '@mui/material/TablePagination';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { useCallback, useState } from 'react';

const StyledTableRow = styled(TableRow)(({ hover }) => ({
  '&:last-child td, &:last-child th': {
    border: 0
  },
  cursor: hover ? 'pointer' : 'default'
}));

type NodeRecord = Record<string | symbol, React.ReactNode>;

export interface Column<K = string> extends Omit<TableCellProps, 'id'> {
  id: K;
}

export interface Item<T> {
  id: string;
  primaryColumn: keyof T;
  data: T;
}

export interface TableProps<T = unknown> {
  label: string;
  columns: Column[];
  items: Item<T>[];
  selectable?: boolean;
  onSelectionChange?: (itemsIds: string[]) => void;
  showPagination?: boolean;
  containerProps?: BoxProps;
}

const Table = <T extends NodeRecord>({ label, columns, items, selectable, onSelectionChange, showPagination = true, containerProps }: TableProps<T>) => {
  const [selected, setSelected] = useState<readonly string[]>([]);
  const defaultLabelDisplayedRows = useCallback(
    ({ count }: LabelDisplayedRowsArgs)=> `${count} élément${count > 1 ? 's' : ''}`
  , []);

  const getColumn = (id: string) => columns.find(column => column.id === id);

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const handleSelectAllClick = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = items.map((item) => item.id);
      setSelected(newSelected);
      onSelectionChange?.([...newSelected]);
    } else {
      setSelected([]);
      onSelectionChange?.([]);
    }
  }, [items, onSelectionChange]);

  const handleItemClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
    onSelectionChange?.([...newSelected]);
  };

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
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < items.length}
                    checked={items.length > 0 && selected.length === items.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'Tout sélectionner' }}
                  />
                </TableCell>
              )}
              {columns.filter(c => c.hidden !== true).map(({ id, ...rest }) => (
                <TableCell key={id} {...rest}>{rest.title}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(({ id, primaryColumn, data }) => {
              const isItemSelected = isSelected(id);
              const primaryColumnId = `item-${id}-column-${primaryColumn.toString()}`;

              return (
                <StyledTableRow
                  key={id}
                  onClick={selectable ? (event) => handleItemClick(event, id) : undefined}
                  hover={selectable}
                  role={selectable ? 'checkbox' : undefined}
                  selected={selectable && isItemSelected}
                  aria-checked={selectable && isItemSelected}
                >
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': primaryColumnId }}
                      />
                    </TableCell>
                  )}
                  {Object.entries(data).map(([dataKey, value]) => {
                    const column = getColumn(dataKey);
                    const isPrimaryColumn = dataKey === primaryColumn;
                    const cellId = `item-${id}-column-${dataKey}`;

                    return column && column.hidden !== true
                      ? <TableCell
                          id={cellId}
                          key={cellId}
                          component={isPrimaryColumn ? 'th' : undefined}
                          scope={isPrimaryColumn ? 'row' : undefined}
                          align={column.align}
                        >{value}</TableCell>
                      : undefined;
                  })}
                </StyledTableRow>
              );
            })}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {showPagination &&
        <TablePagination
          count={items.length}
          page={0}
          labelDisplayedRows={defaultLabelDisplayedRows}
          rowsPerPage={-1}
          rowsPerPageOptions={[-1]}
          onPageChange={() => {}}
          component="div"
        />
      }
    </Box>
  );
};

export default Table;
