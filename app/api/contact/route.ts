import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/server'; // Use server-side Supabase client
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    // Insert into Supabase
    const { error: supabaseError } = await supabase
      .from('contacts')
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      return NextResponse.json({ error: supabaseError.message }, { status: 500 });
    }

    // Send confirmation email via Resend
const { data, error: resendError } = await resend.emails.send({
    from: 'Tanjore Degree Coffee <onboarding@resend.dev>',
    to: [formData.email],
    subject: 'Thank You for Contacting Tanjore Degree Coffee',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You from Tanjore Degree Coffee</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f1e9; color: #4a2c00;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(to right, #8b4513, #d2691e); padding: 20px; text-align: center;">
              <img src="https://via.placeholder.com/150x50/8b4513/ffffff?text=Tanjore+Coffee" alt="Tanjore Degree Coffee Logo" style="max-width: 150px; height: auto;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 10px 0; font-weight: bold;">Thank You, ${formData.name}!</h1>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; line-height: 1.5; color: #4a2c00; margin: 0 0 20px;">
                We’ve received your query and our team is brewing up a response for you. Expect to hear back soon!
              </p>
              <h2 style="font-size: 20px; color: #8b4513; margin: 0 0 15px; font-weight: bold;">Your Submission Details</h2>
              <table width="100%" cellpadding="8" cellspacing="0" style="background-color: #fffaf0; border-radius: 8px; border: 1px solid #f0e4d7;">
                <tr>
                  <td style="font-weight: bold; color: #4a2c00;">Subject:</td>
                  <td style="color: #4a2c00;">${formData.subject}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold; color: #4a2c00;">Message:</td>
                  <td style="color: #4a2c00;">${formData.message}</td>
                </tr>
                ${formData.phone ? `
                <tr>
                  <td style="font-weight: bold; color: #4a2c00;">Phone:</td>
                  <td style="color: #4a2c00;">${formData.phone}</td>
                </tr>
                ` : ''}
              </table>
              <p style="font-size: 16px; line-height: 1.5; color: #4a2c00; margin: 20px 0;">
                For urgent inquiries, feel free to reach us at <a href="tel:+919876543210" style="color: #d2691e; text-decoration: none; font-weight: bold;">+91 98765 43210</a>.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #8b4513; padding: 20px; text-align: center; color: #ffffff;">
              <p style="font-size: 14px; margin: 0 0 10px;">Best regards,<br><span style="font-weight: bold;">The Tanjore Degree Coffee Team</span></p>
              <p style="font-size: 12px; margin: 0; opacity: 0.8;">
                123 Temple Street, Thanjavur, Tamil Nadu, India - 613001
              </p>
              <div style="margin-top: 15px;">
                <a href="#" style="color: #ffffff; text-decoration: none; margin: 0 10px; opacity: 0.8;">Facebook</a> |
                <a href="#" style="color: #ffffff; text-decoration: none; margin: 0 10px; opacity: 0.8;">Twitter</a> |
                <a href="#" style="color: #ffffff; text-decoration: none; margin: 0 10px; opacity: 0.8;">Instagram</a>
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
});

    if (resendError) {
      console.error('Resend error:', resendError);
      return NextResponse.json({ error: 'Email sending failed', details: resendError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Message sent successfully', emailData: data }, { status: 200 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}