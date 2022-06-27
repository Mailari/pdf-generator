import * as fs from "fs";
import { numberToEnglish } from "./utils";
const PDFDocument = require("pdfkit-table");

const invoice = {
  shipping: {
    name: "John Doe",
    address: "1234 Main Street",
    city: "San Francisco",
    state: "CA",
    country: "US",
    postal_code: 94111
  },
  currency: "$",
  currency_name: "Dollar",
  items: [
    {
      name: "TC 100  ",
      quantity: 2,
      amount: 6000,
      price: 3000
    },
    {
      name: "USB_EXT",
      quantity: 1,
      amount: 2000,
      price: 2000
    },
    {
      name: "USB_EXTMain Street Suite Suite random string within range align const ",
      price: 1000,
      quantity: 2,
      amount: 2000
    }
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
      .text(shipping.city + "," + shipping.postal_code, 50, 250, { align: "right" })
      .moveDown();
  }

  static generateFooter(doc: PDFKit.PDFDocument) {
    doc.text("footer Data").moveDown();
  }

  static generate() {
    // start pdf document
    let doc = new PDFDocument();
    // to save on server
    doc.pipe(fs.createWriteStream("./document.pdf"));

    // -----------------------------------------------------------------------------------------------------
    // Simple Table with Array
    // -----------------------------------------------------------------------------------------------------

    this.generateHeader(doc);
    this.generateAddressHeader(doc, invoice.shipping);

    doc.moveDown();
    doc.fontSize(h2);
    const options = { fontSize: 12, fontFamily: "Courier-Bold" };
    const tableArray = {
      headers: [
        { label: "Sl.No", width: 80, options, align: "center" },
        { label: "Name", width: 200, options, align: "left" },
        { label: "Price", width: 50, options, align: "center" },
        { label: "Quantity", width: 80, options, align: "right" },
        { label: "Amount", width: 80, options, align: "right" }
      ],
      rows: [
        ...invoice.items.map((item, i) => {
          return [i + 1, item.name, item.quantity, `${invoice.currency} ${item.price}`, item.amount];
        }),
        [
          "Total :",
          `${numberToEnglish(invoice.subtotal)} ${invoice.currency_name}s only`.toUpperCase(),
          "",
          "Total Amount:",
          invoice.currency + " " + invoice.subtotal.toString()
        ]
      ]
    };
    doc.table(tableArray, {
      prepareHeader: () => doc.font("Courier-Bold").fontSize(h2),
      prepareRow: (row: any, indexColumn: any, indexRow: any, rectRow: any) => {
        doc.font("Courier").fontSize(h2);
      }
    }); // A4 595.28 x 841.89 (portrait) (about width sizes)

    doc.moveDown();
    this.generateFooter(doc);
    doc.end();
  }
}

InvoiceGenerator.generate();
