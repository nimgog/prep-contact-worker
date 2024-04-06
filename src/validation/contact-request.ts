import { type ContactRequest, contactRequestSchema } from '../contracts/contact-request';
import { Result } from '../utils/result';

export const parseContactRequest = (body: object): Result<ContactRequest> => {
  const validationResult = contactRequestSchema.safeParse(body);

  if (!validationResult.success) {
    const validationErrors = JSON.stringify(validationResult.error.format());
    return Result.fail(`Contact request validation failed: ${validationErrors}`);
  }

  return Result.ok(validationResult.data);
};
