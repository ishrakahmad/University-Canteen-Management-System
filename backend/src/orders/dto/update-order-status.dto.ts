import { IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message: 'Status must be pending, preparing, ready, or completed',
  })
  status!: OrderStatus;
}
