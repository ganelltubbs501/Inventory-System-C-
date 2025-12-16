import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const generateAndDownloadSolution = async (mainFormCode: string, milestoneName: string) => {
  const zip = new JSZip();
  const projectName = "InventoryApp";
  
  // 1. Solution File (.sln)
  const slnContent = `
Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 17
VisualStudioVersion = 17.0.31903.59
MinimumVisualStudioVersion = 10.0.40219.1
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "${projectName}", "${projectName}\\${projectName}.csproj", "{8A123456-7890-ABCD-EF12-34567890ABCD}"
EndProject
Global
	GlobalSection(SolutionConfigurationPlatforms) = preSolution
		Debug|Any CPU = Debug|Any CPU
		Release|Any CPU = Release|Any CPU
	EndGlobalSection
	GlobalSection(ProjectConfigurationPlatforms) = postSolution
		{8A123456-7890-ABCD-EF12-34567890ABCD}.Debug|Any CPU.ActiveCfg = Debug|Any CPU
		{8A123456-7890-ABCD-EF12-34567890ABCD}.Debug|Any CPU.Build.0 = Debug|Any CPU
		{8A123456-7890-ABCD-EF12-34567890ABCD}.Release|Any CPU.ActiveCfg = Release|Any CPU
		{8A123456-7890-ABCD-EF12-34567890ABCD}.Release|Any CPU.Build.0 = Release|Any CPU
	EndGlobalSection
EndGlobal
`;
  zip.file(`${projectName}.sln`, slnContent);

  // 2. Project Folder
  const projectFolder = zip.folder(projectName);
  if (!projectFolder) return;

  // 3. Project File (.csproj)
  // configured to copy Data/Inventory.txt to output dir if it exists
  const csprojContent = `<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <OutputType>WinExe</OutputType>
    <TargetFramework>net7.0-windows</TargetFramework>
    <Nullable>enable</Nullable>
    <UseWindowsForms>true</UseWindowsForms>
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

  <ItemGroup>
    <None Update="Data\\Inventory.txt">
      <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </None>
  </ItemGroup>

</Project>`;
  projectFolder.file(`${projectName}.csproj`, csprojContent);

  // 4. Program.cs
  const programCsContent = `using System;
using System.Windows.Forms;

namespace ${projectName}
{
    internal static class Program
    {
        [STAThread]
        static void Main()
        {
            ApplicationConfiguration.Initialize();
            Application.Run(new MainForm());
        }
    }
}`;
  projectFolder.file("Program.cs", programCsContent);

  // 5. MainForm.cs (The user code)
  projectFolder.file("MainForm.cs", mainFormCode);

  // 6. MainForm.Designer.cs
  const designerContent = `namespace ${projectName}
{
    partial class MainForm
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(800, 500);
            this.Text = "MainForm";
        }

        #endregion
    }
}`;
  projectFolder.file("MainForm.Designer.cs", designerContent);

  // 7. Data folder
  const dataFolder = projectFolder.folder("Data");
  if (dataFolder) {
      dataFolder.file("Inventory.txt", `TECH-001,Wireless Mouse,Ergonomic 2.4GHz,45,25.50,Electronics
FURN-101,Office Chair,Mesh back support,8,150.00,Furniture
STAT-055,A4 Paper Ream,500 sheets 80gsm,120,4.50,Stationery`);
  }

  // Generate Zip
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${milestoneName}_Solution.zip`);
};