import React, { useEffect, useState, useImperativeHandle, useRef } from "react";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Box from "@material-ui/core/Box";
import "./Board.css";

import board_icon from "../icons/board_icon.png";

type BoardProps = {
  file: HTMLImageElement
}

type Pointer = {
  x: number,
  y: number
}

const Child = React.forwardRef((props: {
  file: HTMLImageElement, 
  closeAction: (fileToCloseName: string) => void,
  onDragStart: (event: React.MouseEvent) => void,
  onBoardSelected: (event: React.MouseEvent) => void}, 
  ref) => {

  const [actionBarStyle, setActionBarStyle] = useState({
    width: props.file.width,
    height: 60,
  });
  const [imageStyle, setImageStyle] = useState({
    width: props.file.width,
    height: props.file.height,
  });
  const [boardStyle, setBoardStyle] = useState({
    width: props.file.width,
    height: props.file.height + actionBarStyle.height,
  });
  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasContext = useRef<CanvasRenderingContext2D>();

  const oldPointer = useRef<Pointer>();
  const [isDrawing, setDrawing] = useState(false);

  useImperativeHandle(ref, () => ({}));

  // when componentDidUpdate
  useEffect(() => {
    if(canvas.current !== null) {
      const ctx = canvas.current.getContext("2d");

      ctx!.drawImage(props.file, 0, 0, props.file.width, props.file.height);
      ctx!.lineCap = "butt";
      ctx!.strokeStyle = "black";
      ctx!.imageSmoothingEnabled = false;

      ctx!.imageSmoothingEnabled = false

      ctx!.lineWidth = 10;

      canvasContext.current = ctx!;
      console.log("TOTO");
    }
  }, []);

  function clear() {
    if(canvasContext.current !== undefined && canvas.current != undefined) {
      canvasContext.current.clearRect(
        0,
        0,
        canvas.current.width,
        canvas.current.height
      );
    }
  }

  const draw = () => {
    if(canvasContext.current !== undefined) {
      const actualImage = canvasContext.current.getImageData(
        0,
        0,
        props.file.width,
        props.file.height
      );
      clear();
      canvasContext.current.putImageData(actualImage, 0, 0);
    }
  };

  const onDragStart = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).className == "board-action-bar") {
      props.onDragStart(event);
      return;
    }
  };

  function onCloseAction(fileName: string) {
    props.closeAction(fileName);
  }

  const onCanvasClicked = (event:  React.MouseEvent) => {
    oldPointer.current = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    }; //to_canvas_coords(event) //to_canvas_coords(event)

    setDrawing(true);
  };

  const onCanvasMoved = (event: React.MouseEvent) => {
    if (!isDrawing) return;
    const pointer = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    }; //to_canvas_coords(event)

    if(canvasContext.current != undefined && oldPointer.current != undefined) {
      canvasContext.current.fillStyle = "black";
      //Brush size > 1 ?
      const iterate_line = 100 > 1 ? brosandham_line : bresenham_line;
      iterate_line(
        oldPointer.current.x,
        oldPointer.current.y,
        pointer.x,
        pointer.y,
        (x, y) => {
          if(canvasContext.current != undefined) {
            canvasContext.current.fillRect(x, y, 100, 100);
          }
        }
      );
  
      oldPointer.current = pointer;
    }
  
  };

  /*function to_canvas_coords({ clientX: number, clientY: number }) {
    const rect = canvas.current.getBoundingClientRect();
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    return {
      x: ~~((cx / rect.width) * canvas.current.width),
      y: ~~((cy / rect.height) * canvas.current.height),
    };
  }*/

  function bresenham_line(x1: number, y1: number, x2: number, y2: number, callback: (x: number, y: number) => void) {
    // Bresenham's line algorithm
    x1 = ~~x1;
    x2 = ~~x2;
    y1 = ~~y1;
    y2 = ~~y2;

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      callback(x1, y1);

      if (x1 === x2 && y1 === y2) break;
      const e2 = err * 2;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  }

  function brosandham_line(x1: number, y1: number, x2: number, y2: number, callback: (x: number, y: number) => void) {
    // Bresenham's line argorithm with a callback between going horizontal and vertical
    x1 = ~~x1;
    x2 = ~~x2;
    y1 = ~~y1;
    y2 = ~~y2;

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const sx = x1 < x2 ? 1 : -1;
    const sy = y1 < y2 ? 1 : -1;
    let err = dx - dy;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      callback(x1, y1);

      if (x1 === x2 && y1 === y2) break;
      const e2 = err * 2;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      callback(x1, y1);
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
    }
  }

  const onCanvasReleased = (event: React.MouseEvent) => {
    if(canvasContext.current != undefined) {
      canvasContext.current.closePath();
      setDrawing(false);
    }
  };

  const onScroll = (event: React.MouseEvent) => {
    /* const xPos = event.nativeEvent.offsetX
        const yPos = event.nativeEvent.offsetY*/
    //canvasContext.current.scale(1.5, 1.5);

    const xPos = event.nativeEvent.offsetX;
    const yPos = event.nativeEvent.offsetY;
    //clear()

    //const canvasData = canvas.current.canvasData

    /* canvasContext.current.drawImage(canvasData, Math.abs(xPos - 5),
        Math.abs(yPos - 5), 50,50, 0, 0,
        300, 300)*/

    // draw()
    // canvasContext.current.drawImage(props.file, xPos, yPos, props.file.width+event.nativeEvent.wheelDeltaY, props.file.height+event.nativeEvent.wheelDeltaY)

    // canvasContext.current.scale(2,2)
   /* const newWidth = canvas.current.width * 2;
    const newHeight = canvas.current.height * 2;*/
/*
    const image_data = canvasContext.current.getImageData(
      0,
      0,
      canvas.current.width,
      canvas.current.height
    );
    console.log(canvas.current)
    //canvas.current.width = newWidth;
    //canvas.current.height = newHeight;

   // const temp_canvas = make_canvas(image_data);
    var img = document.createElement("img");
    img.src = canvas.current.toDataURL("image/png")
    img.onload = function() {
        canvasContext.current.clearRect(0, 0, canvas.current.width, canvas.current.height);
        canvasContext.current.drawImage(resize(img, 2, 0), 0, 0);
    }
*/
    // setImageStyle({width: newWidth, height: newHeight})

    //console.log(event.nativeEvent.wheelDeltaY)
  };

  /*var resize = function(img,scale,id){

    var zoom=parseInt(img.zoom*scale);
    if(zoom<1){
      console.log('Cannot recale image to less than original size');
      return;
    }
  
    // get the pixels from the original img using a canvas
    var c1=document.createElement('canvas');
    var cw1=c1.width=img.width;
    var ch1=c1.height=img.height;
    var ctx1=c1.getContext('2d');
    ctx1.drawImage(img,0,0);
    var imgData1=ctx1.getImageData(0,0,cw1,ch1);
    var data1=imgData1.data;
  
    // create a canvas to hold the resized pixels
    var c2=document.createElement('canvas');
    c2.id=id;
    c2.zoom=zoom;
    var cw2=c2.width=cw1*scale;
    var ch2=c2.height=ch1*scale;
    var ctx2=c2.getContext('2d');
    var imgData2=ctx2.getImageData(0,0,cw2,ch2);
    var data2=imgData2.data;
  
    // copy each source pixel from c1's data1 into the c2's data2
    for(var y=0; y<ch2; y++) {
      for(var x=0; x<cw2; x++) {
        var i1=(Math.floor(y/scale)*cw1+Math.floor(x/scale))*4;
        var i2 =(y*cw2+x)*4;            
        data2[i2]   = data1[i1];
        data2[i2+1] = data1[i1+1];
        data2[i2+2] = data1[i1+2];
        data2[i2+3] = data1[i1+3];
      }
    }
  
    // put the modified pixels back onto c2
    ctx2.putImageData(imgData2,0,0);
  
    // return the canvas with the zoomed pixels
    return(c2);
  }*/

  function make_canvas(width: number, height: number) {
    const image = width;

    const new_canvas = E("canvas") as HTMLCanvasElement;
    const new_ctx = new_canvas.getContext("2d") as CanvasRenderingContext2D;

    // @TODO: simplify the abstraction by defining setters for width/height
    // that reset the image smoothing to disabled
    // and make image smoothing a parameter to make_canvas

    /*new_ctx.copy = (image: HTMLImageElement) => {
      new_canvas.width = image.naturalWidth || image.width;
      new_canvas.height = image.naturalHeight || image.height;

      // setting width/height resets image smoothing (along with everything)
      new_ctx.imageSmoothingEnabled = false;

      if (image instanceof ImageData) {
        new_ctx.putImageData(image, 0, 0);
      } else {
        new_ctx.drawImage(image, 0, 0);
      }
    };

    if (width && height) {
      // make_canvas(width, height)
      new_canvas.width = width;
      new_canvas.height = height;
      // setting width/height resets image smoothing (along with everything)
      new_ctx.disable_image_smoothing();
    } else if (image) {
      // make_canvas(image)
      new_ctx.copy(image);
    }*/

    return new_canvas;
  }

  function E(t: string) {
    return document.createElement(t);
  }

  return (
    <Box
      className="board"
      style={boardStyle}
      boxShadow={2}
      onMouseDown={(event: React.MouseEvent) => props.onBoardSelected(event)}
    >
      <div
        className="board-action-bar"
        onMouseDown={onDragStart}
        style={actionBarStyle}
      >
        <img className="board-icon" src={board_icon} height={25} width={25} />
        <div className="board-title">
          <p>{props.file.name}</p>
        </div>
        <div className="board-close-button">
          <IconButton
            aria-label="delete"
            onClick={() => onCloseAction(props.file.name)}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </div>

      <div className="board-content" style={Object.assign({}, imageStyle)}>
        <canvas
          ref={canvas}
          className="board-content-canvas"
          onMouseDown={onCanvasClicked}
          onMouseMove={onCanvasMoved}
          onMouseUp={onCanvasReleased}
          onWheel={onScroll}
          width={imageStyle.width}
          height={imageStyle.height}
        />
      </div>
    </Box>
  );
});

export default Child;
