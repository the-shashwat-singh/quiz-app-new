declare module 'html2pdf.js' {
  function html2pdf(): html2pdf.Html2PdfWrapper;
  
  namespace html2pdf {
    interface Html2PdfWrapper {
      from(element: HTMLElement): Html2PdfWrapper;
      set(options: any): Html2PdfWrapper;
      save(): void;
    }
  }
  
  export = html2pdf;
} 