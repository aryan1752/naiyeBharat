// server.js
import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// In-memory storage (use database in production)
const orders = new Map();
const payments = new Map();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Create order endpoint
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    // Create order options
    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    // Create order
    const order = await razorpay.orders.create(options);

    // Store order details
    orders.set(order.id, {
      ...order,
      status: 'created',
      createdAt: new Date(),
    });

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(999).json({
      success: false,
      message: 'Failed to create order',
      error: error.message,
    });
  }
});

// Verify payment endpoint
app.post('/api/verify-payment', (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing required payment details',
      });
    }

    // Create signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    // Verify signature
    if (razorpay_signature === expectedSign) {
      // Update order status
      const order = orders.get(razorpay_order_id);
      if (order) {
        order.status = 'paid';
        order.payment_id = razorpay_payment_id;
        order.paidAt = new Date();
        orders.set(razorpay_order_id, order);
      }

      // Store payment details
      payments.set(razorpay_payment_id, {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
        status: 'verified',
        verifiedAt: new Date(),
      });

      return res.json({
        success: true,
        message: 'Payment verified successfully',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(999).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
});



// Get order status
app.get('/api/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch from Razorpay
    const order = await razorpay.orders.fetch(orderId);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(999).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message,
    });
  }
});

// Get payment details
app.get('/api/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    // Fetch from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(999).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message,
    });
  }
});

// Send email after payment verification
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, phone, caseType, occupation, address, timeSlot, subject, message, payment_id, order_id } = req.body;
    const resolvedSubject = subject?.trim() || `${caseType} Consultation`;

    // Validate required fields
    if (!name || !email || !phone || !caseType || !occupation || !address || !timeSlot || !message || !payment_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Email to you (admin)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Consultation Request - ${caseType} | ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">📋 New Consultation Request</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1f2937; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Client Information</h2>
            
            <table style="width: 100%; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #4b5563; width: 40%;">👤 Name:</td>
                <td style="padding: 10px; color: #1f2937;">${name}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 10px; font-weight: bold; color: #4b5563;">📧 Email:</td>
                <td style="padding: 10px; color: #1f2937;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #4b5563;">📱 Phone:</td>
                <td style="padding: 10px; color: #1f2937;">${phone}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 10px; font-weight: bold; color: #4b5563;">💼 Occupation:</td>
                <td style="padding: 10px; color: #1f2937;">${occupation}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #4b5563;">🏠 Address:</td>
                <td style="padding: 10px; color: #1f2937;">${address}</td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 10px; font-weight: bold; color: #4b5563;">🕒 Preferred Slot:</td>
                <td style="padding: 10px; color: #1f2937;">${timeSlot}</td>
              </tr>
            </table>

            <h2 style="color: #1f2937; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-top: 30px;">Case Details</h2>
            
            <table style="width: 100%; margin: 20px 0;">
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #4b5563; width: 40%;">⚖️ Case Type:</td>
                <td style="padding: 10px; color: #1f2937;"><strong>${caseType}</strong></td>
              </tr>
              <tr style="background-color: #f3f4f6;">
                <td style="padding: 10px; font-weight: bold; color: #4b5563;">📋 Subject:</td>
                <td style="padding: 10px; color: #1f2937;">${resolvedSubject}</td>
              </tr>
            </table>

            <div style="margin: 20px 0; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
              <p style="margin: 0; font-weight: bold; color: #4b5563;">💬 Message:</p>
              <p style="margin: 10px 0 0 0; color: #1f2937; line-height: 1.6;">${message}</p>
            </div>

            <h2 style="color: #1f2937; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-top: 30px;">💳 Payment Confirmation</h2>
            
            <table style="width: 100%; margin: 20px 0; background-color: #d1fae5; border-radius: 8px;">
              <tr>
                <td style="padding: 15px; font-weight: bold; color: #065f46; width: 40%;">Payment ID:</td>
                <td style="padding: 15px; color: #065f46;">${payment_id}</td>
              </tr>
              <tr>
                <td style="padding: 15px; font-weight: bold; color: #065f46;">Order ID:</td>
                <td style="padding: 15px; color: #065f46;">${order_id}</td>
              </tr>
              <tr>
                <td style="padding: 15px; font-weight: bold; color: #065f46;">Amount:</td>
                <td style="padding: 15px; color: #065f46; font-size: 18px;"><strong>₹999</strong></td>
              </tr>
              <tr>
                <td style="padding: 15px; font-weight: bold; color: #065f46;">Status:</td>
                <td style="padding: 15px; color: #065f46;"><span style="background-color: #10b981; color: white; padding: 5px 15px; border-radius: 20px;">✓ PAID</span></td>
              </tr>
            </table>

            <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 14px;">
                <strong>Action Required:</strong> Please respond to this client within 24 hours
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
            <p>This is an automated notification from Nyay Bharat Legal Services</p>
            <p>Received on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
      `,
    };

    // Confirmation email to user
    const confirmationEmail = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ Payment Successful - Consultation Request Received | Nyay Bharat',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">✅ Payment Successful!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your consultation request has been received</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <p style="color: #1f2937; font-size: 16px; line-height: 1.6;">Dear <strong>${name}</strong>,</p>
            
            <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
              Thank you for choosing <strong>Nyay Bharat Legal Services</strong>! 🙏
            </p>

            <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
              We have successfully received your consultation request and payment. Our legal experts will review your case and contact you shortly.
            </p>

            <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin: 0 0 15px 0; font-size: 18px;">💳 Payment Details</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #065f46; font-weight: bold;">Payment ID:</td>
                  <td style="padding: 8px 0; color: #065f46;">${payment_id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #065f46; font-weight: bold;">Amount Paid:</td>
                  <td style="padding: 8px 0; color: #065f46; font-size: 20px;"><strong>₹999</strong></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #065f46; font-weight: bold;">Status:</td>
                  <td style="padding: 8px 0; color: #065f46;"><span style="background-color: #10b981; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px;">✓ Successful</span></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #065f46; font-weight: bold;">Date & Time:</td>
                  <td style="padding: 8px 0; color: #065f46;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6;">
              <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">📋 Your Submission Details</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 8px 0; color: #1e40af; font-weight: bold;">Case Type:</td>
                  <td style="padding: 8px 0; color: #1e40af;">${caseType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #1e40af; font-weight: bold;">Subject:</td>
                  <td style="padding: 8px 0; color: #1e40af;">${resolvedSubject}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #1e40af; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px 0; color: #1e40af;">${phone}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #1e40af; font-weight: bold;">Occupation:</td>
                  <td style="padding: 8px 0; color: #1e40af;">${occupation}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #1e40af; font-weight: bold;">Address:</td>
                  <td style="padding: 8px 0; color: #1e40af;">${address}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #1e40af; font-weight: bold;">Preferred Slot:</td>
                  <td style="padding: 8px 0; color: #1e40af;">${timeSlot}</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin: 0 0 10px 0; font-size: 18px;">⏱️ What Happens Next?</h3>
              <ul style="color: #92400e; margin: 10px 0; padding-left: 20px; line-height: 1.8;">
                <li>Our legal team will review your case within 24 hours</li>
                <li>You'll receive a call or email with next steps</li>
                <li>We'll schedule a detailed consultation</li>
              </ul>
            </div>

            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h3 style="color: white; margin: 0 0 15px 0; font-size: 20px;">📞 Need Immediate Assistance?</h3>
              <p style="color: white; margin: 10px 0; font-size: 16px;">
                <strong>Call us at:</strong><br>
                +91 7011684582<br>
                +91 9643642462
              </p>
              <p style="color: white; margin: 10px 0; font-size: 16px;">
                <strong>Email:</strong> naiyebharat@gmail.com
              </p>
              <p style="color: white; margin: 10px 0; font-size: 14px;">
                <strong>Address:</strong><br>
                Chamber No. 701, Saket District Court, New Delhi
              </p>
            </div>

            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px;">
              This is an automated confirmation email. Please do not reply to this email. For any queries, please contact us using the details above.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

            <p style="color: #1f2937; font-size: 15px;">
              Best regards,<br>
              <strong style="color: #667eea;">Nyay Bharat Legal Services</strong>
            </p>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2025 Nyay Bharat Legal Services. All rights reserved.</p>
            <p>You received this email because you submitted a consultation request on our website.</p>
          </div>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(confirmationEmail);

    // Send WhatsApp message to admin
    await sendWhatsAppMessage(name, phone, caseType, occupation, address, timeSlot, resolvedSubject, message, payment_id);

    // Send WhatsApp confirmation to client
    await sendClientWhatsAppConfirmation(name, phone, payment_id);

    res.json({
      success: true,
      message: 'Email and WhatsApp notifications sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(999).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
});

// Function to send WhatsApp message using Twilio
async function sendWhatsAppMessage(name, phone, caseType, occupation, address, timeSlot, subject, message, payment_id) {
  try {
    // Format WhatsApp message
    const whatsappMessage = `
🔔 *New Legal Consultation Request*

👤 *Name:* ${name}
📱 *Phone:* ${phone}
⚖️ *Case Type:* ${caseType}
💼 *Occupation:* ${occupation}
🏠 *Address:* ${address}
🕒 *Preferred Slot:* ${timeSlot}
📋 *Subject:* ${subject}

💬 *Message:*
${message}

💳 *Payment Details:*
Payment ID: ${payment_id}
Amount: ₹999 ✓ Paid

---
This is an automated notification.
    `.trim();

    // Option 1: Using Twilio WhatsApp API
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const twilio = await import('twilio');
      const client = twilio.default(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:+91${process.env.ADMIN_WHATSAPP}`,
        body: whatsappMessage,
      });

      console.log('WhatsApp message sent via Twilio');
    }
    // Option 2: Using WhatsApp Business API (if configured)
    else if (process.env.WHATSAPP_API_URL && process.env.WHATSAPP_API_TOKEN) {
      const response = await fetch(process.env.WHATSAPP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: process.env.ADMIN_WHATSAPP,
          type: 'text',
          text: {
            body: whatsappMessage,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('WhatsApp API request failed');
      }

      console.log('WhatsApp message sent via Business API');
    }
    // Option 3: Log to console if no WhatsApp service configured
    else {
      console.log('WhatsApp message (no service configured):');
      console.log(whatsappMessage);
      console.log('\nTo enable WhatsApp notifications, configure either:');
      console.log('1. Twilio: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER');
      console.log('2. WhatsApp Business API: WHATSAPP_API_URL, WHATSAPP_API_TOKEN');
    }
  } catch (error) {
    console.error('WhatsApp sending error:', error.message);
    // Don't throw error - let email succeed even if WhatsApp fails
  }
}

// Function to send WhatsApp confirmation to client
async function sendClientWhatsAppConfirmation(name, phone, payment_id) {
  try {
    const confirmationMessage = `
✅ *Payment Confirmation*

Dear ${name},

Thank you for contacting Nyay Bharat! 🙏

Your payment has been successfully received.

💳 *Payment Details:*
Payment ID: ${payment_id}
Amount: ₹999
Status: ✓ Successful

We have received your consultation request and will get back to you shortly.

📞 For urgent queries, call:
+91 7011684582
+91 9643642462

Best regards,
*Nyay Bharat Legal Services*
    `.trim();

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      const twilio = await import('twilio');
      const client = twilio.default(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
        to: `whatsapp:+91${phone}`,
        body: confirmationMessage,
      });

      console.log('Client WhatsApp confirmation sent');
    } else if (process.env.WHATSAPP_API_URL && process.env.WHATSAPP_API_TOKEN) {
      const response = await fetch(process.env.WHATSAPP_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: `91${phone}`,
          type: 'text',
          text: {
            body: confirmationMessage,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Client WhatsApp API request failed');
      }

      console.log('Client WhatsApp confirmation sent via Business API');
    } else {
      console.log('Client WhatsApp confirmation (no service configured):');
      console.log(confirmationMessage);
    }
  } catch (error) {
    console.error('Client WhatsApp sending error:', error.message);
  }
}





// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(999).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});