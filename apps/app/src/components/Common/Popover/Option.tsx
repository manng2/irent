import { blue } from '@radix-ui/colors';
import React, { ComponentPropsWithoutRef } from 'react';
import styled from 'styled-components';

const Title = styled.span`
  color: #696969;
`;

const Container = styled.button<{
  hoverBackground?: string;
  customHoverBackgroundColor?: string;
}>`
  padding: 8px 12px;
  border-radius: 4px;
  outline: none;
  border: none;
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: pointer;
  background: transparent;

  &:hover {
    background: ${(props) =>
      props.customHoverBackgroundColor ? props.customHoverBackgroundColor : props.hoverBackground};

    ${Title} {
      color: #fff;
    }
  }
`;

type OptionProps = {
  title: string;
  hoverBackground?: string;
  customHoverBackgroundColor?: string;
  children?: React.ReactNode; // for icon and something else
} & ComponentPropsWithoutRef<'button'>;

export function Option({ color, title, customHoverBackgroundColor = blue.blue8, ...props }: OptionProps) {
  return (
    <Container {...props} customHoverBackgroundColor={customHoverBackgroundColor}>
      <Title color={color}>{title}</Title>
      {props.children}
    </Container>
  );
}
