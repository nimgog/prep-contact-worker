import { type ContactRequest } from './contracts/contact-request';
import { Env } from './env';
import { validateRequest } from './validation/turnstile';
import { parseContactRequest } from './validation/contact-request';
import { sendContactEmail } from './clients/email-client';
import constants from './constants';

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return handleOptions(request, env);
    }

    if (request.method === 'POST') {
      let response: Response;

      try {
        response = await handlePost(request, env);
      } catch (error) {
        console.error('An unknown error occurred:', error);
        response = new Response(null, { status: 500 });
      }

      Object.entries(buildCorsHeaders(request, env)).forEach((header) => response.headers.set(header[0], header[1]));

      return response;
    }

    console.warn('Request used invalid HTTP method:', request.method);
    return new Response(null, { status: 405, headers: buildCorsHeaders(request, env) });
  },
};

const buildCorsHeaders = (request: Request, env: Env) => {
  const corsHeaders = { ...constants.CORS_HEADERS };

  if (env.CORS_ALLOW_LOCALHOST && request.headers.get('origin')?.startsWith('http://localhost:')) {
    corsHeaders['Access-Control-Allow-Origin'] = request.headers.get('origin')!;
  }

  return corsHeaders;
};

const handleOptions = (request: Request, env: Env) => {
  if (
    request.headers.get('Origin') &&
    request.headers.get('Access-Control-Request-Method') &&
    request.headers.get('Access-Control-Request-Headers')
  ) {
    // Handle CORS pre-flight request
    return new Response(null, {
      headers: buildCorsHeaders(request, env),
    });
  }

  // Handle standard OPTIONS request
  return new Response(null, {
    headers: {
      Allow: 'POST, OPTIONS',
    },
  });
};

const handlePost = async (request: Request, env: Env) => {
  const body: unknown = await request.json<ContactRequest>();

  if (typeof body !== 'object' || body === null) {
    console.warn('Request body is missing');
    return new Response(null, { status: 400, statusText: 'Missing request body' });
  }

  const validationResult = await validateRequest(request.headers, body, env);

  if (validationResult.isFailure) {
    console.warn(validationResult.error);
    return new Response(null, { status: 400, statusText: 'Validation failed' });
  }

  const parsingResult = parseContactRequest(body);

  if (parsingResult.isFailure) {
    console.warn(parsingResult.error);
    return new Response(null, { status: 400, statusText: 'Parsing failed' });
  }

  let emailSendResult = await sendContactEmail(parsingResult.value, env);

  if (emailSendResult.isFailure) {
    console.error('Email sending failed:', emailSendResult.error);
    return new Response(null, { status: 500, statusText: 'Email sending failed' });
  }

  console.log('Contact email has been sent');
  return new Response(null, { status: 202 });
};
