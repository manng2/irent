import { red } from '@radix-ui/colors';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { useAuthStore } from '@/auth';
import { api } from '@/axios/axios';
import { useContract } from '@/hooks';
import { RentedWarehouseStatus } from '@/models/rented-warehouse.model';
import { WareHouseModel } from '@/models/warehouse.model';
import rentedWarehouseService from '@/service/rented-warehouse-service';
import { useMyWarehouseStore } from '@/store/my-warehouse.store';
import { formatPrice } from '@/utils/format-price.util';

import { ConfirmDialog, ConfirmDialogProps, Dialog, DialogProps } from '../Common/Dialog';
import { CustomerPaymentDialog, CustomerPaymentDialogProps } from '../Payment';
import { WarehouseViewCardBase, WarehouseViewCardProps } from '../WarehouseViewCardBase';
import { CardActions } from '../WarehouseViewCardBase/CardOptions';
import { ExtendActionDialogContent } from './ExtendActionDialogContent';

export enum MyWarehouseViewCardType {
  History, // Owner
  Owning, // Owner
  Renting, // Renter
}

type MyWarehouseViewCardProps = {
  warehouse: WareHouseModel;
  type?: MyWarehouseViewCardType;
  onClick?: (id: number) => void;
};

type ActionDialog =
  | {
      type: 'confirm';
      options?: ConfirmDialogProps;
    }
  | {
      type: 'payment';
      options?: CustomerPaymentDialogProps;
    }
  | {
      type: 'dialog';
      options: DialogProps;
    };

// TODO: this component logic need to be bring to the list contain it,
// then make the dialog reusability logic better
export const MyWarehouseViewCard = ({ type = MyWarehouseViewCardType.Renting, ...props }: MyWarehouseViewCardProps) => {
  const warehouse = props.warehouse;
  const fetchMyWarehouses = useMyWarehouseStore((state) => state.fetchMyWarehouses);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { createContract, viewContract } = useContract();

  const [dialogOpen, setDialogOpen] = useState(true);
  const [actionDialog, setActionDialog] = useState<ActionDialog>();

  const getViewCardOptions = (): WarehouseViewCardProps => {
    switch (type) {
      case MyWarehouseViewCardType.Renting:
        return {
          ...props,
          showRentedProgression: true,
          showStatus: true,
          showRentedInfo: true,
          actions: getRentingTypeActions(),
        };
      case MyWarehouseViewCardType.Owning:
        return {
          ...props,
          showPrice: true,
          showStatus: true,
          actions: getOwningTypeActions(),
        };
      case MyWarehouseViewCardType.History:
        return {
          ...props,
          showStatus: true,
          showRentedInfo: true,
          actions: getHistoryTypeActions(),
        };
      default:
        return { ...props, showRentedInfo: true, actions: getHistoryTypeActions() };
    }
  };

  const viewDetailAction = {
    title: 'Xem kho bãi',
    onClick: () => navigate(`/warehouse/${warehouse.id}`),
  };

  const getHistoryTypeActions = useCallback((): CardActions[] => {
    switch (warehouse.rentedInfo?.status) {
      default:
        return [viewDetailAction];
    }
  }, [warehouse.rentedInfo?.status]);

  const getOwningTypeActions = useCallback((): CardActions[] => {
    const confirmCancelActions: CardActions = {
      title: 'Chấp thuận yêu cầu hủy',
      onClick: () => {
        setActionDialog({
          type: 'confirm',
          options: {
            title: 'Yêu cầu hủy thuê',
            children: (
              <>
                <p>Xác nhận chấp thuận yêu cầu hủy thuê?</p>
                <p>Sau khi chấp nhận yêu cầu hủy, người thuê kho của bạn sẽ được nhận lại toàn bộ tiền cọc</p>
              </>
            ),
            onAccept: () => {
              if (warehouse.rentedInfo) {
                rentedWarehouseService.confirmCancelWarehouse(warehouse.rentedInfo.id).finally(() => {
                  fetchMyWarehouses(user);
                });
              }
            },
          },
        });
        setDialogOpen(true);
      },
      customHoverBackgroundColor: red.red9,
    };

    switch (warehouse.rentedInfo?.status) {
      case RentedWarehouseStatus.Canceling:
        return [viewDetailAction, confirmCancelActions];
      default:
        return [viewDetailAction];
    }
  }, [warehouse.rentedInfo?.status]);

  const getRentingTypeActions = useCallback((): CardActions[] => {
    const requestCancelActions: CardActions = {
      title: 'Yêu cầu hủy',
      onClick: () => {
        setActionDialog({
          type: 'confirm',
          options: {
            title: 'Yêu cầu hủy thuê',
            children: (
              <>
                <p>Xác nhận gửi yêu cầu hủy thuê?</p>
                <p>Sau khi gửi yêu cầu hủy, bạn sẽ nhận lại được 1/3 tiền cọc.</p>
              </>
            ),
            onAccept: () => {
              if (warehouse.rentedInfo) {
                rentedWarehouseService.cancelWarehouse(warehouse.rentedInfo.id).finally(() => {
                  fetchMyWarehouses(user);
                });
              }
            },
          },
        });
        setDialogOpen(true);
      },
      customHoverBackgroundColor: red.red9,
    };

    const confirmActions: CardActions = {
      title: 'Thanh toán',
      onClick: handleConfirmAction,
    };

    const extendAction: CardActions = {
      title: 'Gia hạn',
      onClick: handleExtendAction,
    };

    switch (warehouse.rentedInfo?.status) {
      case RentedWarehouseStatus.Waiting:
        return [viewDetailAction, confirmActions, requestCancelActions];
      case RentedWarehouseStatus.Renting:
      case RentedWarehouseStatus.Confirmed:
        return [viewDetailAction, extendAction];
      default:
        return [viewDetailAction];
    }
  }, [warehouse.rentedInfo?.status]);

  const handleConfirmAction = () => {
    const { rentedInfo, userId: ownerId } = warehouse;
    if (rentedInfo) {
      const { confirm, renterId } = rentedInfo;

      const clientSecretPromise = api
        .post<{ clientSecret: string }>('/payment/fee', { amount: confirm, ownerId, userId: renterId })
        .then((response) => {
          return response.data.clientSecret;
        });

      setActionDialog({
        type: 'payment',
        options: {
          clientSecret: () => clientSecretPromise,
          children: (
            <>
              <p>
                Bạn đang thực hiện thanh toán xác nhận thuê kho bãi <strong>{warehouse.name}</strong>
              </p>
              <p>
                Số tiền mà sau đây bạn phải trả là <strong>{formatPrice(warehouse.rentedInfo?.confirm)} VND</strong>
              </p>
            </>
          ),
          onAcceptPay: ({ handlePayment }) => handlePayment(),
        },
      });
      setDialogOpen(true);
    }
  };

  const handleExtendAction = () => {
    setActionDialog({
      type: 'dialog',
      options: {
        children: <ExtendActionDialogContent warehouse={warehouse} />,
        onDialogClose: () => {
          fetchMyWarehouses(user);
          setActionDialog(undefined);
        },
      },
    });
    setDialogOpen(true);
  };

  const handleConfirmPaymentSuccess = () => {
    if (warehouse.rentedInfo)
      rentedWarehouseService.confirmWarehouse(warehouse.rentedInfo.id).then(() => fetchMyWarehouses(user));
  };

  const renderDialog = () => {
    if (actionDialog) {
      switch (actionDialog.type) {
        case 'confirm': {
          const { options } = actionDialog;
          return <ConfirmDialog {...options} open={dialogOpen} onOpenChange={setDialogOpen}></ConfirmDialog>;
        }
        case 'payment': {
          const { options } = actionDialog;
          return (
            <CustomerPaymentDialog
              {...options}
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              onSucceed={handleConfirmPaymentSuccess}
            ></CustomerPaymentDialog>
          );
        }
        case 'dialog': {
          const { options } = actionDialog;
          return <Dialog {...options} open={dialogOpen} onOpenChange={setDialogOpen}></Dialog>;
        }
      }
    }
  };

  return (
    <>
      <WarehouseViewCardBase {...getViewCardOptions()}></WarehouseViewCardBase>
      {renderDialog()}
    </>
  );
};
