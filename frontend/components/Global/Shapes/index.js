import React from 'react';
import styles from './shapes.css';

export const ArrowUp = ({ active, id }) => <div id={id} className={`${active ? styles.arrowUp : styles.inactiveArrowUp}`} />
export const ArrowDown = ({ active,id }) => <div id={id} className={`${active ? styles.arrowDown : styles.inactiveArrowDown}`} />
