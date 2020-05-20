import React from 'react'
import {Tab} from 'semantic-ui-react'
import ProfilePhotos from './ProfilePhotos'
import ProfileDescription from './ProfileDescription'
import { observer } from 'mobx-react-lite'
import ProfileFollowings from './ProfileFollowings'
import ProfileActivities from './ProfileActivities'

interface IProps {
    setActiveTab: (activeIndex: any) => void;
}

const ProfileContent: React.FC<IProps> = ({setActiveTab})=> {
    const panes = [
        {menuItem: 'About', render: () => <ProfileDescription />},
        {menuItem: 'Photos', render: () => <ProfilePhotos />},
        {menuItem: 'Activities', render: () => <ProfileActivities />},
        {menuItem: 'Followers', render: () => <ProfileFollowings />},
        {menuItem: 'Following', render: () => <ProfileFollowings />}
    ]

    return (
        <Tab 
            menu={{fluid:true, vertical:true}}
            menuPosition='right'
            panes={panes}
            onTabChange={(e, data) => setActiveTab(data.activeIndex)} // this needs to make sure active index is number for us
        />
    )
}

export default observer(ProfileContent);