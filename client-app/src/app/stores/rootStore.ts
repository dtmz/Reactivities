import ActivityStore from './activityStore';
import UserStore from './userStore';
import CommonStore from './commonStore';
import { createContext } from 'react';
import { configure } from 'mobx';
import ModalStore from './modalStore';

// forces you to only mutate state in an action. Anything inside a try/catch or await calls are not.
// Must use runInAction
configure({enforceActions: 'always'}); 

export class RootStore {
    activityStore: ActivityStore;
    userStore: UserStore;
    commonStore: CommonStore;
    modalStore: ModalStore;

    constructor() {
        this.activityStore = new ActivityStore(this);
        this.userStore = new UserStore(this);
        this.commonStore = new CommonStore(this);
        this.modalStore = new ModalStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());