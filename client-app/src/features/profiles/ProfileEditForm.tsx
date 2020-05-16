import React from 'react'
import { Button, Form } from 'semantic-ui-react';
import { Field, Form as FinalForm } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { IProfile } from '../../app/models/profile';
import TextInput from '../../app/common/form/TextInput';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { observer } from 'mobx-react-lite';

const validate = combineValidators({
    displayName: isRequired({message: 'Display name is required'})
});

interface IProps {
    updateProfile: (profile: IProfile) => void;
    profile: IProfile;
}

const ProfileEditForm: React.FC<IProps> = ({updateProfile, profile}) => {
    return (    
        <FinalForm 
            onSubmit={updateProfile}
            validate={validate}
            initialValues={profile!}            
            render={({handleSubmit, invalid, pristine, submitting}) => (
                <Form onSubmit={handleSubmit} error>
                    <Field name='displayName' placeholder='Display Name' value={profile!.displayName} component={TextInput} />
                    <Field name='bio' rows={3} placeholder='Biography' value={profile!.bio} component={TextAreaInput} />
                    <Button loading={submitting} floated='right' positive content='Update profile' disabled={invalid || pristine} />
                </Form>   
            )}>
        </FinalForm>        
    )
}

export default observer(ProfileEditForm);