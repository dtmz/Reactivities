import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

// forces you to only mutate state in an action. Anything inside a try/catch or await calls are not.
// Must use runInAction
configure({enforceActions: 'always'}); 

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';
 
    @computed get activitiesByDate() {
        // return an iterable of values in the map after sorting by array
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
        
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.split('T')[0]; // get time from date string
            activities[date] = activities[date] ? 
                [...activities[date], activity] :  // ... spreads the activities array and adds activity at the end
                [activity];
            return activities;
        }, {} as {[key: string]: IActivity[]}));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction('loading activities', () => {
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            });
            console.log(this.groupActivitiesByDate(activities));
        } catch(error) {            
            runInAction('loading activities error', () => { 
                this.loadingInitial = false;
            });
            console.log(error);
        } 
        
        // above does the same as then chain below
        // agent.Activities.list()        
        //     .then((activities) => {
        //         activities.forEach(activity => {
        //             activity.date = activity.date.split('.')[0];
        //             this.activities.push(activity);
        //         });
        //     })
        //     .catch(error => console.log(error))
        //     .finally(() => this.loadingInitial = false);
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
        }
        else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction('getting activity', () => {
                    this.activity = activity;
                    this.loadingInitial = false;
                });
            }
            catch(error) {
                runInAction('get activity error', () => { 
                    this.loadingInitial = false;
                });
                console.log(error);
            }
        }
    }
    // helper function for load activity
    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action clearActivity = () => {
        this.activity = null;
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('create activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            });
        } catch(error) {
            runInAction('create activity error', () => {
                this.submitting = false;
            });
            console.log(error);
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('edit activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            });
        } catch(error) {
            runInAction('edit activity error', () => {
                this.submitting = false;
                this.activity = activity;
            });
            console.log(error);
        } 
    }

    //
    //  Delete Activity
    //
    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;

        try {
            await agent.Activities.delete(id);
            runInAction('delete activity', () => {
                this.activityRegistry.delete(id);   
                this.submitting = false;
                this.target = '';
            });         
        } catch(error) {
            runInAction('delete activity error', () => {
                this.submitting = false;
                this.target = '';
            });
            console.log(error);
        }
    }
}

export default createContext(new ActivityStore())