import { environment } from './../../../environments/environment';
import { Directive,  ElementRef, TemplateRef, ViewContainerRef, Renderer, Input} from '@angular/core';
import { Router } from '@angular/router';
import { AccessManager } from './accessManagement.service';
import { OnAuthorized } from './onAuthorize.model';

@Directive({ selector: '[access]' })
export class AccessManagerDirective {

	@Input() access;

	private skipAuthorization: boolean = false;
	private showElement = false;

	private userDetails;
	private roles;

	constructor(private el: ElementRef,
		private renderer: Renderer,
		private _templateRef: TemplateRef<any>,
		private _viewContainer: ViewContainerRef,
		private router: Router,
		private session: AccessManager) {
		this.skipAuthorization = environment.skipAuthorizationChecks;
	}


	ngOnInit() {
		const ref = <OnAuthorized>this._viewContainer['_view']['component'];
		// lets first seperate by else operator if any
		let conditionList = this.access.condition;
		let requiredAll = false;
		requiredAll = this.access.requiredAll;
		// now in the actual condition list may have multiple or conditions
		let verdict: boolean = false;
		// now we check for all conditions and reduce to single result
		if (conditionList !== null && conditionList !== undefined && conditionList.length > 0) {
			if(!requiredAll)
				verdict = this.session.isAllowed(conditionList);
			else verdict = this.session.isAllowedAll(conditionList);
		} else {
			verdict = false;
		}
		// console.dir(verdict)
		// now lets work on cases using verdict 
		// if authgrization skip is true, just show everything
		if (verdict || this.skipAuthorization) {
            if (this.access.redirect) {
                setTimeout(ref.onAuthorized.bind(ref), 0);
            }
			this._viewContainer.createEmbeddedView(this._templateRef);

		} else {
			this._viewContainer.clear();
			if (this.access.redirect) {
				this.router.navigate(['/index']);
			}
		}
	}
}
