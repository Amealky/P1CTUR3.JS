import React, { useEffect, useState, useImperativeHandle, useRef, useCallback } from "react";
import {animated, useSpring} from "react-spring"
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import './NewBoardForm.css';
import { Height } from "@material-ui/icons";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

export default function NewBoardForm({showModal, setShowModal, openNewBoard}){ 

    const [width, setWidth] = useState(1)
    const [height, setHeight] = useState(1)
    const [name, setName] = useState("")

    /*const modalRefBackground = useRef();

   const animation = useSpring({
        config: {
            duration: 250
        },
        opacity: showModal ? 1 : 0,
        transform: showModal ? 'translateY(-10%)' : 'translateY(-100%)'
    }) 

    const closeModal = event => {
        if(event.target == modalRefBackground.current){
            setShowModal(false)
        }
    }

    const keyPress = useCallback(e => {
        console.log(e)
        if(e.key === 'Escape' && showModal){
            setShowModal(false)
        }
    }, [setShowModal, showModal])


    useEffect(() => {
        if(showModal){
            document.addEventListener('keydown', keyPress);
        }
        return  () => document.removeEventListener('keydown', keyPress)
    }, [keyPress])*/


  const handleClose = () => {
    setHeight(1)
    setWidth(1)
    setName("")
    setShowModal(false);
  };

  const createNewBoard= () => {
    handleClose()
    openNewBoard(width, height, name)
  }


    return (
        <Dialog
        open={showModal}
        TransitionComponent={Transition}
        onClose={handleClose}>
        <DialogTitle id="alert-dialog-slide-title">Nouveau Dessin</DialogTitle>
        <DialogContent >
    
            <div className="dialog-content">
                <TextField autoFocus id="outlined-basic" 
                label="Largeur"  
                value={width}  
                type="number" 
                variant="outlined" 
                onChange={event => setWidth(event.target.value)}
                error={width == 0}/>

                <TextField id="outlined-basic" 
                label="Longueur" 
                value={height}
                type="number"
                variant="outlined"
                onChange={event => setHeight(event.target.value)}
                error={height == 0} />

            </div>
            
            <div className="dialog-content">
                <TextField id="outlined-basic" 
                label="Nom ( Optionnel )"
                value={name}
                variant="outlined"
                onChange={event => setName(event.target.value)} />
            </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={createNewBoard} color="primary">
            Valider
          </Button>
        </DialogActions>
      </Dialog>
        
    )
}