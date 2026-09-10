/**
 * SURAKSHA Emergency SMS Gateway & Provider Abstraction
 * Supports cellular SMS dispatch to geographically targeted citizens in danger zones.
 * Accurately tracks PENDING, SENT, and FAILED delivery statuses.
 */

import { smsLogsCollection } from '../database/store';

export interface SmsSendResult {
  recipient: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  messageId: string;
  error?: string;
}

export interface SmsProvider {
  name: string;
  send(recipient: string, message: string): Promise<SmsSendResult>;
}

/**
 * Standard Indian SMS Gateway / Twilio compatible implementation
 */
class ProductionSmsProvider implements SmsProvider {
  name = 'Indian Emergency SMS Gateway (CDAC/Twilio Compatible)';
  async send(recipient: string, message: string): Promise<SmsSendResult> {
  const apiKey = process.env.TEXTBEE_API_KEY;
  const deviceId = process.env.TEXTBEE_DEVICE_ID;

  if (!apiKey || !deviceId) {
    return {
      recipient,
      status: 'FAILED',
      messageId: `sms_config_fail_${Date.now()}`,
      error: 'TextBee API key or device ID is not configured.'
    };
  }

  try {
    const response = await fetch(
      'https://api.textbee.dev/api/v1/gateway/send-sms',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey
        },
        body: JSON.stringify({
          recipients: [recipient],
          message,
          deviceId
        })
      }
    );

    const data = await response.json().catch(() => ({}));
    const result = data?.data;

    if (!response.ok) {
      return {
        recipient,
        status: 'FAILED',
        messageId: `sms_http_fail_${Date.now()}`,
        error:
          result?.message ||
          data?.message ||
          data?.error ||
          `TextBee HTTP ${response.status}`
      };
    }

    if (result?.success === false || result?.failureCount > 0) {
      return {
        recipient,
        status: 'FAILED',
        messageId: result?.smsBatchId || `sms_fail_${Date.now()}`,
        error: result?.message || 'TextBee rejected the SMS.'
      };
    }

    return {
      recipient,
      status: 'PENDING',
      messageId: result?.smsBatchId || `sms_${Date.now()}`
    };
  } catch (err: any) {
    return {
      recipient,
      status: 'FAILED',
      messageId: `sms_err_${Date.now()}`,
      error: err?.message || 'TextBee request failed.'
    };
  }
  }
}

export const smsGateway: SmsProvider = new ProductionSmsProvider();

export async function dispatchEmergencySms(
  alertId: string,
  recipients: string[],
  alertTitle: string,
  alertArea: string,
  recommendedAction: string,
  appLink: string = 'https://suraksha.gov.in'
): Promise<{ total: number; sent: number; pending: number; failed: number }> {
  let sentCount = 0;
  let failedCount = 0;
  let pendingCount = 0;

  const senderId = process.env.SMS_SENDER_ID || 'SURAKSHA';
  const conciseMessage = `${senderId} ALERT: ${alertTitle.toUpperCase()} in ${alertArea}. Action: ${recommendedAction}. Open app: ${appLink} for shelter & safe route. Follow official instructions.`;

  for (const phone of recipients) {
    const result = await smsGateway.send(phone, conciseMessage);

    if (result.status === 'SENT') sentCount++;
    else if (result.status === 'FAILED') failedCount++;
    else pendingCount++;

    smsLogsCollection.insert({
      id: result.messageId,
      alertId,
      recipientPhone: phone,
      messageContent: conciseMessage,
      status: result.status,
      gatewayResponse: result.error || 'Gateway accepted for delivery',
      timestamp: new Date().toISOString(),
      retryCount: 0
    });
  }

  return {
    total: recipients.length,
    sent: sentCount,
    pending: pendingCount,
    failed: failedCount
  };
}
