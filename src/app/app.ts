import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SpreadsheetAllModule, SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';
import { CommonModule } from '@angular/common';
import spreadsheetData from './spreadsheetData.json';
@Component({
    imports: [
        SpreadsheetAllModule,
        CommonModule
    ],
    standalone: true,
    selector: 'app-root',
    template: `
        <div style="padding: 20px;">
            <h2>Spreadsheet Memory Leak Test</h2>
            <div style="margin-bottom: 20px;">
                <button (click)="createSpreadsheet()" style="padding: 10px 20px; margin-right: 10px; cursor: pointer; background-color: #4CAF50; color: white; border: none; border-radius: 4px;">
                    Create Spreadsheet
                </button>
                <button (click)="destroySpreadsheet()" style="padding: 10px 20px; cursor: pointer; background-color: #f44336; color: white; border: none; border-radius: 4px;">
                    Destroy Spreadsheet
                </button>
            </div>
            <div style="margin-bottom: 10px;">
                <p><strong>Status:</strong> <span id="status">{{ status }}</span></p>
                <p><strong>Instance Count:</strong> <span id="count">{{ instanceCount }}</span></p>
            </div>
            <div *ngIf="spreadsheetVisible" style="border: 1px solid #ccc; height: 500px; overflow: auto;">
                <ejs-spreadsheet 
                    #spreadsheet
                    (openComplete)="openComplete($event)"
                    >
                </ejs-spreadsheet>
            </div>
            <div *ngIf="!spreadsheetVisible" style="height: 500px; display: flex; align-items: center; justify-content: center; background-color: #f5f5f5; border: 1px dashed #ccc;">
                <p style="color: #999;">No spreadsheet loaded. Click "Create Spreadsheet" to load.</p>
            </div>
        </div>
    `,
    styles: [`
        :host {
            font-family: Arial, sans-serif;
        }
    `]
})
export class App implements AfterViewInit, OnDestroy {
    @ViewChild('spreadsheet') spreadsheet!: SpreadsheetComponent;

    spreadsheetVisible = false;
    status = 'Ready';
    instanceCount = 0;
    private static instanceTracker = 0;

    ngAfterViewInit() {
        // Component initialized
    }

    createSpreadsheet() {
        if (this.spreadsheetVisible) {
            this.status = 'Spreadsheet already loaded. Destroy first.';
            return;
        }

        this.spreadsheetVisible = true;
        this.status = 'Creating spreadsheet...';
        App.instanceTracker++;
        this.instanceCount = App.instanceTracker;

        // Use setTimeout to ensure view is rendered
        setTimeout(() => {
            if (this.spreadsheet) {
                this.spreadsheet.openFromJson(
                    { file: spreadsheetData.jsonObject, triggerEvent: true }
                );
            }
        }, 100);
    }

    destroySpreadsheet() {
        if (!this.spreadsheetVisible) {
            this.status = 'No spreadsheet to destroy.';
            return;
        }

        try {
            if (this.spreadsheet) {
                // Cleanup the spreadsheet
                this.spreadsheet.destroy();
            }

            this.spreadsheetVisible = false;
            this.status = `Spreadsheet destroyed (Instance #${this.instanceCount}). Open DevTools > Memory to collect garbage and check for memory leak.`;
        } catch (error) {
            this.status = `Error destroying spreadsheet: ${error}`;
        }
    }

    openComplete(args: any) {
        console.log("openComplete triggered");
        // this.spreadsheet.refresh();
    }


    ngOnDestroy() {
        if (this.spreadsheet) {
            this.spreadsheet.destroy();
        }
    }
}