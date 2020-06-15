// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const axios = require('axios');



// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json());


app.post("/webhook", async (req, res) => {
  
  
  console.log(req.body)
  
  let intent = req.body.queryResult.intent.displayName;
  
  const response = await axios.get('https://parada-certa-fad54.firebaseio.com/.json')
      
  const locais = response.data
  const locaisGroup = locais.map((local, index) => {
        return {
          text: {
            text: [`${local.description}
Estrelas: ${local.stars}
Distância: ${local.distance}
Para ${local.gender.join(" e ")}
Saiba Mais: https://paradacerta.netlify.app/${index}`]
          }
        }
      })
  
  if(intent === 'Pegar paradas'){
    
      let textResponse = [{
            text: {
              text: ["Você tem essas opções proximas a você"]
            }
      }]
      
      textResponse.push(locaisGroup[0])
      textResponse.push(locaisGroup[1])
      textResponse.push(locaisGroup[2])
    
      textResponse.push({
            text: {
              text: ["Deseja ver mais opções?"]
            }
        })
    
    console.log(textResponse)
    
      res.json({
        fulfillmentMessages: textResponse
      });
  }
  
  
  else if (intent === 'Definir viagem - yes'){
    console.log(req.body.queryResult.outputContexts[0].parameters)
    
    
    
    const origem = req.body.queryResult.outputContexts[0].parameters.origem[0].city 
    const destino = req.body.queryResult.outputContexts[0].parameters.destino[0].city
    const horario = req.body.queryResult.outputContexts[0].parameters.time[0]
  
    
    const resposta = `
3.899 km de estrada e mais de 53 horas de viagem.
A sua viagem será de 6 dias. 

Paradas sugeridas para respeitar jornadas de no máximo 10 horas de condução:
Cassilândia - MS: 9 h 24 min (797 km)
Água Quente - MT: 9 h 11 min (644 km)
Comodoro - MT: 9 h 4 min (730 km)
Ariquemes - RO: 9 h 8 min (625 km)
Humaitá - AM: 5 h 40 min (407 km)
Tupana - AM: 7 h 29 min (506 km)

Dê uma olhada nos quartos no caminho:
https://paradacerta.netlify.app/quartos

BOA VIAGEM!
`
    
    res.json({
        fulfillmentMessages: [
          {
            text: {
              text: [`Certo, viagem partindo de ${origem}, com destino à ${destino} a partir das ${horario}:`]
            }
          },
          {
            text: {
              text: [resposta]
            }
          },
        ]
      });
    
    
  }
  
  
  else if (intent === 'Local - yes'){
     let textResponse = [{
            text: {
              text: ["Também tem essas opções proximas a você"]
            }
      }]
      
      textResponse.push(locaisGroup[3])
      textResponse.push(locaisGroup[4])
    
      textResponse.push({
            text: {
              text: ["Esse foram os locais próximos, aproveite a estadia"]
            }
        })
    
    console.log(textResponse)
    
      res.json({
        fulfillmentMessages: textResponse
      });
    
  }
  

});



// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
