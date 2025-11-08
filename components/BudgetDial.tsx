import React, { useState, useEffect, useRef } from 'react';
import { StarIcon } from './icons';
import { TrackerType } from '../types';

const AnimatedNumber: React.FC<{ value: number; isCurrency?: boolean; isScore?: boolean }> = ({ value, isCurrency, isScore }) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    const startValue = currentValue;
    const animationDuration = 500; // ms
    const frameDuration = 1000 / 60; // 60 fps
    const totalFrames = Math.round(animationDuration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const nextValue = startValue + (value - startValue) * easedProgress;

      setCurrentValue(nextValue);

      if (frame === totalFrames) {
        clearInterval(counter);
        setCurrentValue(value);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [value]);

  if (isCurrency) {
    return <>{`$${Math.round(currentValue).toLocaleString()}`}</>;
  }
  if (isScore) {
      return <>{Math.round(currentValue)}</>
  }
  return <>{Math.round(currentValue)}</>;
};

const PolarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const DescribeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number): string => {
  const start = PolarToCartesian(x, y, radius, endAngle);
  const end = PolarToCartesian(x, y, radius, startAngle);
  // arc sweep flag must be changed for angles over 180 degrees
  const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
  const d = [
    "M", start.x, start.y, 
    "A", radius, radius, 0, arcSweep, 0, end.x, end.y
  ].join(" ");
  return d;
};

interface BudgetDialProps {
  title: string;
  currentValue: number;
  target: number;
  onTargetChange: (newTarget: number) => void;
  type: TrackerType;
}

const BudgetDial: React.FC<BudgetDialProps> = ({ title, currentValue, target, onTargetChange, type }) => {
  const [displayValue, setDisplayValue] = useState(0); 
  const MIN_BUDGET = 100;

  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragAngle, setDragAngle] = useState<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    const startValue = displayValue;
    const animationDuration = 500;
    let startTime: number;

    const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        const nextValue = startValue + (currentValue - startValue) * easedProgress;
        setDisplayValue(nextValue);

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            setDisplayValue(currentValue);
        }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
}, [currentValue]);


  const handleGoalButtonClick = (increment: number) => {
    const suggestedIncrement = increment > 0 ? 250 : -250;
    onTargetChange(Math.max(MIN_BUDGET, target + suggestedIncrement));
  };
  
  const startAngle = -120;
  const endAngle = 120;
  const totalAngle = endAngle - startAngle;

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (type === 'credit-score') return; // Don't allow dragging for credit score
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleInteractionEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragAngle(null);
    }
  };

  const handleInteractionMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging || !svgRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;

    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    if (angle > 120 && angle < 240) {
        angle = Math.abs(angle - 120) < Math.abs(angle - 240) ? 120 : 240;
    }

    let newAngle = angle > 180 ? angle - 360 : angle;
    setDragAngle(newAngle);

    const percentage = ((newAngle - startAngle) / totalAngle) * 100;
    
    if (percentage > 0.1) {
        const newTarget = currentValue / (percentage / 100);
        onTargetChange(Math.round(Math.max(MIN_BUDGET, Math.min(newTarget, 50000))));
    } else {
        onTargetChange(50000);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleInteractionMove);
      window.addEventListener('touchmove', handleInteractionMove);
      window.addEventListener('mouseup', handleInteractionEnd);
      window.addEventListener('touchend', handleInteractionEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleInteractionMove);
      window.removeEventListener('touchmove', handleInteractionMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [isDragging, currentValue]);

  let percentage = 0;
  if (type === 'credit-score') {
    const minScore = 300;
    const maxScore = 850;
    // Clamp the score within the valid range for calculation
    const score = Math.max(minScore, Math.min(currentValue, maxScore));
    percentage = ((score - minScore) / (maxScore - minScore)) * 100;
  } else {
    percentage = target > 0 ? Math.min((currentValue / target) * 100, 100) : 0;
  }

  const currentAngle = startAngle + (percentage / 100) * totalAngle;
  const displayAngle = dragAngle ?? currentAngle;

  const svgSize = 350;
  const radius = 115;
  const center = svgSize / 2;
  const strokeWidth = 20;
  const gradientId = "budgetGradient";

  const handlePosition = PolarToCartesian(center, center, radius, displayAngle);

  const numTicks = 24;
  const ticks = Array.from({ length: numTicks + 1 }).map((_, i) => {
    const angle = startAngle + i * (totalAngle / numTicks);
    const start = PolarToCartesian(center, center, radius + strokeWidth/2 + 2, angle);
    const end = PolarToCartesian(center, center, radius + strokeWidth/2 + 6, angle);
    return { x1: start.x, y1: start.y, x2: end.x, y2: end.y, key: `tick-${i}`};
  });

  const labelRadius = radius + 40;
  const startLabelPos = PolarToCartesian(center, center, labelRadius, startAngle + 5);
  const midLabelPos = PolarToCartesian(center, center, labelRadius, 0);
  const endLabelPos = PolarToCartesian(center, center, labelRadius, endAngle - 5);


  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center h-full">
      <div className="absolute flex items-center justify-center">
        <svg ref={svgRef} width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#F87171" />
            </linearGradient>
            <filter id="handleShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#A855F7" floodOpacity="0.5"/>
            </filter>
          </defs>

          <g>
            {ticks.map(tick => (
                <line {...tick} stroke="#E0E0E0" strokeWidth="2" />
            ))}
          </g>

          <g fill="#A0AEC0" fontSize="14" fontWeight="600" textAnchor="middle">
            <text x={startLabelPos.x} y={startLabelPos.y}>{type === 'credit-score' ? '300' : '$0'}</text>
            <text x={midLabelPos.x} y={midLabelPos.y}>{type === 'credit-score' ? '575' : `$${(target/2000).toFixed(1)}k`}</text>
            <text x={endLabelPos.x} y={endLabelPos.y}>{type === 'credit-score' ? '850' : `$${(target/1000).toFixed(1)}k`}</text>
          </g>

          <path
            d={DescribeArc(center, center, radius, startAngle, endAngle)}
            fill="none"
            stroke="#F0F1F5"
            strokeWidth={strokeWidth}
          />
          <path
            d={DescribeArc(center, center, radius, startAngle, currentAngle)}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ transition: 'd 0.5s ease-out' }}
          />
           <g 
            onMouseDown={handleInteractionStart} 
            onTouchStart={handleInteractionStart}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
           >
            <circle cx={handlePosition.x} cy={handlePosition.y} r="20" fill="transparent"/>
            <circle
              cx={handlePosition.x}
              cy={handlePosition.y}
              r="8"
              fill="white"
              stroke="#A855F7"
              strokeWidth="3"
              filter="url(#handleShadow)"
              style={{
                  transition: isDragging ? 'none' : 'cx 0.5s ease-out, cy 0.5s ease-out',
                  pointerEvents: 'none'
              }}
            />
          </g>
        </svg>
      </div>

      <div className="relative bg-white rounded-full w-56 h-56 flex flex-col items-center justify-center shadow-2xl z-10 text-center">
        <span className="text-gray-400 font-semibold text-sm px-4">{title}</span>
        <div className="text-5xl font-bold text-[#1A202C] my-1">
          <AnimatedNumber value={target} isCurrency={type !== 'credit-score'} isScore={type === 'credit-score'} />
        </div>
        <span className="text-gray-400 font-semibold text-sm">
            {type === 'spending' ? 'Spent' : 'Current'}: {type !== 'credit-score' && '$'}{Math.round(displayValue).toLocaleString()}
        </span>
      </div>
      
      {type !== 'credit-score' && (
        <>
          <button 
            onClick={() => handleGoalButtonClick(-250)}
            className="group absolute left-24 bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 z-20 flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-400">-</span>
          </button>
          <button 
            onClick={() => handleGoalButtonClick(250)}
            className="group absolute right-24 bg-white p-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 z-20 flex items-center space-x-2">
            <StarIcon className="w-4 h-4 text-purple-400"/>
            <span className="text-2xl font-bold text-gray-400">+</span>
          </button>
        </>
      )}

      <div className="absolute -bottom-8 flex flex-col items-center">
        <div className="flex space-x-1 items-center justify-center h-4">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
        </div>
        <span className="text-sm text-gray-400 font-semibold mt-1">18d left</span>
      </div>
    </div>
  );
};

export default BudgetDial;