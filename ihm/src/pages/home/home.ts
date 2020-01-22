import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import apexcharts from 'apexcharts';
import { HttpClientProvider } from '../../http-client/http-client';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  graphTemp
  graphHum
  
  currentTemp
  currentHum
  
  switch = true
  
  constructor(public navCtrl: NavController, public http : HttpClientProvider) {
    this.refresh()
    setInterval(()=>{this.refresh()},500)
  }
  
  refresh(){
    // console.log("refresh")
    
    // this.createGraph()
    this.refreshGraphs()
  }
  refreshGraphs(){
    console.log("data")
    this.http.getData("temerature", 3600000 ).then(data=>{
      this.currentTemp = data[0].data
      let values = []
      data.forEach(element =>{
        values.push([element.date,element.data])
      })
      if(this.graphTemp !== undefined){
        this.reloadSerie(values,'graphTemp','temperature')
      }else{
        this.createGraph(values,'graphTemp','temperature')
      }
    })
    this.http.getData("humidite", 3600000 ).then(data=>{
      this.currentHum = data[0].data
      let values = []
      data.forEach(element =>{
        values.push([element.date,element.data])
      })
      if(this.graphHum !== undefined){
        this.reloadSerie(values,'graphHum','humidite')
      }else{
        this.createGraph(values,'graphHum','humidite')
      }
    })
    this.http.getLastData("switch" ).then(data=>{
      this.switch = (data[0].data != 0) 
    })
  }
  
  reloadSerie(value,id,name){
    this[id].updateSeries([{name:name,data:value}])
  }
  
  async createGraph(values,id,name) {
    
    while(document.querySelector("#"+id)==undefined){
      await this.promiseTimeout()
    }
    var options = {
      stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,
        width: 2,
        dashArray: 0,      
      },
      chart: {
        animations:{
          enabled:false
        },
        type: 'line',
        stacked: false,
        height: 200,
        // zoom: {
        //   type: 'x',
        //   enabled: true,
        //   autoScaleYaxis: true
        // },
        toolbar: {
          autoSelected: 'zoom',
          tools:{
            pan:false
          }
        },
        
      },
      dataLabels: {
        enabled: false
      },
      series: [{
        name: name,
        data: values
      }
    ],
    markers: {
      size: 5,
    },
    title: {
      text: name,
      align: 'left'
    },
    yaxis: {
      //min: 0,
      //max: 100,
      labels: {
        formatter: function (val) {
          return val.toFixed(1);
        },
      },
      title: {
        text: name
      },
    },
    xaxis: {
      type: 'datetime',
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(1)
        }
      }
    },
    colors: [ "#0000ff","#00ff00", "#ff0000"],
  }
  
  //options.yaxis.min  = data["display_median"] - data["display_range"]
  //options.yaxis.max = data["display_median"] + data["display_range"] 
  // options.series[0].data = data["temperatures"]
  
  this[id] = new apexcharts(document.querySelector("#"+id), options);
  this[id].render();
  
  
}

promiseTimeout(){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve()
    },500)
  })
}


}
