/*
Created a blackjack app using React.js
*/

import React, { Component } from 'react';
import './App.css';
import { Button, Input, Typography } from "antd";

class App extends Component {
  
  state = {
    deck : [],
    phand : [],
    dhand :[],
    pvalue : 0,
    dvalue : 0,
    pwins : 0,
    dwins : 0,
    index : 0,
    shuffleapi : "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=20",
    drawapi1 : "https://deckofcardsapi.com/api/deck/",
    drawapi2 : "/draw/?count=52",
    testapi : "https://deckofcardsapi.com/api/deck/71zw1u3g22po/draw/?count=52",
    playing : false,
    dbust: false,
    pw: "Player Wins: ",
    dw: "Dealer Wins: "

  }     
  componentDidMount () {
    fetch(this.state.shuffleapi).then(response => response.json())
    .then(shuffled =>{
      let deckID = shuffled.deck_id
      console.log(deckID)
      fetch("https://deckofcardsapi.com/api/deck/"+ deckID + "/draw/?count=52")
      .then(response => response.json())
      .then(
        res => {
          this.setState({   
            deck: res.cards,
          })
        }
      )})
  
      }

  assignvalues = (deck) => {
    let n = deck.length
    for (let i=0; i<n; i++) {
      let c = deck[i].value 
      if (c === "KING" || c === "QUEEN" || c=== "JACK" ) {
        c = '10'
       
        }
      else if (c === "ACE") {
        c = '11'

      }
      deck[i].value = Number(c)
      }
      
    return deck
    }
  

  
  openingdeal = () => {
      
      try{
      this.assignvalues (this.state.deck)
      let pv = this.state.deck[this.state.index].value + this.state.deck[this.state.index+1].value
      this.setState({
        phand : [this.state.deck[this.state.index],this.state.deck[this.state.index+1]],  
        dhand : [this.state.deck[this.state.index+2]],
        index : this.state.index + 4,
        playing : true, 
        dvalue : this.state.deck[this.state.index+2].value,
      })
      if (pv === 22) {
        this.setState({
          pvalue : 12
        })
      }
      else {
        this.setState({
          pvalue: pv
        })
      }
    }
    catch(e) {
      alert("Empty Deck. Please Try Again.")
      console.log(this.state.deck)
      console.log(this.state.index)
    }
    }
  
  loser = (bust, dv, pv)=>{
    if (bust) {
      let output = "You busted with " + pv + ". You Lose!"
      alert(output)
    }
    else {
      let output = "Dealer: " + dv + " Player: " + this.state.pvalue + ". You Lose!"
      alert(output)
    }
    this.setState({
      dwins : this.state.dwins + 1,
      phand : [],
      dhand : [],
      pvalue : 0,
      dvalue : 0,
      playing: false,
      dbust: false
    })
  
    this.openingdeal()

  }
  
  push = (dv) => {
    let output = "Dealer: " + dv + " Player: " + this.state.pvalue + ". No Blood."
    alert(output)
    this.setState({
      phand : [],
      dhand : [],
      pvalue : 0,
      dvalue : 0,
      playing : false,
      dbust: false
    })
    this.openingdeal()
  }

  winnerwinner =(dbust, dv)=>{
    if (dbust) {
      let output = "Dealer Busted with " + dv + ". You Win!"
      alert(output)
    }
    else {
      let output = "Dealer: " + dv + " Player: " + this.state.pvalue + ". You Win!"
      alert(output)
    }
    this.setState({
      pwins : this.state.pwins + 1,
      phand : [], 
      dhand : [],
      pvalue : 0,
      dvalue : 0,
      playing: false,
      dbust: false
    })

    this.openingdeal()

  }
  

  hit = () => {
    this.assignvalues (this.state.deck)
    let index = this.state.index
    let newcard = this.state.deck[index]
    let newcardv = newcard.value 
    if (this.state.pvalue > 10 && newcardv === 11) {
      newcardv = 1
    }
    this.setState({
      phand : this.state.phand.concat(newcard),
      index : index + 1
    })
    let n = this.state.phand.length

    let pv = this.state.pvalue + newcardv
    let bust = true
    if (pv > 21) {
      this.loser(bust, 0, pv)
    }
    else
    this.setState({
      pvalue : pv
      })
  }

  stand = () => {
    let index = this.state.index
    let dvalue = this.state.dvalue
    let pvalue = this.state.pvalue
    let dhand = this.state.dhand 
    let counter = 1
    while (dvalue < 17) {
        this.setState({ 
          dhand : dhand.concat(this.state.deck[index + counter]),
          dvalue: dvalue += this.state.deck[index + counter].value
         })
         counter += 1
    } 
    if (dvalue > 21) {
      let dbust = true
      this.winnerwinner(dbust, dvalue)
    }
    else if (dvalue < pvalue) {
      this.winnerwinner(false, dvalue)
    } 
    else if (dvalue > pvalue) {
      this.loser(false, dvalue, 0)
    }
  
    else 
     this.push(dvalue)

    this.setState({
      index : index + (counter - 1)
    })


}

  
  render() {
    console.log(this.state)
    return (
      <div className ="App" style = {{backgroundColor: '#121212'}}>
      <div style = {{padding: 25, backroundColor: "#121212"}}> </div>
      <div style = {{backroundColor: "#121212", padding: 25}}> {!this.state.playing && <Button type ="primary" style = {{background : "#3700B3", borderColor: "#3700B3"}} onClick = {()=> {this.openingdeal()}}> Start Game </Button>} </div>
     
        <div style = {{backgroundColor: '#121212'}}>
          <body style = {{color: "#bebebe", fontWeight : "bold", backgroundColor : "#121212", padding: 5}}> {this.state.playing && this.state.pw} {this.state.playing && this.state.pwins} </body>
        </div>
       

        <div style = {{padding: 5, backroundColor: "#121212"}}>
          <body style = {{backgroundColor : "#121212"}}>            
          {this.state.playing &&  <img src = {this.state.phand[0].image}/> }
          {this.state.playing && <img src = {this.state.phand[1].image}/>}
          {this.state.playing &&  this.state.phand[2] && <img src = {this.state.phand[2].image}/>}
          {this.state.playing &&  this.state.phand[3] && <img src = {this.state.phand[3].image}/>}
          {this.state.playing &&  this.state.phand[4] && <img src = {this.state.phand[4].image}/>}
          {this.state.playing &&  this.state.phand[5] && <img src = {this.state.phand[5].image}/>}
          {this.state.playing &&  this.state.phand[6] && <img src = {this.state.phand[6].image}/>}
          {this.state.playing &&  this.state.phand[7] && <img src = {this.state.phand[7].image}/>}
          {this.state.playing &&  this.state.phand[8] && <img src = {this.state.phand[8].image}/>}
          {this.state.playing &&  this.state.phand[9] && <img src = {this.state.phand[9].image}/>}
          {this.state.playing &&  this.state.phand[10] && <img src = {this.state.phand[10].image}/>}
          </body>
        </div>
        
        <div style = {{padding: 25, backgroundcolor: "#121212"}}> </div>       

        <div style = {{backroundColor: "#121212", padding: 10}}> {this.state.playing && <Button type ="primary" style = {{background : "#BB86FC", borderColor: "#BB86FC"}} size = "large" shape = "round" onClick = {()=> {this.hit()}}> Hit </Button>} {this.state.playing && <Button type ="primary" style = {{background : "#03DAC6", borderColor: "#03DAC6"}} size = "large" shape = "round" onClick = {()=> {this.stand()}}> Stand </Button>}  </div>

        <div style = {{padding: 25, backgroundcolor: "#121212"}}> </div>

        <div style = {{padding: 5, backgroundcolor: "#121212"}}>
          <body style = {{backgroundColor : "#121212"}}>  
          {this.state.playing && <img src = {this.state.dhand[0].image}/>}
          {this.state.playing &&  this.state.dhand[1] && <img src = {this.state.dhand[1].image}/>}
          {this.state.playing &&  this.state.dhand[2] && <img src = {this.state.dhand[2].image}/>}
          {this.state.playing &&  this.state.dhand[3] && <img src = {this.state.dhand[3].image}/>}
          {this.state.playing &&  this.state.dhand[4] && <img src = {this.state.dhand[4].image}/>}
          {this.state.playing &&  this.state.dhand[5] && <img src = {this.state.dhand[5].image}/>}
          {this.state.playing &&  this.state.dhand[6] && <img src = {this.state.dhand[6].image}/>}
          {this.state.playing &&  this.state.dhand[7] && <img src = {this.state.dhand[7].image}/>}
          {this.state.playing &&  this.state.dhand[8] && <img src = {this.state.dhand[8].image}/>}
          {this.state.playing &&  this.state.dhand[9] && <img src = {this.state.dhand[9].image}/>}
          {this.state.playing &&  this.state.dhand[10] && <img src = {this.state.dhand[10].image}/>}
          </body>
        </div>

         <div style = {{backgroundColor: '#121212'}}>
           <body style = {{color : "#bebebe",fontWeight : "bold", backroundColor: "#121212", padding : 5}}> {this.state.playing && this.state.dw} {this.state.playing && this.state.dwins} </body>
        </div>
        
      </div> 

    );
  }
}


export default App;