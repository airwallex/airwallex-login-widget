import { MessageData } from './MessageData';

export class IFrameAuthSuccessEvent implements MessageData {
  type: 'awx_login_widget/iframe_auth_success';
  payload: IFrameAuthSuccessEventPayload;

  constructor(payload: IFrameAuthSuccessEventPayload) {
    this.type = 'awx_login_widget/iframe_auth_success';
    this.payload = payload;
  }
}

export interface IFrameAuthSuccessEventPayload {
  signedToken: string;
}
