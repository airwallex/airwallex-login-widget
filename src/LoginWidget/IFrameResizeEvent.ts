import { MessageData } from './MessageData';

export class IFrameResizeEvent implements MessageData {
  type: 'awx_login_widget/iframe_resize';
  payload: IFrameResizeEventPayload;

  constructor(payload: IFrameResizeEventPayload) {
    this.type = 'awx_login_widget/iframe_resize';
    this.payload = payload;
  }
}

export interface IFrameResizeEventPayload {
  height: string;
}
