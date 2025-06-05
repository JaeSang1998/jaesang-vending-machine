import { useSyncExternalStore, useRef } from "react";
import { store, type Snapshot } from "@/core/store/vending-store";
import {
  VendingMachineActions,
  VendingMachineAdminActions,
} from "@/types/vending-machine";

const identity = <T>(x: T): T => x;
export function useVendingStore(): Snapshot;
export function useVendingStore<U>(selector: (state: Snapshot) => U): U;
export function useVendingStore<U = Snapshot>(
  selector: VendingSelector<U> = identity as VendingSelector<U>
) {
  return useSyncExternalStore(store.subscribe, usePreservedSnapshot(selector));
}

export function useVendingMachineActions(): VendingMachineActions {
  return {
    insertCash: store.actions.insertCash,
    selectProduct: store.actions.selectProduct,
    cancel: store.actions.cancel,
    insertCard: store.actions.insertCard,
    disconnectCard: store.actions.disconnectCard,
  };
}

export function useVendingAdminActions(): VendingMachineAdminActions {
  return {
    refillCash: store.adminActions.refillCash,
    updateProductStock: store.adminActions.updateProductStock,
  };
}

export type VendingSelector<T> = (state: Snapshot) => T;

const usePreservedSnapshot = <U>(selector: VendingSelector<U>) => {
  const lastSnapshot = useRef<Snapshot>();
  const lastResult = useRef<U>();

  const getSnapshot = () => {
    const snapshot = store.getSnapshot();
    if (lastSnapshot.current === snapshot && lastResult.current !== undefined) {
      return lastResult.current;
    }

    const result = selector(snapshot);
    lastSnapshot.current = snapshot;
    lastResult.current = result;

    return result;
  };

  return getSnapshot;
};
