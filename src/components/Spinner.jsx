import React from 'react';
import { cn } from '../utils/cn';

export const Spinner = ({ className, size = 'default' }) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    default: 'h-6 w-6 border-3',
    large: 'h-8 w-8 border-4'
  };

  return (
    <div className={cn(
      'animate-spin rounded-full border-t-transparent border-dark-accent',
      sizeClasses[size],
      className
    )} />
  );
};