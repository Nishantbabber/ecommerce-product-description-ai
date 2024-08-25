import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../styles/finalizeDescriptionModal.css';

const FinalizeDescriptionModal = ({ show, handleClose, handleSave, handleEditAgain, productData }) => {
    return (
        <Modal show={show} onHide={handleClose} className="finalize-description-modal">
            <Modal.Header>
                <Modal.Title>Finalize Description</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{productData.description}</p> 
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleEditAgain}>
                    Enhanced Again
                </Button>
                <Button variant="success" onClick={handleSave}>
                    Approve & Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FinalizeDescriptionModal;
