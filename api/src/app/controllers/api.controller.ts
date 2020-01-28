import { Get, HttpResponseOK, Post, Options, dependency } from '@foal/core';
import { getConnection, getRepository } from 'typeorm';
import { Data, Config } from '../entities';
import { SocketHandler } from '../services';
import { get } from 'http';

export class ApiController {
  @dependency
  socket : SocketHandler
  constructor(){
    // this.socket = new SocketHandler()
  }
  @Options('/*')  
  returnGraphOption(){
    let response = new HttpResponseOK("ok");
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    return response
  }
  
  @Get('/')
  index(ctx) {
    return new HttpResponseOK('Hello world!');
  }
  
  @Post('/data')
  async data(ctx){
    let device = ctx.request.body.device_name
    let debut = new Date(new Date().getTime() - ctx.request.body.graphTime)
    let fin = new Date()
    
    const datas = await getConnection().query(`
    SELECT "data", "date" FROM data WHERE "deviceName" = $1 AND date BETWEEN $2 AND $3 ORDER BY "date" DESC`
    , [ device, debut, fin]
    );
    
    let resp = new HttpResponseOK(datas)
    resp.setHeader('Access-Control-Allow-Origin', '*');
    return resp
  }
  @Post('/lastValue')
  async lastValue(ctx){
    let device = ctx.request.body.device_name
    
    
    const datas = await getConnection().query(`
    SELECT "data"."data" AS "data" FROM data AS data WHERE data."deviceName" = $1 ORDER BY "data"."date" DESC LIMIT 1`
    , [ device]
    );
    
    let resp = new HttpResponseOK(datas)
    resp.setHeader('Access-Control-Allow-Origin', '*');
    return resp
  }
  
  @Post('/send')
  async send(ctx){
    let payload = ctx.request.body.payload
    console.log(payload)
    let count = payload.length
    for (let index = 0; index < payload.length; index++) {
      const element = payload[index];
      let data = new Data()
      data.deviceName = element.name
      data.data = element.data
      data.date = new Date()
      console.log(data)
      let result = await getRepository(Data).save(data);
      if(result){
        count --
      }
    }
    
    let resp = new HttpResponseOK()
    resp.setHeader('Access-Control-Allow-Origin', '*');
    return resp
  }
  
  @Post("/vibrate")
  vibrate(ctx){
    console.log(ctx.request.body.msg)
    this.socket.sendMessage(ctx.request.body.msg)
    return new HttpResponseOK("ok")
  }
  
  @Post("/config")
  async config(ctx){
    // let result = await getConnection().query(`
    // SELECT DISTINCT ON (key) *
    // FROM  (
    //   SELECT *
    //   FROM   config
    //   ORDER  BY id DESC 
    
    //   ) p
    //   `)
    //   // let result = await getConnection().query(`SELECT DISTINCT ON (conpig.key) conpig.key,conpig.value,conpig.id FROM Config as conpig INNER JOIN Config as conf on conpig.id = conf.id ORDER BY conf.id DESC `)
    //   let plop = ctx.request.body
    
    //   for(let element in plop){
    //     let conf = new Config()
    //     conf.key = element
    //     conf.value = JSON.stringify(plop[element])
    //     await getRepository(Config).save(conf)
    //   }
    
    let result = await getConnection().query(`SELECT * FROM config ORDER BY id DESC LIMIT 1`)
    console.log(ctx.request.body) 
    if(!(Object.keys(ctx.request.body).length ===0)){
      console.log("yolo")
      let conf = new Config()
      conf.key = "conf"
      conf.value = JSON.stringify(ctx.request.body) 
      await getRepository(Config).save(conf)
    }
    
    console.log(result)
    let resp = new HttpResponseOK(result)
    resp.setHeader('Access-Control-Allow-Origin', '*');
    return resp
    
  }
}
