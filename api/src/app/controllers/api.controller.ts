import { Get, HttpResponseOK, Post, Options } from '@foal/core';
import { getConnection, getRepository } from 'typeorm';
import { Data } from '../entities';

export class ApiController {


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
}
