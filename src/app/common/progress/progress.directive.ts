import { Directive, HostListener, Output, Input, EventEmitter, ElementRef, Renderer } from "@angular/core";

@Directive({
	selector: "[progress]"
})
export class ProgressDirective {
	@Input() spinner: boolean = true;
	@Output() call: EventEmitter<any> = new EventEmitter();
	currentInnerHTMl = '';
	constructor(private elementRef: ElementRef, private renderer: Renderer) {
	}

	@HostListener("click", ["$event"])
	public onClick(event: any): void {
		this.disableWithSpinner();
		let promise = new Promise((resolve, reject) => {
			this.call.emit({ resolve: resolve, reject: reject });
		})

		promise.then(value => {
			this.reinstate();
		}).catch(err => {
			// dont know what exactly do do in error but re enable for now
			this.reinstate();
		});
	}

	private disableWithSpinner() {
		if (this.spinner) {
			this.currentInnerHTMl = this.elementRef.nativeElement.innerHTML;
			this.elementRef.nativeElement.innerHTML = '<i style="margin-right:5px;" class="fa fa-refresh rotate-infinite"></i>' + this.currentInnerHTMl;
		}
		this.elementRef.nativeElement.disabled = true;
	}

	private reinstate() {
		if (this.spinner)
			this.elementRef.nativeElement.innerHTML = this.currentInnerHTMl;
		this.elementRef.nativeElement.disabled = false;
	}
}
