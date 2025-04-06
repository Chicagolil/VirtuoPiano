import React from 'react';
import { IconType } from 'react-icons';
import styles from './Card.module.css';

interface CardProps {
  color: string;
  text: string;
  icon: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ color, text, icon }) => {
  return (
    <div className={styles.card} style={{ backgroundColor: color }}>
      <div className={styles.icon}>{icon}</div>
      <p className={styles.text}>{text}</p>
    </div>
  );
};

export default Card;
