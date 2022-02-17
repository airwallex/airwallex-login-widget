import { Language, LoginWidgetOptionsLabels } from './LoginWidget';
import { MessageData } from './MessageData';

export class UpdateIFrameRequest implements MessageData {
  type: 'awx_login_widget/update_iframe';
  payload: UpdateIFrameRequestPayload;

  constructor(payload: UpdateIFrameRequestPayload) {
    this.type = 'awx_login_widget/update_iframe';
    this.payload = payload;
  }
}

export interface UpdateIFrameRequestPayload {
  authSummaryText?: string | undefined;
  labels?: LoginWidgetOptionsLabels | undefined;
  resourceId?: string | undefined;
  enableDisclaimer?: boolean | undefined;
}
