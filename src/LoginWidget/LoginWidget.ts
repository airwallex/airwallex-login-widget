import { BaseWidget } from '../BaseWidget';
import { EventTarget } from '../EventTarget';
import { IFrameAuthSuccessEvent, IFrameAuthSuccessEventPayload } from './IFrameAuthSuccessEvent';
import { IFrameBlurEvent, IFrameBlurEventPayload } from './IFrameBlurEvent';
import { IFrameCancelEvent } from './IFrameCancelEvent';
import { IFrameChangeEvent, IFrameChangeEventPayload } from './IFrameChangeEvent';
import { ERROR_CODE_MAP, IFrameErrorEvent, IFrameErrorEventPayload } from './IFrameErrorEvent';
import { IFrameFocusEvent, IFrameFocusEventPayload } from './IFrameFocusEvent';
import { IFrameLoginSuccessEvent } from './IFrameLoginSuccessEvent';
import { IFrameReadyEvent } from './IFrameReadyEvent';
import { IFrameRedirectEvent, IFrameRedirectEventPayload } from './IFrameRedirectEvent';
import { IFrameResizeEvent, IFrameResizeEventPayload } from './IFrameResizeEvent';
import { InitIFrameRequest } from './InitIFrameRequest';
import { LoginWidgetEventMap } from './LoginWidgetEvents';
import { UpdateIFrameRequest } from './UpdateIFrameRequest';

export let widgetInitOptions: WidgetInitOptionsWithDefaults | null = null;

const iframeSource: Record<Environment, string> = {
  staging: 'https://static-staging.airwallex.com/widgets/login',
  demo: 'https://static-demo.airwallex.com/widgets/login',
  production: 'https://static.airwallex.com/widgets/login',
};

export class LoginWidget extends BaseWidget {
  static init(options?: WidgetInitOptions) {
    widgetInitOptions = {
      logoUrl: options?.logoUrl,
      env: options?.env ?? 'production',
      locale: options?.locale ?? 'en',
    };
  }

  get #widgetInitOptionsWithDefaults(): WidgetInitOptionsWithDefaults {
    if (!widgetInitOptions) throw Error('Please initialize the widget first');
    return widgetInitOptions;
  }

  readonly #options: LoginWidgetOptions | undefined;

  /**
   * Event target for managing the events of the LoginWidget.
   */
  readonly #widgetEventTarget: EventTarget<LoginWidgetEventMap>;

  constructor(options?: LoginWidgetOptions) {
    super();
    this.#options = options;
    this.#widgetEventTarget = new EventTarget();
    this.#initializeIFrameAttributes();
    window.addEventListener('message', this.#messageEventListener.bind(this));
  }

  get #iframeOrigin() {
    return new URL(this.iframe.src).origin;
  }

  #initializeIFrameAttributes() {
    this.iframe.title = 'Login 2FA Widget';
    this.iframe.name = 'Login 2FA Widget';
    this.iframe.src = `${iframeSource[this.#widgetInitOptionsWithDefaults.env]}?origin=${window.origin}`;
    this.iframe.style.transition = 'height 0.35s ease 0s';
    this.iframe.style.width = '100%';
    this.iframe.style.height = '459px';
    this.iframe.style.background = 'white';
    this.iframe.style.border = 'none';
    this.iframe.style.borderRadius = '8px';
  }

  /**
   * The listener of the message event.
   */
  #messageEventListener(event: LoginIFrameMessageEvent) {
    const { source, data: messageData } = event;
    if (source === this.iframe.contentWindow && messageData?.type) {
      switch (messageData.type) {
        case 'awx_login_widget/iframe_blur':
          this.#onInnerBlurEvent(messageData.payload);
          break;
        case 'awx_login_widget/iframe_cancel':
          this.#onInnerCancelEvent();
          break;
        case 'awx_login_widget/iframe_change':
          this.#onInnerChangeEvent(messageData.payload);
          break;
        case 'awx_login_widget/iframe_error':
          this.#onInnerErrorEvent(messageData.payload);
          break;
        case 'awx_login_widget/iframe_focus':
          this.#onInnerFocusEvent(messageData.payload);
          break;
        case 'awx_login_widget/iframe_ready':
          this.#onInnerReadyEvent();
          break;
        case 'awx_login_widget/iframe_redirect':
          this.#onInnerRedirectEvent(messageData.payload);
          break;
        case 'awx_login_widget/iframe_resize':
          this.#onInnerResizeEvent(messageData.payload);
          break;
        case 'awx_login_widget/iframe_login_success':
          this.#onInnerLoginSuccessEvent();
          break;
        case 'awx_login_widget/iframe_auth_success':
          this.#onInnerAuthSuccessEvent(messageData.payload);
          break;
        default:
          break;
      }
    }
  }

  #onInnerBlurEvent(payload: IFrameBlurEventPayload) {
    this.#widgetEventTarget.dispatchEvent('blur', payload);
  }
  #onInnerCancelEvent() {
    this.#widgetEventTarget.dispatchEvent('cancel', {});
  }
  #onInnerChangeEvent(payload: IFrameChangeEventPayload) {
    this.#widgetEventTarget.dispatchEvent('change', payload);
  }
  #onInnerErrorEvent(payload: IFrameErrorEventPayload) {
    const { errorCode } = payload;
    this.#widgetEventTarget.dispatchEvent('error', { errorCode, message: ERROR_CODE_MAP[errorCode] });
  }
  #onInnerFocusEvent(payload: IFrameFocusEventPayload) {
    this.#widgetEventTarget.dispatchEvent('focus', payload);
  }
  #onInnerRedirectEvent(payload: IFrameRedirectEventPayload) {
    window.open(payload.url, '_blank');
  }
  #onInnerAuthSuccessEvent(payload: IFrameAuthSuccessEventPayload) {
    this.#widgetEventTarget.dispatchEvent('auth_success', payload);
  }
  #onInnerResizeEvent({ height }: IFrameResizeEventPayload) {
    this.iframe.style.height = height;
  }
  #onInnerReadyEvent() {
    this.iframe.contentWindow?.postMessage(
      new InitIFrameRequest({
        authSummaryText: this.#options?.authSummaryText,
        labels: this.#options?.labels,
        language: this.#widgetInitOptionsWithDefaults.locale,
        logoUrl: this.#widgetInitOptionsWithDefaults.logoUrl,
        resourceId: this.#options?.resourceId,
      }),
      this.#iframeOrigin,
    );
    this.#widgetEventTarget.dispatchEvent('ready', {});
  }
  #onInnerLoginSuccessEvent() {
    this.#widgetEventTarget.dispatchEvent('login_success', {});
  }

  /**
   * Add a listener to the LoginWidget event.
   * @param eventType LoginWidget event type.
   * @param listener Listener of the event.
   */
  on<EventType extends keyof LoginWidgetEventMap = keyof LoginWidgetEventMap>(
    eventType: EventType,
    listener: (e: LoginWidgetEventMap[EventType]) => void,
  ) {
    this.#widgetEventTarget.addEventListener(eventType, listener);
  }

  /**
   * Remove the listener on the LoginWidget event.
   * @param eventType LoginWidget event type.
   * @param listener Listener to be removed.
   */
  removeEventListener<EventType extends keyof LoginWidgetEventMap = keyof LoginWidgetEventMap>(
    eventType: EventType,
    listener: (e: LoginWidgetEventMap[EventType]) => void,
  ) {
    this.#widgetEventTarget.removeEventListener(eventType, listener);
  }

  /**
   * Update the LoginWidget.
   * @param options Options to update.
   */
  update(options: LoginWidgetUpdateOptions) {
    this.iframe.contentWindow?.postMessage(new UpdateIFrameRequest(options), this.#iframeOrigin);
  }
}

export interface LoginWidgetOptions {
  authSummaryText?: string;
  resourceId?: string;
  /**
   * Custom the texts of the widget.
   */
  labels?: LoginWidgetOptionsLabels | undefined;
}

export interface LoginWidgetOptionsLabels {
  authButton?: string;
  authCode?: string;
  emailLabel?: string;
  forgotPassword?: string;
  loginButton?: string;
  loginSubTitle?: string;
  loginTitle?: string;
  mfaTitle?: string;
  passwordLabel?: string;
  supportLink?: string;
}

export interface LoginWidgetUpdateOptions {
  authSummaryText?: string | undefined;
  resourceId?: string | undefined;
  labels?: LoginWidgetOptionsLabels | undefined;
}

export type Language = 'en' | 'zh';

export type Environment = 'staging' | 'demo' | 'production';

export interface WidgetInitOptions {
  /**
   * The URL of the logo to display in the login widget.
   * The recommended size of the image is 72x72 px.
   */
  logoUrl?: string | undefined;
  /**
   * The environment of the login widget
   * @default 'production'
   */
  env?: Environment;
  /**
   * The language of the login widget.
   * @default 'en'
   */
  locale?: Language | undefined;
}

interface WidgetInitOptionsWithDefaults extends WidgetInitOptions {
  env: Environment;
  locale: Language;
}

type LoginIFrameMessageEvent = MessageEvent<
  | IFrameAuthSuccessEvent
  | IFrameBlurEvent
  | IFrameCancelEvent
  | IFrameChangeEvent
  | IFrameErrorEvent
  | IFrameFocusEvent
  | IFrameLoginSuccessEvent
  | IFrameReadyEvent
  | IFrameRedirectEvent
  | IFrameResizeEvent
  | null
  | undefined
>;
