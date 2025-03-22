import { Injectable } from "@nestjs/common";
import { Connection, ConnectionOptions, createConnection } from "mysql2/promise";
import { Client, ClientChannel, ConnectConfig } from "ssh2";
import * as fs from 'fs';

type TConnection = {
    mysqlConnection: Connection,
    sshConnection: Client
};


@Injectable()
export class DatabaseService {

    dbConnection: Connection;
    sshClient: Client

    async onModuleInit() {
        [this.dbConnection, this.sshClient]= await this.getConnection();
        console.log('module initialized');
    }

    async onModuleDestroy() {
        // this.dbConnection = await this.getConnection();
        await this.close();
        console.log('module closed');
    }

    getConnection() : Promise<any>  {

        let clientChannel:ClientChannel = Object.create(null) as ClientChannel; 

        let mysqlConfig = {
            user: 'agmoodledev',
            password: '56huaj8*JQ+8*9*25.98pt',
            database: 'escolar',
            port: 3306,
            stream: clientChannel,
            host: 'databaseag.cu1njaiwfxac.us-east-2.rds.amazonaws.com'
            // multipleStatements: true
        };
    
        let sshTunnelConfig = {
            username: 'dtmomejia',
            host: '3.19.4.250',
            port: 22,
            privateKey: fs.readFileSync('./dtmomejia.pem'),
            passphrase: 'u#/vsSy2QWBltvmIxOXIUGVxA6CDghpI6mR3pUoQEUiOGyPXukYVK+qFxDFo',
            keepaliveInterval: 15000,
            keepaliveCountMax: 10  
        };
    
        return new Promise( (resolve, reject) => {
            const ssh = new Client();
            try {
            ssh.on('ready',function () {
                ssh.forwardOut(
                    mysqlConfig.host,
                    8000,
                    mysqlConfig.host,
                // 9876,
                    mysqlConfig.port,
                    async function (err, stream){
                        
                        if (err){reject(err)} ;
                        
                        try {
                            mysqlConfig.stream = stream;
                            
                            const connection = await createConnection(mysqlConfig);
                            
                            resolve([
                                connection, 
                                ssh
                            ]);
                            
                        } catch (error) {
                            reject(error);
                        }
            
                    }
                )
            })
                .connect(sshTunnelConfig);
            } catch (error) {
                reject(error)
            }
    
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