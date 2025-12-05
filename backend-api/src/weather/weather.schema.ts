import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class WeatherLog extends Document {
  @Prop() source: string;
  @Prop() city: string;
  @Prop() latitude: number;
  @Prop() longitude: number;
  @Prop() timestamp: Date;

  @Prop() temperature_c: number;
  @Prop() humidity: number;
  @Prop() wind_speed_m_s: number;
  @Prop() weather_code: number;
  @Prop() precipitation_probability: number;
  @Prop() weather_description: string;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);

@Schema({ timestamps: true })
export class WeatherInsight extends Document {
  @Prop() cidade: string;
  
  @Prop() totalRecords: number;

  @Prop({ type: Object })
  data: any;
}

export const WeatherInsightSchema = SchemaFactory.createForClass(WeatherInsight);
