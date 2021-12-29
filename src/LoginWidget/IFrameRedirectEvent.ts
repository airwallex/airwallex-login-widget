import { MessageData } from './MessageData';

export class IFrameRedirectEvent implements MessageData {
  type: 'awx_login_widget/iframe_redirect';
  payload: IFrameRedirectEventPayload;

  constructor(payload: IFrameRedirectEventPayload) {
    this.type = 'awx_login_widget/iframe_redirect';
    this.payload = payload;
  }
}

export interface IFrameRedirectEventPayload {
  url: string;
}
