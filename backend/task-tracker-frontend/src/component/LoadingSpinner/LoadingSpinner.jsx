import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 40, color = '#3498db', thickness = 4 }) => {
    return (
        <div
            className="loading-spinner"
            style={{
                width: size,
                height: size,
                border: `${thickness}px solid ${color}`,
                borderTopColor: 'transparent',
            }}
        >loading</div>
    );
};

export default LoadingSpinner;