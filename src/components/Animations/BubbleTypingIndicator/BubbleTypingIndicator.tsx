// src/components/BubbleTypingIndicator.tsx
import React from 'react';
import styles from './BubbleTypingIndicator.module.css'; // Import the CSS module

const BubbleTypingIndicator: React.FC = () => {
  return (
    <div className={styles.bubbleContainer}>
      <div className={styles.bubble}></div>
      <div className={styles.bubble}></div>
      <div className={styles.bubble}></div>
    </div>
  );
};

export default BubbleTypingIndicator;
