import constants from '../constants';
import { ContactRequest } from '../contracts/contact-request';
import { Env } from '../env';
import { buildContactTemplate } from '../templates/contact-template';
import { Result } from '../utils/result';

export const sendContactEmail = async (contactRequest: ContactRequest, env: Env): Promise<Result<void>> => {
  const sendEmailRequest = new Request(constants.MAILCHANNELS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: { email: constants.SENDER_EMAIL, name: constants.SENDER_NAME },
      reply_to: { email: contactRequest.emailAddress, name: contactRequest.fullName },
      personalizations: [{ to: [{ email: env.RECIPIENT_EMAIL, name: env.RECIPIENT_NAME }] }],
      subject: `Contact request - ${contactRequest.fullName}`,
      content: [{ type: 'text/html', value: buildContactTemplate(contactRequest) }],
    }),
  });

  try {
    if (env.USE_FAKE_EMAIL_SENDING) {
      sendFakeEmail(env);
    } else {
      await sendRealEmail(sendEmailRequest);
    }
  } catch (error) {
    return Result.fail(error instanceof Error ? error.message : JSON.stringify(error));
  }

  return Result.ok();
};

const sendRealEmail = async (sendEmailRequest: Request) => {
  const response = await fetch(sendEmailRequest);

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText);
  }
};

const sendFakeEmail = (env: Env) => {
  if (env.SHOULD_FAKE_EMAIL_SENDING_FAIL) {
    throw new Error('Simulating email sending failure');
  }
};
