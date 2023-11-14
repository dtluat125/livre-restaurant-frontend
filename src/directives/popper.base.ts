/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createPopper, Instance, OptionsGeneric } from '@popperjs/core';

type IPlacement =
    | 'left'
    | 'right'
    | 'auto'
    | 'top'
    | 'bottom'
    | 'auto-start'
    | 'auto-end'
    | 'top-start'
    | 'top-end'
    | 'bottom-start'
    | 'bottom-end'
    | 'right-start'
    | 'right-end'
    | 'left-start'
    | 'left-end'
    | undefined;

type IOption = Partial<OptionsGeneric<{ name: string; options: { offset: number[] } }>>;

export default abstract class PopperBase {
    popperInstance: Instance | null = null;
    timeOut: NodeJS.Timeout | null = null;
    checkGenerate = false;
    tooltip: HTMLElement | null = null;
    currentData: any = {};

    get showActions(): string[] {
        return ['mouseenter'];
    }

    get hideActions(): string[] {
        return ['mouseleave', 'blur', 'mousedown', 'mouseup'];
    }

    /**
     * directive  mounted
     * @param el
     * @param data
     */
    beforeMount(el: any, data: any): void {
        this.createNewEvent(el, data);
    }

    /**
     * update tooltip when change data
     * @param el
     * @param data
     */
    updated(el: any, data: any): void {
        // reset
        this.resetEvent(el);
        // update
        this.createNewEvent(el, data);
    }

    createNewEvent(el: any, data: any): void {
        el.__vHoverEnter__ = (e: MouseEvent) => {
            this.currentData = data.value;
            this.show(el, e);
        };
        el.__vHoverLeave__ = () => {
            this.destroy();
        };
        this.showActions.forEach((action) => {
            el.addEventListener(action, el.__vHoverEnter__);
        });
        this.hideActions.forEach((action) => {
            el.addEventListener(action, el.__vHoverLeave__);
        });
    }

    resetEvent(el: any): void {
        this.showActions.forEach((action) => {
            el.removeEventListener(action, el.__vHoverEnter__);
        });
        this.hideActions.forEach((action) => {
            el.removeEventListener(action, el.__vHoverLeave__);
        });
        delete el.__vHoverLeave__;
        delete el.__vHoverEnter__;
    }

    /**
     * directive before destroy
     * @param el
     */
    unmounted(el: any): void {
        this.resetEvent(el);
    }

    /**
     * you can generate tooltip content here
     * @returns string | HTMLElement
     */
    abstract makeTooltipContent(): string | HTMLElement;

    /**
     * popper options
     */
    get options(): IOption {
        return {
            placement: this.getPlacement(),
            strategy: 'fixed',
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 8],
                    },
                },
            ],
        };
    }

    /**
     * create default popper container
     * @returns void
     */
    createPopoverContainer() {
        const container = document.createElement('div');
        container.classList.add('popover-container');
        container.classList.add('popper');
        if (this.currentData.className) {
            container.classList.add(this.currentData.className);
        }

        container.style.zIndex = '1000';
        const content = document.createElement('div');
        content.classList.add('popover-content');
        const arrow = document.createElement('div');
        arrow.classList.add('popper__arrow');
        arrow.setAttribute('data-popper-arrow', '');

        if (this.currentData.id) {
            container.setAttribute('id', 'popper' + this.currentData.id);
        }

        const text = this.makeTooltipContent();
        if (typeof text === 'string') {
            content.innerHTML = text;
        } else {
            content.appendChild(text);
        }

        container.appendChild(content);
        container.appendChild(arrow);
        document.body.appendChild(container);
        this.mountVueComponentIfNeed(content);
        return container;
    }

    /**
     * mount vue component if use component for tooltip
     * @param content
     * @returns
     */
    mountVueComponentIfNeed(content: Element): void {}

    /**
     * placement of tooltip get from data
     */
    getPlacement(): IPlacement {
        return (this.currentData?.placement || 'right') as IPlacement;
    }

    /**
     * variable control show tooltip
     */
    getDisable(): boolean {
        return this.currentData?.disabled || false;
    }

    /**
     * time for delay show tooltip
     */
    getShowTime(): number {
        return this.currentData?.delay?.show || 500;
    }

    /**
     * height of content
     */
    get offsetHeight(): number {
        return this.tooltip?.offsetHeight || 0;
    }

    /**
     * width of content
     */
    get offsetWidth(): number {
        return this.tooltip?.offsetWidth || 0;
    }

    /**
     * destroy tooltip when hidden
     */
    destroy(): void {
        this.hide();
        this.popperInstance?.destroy();
        if (this.tooltip) document.body.removeChild(this.tooltip as Node);
        this.popperInstance = null;
        this.tooltip = null;
    }

    /**
     * show popover
     * @param e
     * @returns void
     */
    show(el: any, e: MouseEvent) {
        if (this.getDisable()) return;
        this.timeOut = setTimeout(() => {
            this.tooltip = this.createPopoverContainer();
            this.popperInstance = createPopper(el, this.tooltip, this.options);
            // Make the tooltip visible
            this.tooltip?.setAttribute('data-show', '');

            // Enable the event listeners
            this.popperInstance?.setOptions({
                modifiers: [
                    ...(this.options.modifiers || []),
                    { name: 'eventListeners', enabled: true },
                ],
            });

            const newPlacement = this.getNewPlacement(el, e);
            this.popperInstance?.setOptions({
                placement: newPlacement,
            });

            // Update its position
            this.popperInstance?.update();

            this.checkGenerate = true;
        }, this.getShowTime());
    }

    /**
     * hide popover
     */
    hide(): void {
        if (this.timeOut) {
            clearTimeout(this.timeOut);
        }
        if (this.checkGenerate) {
            this.checkGenerate = false;
            // Hide the tooltip
            this.tooltip?.removeAttribute('data-show');
            // Disable the event listeners
            this.popperInstance?.setOptions({
                modifiers: [{ name: 'eventListeners', enabled: false }],
            });
        }
    }

    /**
     * return new placement at mouse position
     * @param e
     * @returns placement
     */
    getNewPlacement(el: any, e: MouseEvent) {
        let _placement = this.getPlacement();
        const bodyHeight = document.documentElement.clientHeight;
        const bodyWidth = document.documentElement.clientWidth;
        const checkHeight = bodyHeight - e.clientY;
        const checkWidth = bodyWidth - e.clientX;
        const toolTipHeight = this.tooltip?.offsetHeight || 0;
        const toolTipWidth = this.tooltip?.offsetWidth || 0;

        if (
            checkHeight < toolTipHeight &&
            e.clientY < toolTipHeight &&
            (this.getPlacement() === 'bottom' || this.getPlacement() === 'top')
        ) {
            if (checkWidth < toolTipWidth) {
                _placement = 'left';
            } else {
                _placement = 'right';
            }
        }

        const element = el.getBoundingClientRect();
        const leftSide = element.left;
        const rightSide = bodyWidth - element.right;
        if (
            toolTipWidth > rightSide &&
            toolTipWidth > leftSide &&
            (this.getPlacement() === 'right' || this.getPlacement() === 'left')
        ) {
            if (checkHeight > toolTipHeight) {
                _placement = 'bottom';
            } else {
                _placement = 'top';
            }
        }

        return _placement as IPlacement;
    }

    /**
     * convert class to plain object
     * @param proto
     * @returns object
     */
    toJSON(proto?: any) {
        const jsoned: any = {};
        const toConvert = proto || this;
        Object.getOwnPropertyNames(toConvert).forEach((prop) => {
            const val = toConvert[prop];
            // don't include those
            if (prop === 'toJSON' || prop === 'constructor') {
                return;
            }
            if (typeof val === 'function') {
                jsoned[prop] = val.bind(jsoned);
                return;
            }
            jsoned[prop] = val;
        });

        const inherited = Object.getPrototypeOf(toConvert);
        if (inherited !== null) {
            Object.keys(this.toJSON(inherited)).forEach((key) => {
                if (!!jsoned[key] || key === 'constructor' || key === 'toJSON') return;
                if (typeof inherited[key] === 'function') {
                    jsoned[key] = inherited[key].bind(jsoned);
                    return;
                }
                jsoned[key] = inherited[key];
            });
        }
        return jsoned;
    }
}
