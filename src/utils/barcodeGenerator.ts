import JsBarcode from 'jsbarcode';

interface BarcodeOptions {
  format?: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  fontSize?: number;
  textAlign?: string;
  textPosition?: string;
  textMargin?: number;
  fontOptions?: string;
  font?: string;
  background?: string;
  lineColor?: string;
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
}

export const generateBarcode = (
  text: string, 
  elementId: string, 
  options: BarcodeOptions = {}
): void => {
  const defaultOptions: BarcodeOptions = {
    format: 'CODE128',
    width: 2,
    height: 100,
    displayValue: true,
    fontSize: 12,
    textAlign: 'center',
    textPosition: 'bottom',
    textMargin: 2,
    fontOptions: '',
    font: 'monospace',
    background: '#ffffff',
    lineColor: '#000000',
    margin: 10,
    marginTop: undefined,
    marginBottom: undefined,
    marginLeft: undefined,
    marginRight: undefined
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    JsBarcode(`#${elementId}`, text, mergedOptions);
  } catch (error) {
    console.error('Error generating barcode:', error);
    throw new Error(`Failed to generate barcode for text: ${text}`);
  }
};

export const generateBarcodeDataURL = (
  text: string, 
  options: BarcodeOptions = {}
): string => {
  const canvas = document.createElement('canvas');
  
  const defaultOptions: BarcodeOptions = {
    format: 'CODE128',
    width: 2,
    height: 100,
    displayValue: true,
    fontSize: 12,
    textAlign: 'center',
    textPosition: 'bottom',
    textMargin: 2,
    fontOptions: '',
    font: 'monospace',
    background: '#ffffff',
    lineColor: '#000000',
    margin: 10
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    JsBarcode(canvas, text, mergedOptions);
    return canvas.toDataURL();
  } catch (error) {
    console.error('Error generating barcode data URL:', error);
    throw new Error(`Failed to generate barcode data URL for text: ${text}`);
  }
};

const generateBatchBarcode = (batchNumber: string): string => {
  return `BATCH_${batchNumber}`;
};

const generateStepBarcode = (
  action: 'START' | 'STOP', 
  stepName: string, 
  batchNumber: string
): string => {
  const cleanStepName = stepName.replace(/\s+/g, '_').toUpperCase();
  return `${action}_${cleanStepName}_${batchNumber}`;
};

export const parseBarcodeAction = (barcode: string): {
  action: 'START' | 'STOP' | 'BATCH' | 'UNKNOWN';
  stepName?: string;
  batchNumber?: string;
} => {
  if (barcode.startsWith('BATCH_')) {
    return {
      action: 'BATCH',
      batchNumber: barcode.replace('BATCH_', '')
    };
  }

  if (barcode.startsWith('START_')) {
    const parts = barcode.split('_');
    if (parts.length >= 3) {
      return {
        action: 'START',
        stepName: parts.slice(1, -1).join('_'),
        batchNumber: parts[parts.length - 1]
      };
    }
  }

  if (barcode.startsWith('STOP_')) {
    const parts = barcode.split('_');
    if (parts.length >= 3) {
      return {
        action: 'STOP',
        stepName: parts.slice(1, -1).join('_'),
        batchNumber: parts[parts.length - 1]
      };
    }
  }

  return { action: 'UNKNOWN' };
};

const validateBarcodeFormat = (barcode: string): boolean => {
  // Code 128 can encode ASCII characters 0-127
  // Check if all characters are valid
  for (let i = 0; i < barcode.length; i++) {
    const charCode = barcode.charCodeAt(i);
    if (charCode < 0 || charCode > 127) {
      return false;
    }
  }
  
  // Check minimum length
  if (barcode.length < 1) {
    return false;
  }
  
  // Check maximum practical length (varies by implementation, but 80 is safe)
  if (barcode.length > 80) {
    return false;
  }
  
  return true;
};

export const createPrintableBarcodeSheet = (
  barcodes: Array<{ text: string; label: string }>,
  title: string = 'Laboratory Barcodes'
): string => {
  const barcodeElements = barcodes.map((barcode, index) => {
    const canvas = document.createElement('canvas');
    
    try {
      JsBarcode(canvas, barcode.text, {
        format: 'CODE128',
        width: 2,
        height: 80,
        displayValue: true,
        fontSize: 10,
        textAlign: 'center',
        textPosition: 'bottom',
        textMargin: 2,
        font: 'monospace',
        background: '#ffffff',
        lineColor: '#000000',
        margin: 5
      });
      
      const dataURL = canvas.toDataURL();
      
      return `
        <div class="barcode-item">
          <h4>${barcode.label}</h4>
          <img src="${dataURL}" alt="${barcode.text}" />
          <p class="barcode-text">${barcode.text}</p>
        </div>
      `;
    } catch (error) {
      console.error(`Error generating barcode for ${barcode.text}:`, error);
      return `
        <div class="barcode-item error">
          <h4>${barcode.label}</h4>
          <p>Error generating barcode</p>
          <p class="barcode-text">${barcode.text}</p>
        </div>
      `;
    }
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          background: white;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        .barcode-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }
        .barcode-item {
          border: 1px solid #ddd;
          padding: 15px;
          text-align: center;
          background: #fafafa;
          border-radius: 5px;
        }
        .barcode-item h4 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 14px;
        }
        .barcode-item img {
          max-width: 100%;
          height: auto;
          margin: 10px 0;
        }
        .barcode-text {
          font-family: monospace;
          font-size: 12px;
          color: #666;
          margin: 5px 0 0 0;
          word-break: break-all;
        }
        .barcode-item.error {
          background: #ffe6e6;
          border-color: #ff9999;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { margin: 0; }
          .barcode-grid { 
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
      </div>
      <div class="barcode-grid">
        ${barcodeElements}
      </div>
      <div class="footer">
        <p>Laboratory Management System - Barcode Sheet</p>
      </div>
    </body>
    </html>
  `;
};