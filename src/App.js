
import React, { useEffect, useState } from "react";
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import new_blank from "./icons/new_blank.png" 
import open_pic from "./icons/open_pic.png"

import './App.css';
import Board from './components/Board';
import Slider from './Slider';
import SideBarItem from './SideBarItem';

const DEFAULT_OPTIONS = [
  {
    name: "Brightness",
    property: "brightness",
    value: 100,
    range: {
      min: 0,
      max: 100
    },
    unit: "%"
  },

  {
    name: "Contrast",
    property: "contrast",
    value: 100,
    range: {
      min: 0,
      max: 100
    },
    unit: "%"
  },

  {
    name: "Saturation",
    property: "saturate",
    value: 100,
    range: {
      min: 0,
      max: 200
    },
    unit: "%"
  },

  {
    name: "Grayscale",
    property: "grayscale",
    value: 0,
    range: {
      min: 0,
      max: 100
    },
    unit: "%"
  },

  {
    name: "Sepia",
    property: "sepia",
    value: 0,
    range: {
      min: 0,
      max: 100
    },
    unit: "%"
  },

  {
    name: "Hue Rotate",
    property: "hue-rotate",
    value: 0,
    range: {
      min: 0,
      max: 360
    },
    unit: "deg"
  },

  {
    name: "Blur",
    property: "blur",
    value: 0,
    range: {
      min: 0,
      max: 20
    },
    unit: "px"
  }
]

function App() {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const selectedOption = options[selectedOptionIndex]
  const [files, setFiles] = useState([])

  const addFile = (file) => {
    setFiles([...files, file])
  }

  const onFileUploaded = event => {

    if(event.target.files[0] != undefined) {
      var file = new Image()
      file.tempUrl = URL.createObjectURL(event.target.files[0])
      file.src = file.tempUrl
      file.name = event.target.files[0].name
      file.onload = function() {
        addFile(file)
      }
    }
    
  }

  const closeFile = (fileToCloseName) => {
    setFiles(files.filter(file => file.name !== fileToCloseName))
  }
  
  function handleSliderChange({target}) {
    setOptions(prevOptions => {
      return prevOptions.map((option, index) => {
        if(index != selectedOptionIndex) return option
        return { ...option, value: target.value}
      })
    })
  }

  function getImageStyle() {
    const filters = options.map(option => {
      return `${option.property}(${option.value}${option.unit})`
    })

    return {filter : filters.join(' ')}

  }

  function showBoard(file) {
    if(file.src != undefined) {
      return <Board file={file}/>
    } else {
      return null
    }
  }

  return (
    <div className="container">
      <div className="top-toolbar">
        <IconButton>
          <img src={new_blank} height={25} width={25}/>
        </IconButton>

        <input accept="image/*"  id="icon-button-file" type="file" onChange={onFileUploaded} hidden/>
        <label htmlFor="icon-button-file">
        <IconButton component="span">
          <img src={open_pic} height={25} width={25}/>
        </IconButton>
        </label>

      </div>
      <div className="right-toolbar"></div>
      <div className="workplan">
        { files.map(file => {
          return <Board file={file} closeAction={closeFile}/>
        })}
        <div className="main-image" >
        </div>

      </div>
        {/* <div className="main-image" style={getImageStyle()}/>
      <div className="sidebar">
        {options.map((option, index) => {
          return (
          <SideBarItem
            key={index}
            name={option.name}
            active={index == selectedOptionIndex}
            handleClick={() => setSelectedOptionIndex(index)}/>
          )
        })}
      </div>      
      <Slider
      min={selectedOption.range.min}
      max={selectedOption.range.max}
      value={selectedOption.value}
      handleChange={handleSliderChange}
      /> */}
    </div>
  );
}

export default App;
