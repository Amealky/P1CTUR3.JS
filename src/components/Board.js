import React, { useEffect, useState, useImperativeHandle, useRef } from "react";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import './Board.css';

import board_icon from "../icons/board_icon.png"

const Child = React.forwardRef((props,ref) => {

    const [actionBarStyle, setActionBarStyle] = useState({width: props.file.width, height: 60})
    const [imageStyle, setImageStyle] = useState({width: props.file.width, height: props.file.height})
    const [boardStyle, setBoardStyle] = useState({width: props.file.width, height: props.file.height + actionBarStyle.height})
    const canvas = useRef();

    useImperativeHandle(ref, () => ({
        
    }))

    useEffect(() => {
        const ctx = canvas.current.getContext("2d");  
        console.log(props.file.height)
        ctx.drawImage(props.file, 0, 0, props.file.width, props.file.height)

    }, [])

    const onDragStart = event => {
     event.stopPropagation();
     if(event.target.className == "board-action-bar") {
        props.onDragStart(event)
       return;
     }
    }

    function onCloseAction(fileName) {
        props.closeAction(fileName)
    }

    return (
        <div className="board" style={boardStyle}>
            <div className="board-action-bar" onMouseDown={onDragStart} style={actionBarStyle}> 
                <img className="board-icon" src={board_icon} height={25} width={25}/>
                <div className="board-title">
                    <p>{props.file.name}</p>
                </div>
                <div className="board-close-button">
                    <IconButton aria-label="delete" onClick={()=>onCloseAction(props.file.name)}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </div>
    
            <div className="board-content" style={Object.assign({}, imageStyle)}>
              <canvas ref={canvas} className="board-content-img" image={props.file.src} width={imageStyle.width} height={imageStyle.height}/>
            </div>
            
        </div>
    )
})

export default Child;
