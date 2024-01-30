import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { CSVLink } from 'react-csv';

const columns = [
  { id: 'title', label: 'Title', minWidth: 170 },
  { id: 'journalname', label: 'Name of Journal', minWidth: 100 },
  {
    id: 'participantno',
    label: 'Number of Participants',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'controlfactors',
    label: 'Factors controlled for',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },

];

function createData(title, journalname,participantno, controlfactors) {
  return { title,journalname, participantno, controlfactors};
}

const rows = [
    createData('Vit c in dogs', 'Dog journal', 1324171354, 'Breed'),
    createData('Vit c in cats', 'cat journal', 1324171354, 'Colour'),
    createData('Vit c in leopards', 'leopard journal', 1324171354, 'Speed'),
 
];

export default function StickyHeadTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const csvData = [columns.map((col) => col.label), ...rows.map((row) => columns.map((col) => row[col.id]))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    
    <Paper sx={{ width: '100%', overflow: 'hidden', marginLeft:'250px'}}>
      <TableContainer sx={{ maxHeight: 440 , overflowX: 'auto'}}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
  
    </Paper>
    <div style={{ marginTop: 'auto', marginBottom: '20px' }}>
        <CSVLink filename="my-file.csv" data={csvData}>
          Export to CSV
        </CSVLink>
      </div>
       
     </div>
  );
}
