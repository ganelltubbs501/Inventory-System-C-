import React, { useState } from 'react';
import { Copy, Terminal, Play, Download } from 'lucide-react';
import { generateAndDownloadSolution } from '../services/solutionGenerator';

const Milestone2: React.FC = () => {
  const [displayText, setDisplayText] = useState<string>('Inventory not loaded.');
  const [showCode, setShowCode] = useState(true);

  // Requirement: Minimum of one button that when selected will display the inventory.
  const handleDisplayInventory = () => {
    // Requirement: Hard code initial inventory using primitive variable data types
    // Note: In C# these would be explicitly typed (string, int, double). 
    // We simulate the logic here in TS.
    
    // Item 1
    const item1Sku = "TECH-001";
    const item1Name = "Wireless Mouse";
    const item1Desc = "Ergonomic 2.4GHz";
    const item1Qty = 45;
    const item1Cost = 25.50;
    const item1Cat = "Electronics";

    // Item 2
    const item2Sku = "FURN-101";
    const item2Name = "Office Chair";
    const item2Desc = "Mesh back support";
    const item2Qty = 8;
    const item2Cost = 150.00;
    const item2Cat = "Furniture";

    // Item 3
    const item3Sku = "STAT-055";
    const item3Name = "A4 Paper Ream";
    const item3Desc = "500 sheets 80gsm";
    const item3Qty = 120;
    const item3Cost = 4.50;
    const item3Cat = "Stationery";

    // Requirement: Using label or labels, display the inventory on the form.
    let output = "";
    output += `SKU: ${item1Sku} | Name: ${item1Name} | Desc: ${item1Desc} | Qty: ${item1Qty} | Cost: $${item1Cost.toFixed(2)} | Cat: ${item1Cat}\n\n`;
    output += `SKU: ${item2Sku} | Name: ${item2Name} | Desc: ${item2Desc} | Qty: ${item2Qty} | Cost: $${item2Cost.toFixed(2)} | Cat: ${item2Cat}\n\n`;
    output += `SKU: ${item3Sku} | Name: ${item3Name} | Desc: ${item3Desc} | Qty: ${item3Qty} | Cost: $${item3Cost.toFixed(2)} | Cat: ${item3Cat}`;

    setDisplayText(output);
  };

  const csharpCode = `using System;
using System.Windows.Forms;

namespace InventoryApp
{
    public partial class MainForm : Form
    {
        // Define labels globally or within InitializeComponent
        private Label lblInventoryDisplay;
        private Button btnDisplayInventory;

        public MainForm()
        {
            InitializeComponent();
            InitializeCustomControls();
        }

        private void InitializeCustomControls()
        {
            this.Text = "Milestone 2 - Inventory";
            this.Size = new System.Drawing.Size(600, 400);

            // Button Configuration
            this.btnDisplayInventory = new Button();
            this.btnDisplayInventory.Text = "Display Inventory";
            this.btnDisplayInventory.Location = new System.Drawing.Point(20, 20);
            this.btnDisplayInventory.Size = new System.Drawing.Size(150, 30);
            this.btnDisplayInventory.Click += new EventHandler(this.btnDisplayInventory_Click);
            this.Controls.Add(this.btnDisplayInventory);

            // Label/Display Configuration
            this.lblInventoryDisplay = new Label();
            this.lblInventoryDisplay.Location = new System.Drawing.Point(20, 70);
            this.lblInventoryDisplay.Size = new System.Drawing.Size(540, 250);
            this.lblInventoryDisplay.BorderStyle = BorderStyle.FixedSingle;
            this.lblInventoryDisplay.Padding = new Padding(10);
            this.lblInventoryDisplay.Text = "Click button to load inventory...";
            this.Controls.Add(this.lblInventoryDisplay);
        }

        private void btnDisplayInventory_Click(object sender, EventArgs e)
        {
            // --- Part 1: Hard coded initial inventory using primitive variable data types ---
            
            // Item 1
            string item1Sku = "TECH-001";
            string item1Name = "Wireless Mouse";
            string item1Desc = "Ergonomic 2.4GHz";
            int item1Qty = 45;
            double item1Cost = 25.50;
            string item1Cat = "Electronics";

            // Item 2
            string item2Sku = "FURN-101";
            string item2Name = "Office Chair";
            string item2Desc = "Mesh back support";
            int item2Qty = 8;
            double item2Cost = 150.00;
            string item2Cat = "Furniture";

            // Item 3
            string item3Sku = "STAT-055";
            string item3Name = "A4 Paper Ream";
            string item3Desc = "500 sheets 80gsm";
            int item3Qty = 120;
            double item3Cost = 4.50;
            string item3Cat = "Stationery";

            // --- Part 2: Displaying inventory using labels ---
            
            string output = "";
            output += $"SKU: {item1Sku}\\nName: {item1Name}\\nDesc: {item1Desc}\\nQty: {item1Qty}\\nCost: \${item1Cost:F2}\\nCat: {item1Cat}\\n\\n";
            output += $"SKU: {item2Sku}\\nName: {item2Name}\\nDesc: {item2Desc}\\nQty: {item2Qty}\\nCost: \${item2Cost:F2}\\nCat: {item2Cat}\\n\\n";
            output += $"SKU: {item3Sku}\\nName: {item3Name}\\nDesc: {item3Desc}\\nQty: {item3Qty}\\nCost: \${item3Cost:F2}\\nCat: {item3Cat}";

            this.lblInventoryDisplay.Text = output;
        }
    }
}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Milestone 2</h1>
        <p className="text-gray-500">Prototype Form & C# Implementation</p>
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
             <div className="bg-gray-100 p-4 rounded-lg border border-gray-300 min-h-[300px] relative">
                {/* Simulated Windows Form UI */}
                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-200 rounded-t-lg border-b border-gray-300 flex items-center px-2 space-x-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                
                <div className="mt-8 space-y-4">
                    <button 
                        onClick={handleDisplayInventory}
                        className="px-4 py-2 bg-gray-200 border border-gray-400 text-gray-800 text-sm hover:bg-gray-300 active:bg-gray-400 transition-colors shadow-sm"
                    >
                        Display Inventory
                    </button>

                    <div className="bg-white border border-gray-400 p-3 min-h-[200px] font-mono text-sm whitespace-pre-wrap">
                        {displayText}
                    </div>
                </div>
             </div>
             <p className="text-sm text-gray-500 italic">
               * This interactive view simulates the behavior of the requested C# Windows Form.
             </p>
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
                onClick={() => generateAndDownloadSolution(csharpCode, 'Milestone2')}
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

export default Milestone2;