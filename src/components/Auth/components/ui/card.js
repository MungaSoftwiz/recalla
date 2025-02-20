import React from 'react';
import { Card as MuiCard, CardHeader as MuiCardHeader, CardContent as MuiCardContent, Typography } from '@mui/material';

export function Card({ children, ...props }) {
  return <MuiCard {...props}>{children}</MuiCard>;
}

export function CardHeader({ title, ...props }) {
  return <MuiCardHeader title={title} {...props} />;
}

export function CardTitle({ children, ...props }) {
  return (
    <Typography variant="h5" {...props}>
      {children}
    </Typography>
  );
}

export function CardContent({ children, ...props }) {
  return <MuiCardContent {...props}>{children}</MuiCardContent>;
}