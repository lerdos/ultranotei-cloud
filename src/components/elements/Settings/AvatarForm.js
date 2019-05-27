import React, { useContext, useState } from 'react';

import { AppContext } from '../../ContextProvider';
import { useFormValidation } from '../../../helpers/hooks';

const AvatarForm = () => {
  const { actions, state } = useContext(AppContext);
  const { updateUser } = actions;
  const { layout, user } = state;
  const { formSubmitted, message } = layout;

  const [avatar, setAvatar] = useState(user.avatar);

  const avatarValidation = (avatar && avatar.name);
  const avatarValid = useFormValidation(avatarValidation);

  return (
    <>
      {message && message.avatarForm &&
        <div className="text-danger mg-b-20">{message.avatarForm}</div>
      }
      <div className="input-group">
        <input
          type="file"
          name="avatar"
          className="form-control custom-file-input"
          onChange={e => setAvatar(e.target.files[0])}
        />
        <span className="input-group-btn">
          <button
            className="btn btn-no-focus btn-outline-secondary btn-uppercase-sm"
            type="submit"
            disabled={!avatarValid || formSubmitted}
            onClick={e => {
              const data = new FormData();
              data.append('file', avatar, avatar.name);
              updateUser({ e, avatar: data, id: 'avatarForm' });
            }}
          >
            Change Avatar
          </button>
        </span>
      </div>
      {user.avatar &&
        <img src={user.avatar} alt="avatar" className="mg-t-20" />
      }
    </>
  )
};

export default AvatarForm;
