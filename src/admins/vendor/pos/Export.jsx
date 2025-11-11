import React from 'react';
import { Button } from '@mui/material';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

const ExcelExport = ({ data }) => {
  const handleExcelExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    XLSX.writeFile(wb, 'customers.xlsx');
  };

  return (
    <Button variant="contained" color="primary" onClick={handleExcelExport}>
      Export to Excel
    </Button>
  );
};

const PDFExport = ({ data }) => {
  const handlePDFExport = () => {
    const doc = new jsPDF();
    doc.text('Customer Data', 20, 20);
    let yOffset = 30;
    data.forEach((customer, index) => {
      doc.text(`${index + 1}. ${customer.name} - ${customer.email}`, 20, yOffset);
      yOffset += 10;
    });
    doc.save('customers.pdf');
  };

  return (
    <Button variant="contained" color="secondary" onClick={handlePDFExport}>
      Export to PDF
    </Button>
  );
};

export { ExcelExport, PDFExport };
