import { FieldName } from './IFrameChangeEvent';
import { MessageData } from './MessageData';

export class IFrameBlurEvent implements MessageData {
  type: 'awx_login_widget/iframe_blur';
  payload: IFrameBlurEventPayload;

  constructor(payload: IFrameBlurEventPayload) {
    this.type = 'awx_login_widget/iframe_blur';
    this.payload = payload;
  }
}

export interface IFrameBlurEventPayload {
  field: FieldName;
  complete: boolean;
}
