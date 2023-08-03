import styled from 'styled-components';

import { StepperItemModel } from './models/stepper-item.model';

const StepperItem = (item: StepperItemModel) => {
  return (
    <Container>
      <Item>
        <Line></Line>
        {item.status === 'active' ? (
          <ActiveState />
        ) : item.status === 'finish' ? (
          <FinishState />
        ) : (
          <DefaultState />
        )}
        {/* <Line></Line> */}
      </Item>
      <Text>{item.label}</Text>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 210px;
`;

const FinishState = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: blue;
  border: 1px solid transparent;
  z-index: 2;
`;

const ActiveState = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid blue;
  background-color: white;
  z-index: 2;
`;

const DefaultState = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid gray;
  background-color: white;
  z-index: 2;
`;

const Item = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Line = styled.div`
  position: absolute;
  height: 1px;
  background-color: #c9c9c9;
  width: 100%;
  z-index: 1;
`;

const Text = styled.span`
  display: block;
  text-align: center;
  margin-top: 8px;
  font-size: 12px;
  color: gray;
`;

export default StepperItem;
