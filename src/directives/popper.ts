import PopperBase from './popper.base';

export default class PopperBasic extends PopperBase {
    makeTooltipContent(): string | HTMLElement {
        return this.currentData?.text || 'content not found';
    }
}
