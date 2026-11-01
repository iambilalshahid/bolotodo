import { Instance, types } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { TodosStore } from './TodosStore';
import { UIStore } from './UIStore';

export const RootStore = types.model('RootStore', {
  todosStore: TodosStore,
  uiStore: UIStore,
});

export type RootStoreInstance = Instance<typeof RootStore>;

export const rootStore = RootStore.create({
  todosStore: { todos: [] },
  uiStore: {},
});

const RootStoreContext = createContext<RootStoreInstance | null>(null);

export const RootStoreProvider = RootStoreContext.Provider;

export function useRootStore(): RootStoreInstance {
  const store = useContext(RootStoreContext);
  if (!store) {
    return rootStore;
  }
  return store;
}