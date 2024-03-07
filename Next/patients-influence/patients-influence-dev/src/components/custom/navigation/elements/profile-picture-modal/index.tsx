import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TProfilePicture } from 'components/custom/navigation/elements/profile-picture-modal/types';
import {
  ProfilePictureMain,
  ProfileUpload,
  ProfilePicture,
  ProfileZoom,
  ProfileInfo,
  ProfileSpan,
  ProfileActions,
} from 'components/custom/navigation/elements/profile-picture-modal/styles';
import { Button, Input, Slider } from 'components/ui';
import { Stack } from 'components/system';
import { UploadIcon } from 'components/svg';
import { useAppContext } from 'context';
import {
  ChangeEmailModal,
  ChangePasswordModal,
} from 'features/account/role/ambasador/elements';
import { useModal } from 'hooks';
import { pick, read } from '@costorgroup/file-manager';

const ProfilePictureModal = ({ onClose, ...props }: TProfilePicture) => {
  const [picture, setPicture] = useState<any>(
    'https://static.intercomassets.com/avatars/5017590/square_128/NIX-1623671396.jpg'
  );

  const handleFile = async () => {
    const file = await pick();
    const dataSource = await read(file as File, 'data-url');
    setPicture(dataSource);
  };

  const [filter, setFilter] = useState({
    firstname: '',
    lastName: '',
  });

  const { role } = useAppContext();

  const [ceModal, openCeModal, closeCeModal] = useModal(false);
  const [cpModal, openCpModal, closeCpModal] = useModal(false);

  return (
    <Modal
      size="small"
      title="Profile Picture"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Save
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <Stack>
        <ProfilePictureMain>
          {['ADMIN', 'SUPERADMIN'].includes(role) && (
            <ProfileUpload onClick={handleFile}>
              <UploadIcon />
              Upload image
            </ProfileUpload>
          )}
          <ProfilePicture src={picture} />
          <ProfileZoom>
            <Slider />
          </ProfileZoom>
          {role === 'ADMIN' ||
            (role === 'SUPERADMIN' && (
              <ProfileInfo>
                <Input
                  type="text"
                  label="First Name"
                  placeholder="John"
                  value={filter.firstname}
                  onValue={(firstname) => setFilter({ ...filter, firstname })}
                />
                <Input
                  type="text"
                  label="Last Name"
                  placeholder="Doe"
                  value={filter.lastName}
                  onValue={(lastName) => setFilter({ ...filter, lastName })}
                />

                <ProfileActions>
                  <ProfileSpan onClick={openCeModal}>Change Email</ProfileSpan>
                  <ProfileSpan onClick={openCpModal}>
                    Change Password
                  </ProfileSpan>
                </ProfileActions>
              </ProfileInfo>
            ))}
        </ProfilePictureMain>
      </Stack>
      {ceModal && <ChangeEmailModal onClose={closeCeModal} />}
      {cpModal && <ChangePasswordModal onClose={closeCpModal} />}
    </Modal>
  );
};

export default ProfilePictureModal;
