import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
    console.log(">>>>>>>>>>>> EmailService constructor called");
  }

  private initializeTransporter() {
    // For development, use Gmail or a test service
    const isDevelopment = this.configService.get('NODE_ENV') === 'development';
    
    // Debug: Log email configuration
    console.log('Email config:', {
      user: this.configService.get('EMAIL_USER'),
      pass: this.configService.get('EMAIL_PASSWORD') ? 'SET' : 'NOT SET',
      from: this.configService.get('EMAIL_FROM'),
    });
    console.log(">>>>>>>>>>>> this.configService.get('NODE_ENV')", this.configService.get('NODE_ENV'));
    if (isDevelopment) {
        console.log(">>>>>>>>>>>> isDevelopment", isDevelopment);
        console.log(">>>>>>>>>>>> this.configService.get('EMAIL_USER')", this.configService.get('EMAIL_USER'));
        console.log(">>>>>>>>>>>> this.configService.get('EMAIL_PASSWORD')", this.configService.get('EMAIL_PASSWORD'));
        console.log(">>>>>>>>>>>> this.configService.get('EMAIL_FROM')", this.configService.get('EMAIL_FROM'));
      // Use Gmail for development (you'll need to set up app password)
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: this.configService.get('EMAIL_USER'),
          pass: this.configService.get('EMAIL_PASSWORD'), // App password, not regular password
        },
      });
    } else {
      // For production, use your SMTP settings
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('SMTP_HOST'),
        port: this.configService.get('SMTP_PORT'),
        secure: true,
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASSWORD'),
        },
      });
    }
  }

  async sendVerificationEmail(email: string, token: string, fullName: string): Promise<void> {
    console.log(">>>>>>>>>>>> sendVerificationEmail called");
    
    // Initialize transporter if not already done
    if (!this.transporter) {
      console.log(">>>>>>>>>>>> Initializing transporter");
      this.initializeTransporter();
    }
    
    const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;
    console.log(">>>>>>>>>>>> configService.get('EMAIL_FROM')", this.configService.get('EMAIL_FROM'));
    console.log(">>>>>>>>>>>> configService.get('EMAIL_USER')", this.configService.get('EMAIL_USER'));
    console.log(">>>>>>>>>>>> configService.get('EMAIL_PASSWORD')", this.configService.get('EMAIL_PASSWORD') ? 'SET' : 'NOT SET');
    
    const mailOptions = {
      // 'Sender Name <sender@server.com>'
      from: `AI Proposal Writer <${this.configService.get('EMAIL_FROM') || 'noreply@aiproposal.com'}>`,
      to: email,
      subject: 'Verify Your Email - AI Proposal Writer',
      html: this.getVerificationEmailTemplate(fullName, verificationUrl),
    };
    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}:`, error);
      throw new Error('Failed to send verification email');
    }
  }

  private getVerificationEmailTemplate(username: string, verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to AI Proposal Writer!</h1>
          </div>
          <div class="content">
            <h2>Hi ${username},</h2>
            <p>Thank you for registering with AI Proposal Writer. To complete your registration, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button" style="color: white;">Verify Email Address</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>
            <p>This link will expire in 24 hours for security reasons.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 AI Proposal Writer. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendPasswordResetEmail(email: string, token: string, username: string): Promise<void> {
    // Initialize transporter if not already done
    if (!this.transporter) {
      this.initializeTransporter();
    }
    
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: this.configService.get('EMAIL_FROM') || 'noreply@aiproposal.com',
      to: email,
      subject: 'Reset Your Password - AI Proposal Writer',
      html: this.getPasswordResetEmailTemplate(username, resetUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}:`, error);
      throw new Error('Failed to send password reset email');
    }
  }

  private getPasswordResetEmailTemplate(username: string, resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 12px 24px; background: #dc3545; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hi ${username},</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #dc3545;">${resetUrl}</p>
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you didn't request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 AI Proposal Writer. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
} 