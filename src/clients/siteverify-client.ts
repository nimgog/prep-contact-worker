import constants from '../constants';
import { TurnstileResponse } from '../contracts/turnstile-response';
import { Env } from '../env';
import { Result } from '../utils/result';

export const sendSiteverifyRequest = async (clientToken: string, remoteIp: string | null | undefined, env: Env) => {
  const formData = new FormData();

  formData.append('secret', env.TURNSTILE_SECRET_KEY);
  formData.append('response', clientToken);

  if (remoteIp) {
    formData.append('remoteip', remoteIp);
  }

  try {
    if (env.USE_FAKE_SITEVERIFY) {
      issueFakeVerification(env);
    } else {
      await issueRealVerification(formData);
    }
  } catch (error) {
    return Result.fail(error instanceof Error ? error.message : JSON.stringify(error));
  }

  return Result.ok();
};

const issueRealVerification = async (formData: FormData) => {
  const response = await fetch(constants.TURNSTILE_SITEVERIFY_API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(responseText);
  }

  const result = await response.json<TurnstileResponse>();

  if (!result?.success) {
    throw new Error('Request validation failed: ' + result?.['error-codes'].join(',') || 'Unknown error');
  }
};

const issueFakeVerification = (env: Env) => {
  if (env.SHOULD_FAKE_SITEVERIFY_FAIL) {
    throw new Error('Simulating siteverify failure');
  }
};
