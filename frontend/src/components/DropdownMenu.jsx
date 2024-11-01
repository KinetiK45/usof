import React, { useState } from 'react';

const DropdownMenu = ({ triggerElement, menuElement }) => {
    const [isMenuVisible, setMenuVisible] = useState(false);

    const handleClick = () => {
        setMenuVisible(!isMenuVisible);
    };

    return (
        <div style={{ position: 'relative' }}>
            <div onClick={handleClick} style={{ cursor: 'pointer' }}>
                {triggerElement}
            </div>
            {isMenuVisible && (
                <div
                    style={{
                        position: 'fixed', // использовать fixed для закрепления меню к экрану
                        top: '60px',
                        right: '0',
                        zIndex: 1,
                    }}
                >
                    {menuElement}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
