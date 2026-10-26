import { Component, ViewContainerRef, ComponentRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpreadsheetAllModule, SpreadsheetComponent } from '@syncfusion/ej2-angular-spreadsheet';

@Component({
    imports: [CommonModule, SpreadsheetAllModule],
    standalone: true,
    selector: 'app-root',
    template: `
        <div>
            <button (click)="createSpreadsheet()">Create Spreadsheet</button>
            <button (click)="destroySpreadsheet()">Destroy Spreadsheet</button>
            <div #spreadsheetContainer></div>
        </div>
    `,
    styles: [`
        div { padding: 20px; }
        button { 
            padding: 10px 20px; 
            margin-right: 10px; 
            cursor: pointer;
            background-color: #2196F3;
            color: white;
            border: none;
            border-radius: 4px;
        }
        button:hover { background-color: #1976D2; }
    `]
})
export class App {
    @ViewChild('spreadsheetContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
    private componentRef: ComponentRef<SpreadsheetComponent> | null = null;

    constructor(private viewContainer: ViewContainerRef) {}

    createSpreadsheet() {
        if (this.componentRef) {
            return;
        }

        this.componentRef = this.viewContainer.createComponent(SpreadsheetComponent);
        const instance = this.componentRef.instance;
        
        instance.openFromJson({
            file: '/spreadsheetData.json'
        });
    }

    destroySpreadsheet() {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }
}