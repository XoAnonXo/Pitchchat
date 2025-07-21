// Simple test script for Brevo API
const BREVO_API_KEY = process.env.BREVO_API_KEY;

if (!BREVO_API_KEY) {
  console.error('Please set BREVO_API_KEY environment variable');
  process.exit(1);
}

async function sendTestEmail() {
  const emailData = {
    sender: {
      name: "PitchChatAI",
      email: "georgiiyvl@gmail.com"
    },
    to: [{
      email: "georgiyxo@protonmail.com",
      name: "Test User"
    }],
    subject: "Direct Brevo API Test",
    htmlContent: "<html><body><h1>Test Email</h1><p>This is a direct test of the Brevo API at " + new Date().toISOString() + "</p></body></html>"
  };

  console.log('Sending email with data:', JSON.stringify(emailData, null, 2));
  console.log('Using API key:', BREVO_API_KEY.substring(0, 10) + '...');

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    });

    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response body:', JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log('\n✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
    } else {
      console.error('\n❌ Failed to send email');
      console.error('Error:', result);
    }
  } catch (error) {
    console.error('\n❌ Network error:', error);
  }
}

// Run the test
sendTestEmail();