import React from 'react';
import './modal.css';

function Modal({ isOpen, onClose, onConfirm, message, confirmText, cancelText }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-buttons">
                    <button className="confirm-button" onClick={onConfirm}>{confirmText}</button>
                    {cancelText && <button className="cancel-button" onClick={onClose}>{cancelText}</button>}
                </div>
            </div>
        </div>
    );
}

export default Modal;
