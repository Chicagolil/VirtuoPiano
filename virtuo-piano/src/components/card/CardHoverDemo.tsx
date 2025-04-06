import React from 'react';
import Card from './Card';

const CardHoverDemo: React.FC = () => {
  // Instructions
  const instructionStyle: React.CSSProperties = {
    color: '#fff',
    textAlign: 'center',
    gridColumn: '1 / -1',
    padding: '1rem',
    fontSize: '1.2rem',
    position: 'relative',
    zIndex: 1,
  };

  const cardContainerStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
  };

  return (
    <>
      <div style={cardContainerStyle}>
        <Card
          text="Code"
          activeColor="#e0f2fe"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentcolor"
              viewBox="0 0 256 256"
            >
              <path d="M67.84,92.61,25.37,128l42.47,35.39a6,6,0,1,1-7.68,9.22l-48-40a6,6,0,0,1,0-9.22l48-40a6,6,0,0,1,7.68,9.22Zm176,30.78-48-40a6,6,0,1,0-7.68,9.22L230.63,128l-42.47,35.39a6,6,0,1,0,7.68,9.22l48-40a6,6,0,0,0,0-9.22Zm-81.79-89A6,6,0,0,0,154.36,38l-64,176A6,6,0,0,0,94,221.64a6.15,6.15,0,0,0,2,.36,6,6,0,0,0,5.64-3.95l64-176A6,6,0,0,0,162.05,34.36Z"></path>
            </svg>
          }
          pixelProps={{
            colors: ['#e0f2fe', '#7dd3fc', '#0ea5e9', '#fef08a', '#fde047'],
            gap: 10,
            speed: 25,
          }}
        />
      </div>

      <div style={cardContainerStyle}>
        <Card
          text="Command"
          activeColor="#fef08a"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentcolor"
              viewBox="0 0 256 256"
            >
              <path d="M180,146H158V110h22a34,34,0,1,0-34-34V98H110V76a34,34,0,1,0-34,34H98v36H76a34,34,0,1,0,34,34V158h36v22a34,34,0,1,0,34-34ZM158,76a22,22,0,1,1,22,22H158ZM54,76a22,22,0,0,1,44,0V98H76A22,22,0,0,1,54,76ZM98,180a22,22,0,1,1-22-22H98Zm12-70h36v36H110Zm70,92a22,22,0,0,1-22-22V158h22a22,22,0,0,1,0,44Z"></path>
            </svg>
          }
          pixelProps={{
            colors: ['#fef08a', '#fde047', '#eab308'],
            gap: 10,
            speed: 40,
          }}
        />
      </div>

      <div style={cardContainerStyle}>
        <Card
          text="Dropper"
          activeColor="#fecdd3"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentcolor"
              viewBox="0 0 256 256"
            >
              <path d="M222,67.34a33.81,33.81,0,0,0-10.64-24.25C198.12,30.56,176.68,31,163.54,44.18L142.82,65l-.63-.63a22,22,0,0,0-31.11,0l-9,9a14,14,0,0,0,0,19.81l3.47,3.47L53.14,149.1a37.81,37.81,0,0,0-9.84,36.73l-8.31,19a11.68,11.68,0,0,0,2.46,13A13.91,13.91,0,0,0,47.32,222,14.15,14.15,0,0,0,53,220.82L71,212.92a37.92,37.92,0,0,0,35.84-10.07l52.44-52.46,3.47,3.48a14,14,0,0,0,19.8,0l9-9a22.06,22.06,0,0,0,0-31.13l-.66-.65L212,91.85A33.76,33.76,0,0,0,222,67.34Zm-123.61,127a26,26,0,0,1-26,6.47,6,6,0,0,0-4.17.24l-20,8.75a2,2,0,0,1-2.09-.31l9.12-20.9a5.94,5.94,0,0,0,.19-4.31A25.91,25.91,0,0,1,56,166h70.78ZM138.78,154H65.24l48.83-48.84,36.76,36.78Zm64.77-70.59L178.17,108.9a6,6,0,0,0,0,8.47l4.88,4.89a10,10,0,0,1,0,14.15l-9,9a2,2,0,0,1-2.82,0l-60.69-60.7a2,2,0,0,1,0-2.83l9-9a10,10,0,0,1,14.14,0l4.89,4.89a6,6,0,0,0,4.24,1.75h0a6,6,0,0,0,4.25-1.77L172,52.66c8.57-8.58,22.51-9,31.07-.85a22,22,0,0,1,.44,31.57Z"></path>
            </svg>
          }
          pixelProps={{
            colors: ['#fecdd3', '#fda4af', '#e11d48'],
            gap: 6,
            speed: 80,
          }}
        />
      </div>

      <div style={cardContainerStyle}>
        <Card
          text="Leaf"
          activeColor="#bbf7d0"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentcolor"
              viewBox="0 0 256 256"
            >
              <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-42.34-77.66a8,8,0,0,1-11.32,11.32L136,139.31V184a8,8,0,0,1-16,0V139.31l-10.34,10.35a8,8,0,0,1-11.32-11.32l24-24a8,8,0,0,1,11.32,0Z"></path>
            </svg>
          }
          pixelProps={{
            colors: ['#bbf7d0', '#86efac', '#22c55e'],
            gap: 6,
            speed: 40,
          }}
        />
      </div>
    </>
  );
};

export default CardHoverDemo;
