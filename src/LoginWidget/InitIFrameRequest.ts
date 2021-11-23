import { Language, LoginWidgetOptionsLabels } from './LoginWidget';
import { MessageData } from './MessageData';

export class InitIFrameRequest implements MessageData {
  type: 'awx_login_widget/init_iframe';
  payload: InitIFrameRequestPayload;

  constructor(payload: InitIFrameRequestPayload) {
    this.type = 'awx_login_widget/init_iframe';
    this.payload = payload;
  }
}

export interface InitIFrameRequestPayload {
  authSummaryText: string | undefined;
  labels: LoginWidgetOptionsLabels | undefined;
  language: Language;
  logoUrl: string;
  resourceId: string | undefined;
}
