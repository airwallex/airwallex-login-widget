import { BaseWidget } from './BaseWidget';

test('it should create a iframe element', () => {
  const widget = new BaseWidget();

  expect(widget.iframe).toBeTruthy();
});

test('is should NOT mount the iframe to the DOM by default', () => {
  const widget = new BaseWidget();

  expect(widget.iframe).not.toBeInTheDocument();
  expect(widget.domElement).toBeNull();
});

test('it should append the iframe to the given DOM element', () => {
  const widget = new BaseWidget();
  const div = document.createElement('div');

  widget.mount(div);
  expect(div).toBe(widget.domElement);
  expect(div).toContainElement(widget.iframe);
});

test('it should throw an error if the DOM element that iframe is append to is invalid', () => {
  const widget = new BaseWidget();

  expect(() => widget.mount({} as HTMLDivElement)).toThrowError();
});

test('it should throw an error if the DOM element that iframe is append to can not be queried', () => {
  const widget = new BaseWidget();

  expect(() => widget.mount('#id')).toThrowError();
});

test('it should remove the iframe when `unmount` is called', () => {
  const widget = new BaseWidget();
  const div = document.createElement('div');

  widget.mount(div);
  expect(div).toContainElement(widget.iframe);

  widget.unmount();
  expect(widget.domElement).toBeNull();
  expect(div).not.toContainElement(widget.iframe);
});
