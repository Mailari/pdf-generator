import * as fs from "fs";
import * as pdfkit from "pdfkit";
import { numberToEnglish } from "./utils";

const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111
  },
  items: [
    { item: "TC 100", description: "Toner Cartridge", quantity: 2, amount: 6000 },
    {
      item: "USB_EXT",
      description: "USB Cable Extender Payment is due within 15 days. Thank you for your business",
      quantity: 1,
      amount: 2000
    },
    { item: "USB_EXT", description: "USB Cable Extender", quantity: 2, amount: 2000 }
  ],
  subtotal: 8000,
  paid: 0,
  invoice_nr: 1234
};

const h1 = 12;
const h2 = 10;
const h3 = 8;

export class InvoiceGenerator {
  static generateHeader(doc: PDFKit.PDFDocument) {
    doc
      .image("logo.png", 50, 45, { width: 80 })
      .fillColor("#444444")
      .fontSize(h1)
      .font("Courier-Bold")
      .text("Tax Invoice/Bill of Supply and /Cash Memo", 110, 57, { align: "right" })
      .fontSize(h3)
      .text("(Original Recept)", 200, 80, { align: "right" })
      .moveDown();
  }

  static generateAddressHeader(doc: PDFKit.PDFDocument, shipping: any) {
    doc
      .fillColor("#444444")
      .font("Courier-Bold")
      .fontSize(h2)
      .text("Sold By:", 50, 150, { align: "left" })
      .text("Billing Address:", 50, 150, { align: "right" })
      .moveDown()
      .font("Courier")
      .fontSize(h3)
      .text(shipping.name, 50, 170, { align: "left" })
      .text(shipping.address, 50, 180, { align: "left" })
      .text(shipping.city + "," + shipping.postal_code, 50, 190, { align: "left" })
      .font("Courier")
      .fontSize(h3)
      .text(shipping.name, 50, 170, { align: "right" })
      .text(shipping.address, 50, 180, { align: "right" })
      .text(shipping.city + "," + shipping.postal_code, 50, 190, { align: "right" })
      .moveDown()
      .font("Courier-Bold")
      .fontSize(h2)
      .text("Shipping Address:", 50, 220, { align: "right" })
      .fontSize(h3)
      .font("Courier")
      .text(shipping.name, 50, 230, { align: "right" })
      .text(shipping.address, 50, 240, { align: "right" })
      .text(shipping.city + "," + shipping.postal_code, 50, 250, { align: "right" });
  }

  static generateTableRow(doc: PDFKit.PDFDocument, row: any) {
    doc
      .text(row.c1 ?? "", 50, row.y, { lineBreak: true })
      .text(row.c2 ?? "", 100, row.y, { width: 250, lineBreak: true })
      .text(row.c3 ?? "", 370, row.y, { width: 130, align: "right" })
      .text(row.c4 ?? "", 425, row.y, { width: 130, align: "right" });
  }

  static generateTable(doc: PDFKit.PDFDocument, items: any[], subtotal: number) {
    let invoiceTableTop = 300;
    let i = 0;

    doc.fontSize(h2);
    doc.font("Courier-Bold");
    this.generateTableRow(doc, { c1: "Name", c2: "Description", c3: "Quantity", c4: "Amount", y: 290 });

    for (const item of items) {
      doc.fontSize(h3);
      const item = invoice.items[i];
      const position = invoiceTableTop + (i + 1) * 20;
      let row = {};
      Object.values(item).forEach((a, i) => Object.assign(row, { [`c${i + 1}`]: a }));
      Object.assign(row, { y: position });
      this.generateTableRow(doc, row);
      i++;
    }
    doc.fontSize(h2);
    doc.font("Courier-Bold");
    this.generateTableRow(doc, {
      c1: "Total : ",
      c2: (numberToEnglish(subtotal) + " only").toUpperCase(),
      c4: subtotal,
      y: invoiceTableTop + (items.length + 1) * 20
    });
  }

  static TableSkeleton(doc: PDFKit.PDFDocument, items: number[]) {
    doc.strike(45, 280, 520, 5);
  }

  static generate(invoice: any, path: string) {
    const doc = new pdfkit({ margin: 50 });
    this.generateHeader(doc);
    this.generateAddressHeader(doc, invoice.shipping);
    this.generateTable(doc, invoice.items, invoice.subtotal);
    // this.TableSkeleton(doc, invoice.items);
    doc.end();
    doc.pipe(fs.createWriteStream(path));
    console.log("Invoice Generated Successfully");
  }
}

InvoiceGenerator.generate(invoice, "template1.pdf");
