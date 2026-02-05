import { ReactNode } from 'react';
import { FaInfoCircle, FaExclamationTriangle, FaExclamationCircle, FaCheckCircle, FaLightbulb } from 'react-icons/fa';

type CalloutType = 'info' | 'warning' | 'error' | 'success' | 'tip';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const icons: Record<CalloutType, typeof FaInfoCircle> = {
  info: FaInfoCircle,
  warning: FaExclamationTriangle,
  error: FaExclamationCircle,
  success: FaCheckCircle,
  tip: FaLightbulb,
};

const defaultTitles: Record<CalloutType, string> = {
  info: 'Info',
  warning: 'Warning',
  error: 'Error',
  success: 'Success',
  tip: 'Tip',
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const Icon = icons[type];
  
  return (
    <div className={`callout callout-${type}`}>
      <div className="callout-title">
        <span className="callout-icon">
          <Icon />
        </span>
        {title || defaultTitles[type]}
      </div>
      <div className="callout-content">
        {children}
      </div>
    </div>
  );
}
