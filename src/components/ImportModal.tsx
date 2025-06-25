
import React, { useState } from 'react';
import { Upload, X, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import * as XLSX from 'xlsx';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => Promise<void>;
  type: 'poi' | 'event';
  categories?: { id: number; name: string; }[];
}

const ImportModal: React.FC<ImportModalProps> = ({ 
  isOpen, 
  onClose, 
  onImport, 
  type,
  categories = []
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { toast } = useToast();

  if (!isOpen) return null;

  const poiTemplate = [
    ['Name*', 'Description*', 'Category*', 'Latitude*', 'Longitude*', 'Image URLs (comma separated)'],
    ['Example POI', 'A sample place of interest', 'Library', '40.7128', '-74.0060', 'https://example.com/image1.jpg,https://example.com/image2.jpg']
  ];

  const eventTemplate = [
    ['Title*', 'Description*', 'Location*', 'Start Date*', 'End Date*', 'Image URL'],
    ['Sample Event', 'A sample event description', 'Main Hall', '2024-01-15 10:00:00', '2024-01-15 12:00:00', 'https://example.com/event.jpg']
  ];

  const downloadTemplate = () => {
    const template = type === 'poi' ? poiTemplate : eventTemplate;
    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type === 'poi' ? 'POIs' : 'Events');
    XLSX.writeFile(wb, `${type}_import_template.xlsx`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];

    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Error",
        description: "Please select a valid Excel (.xlsx, .xls) or CSV file",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    parseFile(selectedFile);
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length < 2) {
          throw new Error('File must contain at least a header row and one data row');
        }

        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1) as any[][];
        
        const parsedData = rows
          .filter(row => row.some(cell => cell !== undefined && cell !== ''))
          .map((row, index) => {
            const rowData: any = {};
            headers.forEach((header, colIndex) => {
              rowData[header] = row[colIndex] || '';
            });
            rowData._originalIndex = index + 2; // +2 for header and 0-based index
            return rowData;
          });

        setPreviewData(parsedData);
        validateData(parsedData);
      } catch (error) {
        console.error('Error parsing file:', error);
        toast({
          title: "Error",
          description: "Failed to parse file. Please check the format.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsArrayBuffer(file);
  };

  const validateData = (data: any[]) => {
    const errors: string[] = [];
    
    if (type === 'poi') {
      validatePOIData(data, errors);
    } else {
      validateEventData(data, errors);
    }
    
    setValidationErrors(errors);
  };

  const validatePOIData = (data: any[], errors: string[]) => {
    const requiredFields = ['Name*', 'Description*', 'Category*', 'Latitude*', 'Longitude*'];
    const categoryNames = categories.map(cat => cat.name.toLowerCase());
    
    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push(`Row ${row._originalIndex}: ${field} is required`);
        }
      });
      
      // Validate category
      if (row['Category*']) {
        const categoryName = row['Category*'].toString().toLowerCase();
        if (!categoryNames.includes(categoryName)) {
          errors.push(`Row ${row._originalIndex}: Category "${row['Category*']}" not found. Available: ${categories.map(c => c.name).join(', ')}`);
        }
      }
      
      // Validate coordinates
      const lat = parseFloat(row['Latitude*']);
      const lng = parseFloat(row['Longitude*']);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errors.push(`Row ${row._originalIndex}: Invalid latitude. Must be between -90 and 90`);
      }
      if (isNaN(lng) || lng < -180 || lng > 180) {
        errors.push(`Row ${row._originalIndex}: Invalid longitude. Must be between -180 and 180`);
      }
    });
  };

  const validateEventData = (data: any[], errors: string[]) => {
    const requiredFields = ['Title*', 'Description*', 'Location*', 'Start Date*', 'End Date*'];
    
    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (!row[field] || row[field].toString().trim() === '') {
          errors.push(`Row ${row._originalIndex}: ${field} is required`);
        }
      });
      
      // Validate dates
      const startDate = new Date(row['Start Date*']);
      const endDate = new Date(row['End Date*']);
      
      if (isNaN(startDate.getTime())) {
        errors.push(`Row ${row._originalIndex}: Invalid start date format. Use YYYY-MM-DD HH:mm:ss`);
      }
      if (isNaN(endDate.getTime())) {
        errors.push(`Row ${row._originalIndex}: Invalid end date format. Use YYYY-MM-DD HH:mm:ss`);
      }
      if (startDate.getTime() >= endDate.getTime()) {
        errors.push(`Row ${row._originalIndex}: End date must be after start date`);
      }
    });
  };

  const formatDataForAPI = (data: any[]) => {
    if (type === 'poi') {
      return data.map(row => {
        const category = categories.find(cat => 
          cat.name.toLowerCase() === row['Category*'].toString().toLowerCase()
        );
        
        return {
          name: row['Name*'],
          description: row['Description*'],
          category_id: category?.id || 0,
          location: JSON.stringify({
            lat: parseFloat(row['Latitude*']),
            lng: parseFloat(row['Longitude*'])
          }),
          image_urls: row['Image URLs (comma separated)'] 
            ? row['Image URLs (comma separated)'].split(',').map((url: string) => url.trim())
            : []
        };
      });
    } else {
      return data.map(row => ({
        title: row['Title*'],
        description: row['Description*'],
        location: row['Location*'],
        start_date: new Date(row['Start Date*']).toISOString(),
        end_date: new Date(row['End Date*']).toISOString(),
        image_url: row['Image URL'] || null
      }));
    }
  };

  const handleImport = async () => {
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix validation errors before importing",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    try {
      const formattedData = formatDataForAPI(previewData);
      await onImport(formattedData);
      toast({
        title: "Success",
        description: `Successfully imported ${formattedData.length} ${type === 'poi' ? 'POIs' : 'events'}`,
      });
      onClose();
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: "Failed to import data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const resetModal = () => {
    setFile(null);
    setPreviewData([]);
    setValidationErrors([]);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            Import {type === 'poi' ? 'POIs' : 'Events'} from Excel/CSV
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Template Download */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Step 1: Download Template</h3>
            <p className="text-blue-800 text-sm mb-3">
              Download the template file to see the required format and columns.
            </p>
            <button
              onClick={downloadTemplate}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </button>
          </div>

          {/* File Upload */}
          <div>
            <h3 className="font-medium mb-2">Step 2: Upload Your File</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="mb-2"
              />
              <p className="text-sm text-gray-600">
                Supported formats: .xlsx, .xls, .csv
              </p>
            </div>
          </div>

          {/* Validation Results */}
          {file && (
            <div>
              <h3 className="font-medium mb-2">Step 3: Validation Results</h3>
              {validationErrors.length === 0 ? (
                <div className="bg-green-50 p-4 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800">
                    All data is valid! Found {previewData.length} records ready to import.
                  </span>
                </div>
              ) : (
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-red-800 font-medium">
                      {validationErrors.length} validation error(s) found:
                    </span>
                  </div>
                  <ul className="text-red-700 text-sm space-y-1 max-h-32 overflow-y-auto">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Preview Data */}
          {previewData.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Data Preview</h3>
              <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-auto">
                <div className="text-sm">
                  <div className="font-medium mb-2">
                    First {Math.min(3, previewData.length)} records:
                  </div>
                  {previewData.slice(0, 3).map((row, index) => (
                    <div key={index} className="mb-2 pb-2 border-b border-gray-200 last:border-b-0">
                      <div className="font-medium text-xs text-gray-600 mb-1">
                        Row {row._originalIndex}:
                      </div>
                      {Object.entries(row)
                        .filter(([key]) => !key.startsWith('_'))
                        .map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="font-medium">{key}:</span> {String(value)}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              onClick={handleImport}
              disabled={!file || validationErrors.length > 0 || importing}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              {importing ? 'Importing...' : 'Import Data'}
            </button>
            <button
              onClick={handleClose}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
