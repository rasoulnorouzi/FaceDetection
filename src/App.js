import React, { Component } from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';

import Clarifai from 'clarifai';

// initialize with your api key. This will also work in your browser via http://browserify.org/


const app = new Clarifai.App({
 apiKey: 'b71842ea7aed4b49ba245dd74755db43'
});


const particleOptions={
  particles: {
    number: {
      value:30,
      density:{
        enable:true,
        value_area:800
      }
      }
    }
  }

  
class App extends Component{
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:'',
      box:{}
    }
  }

  calculateFaceLocation=(data)=>{
    const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
    const image= document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height);
    return{
      leftCol: clarifaiFace.left_col*width,
      topRow: clarifaiFace.top_row*height,
      rightCol:width-(clarifaiFace.right_col*width),
      bottomRow: height-(clarifaiFace.bottom_row*height)
    }
  }

  displayFaceBox=(box)=>{
    this.setState({box:box})
  }


   onInputChange=(event)=>{
     this.setState({input:event.target.value});
   }

   onButtonSubmit=()=>{

    this.setState({imageUrl: this.state.input});

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(response=>
      this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err=>console.log(err))
      // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
  }

  render(){
    return (
      <div className="App">
        <Particles params={particleOptions} className='particles' />
        <Navigation/>
        <Logo/>
        <Rank/>
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}
 

export default App;
