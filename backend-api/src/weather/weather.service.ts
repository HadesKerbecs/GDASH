import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { WeatherLog, WeatherInsight } from './weather.schema';
import * as ExcelJS from 'exceljs';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(
    @InjectModel(WeatherLog.name)
    private readonly weatherModel: Model<WeatherLog>,
    @InjectModel(WeatherInsight.name)
    private readonly insightModel: Model<WeatherInsight>,
  ) { }

  // ---------- LOGS BÁSICOS ----------

  async createLog(data: any) {
    const created = await this.weatherModel.create(data);

    // Recalcula insights sempre que chega dado novo
    await this.recomputeInsightsAndSave();

    return created;
  }

  async findAll() {
    return this.weatherModel.find().sort({ timestamp: -1 }).exec();
  }

  // ---------- EXPORT CSV ----------

  async exportCsv(): Promise<string> {
    const logs = await this.weatherModel.find().sort({ timestamp: -1 }).lean();

    if (logs.length === 0) {
      return 'Nenhum dado disponível';
    }

    const headers = Object.keys(logs[0]).filter(k => k !== '__v');
    const rows = logs.map(record => {
      return Object.keys(record)
        .filter(k => k !== '__v')
        .map(key => {
          const value = record[key];
          if (value === null || value === undefined) return '';
          return String(value).replace(/,/g, '');
        })
        .join(',');
    });

    return headers.join(',') + '\n' + rows.join('\n');
  }

  // ---------- EXPORT XLSX ----------

  async exportXlsx(): Promise<Buffer> {
    const logs = await this.weatherModel.find().sort({ timestamp: -1 }).lean();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Weather Logs');

    if (logs.length === 0) {
      sheet.addRow(['Nenhum dado disponível']);
    } else {
      const headers = Object.keys(logs[0]).filter(k => k !== '__v');
      sheet.addRow(headers);

      logs.forEach(record => {
        const row = headers.map(key => record[key] ?? '');
        sheet.addRow(row);
      });
    }

    const arrayBuffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(arrayBuffer);
  }

  // ---------- INSIGHTS: PONTO CENTRAL ----------

  // Usado pelo controller (GET/POST /insights)
  async generateInsights() {
    // pega último insight salvo
    const last = await this.insightModel.findOne().sort({ updatedAt: -1 }).lean();

    // se existe e já tem cidade -> retorna normal
    if (last && last.cidade) {
      return last;
    }

    // se existe mas NÃO tem cidade -> corrige e salva
    if (last && !last.cidade) {
      const updated = await this.insightModel.findOneAndUpdate(
        { _id: last._id },
        { $set: { cidade: "Alvorada - TO" } },
        { new: true }
      ).lean();

      return updated;
    }

    // se não existe -> recalcula tudo
    return this.recomputeInsightsAndSave();
  }


  // Recalcula a partir dos logs e grava no MongoDB
  async recomputeInsightsAndSave() {
    const logs = await this.weatherModel.find().sort({ timestamp: 1 }).lean();

    if (logs.length === 0) {
      this.logger.warn('Sem dados para calcular insights.');
      return this.insightModel.findOneAndUpdate(
        {},
        { totalRecords: 0, data: { message: 'Nenhum dado disponível.' } },
        { upsert: true, new: true },
      );
    }

    const data = this.computeInsightsFromLogs(logs);
    const totalRecords = logs.length;

    const saved = await this.insightModel.findOneAndUpdate(
      {},
      {
        cidade: "Alvorada - TO",
        totalRecords,
        data,
      },
      { upsert: true, new: true },
    );


    this.logger.log('Insights recalculados e salvos.');
    return saved;
  }

  // LÓGICA DE INSIGHTS AVANÇADOS
  private computeInsightsFromLogs(logs: any[]) {
    const temps = logs.map(l => l.temperature_c).filter((v: any) => v !== null && v !== undefined);
    const hums = logs.map(l => l.humidity).filter((v: any) => v !== null && v !== undefined);
    const winds = logs.map(l => l.wind_speed_m_s).filter((v: any) => v !== null && v !== undefined);
    const rains = logs.map(l => l.precipitation_probability).filter((v: any) => v !== null && v !== undefined);

    const avg = (arr: number[]) =>
      arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

    const tempAvg = avg(temps);
    const humAvg = avg(hums);
    const windAvg = avg(winds);
    const rainMax = rains.length ? Math.max(...rains) : null;

    // Tendência da temperatura (simples: compara primeiro e último)
    let tendencia = 'estável';
    if (temps.length > 2) {
      const first = temps[0];
      const last = temps[temps.length - 1];
      if (last > first + 1) tendencia = 'subindo';
      else if (last < first - 1) tendencia = 'caindo';
    }

    // Classificação de "tipo de dia"
    let classificacao = 'indefinido';
    if (tempAvg !== null) {
      if (tempAvg < 18) classificacao = 'frio';
      else if (tempAvg >= 18 && tempAvg <= 27) classificacao = 'agradável';
      else classificacao = 'quente';
    }

    // Score de conforto (0–100)
    let conforto = 100;

    if (tempAvg !== null) {
      if (tempAvg < 18) conforto -= (18 - tempAvg) * 2;
      if (tempAvg > 27) conforto -= (tempAvg - 27) * 2;
    }

    if (humAvg !== null && humAvg > 70) {
      conforto -= (humAvg - 70) * 0.5;
    }

    if (windAvg !== null && windAvg > 10) {
      conforto -= (windAvg - 10) * 1.5;
    }

    if (rainMax !== null && rainMax > 50) {
      conforto -= (rainMax - 50) * 0.5;
    }

    if (conforto < 0) conforto = 0;
    if (conforto > 100) conforto = 100;

    // Alertas
    const alertas: string[] = [];

    if (tempAvg !== null && tempAvg >= 32) {
      alertas.push('Calor intenso (média acima de 32°C).');
    }

    if (tempAvg !== null && tempAvg <= 12) {
      alertas.push('Frio intenso (média abaixo de 12°C).');
    }

    if (rainMax !== null && rainMax >= 70) {
      alertas.push('Alta chance de chuva (probabilidade >= 70%).');
    }

    if (humAvg !== null && humAvg >= 85) {
      alertas.push('Umidade muito alta (>= 85%).');
    }

    // Resumo em texto (sem IA externa, mas descritivo)
    const resumoPartes: string[] = [];

    if (tempAvg !== null) {
      resumoPartes.push(`Temperatura média de ${tempAvg.toFixed(1)}°C (${classificacao}).`);
    }

    if (humAvg !== null) {
      resumoPartes.push(`Umidade média em ${humAvg.toFixed(1)}%.`);
    }

    if (windAvg !== null) {
      resumoPartes.push(`Vento médio em ${windAvg.toFixed(1)} m/s.`);
    }

    if (rainMax !== null) {
      resumoPartes.push(`Maior probabilidade de chuva registrada: ${rainMax}%.`);
    }

    resumoPartes.push(`Tendência de temperatura: ${tendencia}.`);
    resumoPartes.push(`Índice de conforto climático: ${conforto.toFixed(0)}/100.`);

    if (alertas.length) {
      resumoPartes.push('Alertas: ' + alertas.join(' '));
    }

    const resumo = resumoPartes.join(' ');

    return {
      media_temperatura: tempAvg !== null ? Number(tempAvg.toFixed(2)) : null,
      media_umidade: humAvg !== null ? Number(humAvg.toFixed(2)) : null,
      media_velocidade_vento: windAvg !== null ? Number(windAvg.toFixed(2)) : null,
      maior_probabilidade_chuva: rainMax,
      tendencia_temperatura: tendencia,
      classificacao_climatica: classificacao,
      conforto_climatico: Number(conforto.toFixed(0)),
      alertas,
      resumo,
    };
  }

  // ---------- CRON: REGERAR INSIGHTS PERIODICAMENTE ----------

  @Cron(CronExpression.EVERY_HOUR)
  async cronRecomputeInsights() {
    this.logger.log('Cron: Recalculando insights de clima...');
    await this.recomputeInsightsAndSave();
  }
}