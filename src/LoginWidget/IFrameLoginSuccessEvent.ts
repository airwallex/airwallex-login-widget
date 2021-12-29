import { MessageData } from './MessageData';

export class IFrameLoginSuccessEvent implements MessageData {
  type: 'awx_login_widget/iframe_login_success' = 'awx_login_widget/iframe_login_success';
}
