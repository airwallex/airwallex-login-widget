import { LoginWidget } from '@airwallex/login-widget';
import { useEffect, useMemo, useRef } from 'react';

export default function MFAWidget(props) {
  const {
    resourceId,
    authSummaryText,
    labels,
    onBlur,
    onCancel,
    onChange,
    onError,
    onFocus,
    onReady,
    onLoginSuccess,
    onAuthSuccess,
    enableDisclaimer,
  } = props;

  const widget = useMemo(
    () => new LoginWidget({ authSummaryText, resourceId, labels, enableDisclaimer }),
    [authSummaryText, resourceId, labels, enableDisclaimer],
  );

  const widgetContainer = useRef(null);

  useEffect(() => {
    if (widgetContainer.current) widget.mount(widgetContainer.current);
    return () => widget.unmount();
  }, [widget]);

  useEffect(() => {
    if (onCancel) {
      widget.on('cancel', onCancel);
      return () => widget.removeEventListener('cancel', onCancel);
    }
  }, [onCancel, widget]);

  useEffect(() => {
    if (onError) {
      widget.on('error', onError);
      return () => widget.removeEventListener('error', onError);
    }
  }, [onError, widget]);

  useEffect(() => {
    if (onAuthSuccess) {
      widget.on('auth_success', onAuthSuccess);
      return () => widget.removeEventListener('auth_success', onAuthSuccess);
    }
  }, [onAuthSuccess, widget]);

  useEffect(() => {
    if (onBlur) {
      widget.on('blur', onBlur);
      return () => widget.removeEventListener('blur', onBlur);
    }
  }, [onBlur, widget]);

  useEffect(() => {
    if (onChange) {
      widget.on('change', onChange);
      return () => widget.removeEventListener('change', onChange);
    }
  }, [onChange, widget]);

  useEffect(() => {
    if (onFocus) {
      widget.on('focus', onFocus);
      return () => widget.removeEventListener('focus', onFocus);
    }
  }, [onFocus, widget]);

  useEffect(() => {
    if (onReady) {
      widget.on('ready', onReady);
      return () => widget.removeEventListener('ready', onReady);
    }
  }, [onReady, widget]);

  useEffect(() => {
    if (onLoginSuccess) {
      widget.on('login_success', onLoginSuccess);
      return () => widget.removeEventListener('login_success', onLoginSuccess);
    }
  }, [onLoginSuccess, widget]);

  return <div ref={widgetContainer} />;
}
