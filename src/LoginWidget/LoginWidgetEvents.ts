import { FieldName } from './IFrameChangeEvent';
import { ERROR_CODE_MAP } from './IFrameErrorEvent';

export type LoginWidgetEventType = keyof LoginWidgetEventMap;

export type LoginWidgetEventMap = {
  auth_success: LoginWidgetAuthSuccessEvent;
  blur: LoginWidgetFiledEvent;
  cancel: Record<string, never>;
  change: LoginWidgetFiledEvent;
  error: LoginWidgetErrorEvent;
  focus: LoginWidgetFiledEvent;
  login_success: Record<string, never>;
  ready: Record<string, never>;
};

export interface LoginWidgetErrorEvent<T extends keyof typeof ERROR_CODE_MAP = keyof typeof ERROR_CODE_MAP> {
  errorCode: T;
  message: typeof ERROR_CODE_MAP[T];
}

export interface LoginWidgetAuthSuccessEvent {
  signedToken: string;
}

export interface LoginWidgetFiledEvent {
  /**
   * Whether the input of the field is valid.
   */
  complete: boolean;
  /**
   * The name of the field.
   */
  field: FieldName;
}
