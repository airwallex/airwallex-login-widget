export class BaseWidget {
  /**
   * The iframe element.
   */
  iframe: HTMLIFrameElement;

  /**
   * The DOM element that the iframe is appended to.
   */
  domElement: HTMLElement | null;

  constructor() {
    this.iframe = window.document.createElement('iframe');
    this.domElement = null;
  }

  /**
   * Append the iframe to the given DOM element.
   * If the DOM element could not be found, will throw an error.
   *
   * @param domElement it's either a CSS Selector or a DOM element.
   */
  mount(domElement: string | HTMLElement) {
    const domElementToMount = this.#findElement(domElement);
    domElementToMount.appendChild(this.iframe);

    this.domElement = domElementToMount;
  }

  #findElement(domElement: string | HTMLElement) {
    if (typeof domElement === 'string') {
      const element = window.document.querySelector<HTMLElement>(domElement);
      if (element === null) throw Error('Unable to find the DOM element');
      return element;
    }

    if (!(domElement instanceof HTMLElement)) throw Error('Invalid DOM element');
    return domElement;
  }

  /**
   * Remove the iframe from the DOM.
   */
  unmount() {
    this.domElement?.removeChild(this.iframe);
    this.domElement = null;
  }
}
