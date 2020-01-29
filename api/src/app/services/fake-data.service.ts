import { Data } from "../entities"
import { getRepository } from "typeorm"

export class FakeData {

    timeout
    fakeData=false
    refValue = 0
    
    generated_sens = 1
    generated_value = 400
    generated_max = 540
    generated_min = 230
    constructor(){

    }


    resetTimeOut(){
        if(this.timeout){
            clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(()=>{
            this.fakeData = true
        },15000)
    }
    async processData(data){
        if(Math.abs(data.data - this.refValue) > data.data/10){
            // ya une différence
            this.refValue = data.data
            this.resetTimeOut()
            this.fakeData=false
        }else{
            if(this.fakeData){
                // on envoie les fakedata
                console.log("fake")
                await this.register_data(this.generateData())
            }else{
                console.log("true")
                // on envoie les vraies datas
                await this.register_data(data)
            }
        }
        // this.startTimeOut()

        // check la valeur d'humidité
        //stocker la 1ère valeur ,vérifier à chaque process data si elle a bougé de + de 10 %
        // si oui, reset timeout, reset 1st value
        // si non, checker si le boolean timeout est on, si c'est le cas rentrer données bidons. dans tous les autres cas, on rentre les deonnées normales

    }

    async register_data(element){
        let data = new Data()
        data.deviceName = element.name
        data.data = element.data
        data.date = new Date()
        console.log(data)
        let result = await getRepository(Data).save(data);
    }

    generateData(){
        let val = this.generated_value + 50*this.generated_sens
        if(val > this.generated_max){
            val = this.generated_max
            this.generated_sens *= -1
        }
        if(val < this.generated_min){
            val = this.generated_min
            this.generated_sens *= -1
        }
        this.generated_value = val

        return {
            name:"humidite",
            data:val
        }
    }
}
