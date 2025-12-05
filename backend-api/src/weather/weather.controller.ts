import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { WeatherService } from './weather.service';

@Controller('api/weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Post('logs')
  createLog(@Body() body: any) {
    return this.weatherService.createLog(body);
  }

  @Get('logs')
  findAll() {
    return this.weatherService.findAll();
  }

  @Get('export.csv')
  async exportCsv(@Res() res: Response) {
    const csv = await this.weatherService.exportCsv();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="weather_logs.csv"');

    return res.send(csv);
  }

  @Get('export.xlsx')
  async exportXlsx(@Res() res: Response) {
    const buffer = await this.weatherService.exportXlsx();

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="weather_logs.xlsx"',
    );

    return res.send(buffer);
  }

  @Get('insights')
  getInsights() {
    return this.weatherService.generateInsights();
  }

  @Post('insights')
  postInsights() {
    return this.weatherService.generateInsights();
  }
}
