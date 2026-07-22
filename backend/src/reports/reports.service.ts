import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepository: Repository<OrderItem>,
  ) {}

  async getSalesSummary(range: string = 'daily') {
    const since = new Date();
    if (range === 'weekly') {
      since.setDate(since.getDate() - 7);
    } else {
      since.setHours(0, 0, 0, 0);
    }

    const { totalOrders, totalRevenue } = await this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(order.id)', 'totalOrders')
      .addSelect('COALESCE(SUM(order.totalPrice), 0)', 'totalRevenue')
      .where('order.createdAt >= :since', { since })
      .getRawOne();

    return {
      range,
      since,
      totalOrders: Number(totalOrders),
      totalRevenue: Number(totalRevenue),
    };
  }

  async getBestSellers(limit: number = 5) {
    const rows = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoin('orderItem.menuItem', 'menuItem')
      .select('menuItem.id', 'menuItemId')
      .addSelect('menuItem.name', 'name')
      .addSelect('SUM(orderItem.quantity)', 'totalSold')
      .groupBy('menuItem.id')
      .addGroupBy('menuItem.name')
      .orderBy('"totalSold"', 'DESC')
      .limit(limit)
      .getRawMany();

    return rows.map((row) => ({
      menuItemId: row.menuItemId,
      name: row.name,
      totalSold: Number(row.totalSold),
    }));
  }
}
