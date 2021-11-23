import { MessageData } from './MessageData';

export class IFrameCancelEvent implements MessageData {
  type: 'awx_login_widget/iframe_cancel' = 'awx_login_widget/iframe_cancel';
}
