import { Component } from '@angular/core';
import { MemoryLeakTestComponent } from './memory-leak-test.component';

@Component({
    imports: [MemoryLeakTestComponent],
    standalone: true,
    selector: 'app-root',
    template: '<app-memory-leak-test></app-memory-leak-test>'
})
export class App { }