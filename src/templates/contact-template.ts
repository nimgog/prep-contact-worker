import { ContactRequest } from '../contracts/contact-request';

export const buildContactTemplate = (contactRequest: ContactRequest) => `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Request</title>
</head>

<body>
  <h1>${contactRequest.fullName} sent you a contact request.</h1>
  <h2>Message:</h2>
  <p>${contactRequest.message}</p>
</body>

</html>
`;
