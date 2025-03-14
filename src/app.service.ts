import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { Client, ClientChannel } from 'ssh2';
import * as fs from 'fs';
import { createConnection } from 'mysql2/promise';

@Injectable()
export class AppService {

  constructor(private readonly databaseService: DatabaseService) {

  }

  // async onModuleInit() {
  //   await this.databaseService.connect();
  // }

  // async onModuleDestroy() {
  //   await this.databaseService.close();
  // }

  checkStatus() : Promise<any>  {
  
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

                              await connection.query('SELECT 1');
                              await connection.end();
                              
                              resolve({ status: 'up' });
                              
                          } catch (error) {
                              reject(error);
                          }
              
                      }
                  )
              })
                .on('error', (err) => {
                  reject({ status: 'down', message: err.message })
                })
                .connect(sshTunnelConfig);
              } catch (error) {
                  // reject(error)
                  return { status: 'down', message: error.message };
              }
      
          });
      }
}
