import {User} from './user'

export interface UpdateUserProps {
    user: User;
    onUpdate: (updatedUser: User) => void;
}