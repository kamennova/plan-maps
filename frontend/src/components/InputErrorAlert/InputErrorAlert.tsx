import React, { CSSProperties } from 'react';

export const InputErrorAlert = (props: {children: string, style?: CSSProperties}) => {
  return (
      <p style={{
          display: 'inline-block',
          width: '100%',
          margin: '0 0 14px',
          padding: '7px 5px',
          fontSize: '13px',
          color: 'red',
          backgroundColor: '#ffebef',
          ...props.style
      }}>
          {props.children}
      </p>
  );
};
