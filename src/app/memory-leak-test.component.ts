import { Component, ViewContainerRef, ComponentRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpreadsheetAllModule, SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';

@Component({
  selector: 'app-memory-leak-test',
  standalone: true,
  imports: [CommonModule, SpreadsheetAllModule],
  template: `
    <div class="test-container">
      <div class="controls">
        <h2>Spreadsheet Memory Leak Test</h2>
        <p class="info">
          Instructions: Click "Open Spreadsheet" to load large data, then click "Close Spreadsheet" to destroy it. 
          Use Chrome DevTools > Memory > Collect garbage between cycles to check if memory is released.
        </p>
        <div class="button-group">
          <button (click)="openSpreadsheet()" [disabled]="isOpen">Open Spreadsheet</button>
          <button (click)="closeSpreadsheet()" [disabled]="!isOpen">Close Spreadsheet</button>
          <button (click)="autoTest()" [disabled]="isRunning">Auto Test (5 cycles)</button>
        </div>
        <div class="status">
          <p>Status: <span class="status-value">{{ status }}</span></p>
          <p>Spreadsheets Created: {{ cycleCount }}</p>
        </div>
      </div>
      <div class="spreadsheet-container">
        <div #spreadsheetHost></div>
      </div>
    </div>
  `,
  styles: [`
    .test-container {
      padding: 20px;
      font-family: Arial, sans-serif;
    }

    .controls {
      background-color: #f5f5f5;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    h2 {
      margin-top: 0;
      color: #333;
    }

    .info {
      background-color: #e3f2fd;
      padding: 10px;
      border-left: 4px solid #2196F3;
      margin: 10px 0;
      font-size: 13px;
      color: #1565c0;
    }

    .button-group {
      display: flex;
      gap: 10px;
      margin: 15px 0;
    }

    button {
      padding: 10px 20px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }

    button:hover:not(:disabled) {
      background-color: #1976D2;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    .status {
      margin-top: 15px;
      font-size: 14px;
      color: #333;
    }

    .status-value {
      font-weight: bold;
      color: #2196F3;
    }

    .spreadsheet-container {
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      min-height: 400px;
    }

    ::ng-deep .e-spreadsheet {
      height: 500px;
    }
  `]
})
export class MemoryLeakTestComponent implements OnDestroy {
  isOpen = false;
  isRunning = false;
  status = 'Ready';
  cycleCount = 0;

  private componentRef: ComponentRef<SpreadsheetComponent> | null = null;

  constructor(private viewContainerRef: ViewContainerRef) {}

  async openSpreadsheet() {
    if (this.isOpen) return;

    this.status = 'Loading spreadsheet...';
    this.isOpen = true;

    try {
      // Create a new spreadsheet component dynamically
      this.componentRef = this.viewContainerRef.createComponent(SpreadsheetComponent);
      const spreadsheet = this.componentRef.instance;

      // Wait for component to be ready
      await new Promise(resolve => setTimeout(resolve, 100));

      // Load the JSON file
      const dataUrl = 'spreadsheetData.json';
      spreadsheet.openFromJson({ file: dataUrl });

      this.status = `Spreadsheet opened (Cycle: ${this.cycleCount + 1})`;
      this.cycleCount++;
    } catch (error) {
      this.status = `Error opening spreadsheet: ${error}`;
      this.isOpen = false;
    }
  }

  closeSpreadsheet() {
    if (!this.isOpen || !this.componentRef) return;

    this.status = 'Closing spreadsheet...';

    try {
      // Destroy the component
      this.componentRef.destroy();
      this.componentRef = null;
      this.isOpen = false;

      this.status = 'Spreadsheet closed. Run garbage collection in Chrome DevTools > Memory.';
    } catch (error) {
      this.status = `Error closing spreadsheet: ${error}`;
    }
  }

  async autoTest() {
    if (this.isRunning) return;

    this.isRunning = true;
    const cycles = 5;

    for (let i = 0; i < cycles; i++) {
      this.status = `Auto Test: Opening cycle ${i + 1}/${cycles}...`;
      await new Promise(resolve => setTimeout(resolve, 500));

      this.openSpreadsheet();
      await new Promise(resolve => setTimeout(resolve, 2000));

      this.closeSpreadsheet();
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.status = 'Auto test completed! Check memory in DevTools.';
    this.isRunning = false;
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
}
