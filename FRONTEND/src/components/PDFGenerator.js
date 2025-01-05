import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const prescriptionPDF = (formData) => {
  const docDefinition = {
    content: [
      {
        text: 'HealingWave Health Service',
        style: 'header',
        alignment: 'center',
        margin: [0, 20],
      },
      {
        text: '15 Rankin Street, Wari, Dhaka 1203',
        style: 'address',
        alignment: 'center',
        margin: [0, 0, 0, 30],
      },
      {
        text: 'Prescription Details',
        style: 'sectionHeader',
        margin: [0, 20],
      },
      {
        style: 'detailsTable',
        table: {
          widths: ['30%', '70%'],
          body: [
            [{ text: 'Doctor Name', style: 'tableHeader' }, { text: formData.doctorName, style: 'tableData' }],
            [{ text: 'Doctor Email', style: 'tableHeader' }, { text: formData.doctorEmail, style: 'tableData' }],
            [{ text: 'Date', style: 'tableHeader' }, { text: formData.date, style: 'tableData' }],
            [{ text: 'Patient Email', style: 'tableHeader' }, { text: formData.patientEmail, style: 'tableData' }],
            [{ text: 'Patient Name', style: 'tableHeader' }, { text: formData.patientName, style: 'tableData' }],
            [{ text: 'Age', style: 'tableHeader' }, { text: formData.age, style: 'tableData' }],
            [{ text: 'Sex', style: 'tableHeader' }, { text: formData.sex, style: 'tableData' }],
            [{ text: 'Phone Number', style: 'tableHeader' }, { text: formData.phoneNumber, style: 'tableData' }],
          ],
        },
        layout: 'lightHorizontalLines',
        margin: [0, 10],
      },
      {
        text: 'Prescription',
        style: 'sectionHeader',
        margin: [0, 20],
      },
      {
        text: formData.prescriptionText,
        style: 'prescriptionText',
        margin: [0, 10],
      },
      {
        text: 'Thank you for choosing HealingWave Health Service.',
        style: 'footer',
        alignment: 'center',
        margin: [0, 30],
      },
    ],
    styles: {
      header: {
        fontSize: 32,
        bold: true,
        color: '#3498db', 
        decoration: 'underline',
        margin: [0, 10],
      },
      address: {
        fontSize: 16,
        color: '#2c3e50',
        margin: [0, 10],
      },
      sectionHeader: {
        fontSize: 22,
        bold: true,
        color: '#3498db', 
        decoration: 'underline',
        margin: [0, 20],
      },
      detailsTable: {
        margin: [0, 10],
        borderColor: '#3498db',
        borderWidth: 1,
        fontSize: 12,
        layout: {
          fillColor: (rowIndex, node, columnIndex) => (rowIndex % 2 === 0 ? '#f9f9f9' : '#ffffff'),
          hLineColor: '#3498db',
          vLineColor: '#3498db',
          hLineWidth: 1,
          vLineWidth: 1,
        },
      },
      tableHeader: {
        fillColor: '#dfe6e9',
        bold: true,
        color: '#2c3e50',
        padding: [8, 6],
        fontSize: 14,
      },
      tableData: {
        padding: [8, 6],
        color: '#34495e',
      },
      prescriptionText: {
        fontSize: 14,
        margin: [0, 10],
        border: [true, true, true, true],
        borderColor: '#3498db',
        borderWidth: 1,
        padding: [15, 15],
        background: '#f9f9f9',
        lineHeight: 1.6,
      },
      footer: {
        fontSize: 12,
        italics: true,
        color: '#7f8c8d',
        margin: [0, 30],
      },
    },
    pageMargins: [40, 60, 40, 60],
  };

  pdfMake.createPdf(docDefinition).download('prescription.pdf');
};


pdfMake.vfs = pdfFonts.pdfMake.vfs;

const generateBillPDF = (bills, type) => {
  const hospitalName = 'HealingWave Health Service';
  const hospitalAddress = '15 Rankin Street, Wari, Dhaka 1203';

  const docDefinition = {
    content: [
      {
        text: hospitalName,
        style: 'header',
        color: '#3498db', 
        bold: true
      },
      {
        text: hospitalAddress,
        style: 'subheader',
        color: '#3498db', 
        margin: [0, 0, 0, 10]
      },
      {
        text: `${type.charAt(0).toUpperCase() + type.slice(1)} Bills`,
        style: 'title'
      },
      {
        text: '\n' 
      },
      ...bills.map(bill => ({
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: [
            [{ text: 'Description', style: 'tableHeader' }, { text: 'Details', style: 'tableHeader' }],
            ['Type', type === 'ward' ? bill.wardType : bill.cabinType],
            ['Floor No', bill.floor],
            ['Number', type === 'ward' ? bill.wardNo : bill.cabinNo],
            ['Patient Name', bill.patientName],
            ['Email', bill.email],
            ['Phone', bill.phone],
            ['Booked Date', new Date(bill.bookedDate).toLocaleDateString()],
            ['Total Bill', bill.totalBill],
            [
              'Paid Status',
              {
                text: bill.paid ? 'Paid' : 'Unpaid',
                color: bill.paid ? 'green' : 'red',
                bold: true
              }
            ]
          ]
        },
        layout: {
          hLineColor: () => '#3498db',
          vLineColor: () => '#3498db',
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 8,
          paddingBottom: () => 8
        }
      })),
      {
        text: '\n' 
      },
      {
        text: 'Thank you for visiting HealingWave Health Service.',
        style: 'footer'
      }
    ],
    styles: {
      header: {
        fontSize: 22,
        alignment: 'center',
        margin: [0, 0, 0, 10],
        color: '#2c3e50'
      },
      subheader: {
        fontSize: 14,
        alignment: 'center',
        margin: [0, 0, 0, 10],
        color: '#2c3e50'
      },
      title: {
        fontSize: 18,
        alignment: 'center',
        margin: [0, 0, 0, 20],
        color: '#3498db',
        bold: true
      },
      tableHeader: {
        fillColor: '#3498db',
        color: 'white',
        alignment: 'center',
        bold: true,
        fontSize: 12,
        margin: [0, 5]
      },
      footer: {
        fontSize: 12,
        alignment: 'center',
        margin: [0, 20, 0, 0],
        color: '#3498db'
      }
    },
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60], 
    defaultStyle: {
      fontSize: 12,
      color: '#333'
    }
  };

  pdfMake.createPdf(docDefinition).download(`Bill_${type.charAt(0).toUpperCase() + type.slice(1)}.pdf`);
};

export { generateBillPDF };
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const generateTestBillPDF = (bills) => {
  const hospitalName = 'HealingWave Health Service';
  const hospitalAddress = '15 Rankin Street, Wari, Dhaka 1203';

  const docDefinition = {
    content: [
      {
        text: hospitalName,
        style: 'header',
        color: '#3498db', 
        bold: true
      },
      {
        text: hospitalAddress,
        style: 'subheader',
        color: '#3498db', 
        margin: [0, 0, 0, 10]
      },
      {
        text: 'Test and Services Bills',
        style: 'title'
      },
      {
        text: '\n' 
      },
      ...bills.map(bill => ({
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: [
            [{ text: 'Description', style: 'tableHeader' }, { text: 'Details', style: 'tableHeader' }],
            ['Doctor Name', bill.doctorName || 'N/A'],
            ['Doctor Email', bill.doctorEmail || 'N/A'],
            ['Patient Name', bill.patientName || 'N/A'],
            ['Patient Email', bill.patientEmail || 'N/A'],
            ['Phone', bill.phone || 'N/A'],
            ['Selected Items', bill.selectedItems.length ? bill.selectedItems.map(item => `${item.type}: ${item.name} - ${item.price}`).join(', ') : 'N/A'],
            ['Total Bill', bill.totalBill || 'N/A'],
            ['Paid Status', {
              text: bill.paid ? 'Paid' : 'Unpaid',
              color: bill.paid ? 'green' : 'red',
              bold: true
            }]
          ]
        },
        layout: {
          hLineColor: () => '#3498db',
          vLineColor: () => '#3498db',
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 8,
          paddingBottom: () => 8
        }
      })),
      {
        text: '\n'
      },
      {
        text: 'Thank you for visiting HealingWave Health Service.',
        style: 'footer'
      }
    ],
    styles: {
      header: {
        fontSize: 22,
        alignment: 'center',
        margin: [0, 0, 0, 10],
        color: '#2c3e50'
      },
      subheader: {
        fontSize: 14,
        alignment: 'center',
        margin: [0, 0, 0, 10],
        color: '#2c3e50'
      },
      title: {
        fontSize: 18,
        alignment: 'center',
        margin: [0, 0, 0, 20],
        color: '#3498db',
        bold: true
      },
      tableHeader: {
        fillColor: '#3498db',
        color: 'white',
        alignment: 'center',
        bold: true,
        fontSize: 12,
        margin: [0, 5]
      },
      footer: {
        fontSize: 12,
        alignment: 'center',
        margin: [0, 20, 0, 0],
        color: '#3498db'
      }
    },
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60], 
    defaultStyle: {
      fontSize: 12,
      color: '#333'
    }
  };

  pdfMake.createPdf(docDefinition).download('TestBill.pdf');
};

export { generateTestBillPDF };

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generateMedicineBillPDF = (bills) => {
  const hospitalName = 'HealingWave Health Service';
  const hospitalAddress = '15 Rankin Street, Wari, Dhaka 1203';

  const docDefinition = {
    content: [
      {
        text: hospitalName,
        style: 'header',
        color: '#3498db', 
        bold: true
      },
      {
        text: hospitalAddress,
        style: 'subheader',
        color: '#3498db', 
        margin: [0, 0, 0, 10]
      },
      {
        text: 'Medicine Bills',
        style: 'title'
      },
      {
        text: '\n' 
      },
      ...bills.map(bill => ({
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: [
            [{ text: 'Description', style: 'tableHeader' }, { text: 'Details', style: 'tableHeader' }],
            ['Name', bill.name || 'N/A'],
            ['Email', bill.email || 'N/A'],
            ['Phone Number', bill.phoneNumber || 'N/A'],
            ['Address', bill.address || 'N/A'],
            ['Total Bill', `৳ ${bill.totalBill || 'N/A'}`],
            ['Date', new Date(bill.date).toLocaleDateString() || 'N/A'],
            ['Medicines', bill.medicines.length ? bill.medicines.map(item => `${item.medicineId.name}: ৳ ${item.totalPrice} for ${item.quantity} units`).join(', ') : 'N/A'],
            ['Paid Status', {
              text: bill.paid ? 'Paid' : 'Unpaid',
              color: bill.paid ? 'green' : 'red',
              bold: true
            }]
          ]
        },
        layout: {
          hLineColor: () => '#3498db',
          vLineColor: () => '#3498db',
          hLineWidth: () => 1,
          vLineWidth: () => 1,
          paddingLeft: () => 8,
          paddingRight: () => 8,
          paddingTop: () => 8,
          paddingBottom: () => 8
        }
      })),
      {
        text: '\n'
      },
      {
        text: 'Thank you for visiting HealingWave Health Service.',
        style: 'footer'
      }
    ],
    styles: {
      header: {
        fontSize: 22,
        alignment: 'center',
        margin: [0, 0, 0, 10],
        color: '#2c3e50'
      },
      subheader: {
        fontSize: 14,
        alignment: 'center',
        margin: [0, 0, 0, 10],
        color: '#2c3e50'
      },
      title: {
        fontSize: 18,
        alignment: 'center',
        margin: [0, 0, 0, 20],
        color: '#3498db',
        bold: true
      },
      tableHeader: {
        fillColor: '#3498db',
        color: 'white',
        alignment: 'center',
        bold: true,
        fontSize: 12,
        margin: [0, 5]
      },
      footer: {
        fontSize: 12,
        alignment: 'center',
        margin: [0, 20, 0, 0],
        color: '#3498db'
      }
    },
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60], 
    defaultStyle: {
      fontSize: 12,
      color: '#333'
    }
  };

  pdfMake.createPdf(docDefinition).download('MedicineBill.pdf');
};