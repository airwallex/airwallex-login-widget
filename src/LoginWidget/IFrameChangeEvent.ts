import { MessageData } from './MessageData';

export class IFrameChangeEvent implements MessageData {
  type: 'awx_login_widget/iframe_change';
  payload: IFrameChangeEventPayload;

  constructor(payload: IFrameChangeEventPayload) {
    this.type = 'awx_login_widget/iframe_change';
    this.payload = payload;
  }
}

export interface IFrameChangeEventPayload {
  field: FieldName;
  complete: boolean;
}

export type FieldName = 'username' | 'password' | 'authcode';
