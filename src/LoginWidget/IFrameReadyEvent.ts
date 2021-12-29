import { MessageData } from './MessageData';

export class IFrameReadyEvent implements MessageData {
  type: 'awx_login_widget/iframe_ready' = 'awx_login_widget/iframe_ready';
}
