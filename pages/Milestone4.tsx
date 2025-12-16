import React, { useState } from 'react';
import { Copy, Terminal, Play, FileText, AlertTriangle, ArrowRight, Save, Download } from 'lucide-react';
import { generateAndDownloadSolution } from '../services/solutionGenerator';

interface SimulatedItem {
  sku: string;
  name: string;
  description: string;
  quantity: number;
  cost: number;
  category: string;
}

const Milestone4: React.FC = () => {
  // Simulated file content state
  const [fileContent, setFileContent] = useState<string>(
    `TECH-001,Wireless Mouse,Ergonomic 2.4GHz,45,25.50,Electronics
FURN-101,Office Chair,Mesh back support,8,150.00,Furniture
STAT-055,A4 Paper Ream,500 sheets 80gsm,120,4.50,Stationery`
  );

  const [displayText, setDisplayText] = useState<string>('Ready to start process...');
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string>('');

  // --- Simulation Methods (Mirroring C# Requirements) ---

  // Method 1: Read inventory from external text file
  const loadInventory = (content: string): SimulatedItem[] => {
    if (!content.trim()) throw new Error("File is empty.");
    
    return content.split('\n')
      .filter(line => line.trim() !== '')
      .map((line, index) => {
        const parts = line.split(',');
        if (parts.length < 6) throw new Error(`Line ${index + 1} format error.`);
        return {
          sku: parts[0].trim(),
          name: parts[1].trim(),
          description: parts[2].trim(),
          quantity: parseInt(parts[3].trim()),
          cost: parseFloat(parts[4].trim()),
          category: parts[5].trim()
        };
      });
  };

  // Method 2: Inventory business logic (Increment)
  const incrementInventoryItem = (items: SimulatedItem[]) => {
    if (items.length > 0) {
      // Logic: Find 'Wireless Mouse' or just first item
      items[0].quantity += 1;
      setLastAction(`Incremented Quantity for ${items[0].sku} to ${items[0].quantity}`);
    }
  };

  // Method 3: Update text file (Simulated by updating state)
  const saveInventory = (items: SimulatedItem[]): string => {
    return items.map(item => 
      `${item.sku},${item.name},${item.description},${item.quantity},${item.cost.toFixed(2)},${item.category}`
    ).join('\n');
  };

  // Method 4: Displaying inventory in the label
  const displayInventory = (items: SimulatedItem[]): string => {
    let output = "--- Inventory Status (Updated) ---\n\n";
    items.forEach(item => {
      output += `SKU: ${item.sku} | Name: ${item.name} | Qty: ${item.quantity} | Cost: $${item.cost.toFixed(2)}\n`;
      output += `Desc: ${item.description}\n`;
      output += "----------------------------------------\n";
    });
    return output;
  };

  // Main Event Handler
  const handleRunProcess = () => {
    setError(null);
    setLastAction('Starting process...');

    try {
      // 1. Call Load Method
      const items = loadInventory(fileContent);
      
      // 2. Call Business Logic Method
      incrementInventoryItem(items);

      // 3. Call Save Method (Updates the "File" on the left)
      const newContent = saveInventory(items);
      setFileContent(newContent);

      // 4. Call Display Method
      const output = displayInventory(items);
      setDisplayText(output);

    } catch (err: any) {
      setError(err.message);
      setDisplayText("Process Failed.");
    }
  };

  const csharpCode = `using System;
using System.IO;
using System.Windows.Forms;
using System.Collections.Generic; // Added for potentially easier handling, but using Arrays per M3 pattern

namespace InventoryApp
{
    // Define the data structure
    public class InventoryItem
    {
        public string Sku { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public double Cost { get; set; }
        public string Category { get; set; }

        // Helper to format for CSV file
        public string ToCSV()
        {
            return $"{Sku},{Name},{Description},{Quantity},{Cost},{Category}";
        }
    }

    public partial class MainForm : Form
    {
        private Label lblDisplay;
        private Button btnProcess;

        public MainForm()
        {
            InitializeComponent();
            InitializeCustomControls();
        }

        private void InitializeCustomControls()
        {
            this.Text = "Milestone 4 - Modular Methods";
            this.Size = new System.Drawing.Size(600, 500);

            this.btnProcess = new Button();
            this.btnProcess.Text = "Run Process";
            this.btnProcess.Location = new System.Drawing.Point(20, 20);
            this.btnProcess.Size = new System.Drawing.Size(120, 30);
            this.btnProcess.Click += new EventHandler(this.btnProcess_Click);
            this.Controls.Add(this.btnProcess);

            this.lblDisplay = new Label();
            this.lblDisplay.Location = new System.Drawing.Point(20, 70);
            this.lblDisplay.Size = new System.Drawing.Size(540, 350);
            this.lblDisplay.BorderStyle = BorderStyle.FixedSingle;
            this.lblDisplay.Text = "Ready...";
            this.Controls.Add(this.lblDisplay);
        }

        // --- Main Event Handler ---
        // Clean and minimal logic, delegates to methods.
        private void btnProcess_Click(object sender, EventArgs e)
        {
            string folderPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data");
            string filePath = Path.Combine(folderPath, "Inventory.txt");

            try
            {
                // 1. Load Data
                InventoryItem[] inventory = LoadInventoryFromFile(filePath);

                // 2. Perform Business Logic
                IncrementInventoryItem(inventory);

                // 3. Save Updates
                SaveInventoryToFile(filePath, inventory);

                // 4. Update UI
                DisplayInventory(inventory);

                MessageBox.Show("Inventory processed and saved successfully.");
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.Message}");
            }
        }

        // --- Separate Method: Read Inventory ---
        private InventoryItem[] LoadInventoryFromFile(string filePath)
        {
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException("Inventory file not found at " + filePath);
            }

            string[] lines = File.ReadAllLines(filePath);
            InventoryItem[] items = new InventoryItem[lines.Length];

            for (int i = 0; i < lines.Length; i++)
            {
                string[] parts = lines[i].Split(',');
                if (parts.Length >= 6)
                {
                    items[i] = new InventoryItem
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
            return items;
        }

        // --- Separate Method: Business Logic ---
        private void IncrementInventoryItem(InventoryItem[] items)
        {
            // Requirement: Increment the inventory for one of the inventory items.
            // We will target the first valid item found.
            if (items.Length > 0 && items[0] != null)
            {
                items[0].Quantity++;
            }
        }

        // --- Separate Method: Save Inventory ---
        private void SaveInventoryToFile(string filePath, InventoryItem[] items)
        {
            List<string> lines = new List<string>();
            foreach (var item in items)
            {
                if (item != null)
                {
                    lines.Add(item.ToCSV());
                }
            }
            File.WriteAllLines(filePath, lines);
        }

        // --- Separate Method: Display Inventory ---
        private void DisplayInventory(InventoryItem[] items)
        {
            lblDisplay.Text = "--- Current Inventory ---\\n\\n";
            foreach (var item in items)
            {
                if (item != null)
                {
                    lblDisplay.Text += $"SKU: {item.Sku} | Name: {item.Name} | Qty: {item.Quantity} | Cost: {item.Cost:C}\\n";
                    lblDisplay.Text += $"Desc: {item.Description}\\n";
                    lblDisplay.Text += "----------------------------------------\\n";
                }
            }
        }
    }
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Milestone 4</h1>
        <p className="text-gray-500">Modular Design: Methods & Logic Separation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prototype Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
              <Play size={18} className="text-indigo-600" />
              Process Simulation
            </h2>
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
               Auto-Save Enabled
            </span>
          </div>
          
          <div className="p-6 flex-1 space-y-6">
             {/* Simulated File Editor */}
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-700 flex items-center gap-2 justify-between">
                 <div className="flex items-center gap-2">
                    <FileText size={16} />
                    <span>Inventory.txt (Data Storage)</span>
                 </div>
                 {lastAction && <span className="text-xs text-indigo-600">{lastAction}</span>}
               </label>
               <textarea
                 value={fileContent}
                 onChange={(e) => setFileContent(e.target.value)}
                 className="w-full h-32 p-3 font-mono text-xs bg-slate-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                 placeholder="Enter CSV data..."
               />
               <p className="text-xs text-gray-500">Notice: This text updates when you click 'Run Process' (Write back)</p>
             </div>

             <div className="flex justify-center">
                 <ArrowRight size={24} className="text-gray-300 transform rotate-90 lg:rotate-0" />
             </div>

             <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 min-h-[300px] relative">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-200 rounded-t-lg border-b border-gray-300 flex items-center px-2 space-x-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                
                <div className="mt-8 space-y-4">
                    <button 
                        onClick={handleRunProcess}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm text-sm"
                    >
                        <Play size={14} /> Run Process (Load -> Update -> Save -> Display)
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
                onClick={() => generateAndDownloadSolution(csharpCode, 'Milestone4')}
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

export default Milestone4;