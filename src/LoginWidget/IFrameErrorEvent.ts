import { MessageData } from './MessageData';

export class IFrameErrorEvent implements MessageData {
  type: 'awx_login_widget/iframe_error';
  payload: IFrameErrorEventPayload;

  constructor(payload: IFrameErrorEventPayload) {
    this.type = 'awx_login_widget/iframe_error';
    this.payload = payload;
  }
}

export interface IFrameErrorEventPayload {
  errorCode: keyof typeof ERROR_CODE_MAP;
}

export const ERROR_CODE_MAP = {
  BAD_CREDENTIAL: 'User name or password is incorrect',
  INVALID_AUTH_CODE: 'Invalid authorization code',
  INVALID_RESOURCE_ID: 'Invalid resource ID',
  TWO_FACTOR_AUTHENTICATION_NOT_ENABLED: 'Two-factor authentication is not enabled',
  UNKNOWN_ERROR: 'Unknown error',
  USER_AUTH_LOCKED: 'User auth has been locked',
  USER_LOGIN_LOCKED: 'User login has been locked',
} as const;
