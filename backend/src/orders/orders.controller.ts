import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Get,
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtGuard)
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.ordersService.createOrder(createOrderDto, req.user);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.ordersService.findAllOrders();
  }

  @UseGuards(JwtGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(
      +id,
      updateOrderStatusDto.status,
    );
  }
}
