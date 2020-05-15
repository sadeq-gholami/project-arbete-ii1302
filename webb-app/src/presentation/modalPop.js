import React from 'react';
import {Modal, Button} from 'react-bootstrap';
const ModalPop = ({closePopup, handleSubmit, props, children})=>{
    return ( 
        <div id = "bg-modal">  
          <Modal.Dialog>
            <Modal.Header>
                 <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {children}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick ={handleSubmit}>{props.button}</Button>
            </Modal.Footer>
        </Modal.Dialog> 
      </div>
    );
}
export default ModalPop;