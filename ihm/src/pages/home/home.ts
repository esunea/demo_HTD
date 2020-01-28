import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import apexcharts from 'apexcharts';
import { HttpClientProvider } from '../../http-client/http-client';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  barUS
  baseHeight=200
  // graphTemp
  graphHum
  tool = false
  // currentTemp
  // currentHum
  conf = {
    dataScale:{
      a:-.35,
      b:189,
      inv:false
    },
    USscale:{
      a:1,
      b:0
    },
    refresh:500,
    sampleSize:3600000,
    humAlert:{
      seuil:80,
      active:true
    },
    USAlert:{
      seuil:80,
      active:true
    },
  }
  // switch = true
  humiditeValue
  USValue
  
  gauge
  bar
  graphChelou
  
  interval
  
  tooling(){
    if(this.bar){
      this.bar.destroy()
      this.bar=undefined
    }
    if(this.barUS){
      this.barUS.destroy()
      this.barUS=undefined
    }
    
    
    this.tool = !this.tool
    if(!this.tool){
      console.log(this.conf)
      this.http.config(this.conf).then(()=>{

        clearInterval(this.interval)
        this.interval = setInterval(()=>{this.refresh()},this.conf.refresh)
        document.location.reload(true)
      })
    }
  }
  
  constructor(public navCtrl: NavController, public http : HttpClientProvider) {
    setTimeout(()=>{document.location.reload(true)},1800000)
    this.http.config({}).then((data:any)=>{
      console.log(data)
      if(data.length != 0){
        this.conf = JSON.parse(data[0].value)
      }
    })
    
    
    
    this.refresh()
    //TODO stocker/charger la conf dans le serv
    // mettre le setInterval dans le callback du ajax
    this.interval = setInterval(()=>{this.refresh()},this.conf.refresh)
    
  }
  
  refresh(){
    // console.log("refresh")
    
    // this.createGraph()
    this.refreshGraphs()
    
  }
  refreshGraphs(){
    // this.http.getData("temerature", 3600000 ).then(data=>{
    //   if(data && data.length>0){
    
    
    //     this.currentTemp = data[0].data
    //     let values = []
    //     data.forEach(element =>{
    //       values.push([element.date,element.data])
    //     })
    //     if(this.graphTemp !== undefined){
    //       this.reloadSerie(values,'graphTemp','temperature')
    //     }else{
    //       this.createGraph(values,'graphTemp','temperature')
    //     }
    //   }else{
    //     console.log("no data temerature")
    //   }
    // })
    this.http.getData("humidite", this.conf.sampleSize ).then(data=>{
      // console.log(data)
      if(data && data.length>0){
        this.humiditeValue = (((data[0].data*this.conf.dataScale.a)+this.conf.dataScale.b)*(this.conf.dataScale.inv?-1:1)).toFixed(0)
        let values = []
        data.forEach(element =>{
          values.push([element.date,(((element.data*this.conf.dataScale.a)+this.conf.dataScale.b)*(this.conf.dataScale.inv?-1:1))])
        })
        if(this.graphHum !== undefined){
          this.reloadSerie(values,'graphHum','humidite')
        }else{
          this.createGraph(values,'graphHum','humidite')
        }
        
        if(this.bar !== undefined){
          this.reloadBar(this.humiditeValue)
        }else{
          this.putBar(this.humiditeValue)
        }
      }else{
        console.log("no data humidite")
      }
    })
    
    
    this.http.getData("US", this.conf.sampleSize ).then(data=>{
      if(data && data.length>0){
        this.USValue = (((data[0].data*this.conf.USscale.a)+this.conf.USscale.b)).toFixed(0)
        let values = []
        data.forEach(element =>{
          values.push([element.date,(((element.data*this.conf.USscale.a)+this.conf.USscale.b))])
        })
        console.log(values)

        if(this.gauge !== undefined){
          this.reloadGauge(this.USValue)
        }else{
          this.putGauge(this.USValue)
        }
        if(this.barUS !== undefined){
          this.reloadBarUS(values)
        }else{
          this.putBarUS(values)
        }
      }else{
        console.log("no data humidite")
      }
    })
    
    // this.http.getLastData("humidite").then(data=>{
    //   if(data&& data.length>0){
    //     this.humiditeValue = (data[0].data != 0) 
    //     if(this.bar !== undefined){
    //       this.reloadSerie(values,'graphHum','humidite')
    //     }else{
    //       this.putBar(values)
    //     }
    //   }else{
    //     console.log("no data humidite")
    //   }
    // })
  }
  
  reloadSerie(value,id,name){
    this[id].updateSeries([{name:name,data:value}])
  }
  
  async createGraph(values,id,name) {
    
    while(document.querySelector("#"+id)==undefined){
      await this.promiseTimeout()
    }
    
    var options = {
      series: [{
        name: "Humidité",
        data: values
      }],
      chart: {
        toolbar: {
          show:false
        },
        animations:{
          enabled:false
        },
        height: this.baseHeight-38,
        type: 'area',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2.5,
      },
      title: {
        text: '',
        align: 'left'
      },
      fill: {
        // color:"#FF0000",
        // type: 'gradient',
      },
      grid: {
        row: {
          colors: [ 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
        yaxis: {
          lines: {
            show: false
          }
        }, 
        
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            if(val %50 == 0)
            return val;
          },
        },
        title: {
          text: ''
        },
        min:0,
        max:100,
      },
      xaxis: {
        type: 'datetime',
        axisBorder: {
          show: false,
        },
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return val
          }
        }
      }
    };
    //   var options = {
    //     stroke: {
    //       show: true,
    //       curve: 'smooth',
    //       lineCap: 'butt',
    //       colors: undefined,
    //       width: 2.5,
    //       dashArray: 0,      
    //     },
    //     chart: {
    //       animations:{
    //         enabled:false
    //       },
    //       type: 'line',
    //       stacked: false,
    //       height: 200,
    //       // zoom: {
    //       //   type: 'x',
    //       //   enabled: true,
    //       //   autoScaleYaxis: true
    //       // },
    //       toolbar: {
    //         autoSelected: 'zoom',
    //         tools:{
    //           pan:false
    //         }
    //       },
    
    //     },
    //     dataLabels: {
    //       enabled: false
    //     },
    //     series: [{
    //       name: name,
    //       data: values
    //     }
    //   ],
    //   markers: {
    //     size: 0,
    //   },
    //   title: {
    //     text: name,
    //     align: 'left'
    //   },
    //   yaxis: {
    //     //min: 0,
    //     //max: 100,
    //     labels: {
    //       formatter: function (val) {
    //         return val.toFixed(1);
    //       },
    //     },
    //     title: {
    //       text: name
    //     },
    //   },
    //   xaxis: {
    //     type: 'datetime',
    //   },
    //   tooltip: {
    //     shared: false,
    //     y: {
    //       formatter: function (val) {
    //         return val.toFixed(1)
    //       }
    //     }
    //   },
    //   colors: [ "#0000ff","#00ff00", "#ff0000"],
    // }
    
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
  async reloadBar(value){
    this.bar.updateSeries([{name:"Inflation",data:[0,0,value,0,0]}])
  }
  async putBar(value){
    while(document.querySelector("#bar")==undefined){
      await this.promiseTimeout()
    }
    
    
    let annotations = {}
    if(this.conf.humAlert.active){
      annotations=
      {
        yaxis: [{
          
          // strokeDashArray:10,
          y: this.conf.humAlert.seuil,
          y2:this.conf.humAlert.seuil+1,
          borderColor: '#FF0000',
          fillColor:'#FF0000',
          opacity:1,
          label: {
            borderColor: '#FF0000',
            style: {
              opactity:0.5,
              color: '#fff',
              background: '#FF0000',
            },
            text: 'Seuil d\'alerte',
          }
        }]
      }
    }
    var options = {
      
      annotations: annotations,
      ////////////////////////////////////
      
      series: [{
        name: 'Inflation',
        data: [0,0,value,0,0]
      }],
      chart: {
        height: this.baseHeight+29,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          if(val != '0')
          return val + "%";
          return
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },
      
      xaxis: {
        categories: ["Humidité"],
        position: 'top',
        labels: {
          offsetY: -18,
          
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
          offsetY: -35,
          
        }
      },
      fill: {
        gradient: {
          shade: 'light',
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        },
      },
      yaxis: {
        min:0,
        max:100,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + "%";
          }
        }
        
      },
      title: {
        text: 'Monthly Inflation in Argentina, 2002',
        floating: true,
        offsetY: 320,
        align: 'center',
        style: {
          color: '#444'
        }
      }
    };
    
    this.bar = new apexcharts(document.querySelector("#bar"), options);
    this.bar.render();
  }
  
  async reloadGauge(value){
    this.gauge.updateSeries([value])
  }
  
  async putGauge(value){
    while(document.querySelector("#gauge")==undefined){
      await this.promiseTimeout()
    }
    var options = {
      series: [value],
      chart: {
        height: this.baseHeight-50,
        type: 'radialBar',
        offsetY: -10,
        animations:{
          // enabled:false,
          animateGradually: {
            enabled: true,
            delay: 0
          },
          dynamicAnimation: {
            enabled: true,
            speed: 0
          }
        },
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: '16px',
              color: undefined,
              offsetY: 120
            },
            value: {
              offsetY: 76,
              fontSize: '22px',
              color: undefined,
              formatter: function (val) {
                return val + " cm";
              }
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91]
        },
      },
      stroke: {
        dashArray: 4
      },
      labels: ['Distance'],
    };
    
    this.gauge = new apexcharts(document.querySelector("#gauge"), options);
    this.gauge.render();
  }
  
  putGraphChelou(){
    
  }
  
  // <div id="gauge"></div>
  //   <div id="bar"></div>
  //   <div id="graph-chelou"></div>
  
  
  //*************************************** */
  
  async reloadBarUS(value){
    this.barUS.updateSeries([{name:"Distance",data:value}])
  }
  
  async putBarUS(value){
    while(document.querySelector("#barUS")==undefined){
      await this.promiseTimeout()
    }
    
    
 
    
    var options = {
      series: [{
        name: "Humidité",
        data: value
      }],
      chart: {
        toolbar: {
          show:false
        },
        animations:{
          enabled:false
        },
        height: this.baseHeight-38,
        type: 'area',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2.5,
      },
      title: {
        text: '',
        align: 'left'
      },
      fill: {
        // color:"#FF0000",
        // type: 'gradient',
      },
      grid: {
        row: {
          colors: [ 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
        yaxis: {
          lines: {
            show: false
          }
        }, 
        
      },
      yaxis: {
        labels: {
          formatter: function (val) {
            if(val %50 == 0)
            return val;
          },
        },
        title: {
          text: ''
        },
        min:0,
        max:100,
      },
      xaxis: {
        type: 'datetime',
        axisBorder: {
          show: false,
        },
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return val
          }
        }
      }
    };
    
    this.barUS = new apexcharts(document.querySelector("#barUS"), options);
    this.barUS.render();
  }
  
  
}
