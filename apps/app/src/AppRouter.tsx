import React from 'react';
import { Route, Routes } from 'react-router-dom';

import CreateWarehouse from './containers/CreateWarehouse/CreateWarehouse';
import Home from './containers/Home/Home';
import ListWarehouse from './containers/ListWarehouse/ListWarehouse';
import Login from './containers/Login/Login';
import RentingForm from './containers/RentingForm/RentingForm';
import SignUp from './containers/SignUp/SignUp';
import WarehouseDetails from './containers/WarehouseDetails/WarehouseDetails';

const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<Login />} path="/login" />
      <Route element={<SignUp />} path="/sign-up" />
      <Route element={<Home />} path="/home" />
      <Route element={<ListWarehouse />} path="/list" />
      <Route element={<WarehouseDetails />} path="/warehouse/:id" />
      <Route element={<RentingForm />} path="/warehouse/:id/renting" />
      <Route element={<CreateWarehouse />} path="/create" />
      <Route element={<Login />} path="*" />
    </Routes>
  );
};

export default AppRouter;
