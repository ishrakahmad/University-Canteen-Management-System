import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Menu } from '../menu/menu.entity';
import { MailService } from '../mail/mail.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
    private mailService: MailService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: any) {
    let totalPrice = 0;
    const orderItems: OrderItem[] = [];

    for (const itemDto of createOrderDto.items) {
      const menuItem = await this.menuRepository.findOne({
        where: { id: itemDto.menuItemId },
      });
      if (!menuItem)
        throw new NotFoundException(`Item ${itemDto.menuItemId} not found`);

      const orderItem = new OrderItem();
      orderItem.menuItem = menuItem;
      orderItem.quantity = itemDto.quantity;
      orderItem.unitPrice = menuItem.price;

      totalPrice += menuItem.price * itemDto.quantity;
      orderItems.push(orderItem);
    }

    const order = this.orderRepository.create({
      customer: { id: user.userId },
      totalPrice,
      items: orderItems,
      pickupTime: createOrderDto.pickupTime,
    });

    // 1. Save the order to the database
    const savedOrder = await this.orderRepository.save(order);

    // 2. NEW FIX: Fetch the order back from the DB to securely grab the real Customer Name
    const fullOrderDetails = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['customer'],
    });

    const emailItems = orderItems.map((item) => ({
      name: item.menuItem.name,
      quantity: item.quantity,
      price: (item.unitPrice * item.quantity).toFixed(2),
    }));

    // 3. Send the email using the database-verified name
    this.mailService
      .sendOrderConfirmation(
        user.email,
        fullOrderDetails?.customer?.fullName || 'Student', // Pulls your real name!
        savedOrder.id,
        totalPrice,
        emailItems,
        savedOrder.pickupTime,
      )
      .catch((err) => console.error('Failed to send order email:', err));

    return savedOrder;
  }

  async findAllOrders() {
    return this.orderRepository.find({
      relations: ['customer', 'items', 'items.menuItem'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(id: number, status: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!order) throw new NotFoundException(`Order #${id} not found`);

    order.status = status as any;
    const updatedOrder = await this.orderRepository.save(order);

    this.mailService
      .sendOrderStatusUpdate(
        order.customer.email,
        order.customer.fullName || 'Customer', 
        order.id,
        status,
      )
      .catch((err) => console.error('Failed to send status email:', err));

    return updatedOrder;
  }
}