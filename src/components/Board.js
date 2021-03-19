import React, { useEffect, useState } from "react";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import './Board.css';

import board_icon from "../icons/board_icon.png"

export default function Board({ file, closeAction }) {

    const [diffX, setDiffX] = useState(0) 
    const [diffY, setDiffY] = useState(0) 
    const [dragging, setDragging] = useState(false) 
    const [style, setStyle] = useState({})
    const [imageStyle, setImageStyle] = useState({width: file.width, height: file.height})

    const onDragStart = event => {
       event.preventDefault()
       setDiffX(event.screenX - event.target.parentNode.parentNode.offsetLeft)
       setDiffY(event.screenY - event.target.parentNode.parentNode.offsetTop)
       setDragging(true)
    }

    const onDragEnd = event => {
        setDragging(false)
    }

    const onDragging = event => {
        console.log(dragging)
        if(dragging) {
            var left = event.screenX - diffX
            var top = event.screenY - diffY

            setStyle(
              {
                left: left,
                top: top
              }
            )
        }
    }

    return (
        <div className="board" style={Object.assign({}, style, imageStyle)} onMouseEnter={onDragEnd} onMouseMove={onDragging}  onMouseDown={onDragStart} onMouseUp={onDragEnd}>
            <div className="board-action-bar">
                <img className="board-icon" src={board_icon} height={25} width={25}/>
                <div className="board-title">
                    <p>{file.name}</p>
                </div>
                <div className="board-close-button">
                    <IconButton aria-label="delete" onClick={()=>closeAction(file.name)}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </div>
    
            <div className="board-content">
              <img src={file.tempUrl}/>
            </div>
            
        </div>
    )
}
