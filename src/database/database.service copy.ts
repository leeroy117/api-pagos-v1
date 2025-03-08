import { Injectable } from '@nestjs/common';
import { Connection, ConnectionOptions, createConnection } from 'mysql2/promise';
import { Client, ClientChannel, ConnectConfig } from 'ssh2';
import * as fs from 'fs';

@Injectable()
export class DatabaseService {
    private sshClient: Client;
    private dbConnection: Connection;
    clientChannel: ClientChannel = Object.create(null) as ClientChannel; 

    // mysqlConfig: ConnectionOptions;
    // sshTunnelConfig: ConnectConfig;
    
    mysqlConfig = {
        user: 'agmoodledev',
        password: '56huaj8*JQ+8*9*25.98pt',
        database: 'escolar',
        port: 3306,
        host: 'databaseag.cu1njaiwfxac.us-east-2.rds.amazonaws.com',
        stream: this.clientChannel,
    }

    sshTunnelConfig = {
        username: 'dtmomejia',
        host: '3.19.4.250',
        port: 22,
        privateKey: fs.readFileSync('./dtmomejia.pem'),
        passphrase: 'u#/vsSy2QWBltvmIxOXIUGVxA6CDghpI6mR3pUoQEUiOGyPXukYVK+qFxDFo',
    };

  constructor() {
    this.sshClient = new Client();

  }

  async onModuleInit() {
    await this.connect();
    // console.log('onmodule init', this.dbConnection);
  }

  async onModuleDestroy() {
    await this.close();
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log('mysqlconfig', this.mysqlConfig);
        console.log('mysqlconfig', this.sshTunnelConfig);
        
      this.sshClient
        .on('ready', () => {
          console.log('🔹 Conexión SSH establecida');
          this.sshClient.forwardOut(
            this.mysqlConfig.host, // Host local del cliente SSH
            8000, // Puerto origen (0 para asignación automática)
            this.mysqlConfig.host, // Host de MySQL en el servidor remoto
            this.mysqlConfig.port, // Puerto de MySQL
            async (err, stream) => {
              if (err) {
                console.error('❌ Error en el túnel SSH:', err);
                reject(err);
                return;
              }

              
              this.mysqlConfig.stream = stream;
              console.log('mysqlconfig2', this.mysqlConfig);
              try {
                this.dbConnection = await createConnection(this.mysqlConfig);
                console.log('✅ Conectado a MySQL con éxito');
                resolve();
              } catch (dbErr) {
                console.error('❌ Error en la conexión MySQL:', dbErr);
                reject(dbErr);
              }
            }
          );
        })
        .connect(this.sshTunnelConfig)
        .on('error', (err) => {
          console.error('❌ Error en la conexión SSH:', err);
          reject(err);
        })
    });
  }


  async query<T = any>(sql: string, params?: any[]): Promise<any> {
    if (!this.dbConnection) {
      throw new Error('❌ No hay conexión a la base de datos');
    }
    const [rows] = await this.dbConnection.execute(sql, params);
    return rows;
  }

  async close(): Promise<void> {
    if (this.dbConnection) {
      await this.dbConnection.end();
      console.log('🔹 Conexión MySQL cerrada');
    }
    if (this.sshClient) {
      this.sshClient.end();
      console.log('🔹 Conexión SSH cerrada');
    }
  }
}
