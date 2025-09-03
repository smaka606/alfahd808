// This is a placeholder for a real email sending service.
// The implementation details will vary depending on your chosen provider (e.g., SendGrid, Mailgun, Resend).
async function sendEmailWithProvider({ apiKey, to, subject, text, html }) {
    console.log("--- SIMULATING EMAIL SEND ---");

    if (!apiKey) {
        console.error("EMAIL_PROVIDER_KEY is not set in environment variables.");
        throw new Error("The email service is not configured.");
    }
    if (!to) {
        throw new Error("Recipient email address is missing.");
    }

    // =========================================================================
    // EXAMPLE IMPLEMENTATION (e.g., using SendGrid)
    // =========================================================================
    // 1. Install the provider's library: `npm install @sendgrid/mail` or add to package.json
    // 2. Uncomment the following code and adapt if necessary.
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(apiKey);
    const msg = {
      to: to,
      from: 'noreply@yourdomain.com', // Use a verified sender from your email provider
      subject: subject,
      text: text,
      html: html,
    };
    await sgMail.send(msg);
    */
    // =========================================================================

    console.log(`Simulating email sent to ${to}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log("Email sent successfully (simulation).");
    return { success: true };
}


exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { email, transcript } = JSON.parse(event.body);

        if (!email || !transcript) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Email and transcript are required.' }) };
        }

        const apiKey = process.env.EMAIL_PROVIDER_KEY;
        const subject = 'Your Chat Transcript from Al Fahd Seafood';
        const textContent = `Here is your chat transcript:\n\n${transcript}`;
        const htmlContent = `
            <h1>Your Chat Transcript</h1>
            <p>Here is the conversation you had with our assistant:</p>
            <pre style="background-color: #f4f4f4; padding: 15px; border-radius: 5px;">${transcript.replace(/\n/g, '<br>')}</pre>
            <p>Thank you for contacting Al Fahd Seafood!</p>
        `;

        // Call the email provider function (simulated)
        await sendEmailWithProvider({
            apiKey,
            to: email,
            subject: subject,
            text: textContent,
            html: htmlContent
        });

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Transcript sent successfully!' }),
        };

    } catch (error) {
        console.error('Error in send-email function:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Sorry, there was a problem sending the email.' }),
        };
    }
};
