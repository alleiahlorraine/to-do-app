import React from 'react';
import './fulltext.css';

function FullText({ isOpen, onClose, text }) {
    if (!isOpen) return null;

    return (
        <div className="full-text-overlay">
            <button className="close-button" onClick={onClose}>Close</button>
            <div className="full-text-content">
                <p>{text}</p>
            </div>
        </div>
    );
}

export default FullText;
