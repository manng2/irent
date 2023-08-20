import { produce } from 'immer';
import { isEmpty } from 'lodash';
import { createContext, useContext, useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';

import { Loading } from '@/components/Fallback';

import { useAuthStore } from '../../auth';
import { api } from '../../axios/axios';
import { WareHouseModel } from '../../models/warehouse.model';

type WarehouseResolverType = {
  id: string;
  warehouse: WareHouseModel;
  isOwner: boolean;
};

const WarehouseResolverContext = createContext<WarehouseResolverType | undefined>(undefined);

export function useWarehouseResolver() {
  const context = useContext(WarehouseResolverContext);

  if (context === undefined) throw Error(`WarehouseResolver: The component is not inside the resolver`);

  return context;
}

export function WarehouseResolver() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [warehouse, setWarehouse] = useState<WareHouseModel>();
  const isOwner = warehouse?.userId === user?.id;

  useEffect(() => {
    getWarehouse();
  }, [id]);

  const getWarehouse = async () => {
    const warehouse = (await api.get<WareHouseModel>(`warehouse/${id}`, { params: { Includes: 'RentedWarehouses' } }))
      .data;

    setWarehouse(warehouse);
  };

  return (
    <>
      {warehouse !== undefined && id !== undefined ? (
        <WarehouseResolverContext.Provider value={{ warehouse, id, isOwner: isOwner }}>
          <Outlet />
        </WarehouseResolverContext.Provider>
      ) : (
        <Loading />
      )}
    </>
  );
}
