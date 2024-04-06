# PREP Contact Worker

This project was generated with C3 CLI (create-cloudflare-cli), based on this [guide](https://developers.cloudflare.com/workers/get-started/guide).

## Development server

Unfortunately, MailChannels email sending can only be authorized when the worker is deployed to Cloudflare.

However, there are environment variables for email sending and for siteverify in the `wrangler.toml` file, which can be modified to simulate these features.

> Important: Don't forget to set the testing environment variables back to their desired production values before initiating a deployment!

Run `npm run dev` in your terminal to start a development server.
Open a browser tab at http://localhost:8787/ to see the worker in action.

## One-time MailChannels setup

For the one-time MailChannels email sending setup, refer to the [MailChannels](https://developers.cloudflare.com/pages/platform/functions/plugins/mailchannels) page.
The plugin mentioned in the article is irrelevant, only Domain Lockdown DNS record and SPF intructions need to be followed.

## Deployment

If the worker is to be used by the locally hosted PREP app, set the `CORS_ALLOW_LOCALHOST` environment variable to **true**, otherwise requests to the worker will fail due to CORS errors.

If the recipient of the emails should be different for testing purposes, set the `RECIPIENT_EMAIL` and `RECIPIENT_NAME` environment variables to the desired test values.

> Important: Don't forget to set the testing environment variables back to their desired production values before initiating a deployment!

The other settings used by the worker, but less important from a testing perspective, can be found in `./src/constants/index.ts`.

There is only one environment secret that must be set, named `TURNSTILE_SECRET_KEY`. This must hold the value displayed in Cloudflare, under Turnstile/PREP.

To set it from the CLI, run `npx wrangler secret put TURNSTILE_SECRET_KEY` and provide the key in the next prompt.

To test the deployed app together with a locally hosted PREP app, `TURNSTILE_SECRET_KEY` can be set to one of the keys from the [Testing](https://developers.cloudflare.com/turnstile/reference/testing) page of Turnstile docs.

Run `npm run deploy` to publish the worker.

> Deployments initiated from the daskboard and the ones initiated from the CLI can override each others' configuration, so use them with caution!

## Futher help

To learn more about workers, check out the [Cloudflare Workers](https://developers.cloudflare.com/workers) page.
