import { waitFor } from '@testing-library/dom';
import { IFrameAuthSuccessEvent } from './IFrameAuthSuccessEvent';
import { IFrameBlurEvent } from './IFrameBlurEvent';
import { IFrameCancelEvent } from './IFrameCancelEvent';
import { IFrameChangeEvent } from './IFrameChangeEvent';
import { IFrameErrorEvent } from './IFrameErrorEvent';
import { IFrameFocusEvent } from './IFrameFocusEvent';
import { IFrameLoginSuccessEvent } from './IFrameLoginSuccessEvent';
import { IFrameReadyEvent } from './IFrameReadyEvent';
import { IFrameRedirectEvent } from './IFrameRedirectEvent';
import { IFrameResizeEvent } from './IFrameResizeEvent';
import { LoginWidget, widgetInitOptions } from './LoginWidget';

const logoUrl = 'https://www.airwallex.com/logo';

const initializeLoginWidget = () => {
  LoginWidget.init({ logoUrl });
  return new LoginWidget();
};

test("it should throw an error if the widget wasn't initialized", () => {
  expect(() => new LoginWidget()).toThrowError();
});

test('it should set default init options value', () => {
  expect(widgetInitOptions).toBeNull();
  initializeLoginWidget();
  expect(widgetInitOptions).toEqual({ logoUrl, env: 'production', locale: 'en' });
});

test('it should initialize iframe element attributes', () => {
  const loginWidget = initializeLoginWidget();

  expect(loginWidget.iframe).toHaveAttribute('title');
  expect(loginWidget.iframe).toHaveAttribute('src');
  expect(loginWidget.iframe.style.length).toBeGreaterThan(0);
});

test("it should only subscribe to the iframe's message event", async () => {
  const readyCallback = jest.fn();
  const loginWidget = initializeLoginWidget();
  // Subscribed twice, but expected to be called only once (by the subscription to window)
  loginWidget.on('ready', readyCallback);
  window.addEventListener('message', readyCallback);

  window.dispatchEvent(new MessageEvent('message', { data: new IFrameReadyEvent(), source: window }));
  await waitFor(() => expect(readyCallback).toBeCalledTimes(1));
});

test('it should be able to unsubscribe from the event', async () => {
  const cancelCallback = jest.fn();
  const loginWidget = initializeLoginWidget();
  loginWidget.on('cancel', cancelCallback);

  window.dispatchEvent(
    new MessageEvent('message', { data: new IFrameCancelEvent(), source: loginWidget.iframe.contentWindow }),
  );
  await waitFor(() => expect(cancelCallback).toBeCalledTimes(1));
  loginWidget.removeEventListener('cancel', cancelCallback);
  window.dispatchEvent(
    new MessageEvent('message', { data: new IFrameCancelEvent(), source: loginWidget.iframe.contentWindow }),
  );
  await waitFor(() => expect(cancelCallback).toBeCalledTimes(1));
});

test('it should open a new tab', async () => {
  const url = 'https://github.com';
  window.open = jest.fn();
  const loginWidget = initializeLoginWidget();
  window.dispatchEvent(
    new MessageEvent('message', { data: new IFrameRedirectEvent({ url }), source: loginWidget.iframe.contentWindow }),
  );

  await waitFor(() => expect(window.open).toBeCalledWith(url, '_blank'));
});

test('it should emit ready event to user', async () => {
  const readyCallback = jest.fn();
  const loginWidget = initializeLoginWidget();
  loginWidget.on('ready', readyCallback);

  window.dispatchEvent(
    new MessageEvent('message', { data: new IFrameReadyEvent(), source: loginWidget.iframe.contentWindow }),
  );
  await waitFor(() => expect(readyCallback).toBeCalledTimes(1));
});

test('it should emit cancel event to user', async () => {
  const cancelCallback = jest.fn();
  const loginWidget = initializeLoginWidget();
  loginWidget.on('cancel', cancelCallback);

  window.dispatchEvent(
    new MessageEvent('message', { data: new IFrameCancelEvent(), source: loginWidget.iframe.contentWindow }),
  );
  await waitFor(() => expect(cancelCallback).toBeCalledTimes(1));
});

test('it should emit login success event to user', async () => {
  const loginSuccessCallback = jest.fn();
  const loginWidget = initializeLoginWidget();
  loginWidget.on('login_success', loginSuccessCallback);

  window.dispatchEvent(
    new MessageEvent('message', {
      data: new IFrameLoginSuccessEvent(),
      source: loginWidget.iframe.contentWindow,
    }),
  );
  await waitFor(() => expect(loginSuccessCallback).toBeCalledTimes(1));
});

test('it should emit error event to user', async () => {
  const errorCallback = jest.fn();
  const loginWidget = initializeLoginWidget();
  loginWidget.on('error', errorCallback);

  window.dispatchEvent(
    new MessageEvent('message', {
      data: new IFrameErrorEvent({ errorCode: 'BAD_CREDENTIAL' }),
      source: loginWidget.iframe.contentWindow,
    }),
  );
  await waitFor(() => expect(errorCallback).toBeCalledTimes(1));
});

const fieldEventPayload = { field: 'password', complete: false } as const;

test('it should emit field events to user', async () => {
  const blurCallback = jest.fn();
  const changeCallback = jest.fn();
  const focusCallback = jest.fn();

  const loginWidget = initializeLoginWidget();
  loginWidget.on('blur', blurCallback);
  loginWidget.on('change', changeCallback);
  loginWidget.on('focus', focusCallback);

  window.dispatchEvent(
    new MessageEvent('message', {
      data: new IFrameBlurEvent(fieldEventPayload),
      source: loginWidget.iframe.contentWindow,
    }),
  );
  await waitFor(() => expect(blurCallback).toBeCalledWith(fieldEventPayload));

  window.dispatchEvent(
    new MessageEvent('message', {
      data: new IFrameChangeEvent(fieldEventPayload),
      source: loginWidget.iframe.contentWindow,
    }),
  );
  await waitFor(() => expect(changeCallback).toBeCalledWith(fieldEventPayload));

  window.dispatchEvent(
    new MessageEvent('message', {
      data: new IFrameFocusEvent(fieldEventPayload),
      source: loginWidget.iframe.contentWindow,
    }),
  );
  await waitFor(() => expect(focusCallback).toBeCalledWith(fieldEventPayload));
});

const successEventPayload = { signedToken: '' } as const;

test('it should emit auth success event to user', async () => {
  const autSuccessCallback = jest.fn();
  const loginWidget = initializeLoginWidget();
  loginWidget.on('auth_success', autSuccessCallback);

  window.dispatchEvent(
    new MessageEvent('message', {
      data: new IFrameAuthSuccessEvent(successEventPayload),
      source: loginWidget.iframe.contentWindow,
    }),
  );
  await waitFor(() => expect(autSuccessCallback).toBeCalledWith(successEventPayload));
});

test("it should resize the iframe's height", async () => {
  const loginWidget = initializeLoginWidget();
  window.dispatchEvent(
    new MessageEvent('message', {
      data: new IFrameResizeEvent({ height: '1000px' }),
      source: loginWidget.iframe.contentWindow,
    }),
  );
  await waitFor(() => expect(loginWidget.iframe).toHaveStyle({ height: '1000px' }));
});
