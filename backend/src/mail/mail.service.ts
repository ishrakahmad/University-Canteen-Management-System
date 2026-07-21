import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to the University Canteen!',
      template: './welcome', 
      context: {
        name: name,
      },
    });
  }

  async sendOrderConfirmation(
    email: string,
    name: string,
    orderId: number,
    total: number,
    items: any[],
    pickupTime?: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Order Confirmation - #${orderId}`,
      template: './order-confirmation',
      context: {
        customerName: name,
        orderId: orderId,
        totalPrice: total.toFixed(2),
        items: items,
        pickupTime: pickupTime || 'Not specified',
      },
    });
  }

  async sendPasswordResetEmail(email: string, name: string, resetLink: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request - University Canteen',
      // We are using raw HTML here so you don't have to build a whole new template file!
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Reset Your Password</h2>
          <p>Hi ${name},</p>
          <p>You requested to reset your password. Click the secure button below to choose a new one:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">Reset Password</a>
          <p style="color: #666; font-size: 12px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
  }

  async sendOrderStatusUpdate(
    email: string,
    name: string,
    orderId: number,
    status: string,
  ) {
    await this.mailerService.sendMail({
      to: email,
      subject: `Your Order is ${status.toUpperCase()} - #${orderId}`, 
      template: './order-status',
      context: {
        customerName: name,
        orderId: orderId,
        status: status,
      },
    });
  }
}
