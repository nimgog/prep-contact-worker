export interface Env {
  CORS_ALLOW_LOCALHOST?: boolean;

  USE_FAKE_EMAIL_SENDING?: boolean;
  SHOULD_FAKE_EMAIL_SENDING_FAIL?: boolean;
  RECIPIENT_EMAIL: string;
  RECIPIENT_NAME: string;

  USE_FAKE_SITEVERIFY?: boolean;
  SHOULD_FAKE_SITEVERIFY_FAIL?: boolean;
  TURNSTILE_SECRET_KEY: string;
}
