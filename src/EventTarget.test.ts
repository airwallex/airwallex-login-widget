import { EventTarget } from './EventTarget';

type EventMap = {
  success: { text: 'success' };
  fail: { text: 'fail' };
};

test('it should invoke the listener subscribed to the event', () => {
  const eventTarget = new EventTarget<EventMap>();
  const successEventListener = jest.fn();
  const failEventListener = jest.fn();
  eventTarget.addEventListener('success', successEventListener);
  eventTarget.addEventListener('fail', failEventListener);

  eventTarget.dispatchEvent('success', { text: 'success' });
  expect(successEventListener).toBeCalledWith({ text: 'success' });
  expect(failEventListener).not.toBeCalled();
});

test('it should throw an error when the event listener is not a function', () => {
  const eventTarget = new EventTarget<EventMap>();
  expect(() => eventTarget.addEventListener('success', 123123 as unknown as () => void)).toThrowError();
  expect(() => eventTarget.removeEventListener('success', 123123 as unknown as () => void)).toThrowError();
});

test('it should throw an error when removing an listener that did not listen to any event', () => {
  const eventTarget = new EventTarget<EventMap>();
  expect(() => eventTarget.removeEventListener('success', () => undefined)).toThrowError();
});

test('it should invoke all the listeners subscribed to the same event', () => {
  const eventTarget = new EventTarget<EventMap>();
  const successEventListener1 = jest.fn();
  const successEventListener2 = jest.fn();
  eventTarget.addEventListener('success', successEventListener1);
  eventTarget.addEventListener('success', successEventListener2);

  eventTarget.dispatchEvent('success', { text: 'success' });
  expect(successEventListener1).toBeCalledWith({ text: 'success' });
  expect(successEventListener2).toBeCalledWith({ text: 'success' });
});

test('it should unsubscribe to the event', () => {
  const eventTarget = new EventTarget<EventMap>();
  const successEventListener1 = jest.fn();
  const successEventListener2 = jest.fn();
  const failEventListener = jest.fn();
  eventTarget.addEventListener('success', successEventListener1);
  eventTarget.addEventListener('success', successEventListener2);
  eventTarget.addEventListener('fail', failEventListener);

  eventTarget.dispatchEvent('success', { text: 'success' });
  eventTarget.dispatchEvent('fail', { text: 'fail' });
  expect(successEventListener1).toBeCalledTimes(1);
  expect(successEventListener2).toBeCalledTimes(1);
  expect(failEventListener).toBeCalledTimes(1);

  eventTarget.removeEventListener('success', successEventListener1);

  eventTarget.dispatchEvent('success', { text: 'success' });
  eventTarget.dispatchEvent('fail', { text: 'fail' });
  expect(successEventListener1).toBeCalledTimes(1);
  expect(successEventListener2).toBeCalledTimes(2);
  expect(failEventListener).toBeCalledTimes(2);
});

test('it should unsubscribe all the listeners to the event', () => {
  const eventTarget = new EventTarget<EventMap>();
  const successEventListener1 = jest.fn();
  const successEventListener2 = jest.fn();
  const failEventListener = jest.fn();
  eventTarget.addEventListener('success', successEventListener1);
  eventTarget.addEventListener('success', successEventListener2);
  eventTarget.addEventListener('fail', failEventListener);

  eventTarget.dispatchEvent('success', { text: 'success' });
  eventTarget.dispatchEvent('fail', { text: 'fail' });
  expect(successEventListener1).toBeCalledTimes(1);
  expect(successEventListener2).toBeCalledTimes(1);
  expect(failEventListener).toBeCalledTimes(1);

  eventTarget.removeAllEventListeners();

  eventTarget.dispatchEvent('success', { text: 'success' });
  eventTarget.dispatchEvent('fail', { text: 'fail' });
  expect(successEventListener1).toBeCalledTimes(1);
  expect(successEventListener2).toBeCalledTimes(1);
  expect(failEventListener).toBeCalledTimes(1);
});
