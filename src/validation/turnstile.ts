import { sendSiteverifyRequest } from '../clients/siteverify-client';
import { Env } from '../env';
import { Result } from '../utils/result';

export const validateRequest = async (headers: Headers, body: object, env: Env): Promise<Result<void>> => {
  if (!('turnstileToken' in body) || typeof body['turnstileToken'] !== 'string') {
    return Result.fail('Request validation failed: Turnstile response is missing');
  }
  const clientToken = body['turnstileToken'];
  const remoteIp = headers.get('CF-Connecting-IP');

  return await sendSiteverifyRequest(clientToken, remoteIp, env);
};
