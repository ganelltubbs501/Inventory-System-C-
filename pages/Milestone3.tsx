import React, { useState } from 'react';
import { Copy, Terminal, Play, FileText, AlertTriangle, Download } from 'lucide-react';
import { generateAndDownloadSolution } from '../services/solutionGenerator';

interface SimulatedItem {
  sku: string;
  name: string;
  description: string;
  quantity: number;
  cost: number;
  category: string;
}

const Milestone3: React.FC = () => {
  // Simulated file content
  const [fileContent, setFileContent] = useState<string>(
    `TECH-001,Wireless Mouse,Ergonomic 2.4GHz,45,25.50,Electronics
FURN-101,Office Chair,Mesh back support,8,150.00,Furniture
STAT-055,A4 Paper Ream,500 sheets 80gsm,120,4.50,Stationery`
  );

  const [displayText, setDisplayText] = useState<string>('Inventory not loaded.');
  const [error, setError] = useState<string | null>(null);

  const handleProcessInventory = () => {
    setError(null);
    setDisplayText('Processing...');

    try {
      // Simulate File.ReadAllLines
      if (!fileContent.trim()) {
        throw new Error("File is empty or not found.");
      }

      const lines = fileContent.split('\n').filter(line => line.trim() !== '');
      
      // Simulate creating an array
      const inventory: SimulatedItem[] = [];

      // Parse loop
      lines.forEach((line, index) => {
        const parts = line.split(',');
        if (parts.length < 6) {
          throw new Error(`Line ${index + 1} is missing data format.`);
        }

        inventory.push({
          sku: parts[0].trim(),
          name: parts[1].trim(),
          description: parts[2].trim(),
          quantity: parseInt(parts[3].trim()),
          cost: parseFloat(parts[4].trim()),
          category: parts[5].trim()
        });
      });

      // Requirement: Increment the inventory for one of the inventory items.
      if (inventory.length > 0) {
        // Let's increment the first item
        inventory[0].quantity += 1;
      }

      // Display logic
      let output = "--- Inventory Loaded from File ---\n";
      output += "(Item 1 Quantity incremented by 1)\n\n";
      
      inventory.forEach(item => {
        output += `SKU: ${item.sku} | Name: ${item.name} | Qty: ${item.quantity} | Cost: $${item.cost.toFixed(2)}\n`;
        output += `Desc: ${item.description}\n`;
        output += "----------------------------------------\n";
      });

      setDisplayText(output);

    } catch (err: any) {
      // Simulate Exception Handling
      setError(err.message);
      setDisplayText("Error processing inventory. See details above.");
    }
  };

  const csharpCode = `using System;
using System.IO;
using System.Windows.Forms;

namespace InventoryApp
{
    // Simple class to define the array structure
    public class InventoryItem
    {
        public string Sku { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public double Cost { get; set; }
        public string Category { get; set; }
    }

    public partial class MainForm : Form
    {
        private Label lblDisplay;
        private Button btnLoadFile;

        public MainForm()
        {
            InitializeComponent();
            InitializeCustomControls();
        }

        private void InitializeCustomControls()
        {
            this.Text = "Milestone 3 - File I/O & Arrays";
            this.Size = new System.Drawing.Size(600, 500);

            this.btnLoadFile = new Button();
            this.btnLoadFile.Text = "Load Inventory";
            this.btnLoadFile.Location = new System.Drawing.Point(20, 20);
            this.btnLoadFile.Size = new System.Drawing.Size(120, 30);
            this.btnLoadFile.Click += new EventHandler(this.btnLoadFile_Click);
            this.Controls.Add(this.btnLoadFile);

            this.lblDisplay = new Label();
            this.lblDisplay.Location = new System.Drawing.Point(20, 70);
            this.lblDisplay.Size = new System.Drawing.Size(540, 350);
            this.lblDisplay.BorderStyle = BorderStyle.FixedSingle;
            this.lblDisplay.Text = "Inventory not loaded.";
            this.Controls.Add(this.lblDisplay);
        }

        private void btnLoadFile_Click(object sender, EventArgs e)
        {
            // Construct path: bin\\Debug\\net7.0-windows\\Data\\Inventory.txt
            string folderPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data");
            string filePath = Path.Combine(folderPath, "Inventory.txt");

            // Requirement: Implement exception handling
            try
            {
                // Requirement: Read inventory from external text file
                if (!File.Exists(filePath))
                {
                    MessageBox.Show($"File not found at: {filePath}\\nPlease ensure the 'Data' folder exists in bin/Debug/net7.0-windows/");
                    return;
                }

                string[] lines = File.ReadAllLines(filePath);
                
                // Requirement: Populate inventory display using an array
                InventoryItem[] inventory = new InventoryItem[lines.Length];

                for (int i = 0; i < lines.Length; i++)
                {
                    string[] parts = lines[i].Split(',');
                    
                    // Basic validation to avoid index out of bounds within the loop
                    if (parts.Length >= 6) 
                    {
                        inventory[i] = new InventoryItem
                        {
                            Sku = parts[0].Trim(),
                            Name = parts[1].Trim(),
                            Description = parts[2].Trim(),
                            Quantity = int.Parse(parts[3].Trim()),
                            Cost = double.Parse(parts[4].Trim()),
                            Category = parts[5].Trim()
                        };
                    }
                }

                // Requirement: Increment the inventory for one of the inventory items
                if (inventory.Length > 0 && inventory[0] != null)
                {
                    inventory[0].Quantity++; // Incrementing the first item's quantity
                }

                // Display
                lblDisplay.Text = "";
                foreach (InventoryItem item in inventory)
                {
                    if (item != null)
                    {
                        lblDisplay.Text += $"SKU: {item.Sku} | Name: {item.Name} | Qty: {item.Quantity} | Cost: {item.Cost:C}\\n";
                        lblDisplay.Text += $"Desc: {item.Description}\\n";
                        lblDisplay.Text += "----------------------------------------\\n";
                    }
                }
            }
            catch (Exception ex)
            {
                // Requirement: Catch any runtime errors
                MessageBox.Show("Error: " + ex.Message);
            }
        }
    }
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Milestone 3</h1>
        <p className="text-gray-500">File I/O, Arrays, and Exception Handling</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prototype Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
              <Play size={18} className="text-indigo-600" />
              Interactive Prototype
            </h2>
          </div>
          
          <div className="p-6 flex-1 space-y-6">
             {/* Simulated File Editor */}
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                 <FileText size={16} />
                 Simulated "Inventory.txt" Content (Editable)
               </label>
               <textarea
                 value={fileContent}
                 onChange={(e) => setFileContent(e.target.value)}
                 className="w-full h-32 p-3 font-mono text-xs bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                 placeholder="Enter CSV data..."
               />
               <p className="text-xs text-gray-500">Format: SKU, Name, Description, Qty, Cost, Category</p>
             </div>

             <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 min-h-[300px] relative">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-200 rounded-t-lg border-b border-gray-300 flex items-center px-2 space-x-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                
                <div className="mt-8 space-y-4">
                    <button 
                        onClick={handleProcessInventory}
                        className="px-4 py-2 bg-gray-200 border border-gray-400 text-gray-800 text-sm hover:bg-gray-300 active:bg-gray-400 transition-colors shadow-sm"
                    >
                        Load & Process File
                    </button>

                    {error && (
                      <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm flex items-start gap-2">
                        <AlertTriangle size={16} className="mt-0.5" />
                        {error}
                      </div>
                    )}

                    <div className="bg-white border border-gray-400 p-3 min-h-[200px] font-mono text-sm whitespace-pre-wrap max-h-[300px] overflow-auto">
                        {displayText}
                    </div>
                </div>
             </div>
          </div>
        </div>

        {/* C# Code Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
              <Terminal size={18} className="text-slate-600" />
              C# Solution Code
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => generateAndDownloadSolution(csharpCode, 'Milestone3')}
                className="text-xs flex items-center gap-1 text-green-600 hover:text-green-800 font-medium px-2 py-1 bg-green-50 rounded"
              >
                <Download size={14} /> Download .sln
              </button>
              <button 
                onClick={() => navigator.clipboard.writeText(csharpCode)}
                className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 bg-indigo-50 rounded"
              >
                <Copy size={14} /> Copy Code
              </button>
            </div>
          </div>
          
          <div className="flex-1 bg-slate-900 overflow-auto">
            <pre className="p-4 text-sm font-mono text-slate-300">
              <code>{csharpCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Milestone3;