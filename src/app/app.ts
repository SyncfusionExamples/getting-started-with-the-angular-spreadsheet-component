import {
    Component,
    ViewChild,
    ViewContainerRef,
    ComponentRef,
    AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    SpreadsheetAllModule,
    SpreadsheetComponent
} from '@syncfusion/ej2-angular-spreadsheet';

import spreadsheetData from '../spreadsheetData.json';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, SpreadsheetAllModule],
    template: `
    <button (click)="createSpreadsheet()">Create Spreadsheet</button>
    <button (click)="openWorkbook()">Open From JSON</button>
    <button (click)="destroySpreadsheet()">Destroy Spreadsheet</button>

    <div style="margin-top:10px">
      <ng-container #container></ng-container>
    </div>
  `
})
export class App implements AfterViewInit {

    @ViewChild('container', { read: ViewContainerRef, static: true })
    public container!: ViewContainerRef;

    private spreadsheetRef!: ComponentRef<SpreadsheetComponent>;

    ngAfterViewInit(): void {
        // initial creation if needed
    }

    public createSpreadsheet(): void {
        if (this.spreadsheetRef) {
            console.log('Spreadsheet already exists');
            return;
        }

        console.log('Creating Spreadsheet');

        this.spreadsheetRef =
            this.container.createComponent(SpreadsheetComponent);
    }

    public openWorkbook(): void {
        if (!this.spreadsheetRef) {
            console.log('Create Spreadsheet first');
            return;
        }

        console.log('Loading workbook');

        setTimeout(() => {
            this.spreadsheetRef.instance.openFromJson({
                file: spreadsheetData.jsonObject
            });
        }, 500);
    }

    public destroySpreadsheet(): void {
        if (!this.spreadsheetRef) {
            return;
        }

        console.log('Destroying Spreadsheet');

        this.spreadsheetRef.instance.destroy();

        this.spreadsheetRef.destroy();

        this.container.clear();

        // remove reference
        (this.spreadsheetRef as any) = null;

        // optional memory check point
        if ((window as any).gc) {
            console.log('Triggering GC');
            (window as any).gc();
        }
    }
}
