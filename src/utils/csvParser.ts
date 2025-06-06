import { OrderInsert } from '../services/orderService';

export const parseCSVToOrders = (csvData: string): OrderInsert[] => {
  const lines = csvData.trim().split('\n');
  
  // Skip the header row
  const dataRows = lines.slice(1);
  
  const orders: OrderInsert[] = [];
  
  dataRows.forEach((row, index) => {
    // Parse CSV row properly handling quoted fields
    const columns = parseCSVRow(row);
    
    if (columns.length >= 12) {
      // Extract values from columns
      const accessionId = columns[0].trim();
      const status = columns[1].trim();
      const organization = columns[2].trim();
      const location = columns[3].trim();
      const provider = columns[4].trim();
      const patientName = columns[5].trim();
      
      // Parse required date fields
      const requestDate = formatDate(columns[6].trim());
      const collectionDate = formatDate(columns[7].trim());
      
      // Check if required dates are valid
      if (!requestDate) {
        throw new Error(`Invalid request_date format in row ${index + 2}: "${columns[6].trim()}"`);
      }
      if (!collectionDate) {
        throw new Error(`Invalid collection_date format in row ${index + 2}: "${columns[7].trim()}"`);
      }
      
      // Parse optional date fields
      const receivedDate = columns[8].trim() ? formatDate(columns[8].trim()) : null;
      const finalizedDate = columns[9].trim() ? formatDate(columns[9].trim()) : null;
      const testMethod = columns[10].trim();
      const orderPanels = columns[11].trim();
      
      // Create order object
      const order: OrderInsert = {
        accession_id: accessionId,
        status,
        organization,
        location,
        provider,
        patient_name: patientName,
        request_date: requestDate,
        collection_date: collectionDate,
        received_date: receivedDate,
        finalized_date: finalizedDate,
        test_method: testMethod,
        order_panels: orderPanels,
      };
      
      orders.push(order);
    }
  });
  
  return orders;
};

// Proper CSV row parser that handles quoted fields
const parseCSVRow = (row: string): string[] => {
  const columns: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < row.length) {
    const char = row[i];
    
    if (char === '"') {
      if (inQuotes && row[i + 1] === '"') {
        // Handle escaped quotes ("")
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      columns.push(current.trim());
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Add the last column
  columns.push(current.trim());
  
  return columns;
};

// Helper function to format date strings to ISO format
const formatDate = (dateStr: string): string | null => {
  if (!dateStr) return null;
  
  // Parse date in format MM/DD/YYYY HH:MM AM/PM
  const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})\s+(AM|PM)/);
  
  if (match) {
    const [_, month, day, year, hours, minutes, ampm] = match;
    let hour = parseInt(hours, 10);
    
    // Convert to 24-hour format
    if (ampm === 'PM' && hour < 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    
    // Create ISO date string
    return `${year}-${month}-${day}T${hour.toString().padStart(2, '0')}:${minutes}:00`;
  }
  
  // Return null for invalid date formats instead of the original string
  return null;
};