import { FieldName } from './IFrameChangeEvent';
import { MessageData } from './MessageData';

export class IFrameFocusEvent implements MessageData {
  type: 'awx_login_widget/iframe_focus';
  payload: IFrameFocusEventPayload;

  constructor(payload: IFrameFocusEventPayload) {
    this.type = 'awx_login_widget/iframe_focus';
    this.payload = payload;
  }
}

export interface IFrameFocusEventPayload {
  field: FieldName;
  complete: boolean;
}
