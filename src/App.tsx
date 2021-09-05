
import React, { useEffect, useState, useRef } from "react";
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import new_blank from "./icons/new_blank.png" 
import open_pic from "./icons/open_pic.png"

import {HTMLInputEvent} from "./extensions/extensions";

import './App.css';
import Board from './components/Board';
import NewBoardForm from './components/NewBoardForm';
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

  const [showModal, setShowModal] = useState(false)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
  const [options, setOptions] = useState(DEFAULT_OPTIONS)
  const selectedOption = options[selectedOptionIndex]
  const [files, setFiles] = useState<Array<HTMLImageElement>>([])

  const [diffX, setDiffX] = useState(0) 
  const [diffY, setDiffY] = useState(0) 
  const [style, setStyle] = useState({})
  const [dragging, setDragging] = useState(false) 
  const boardDragged = useRef<EventTarget>();
 /* const boardRefs = useRef([]);
  boardRefs.current = []*/


  const openNewBoardForm = () => {
    setShowModal(prev => !prev)
  }

  const openNewBoard = (width:number, height:number, name:string) => {
    const file = new Image()
    file.width = width
    file.height = height
    if(name == "") {
      const number = files.length + 1
      name = "Nouveau (" + number+ ")" 
    }
    file.name = name
    addFile(file)
  }


  const addFile = (file: HTMLImageElement) => {
    setFiles([...files, file])
  }

  const onFileUploaded = (event: React.FormEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement;
      if(input.files?.[0] !== undefined) {
        const reader = new FileReader();
        reader.onload = function(){
          const dataURL = reader.result as string;
          const file = new Image()
          file.src = dataURL;
          file.name = input.files![0].name
          file.onload = function() {
            addFile(file)
          }
  
         input.value = "null"
  
        };
        reader.readAsDataURL(input.files[0]);
      }
  }

  const closeFile = (fileToCloseName: string) => {
    var fileToRemove = files.filter(file => file.name == fileToCloseName)[0]
    var index = files.indexOf(fileToRemove)
    files.splice(index, 1)
    setFiles([...files])
  }


const onDragStart = (event: React.MouseEvent) => {
  if(event.target) {
    let parentNode =  (event.target as HTMLElement).parentNode as HTMLElement
    if(parentNode) {
      setDiffX(event.screenX - parentNode.offsetLeft)
      setDiffY(event.screenY - parentNode.offsetTop)
      setDragging(true)
    }
  }
}

const onDragEnd = (event: React.MouseEvent) => {
  if(dragging){
    setDragging(false)
  }
}

const onDragging = (event: React.MouseEvent) => {
  if(dragging) {
    var left = event.screenX - diffX
    var top = event.screenY - diffY

    if(boardDragged.current !== undefined) {
      (boardDragged.current as HTMLElement).style.left = left + "px";
      (boardDragged.current as HTMLElement).style.top = top + "px";
    }
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
  const onBoardSelected = (event: React.MouseEvent) => {
    if(event) {
      if(boardDragged.current != undefined) {
        (boardDragged.current as HTMLElement).style.zIndex = "1";
        (event.currentTarget as HTMLElement).style.zIndex = "2";
      }
  
      if(event.currentTarget != undefined) {
        boardDragged.current = event.currentTarget
      }
    }
  }


  return (
    <div className="container" onMouseMove={onDragging} onMouseUp={onDragEnd}>
    
      <NewBoardForm showModal={showModal} setShowModal={setShowModal} openNewBoard={openNewBoard}/>
        
      <div className="top-toolbar">

        <IconButton onClick={openNewBoardForm}>
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
          return <Board file={file} closeAction={closeFile} onDragStart={onDragStart} 
          onBoardSelected={onBoardSelected}/>
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
