
import React, { useEffect, useState, useRef } from "react";
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

  const [diffX, setDiffX] = useState(0) 
  const [diffY, setDiffY] = useState(0) 
  const [style, setStyle] = useState({})
  const [dragging, setDragging] = useState(false) 
  const boardDragged = useRef();
 /* const boardRefs = useRef([]);
  boardRefs.current = []*/

  const addFile = (file) => {
    setFiles([...files, file])
   
  }

  const onFileUploaded = event => {
    const input = event.target;
    if(input.files[0] != undefined) {
      const reader = new FileReader();
      reader.onload = function(){
        const dataURL = reader.result;
        const file = new Image()
        file.src = dataURL;
        file.name = input.files[0].name
        file.onload = function() {
          addFile(file)
        }

       input.value = null

      };
      reader.readAsDataURL(input.files[0]);
    }

  }

  const closeFile = (fileToCloseName) => {
    var fileToRemove = files.filter(file => file.name == fileToCloseName)[0]
    var index = files.indexOf(fileToRemove)
    files.splice(index, 1)
    setFiles([...files])
  }

const onDragStart = event => {

  boardDragged.current = event.target.parentNode
  setDiffX(event.screenX - event.target.parentNode.offsetLeft)
  setDiffY(event.screenY - event.target.parentNode.offsetTop)
  setDragging(true)
}

const onDragEnd = event => {
  if(dragging){
    boardDragged.current = null
    setDragging(false)
  }
}

const onDragging = event => {
  if(dragging) {
    var left = event.screenX - diffX
    var top = event.screenY - diffY

    boardDragged.current.style.left = left + "px"
    boardDragged.current.style.top = top + "px"
  }
}

//PHOTOSHOP OPTIONS
  /*function handleSliderChange({target}) {
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

  }*/

  /*function addBoards(boardRef) {
    console.log(boardRef)
    if(boardRef && !boardRefs.current.includes(boardRef) && boardRefs.current.length < files.length) {
      boardRefs.current.push(boardRef)
    }
    console.log(boardRefs.current)
    console.log(files.length)
  }*/


  return (
    <div className="container" onMouseMove={onDragging} onMouseUp={onDragEnd}>
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
          console.log("LOOP ON")
          return <Board file={file} closeAction={closeFile} onDragStart={onDragStart}/>
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
