import { HeartIcon, RulerSquareIcon, StackIcon, ViewVerticalIcon } from '@radix-ui/react-icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '@/components/Common/Button/Button';

import { WardValue } from '../../enums/ward-value.enum';
import { WareHouseModel } from '../../models/warehouse.model';
import { useWarehouseResolver } from '../../resolver/WarehouseResolver';
import { convertTimestampToDate } from '../../utils/convert-timestamp-to-date.util';

const mockWarehouseDetails: WareHouseModel = {
  id: 1,
  name: 'Thien Thai Ho',
  ward: WardValue.HAI_CHAU,
  address: '73 Ha Huy Tap, Thanh Khe, Khue My',
  price: 45,
  area: 100,
  createdDate: 1,
  doorQuantity: 3,
  floors: 3,
};

export const WarehouseDetails = () => {
  const { warehouse, id, isOwner } = useWarehouseResolver();
  const navigate = useNavigate();

  const goToRentingForm = () => {
    navigate(`/warehouse/${id}/renting`);
  };

  return (
    <Container>
      <ImageContainer>
        <Image alt="title" src="https://picsum.photos/seed/picsum/900/300" />
      </ImageContainer>
      <HeaderContainer>
        <Title>{warehouse?.name}</Title>
        <Address>
          {warehouse?.address}. <DirectionText>See on map</DirectionText>
        </Address>
        <Date>Created at: {warehouse?.createdDate ? convertTimestampToDate(warehouse?.createdDate) : ''}</Date>
        <br />
        {!isOwner && (
          <>
            <ButtonContainer>
              <Button disabled={warehouse.rented} onClick={goToRentingForm}>
                {warehouse.rented ? 'Rented' : 'Rent'}
              </Button>
            </ButtonContainer>
            <IconActions>
              <IconActionItem>
                <HeartIcon></HeartIcon>
                <Text>Shortlist</Text>
              </IconActionItem>
            </IconActions>
          </>
        )}

        <MetricsContainer>
          <Price>{warehouse?.price} $ / mth</Price>
          <OtherMetrics>
            <OtherMetricItem>
              <RulerSquareIcon color="#999" height={32} width={32}></RulerSquareIcon>
              <Text>{warehouse?.area} sqrt</Text>
            </OtherMetricItem>
            <OtherMetricItem>
              <ViewVerticalIcon color="#999" height={32} width={32}></ViewVerticalIcon>
              <Text>{warehouse?.doorQuantity} doors</Text>
            </OtherMetricItem>
            <OtherMetricItem>
              <StackIcon color="#999" height={32} width={32}></StackIcon>
              <Text>{warehouse?.floors} floors</Text>
            </OtherMetricItem>
          </OtherMetrics>
        </MetricsContainer>
      </HeaderContainer>
    </Container>
  );
};

const ImageContainer = styled.div`
  width: 100%;
  height: 341px;
  border-radius: 16px;
  overflow: hidden;
  background-color: #8080807a;
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
  object-position: center center;
`;

const HeaderContainer = styled.div`
  position: relative;
`;

const Title = styled.h1``;

const Address = styled.h4``;

const Date = styled.span`
  color: #999;
`;

const DirectionText = styled.span`
  color: #e03c31;
  pointer-events: none;
`;

const IconActions = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

const IconActionItem = styled.div`
  align-items: center;
  display: flex;
  gap: 8px;
  cursor: pointer;

  &:hover {
    color: #999;
  }
`;

const MetricsContainer = styled.div`
  display: flex;
  margin-top: 24px;
  padding: 24px;
  border-top: 1px solid #999;
  border-bottom: 1px solid #999;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.span`
  font-size: 32px;
  font-weight: bold;
`;

const OtherMetrics = styled.div`
  display: flex;
  gap: 24px;
`;

const OtherMetricItem = styled.div`
  text-align: center;
  span {
    margin-top: 8px;
    display: block;
    font-size: 24px;
  }
`;

const Text = styled.span``;

const Container = styled.div``;

const ButtonContainer = styled.div`
  margin-top: 24px;
  text-align: right;
  cursor: pointer;
`;