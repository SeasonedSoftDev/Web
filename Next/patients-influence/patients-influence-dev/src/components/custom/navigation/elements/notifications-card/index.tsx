import React, { useState, useEffect } from 'react';
import { NotificationsCardList } from 'components/custom/navigation/elements/notifications-card/styles';

import {
  Notification,
  NotificationSettings,
} from 'components/custom/navigation/elements/notifications-card/elements';
import { DNotifications } from 'components/custom/notifications-card/data';
import { TNotificationsCardProps } from 'components/custom/navigation/elements/notifications-card/types';
import { useAppContext } from 'context';
import { SettingsIcon } from 'components/svg';
import { useModal } from 'hooks';
import { Modal } from 'components/custom';
import { INotificationComponentBody } from 'components/custom/notifications-card';
import { NotificationIO } from 'api';
import { IGetAllNotifications } from 'api/notification/types';

const NotificationsCard = ({ onClose, ...props }: TNotificationsCardProps) => {
  const { role } = useAppContext();

  const [nModal, _openNModal, closeNModal] = useModal(false);

  const [notifications, setNotifications] = useState<
    INotificationComponentBody[]
  >([]);

  const handleIncomingNotification = (response: any) => {
    if (response) {
      const formattedNotification: INotificationComponentBody = {
        id: response.id,
        status: response.notificationUsers[0].seen ? 'seen' : 'unseen',
        text: response.description,
        createdAt: response.createdAt,
      };

      setNotifications((prevState) => {
        if (prevState.length > 0) {
          return [formattedNotification, ...prevState];
        }
        return [formattedNotification];
      });
    }
  };
  useEffect(() => {
    NotificationIO.connect();
    NotificationIO.findUserNotifications(() => {});
    NotificationIO.socket.on(
      'getUsersNotifications',
      (response: IGetAllNotifications[]) => {
        const formattedNotifications: INotificationComponentBody[] =
          response && response.length > 0
            ? response?.map((notification) => ({
                id: notification.id,
                status: notification.notificationUsers[0].seen
                  ? 'seen'
                  : 'unseen',
                text: notification.description,
                createdAt: notification.createdAt,
              }))
            : [];
        const notificationIds: number[] =
          response && response.length > 0
            ? response.map((notification: any) => notification.id)
            : [];
        NotificationIO.markNotificationsAsSeen(notificationIds);
        setNotifications((prevState) => [
          ...formattedNotifications,
          ...prevState,
        ]);
      }
    );
    //   NotificationIO.socket.on('ClientStatusUnchanged', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('InfluencerNotVerified', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('InfluencerStatusUnchanged', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('InfluencerEmailUnverified', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('CampaignCreated', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('SurveyCreated', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('CampaignInfluencerAdded', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('CampaignInfluencerInvited', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('SurveyInfluencerInvited', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('CampaignInfluencerInviteAccepted', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('CampaignInfluencerInviteDeclined', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('SurveyInfluencerInviteAccepted', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('SurveyInfluencerInviteDeclined', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on(
    //     'CampaignInfluencerRemovedAfterApplication',
    //     () => {
    //       NotificationIO.findUserNotifications(() => {});
    //     }
    //   );
    //   NotificationIO.socket.on('SurveyInfluencerRemovedAfterApplication', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on(
    //     'CampaignInfluencerWithdrawAfterApplication',
    //     () => {
    //       NotificationIO.findUserNotifications(() => {});
    //     }
    //   );
    //   NotificationIO.socket.on('SurveyInfluencerWithdrawAfterApplication', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('CampaignInfluencerLinkSubmitted', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('SurveyInfluencerAnswersSubmited', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('CampaignSubmissionApprovedOrDeclined', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('SurveySubmissionApprovedOrDeclined', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('CampaignStarted', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('SurveyStarted', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('SurveyEnded', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('CampaignEnded', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('CampaignMessageUnread', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('SurveyMessageUnread', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('CampaignAdminPinged', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('CampaignReportOrdered', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('PaymentApproved', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('ClientRegistered', (response: any) => {
    //     if (response) {
    //       const formattedNotification: INotificationComponentBody = {
    //         id: response.id,
    //         status: response.notificationUsers[0].seen ? 'seen' : 'unseen',
    //         text: response.description,
    //         createdAt: response.createdAt,
    //       };
    //       setNotifications((prevState) => {
    //         if (prevState.length > 0) {
    //           return [formattedNotification, ...prevState];
    //         }
    //         return [formattedNotification];
    //       });
    //     }
    //   });
    //   NotificationIO.socket.on(
    //     'InfluencerRegistered',
    //     handleIncomingNotification
    //   );
    //   NotificationIO.socket.on('InfluencerVerified', handleIncomingNotification);
    //   NotificationIO.socket.on('InfluencerApproved', handleIncomingNotification);
    //   NotificationIO.socket.on('ClientOrderCreated', (response: any) => {
    //     if (response) {
    //       const formattedNotification: INotificationComponentBody = {
    //         id: response.id,
    //         status: response.notificationUsers[0].seen ? 'seen' : 'unseen',
    //         text: response.description,
    //         createdAt: response.createdAt,
    //       };
    //       setNotifications((prevState) => {
    //         if (prevState.length > 0) {
    //           return [formattedNotification, ...prevState];
    //         }
    //         return [formattedNotification];
    //       });
    //     }
    //   });
    //   NotificationIO.socket.on('ClientNoFirstOrderInSetDays', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   NotificationIO.socket.on('ClientEmailUnverified', () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   });
    //   if (['INFLUENCER', 'CLIENT', 'AMBASSADOR'].includes(role)) {
    //     NotificationIO.socket.on('WelcomeRegisteredUser', (response: any) => {
    //       if (response) {
    //         const formattedNotification: INotificationComponentBody = {
    //           id: response.id,
    //           status: response.notificationUsers[0].seen ? 'seen' : 'unseen',
    //           text: response.description,
    //           createdAt: response.createdAt,
    //         };
    //         setNotifications((prevState) => {
    //           if (prevState.length > 0) {
    //             return [formattedNotification, ...prevState];
    //           }
    //           return [formattedNotification];
    //         });
    //       }
    //     });
    //   }
    return () => {
      NotificationIO.disconnect();
    };
  }, []);

  return (
    <Modal
      size="small"
      title={
        <>
          Notifications
          {/* <SettingsIcon onClick={openNModal} /> */}
        </>
      }
      onClose={onClose}
      {...props}
    >
      {['ADMIN', 'SUPERADMIN'].includes(role) && (
        <NotificationsCardList>
          {notifications.map(({ id, ...x }) => (
            <Notification key={id} {...x} />
          ))}
        </NotificationsCardList>
      )}
      {['INFLUENCER', 'CLIENT', 'AMBASSADOR'].includes(role) && (
        <NotificationsCardList>
          {notifications.map(({ id, ...x }) => (
            <Notification key={id} {...x} />
          ))}
        </NotificationsCardList>
      )}
      {nModal && <NotificationSettings onClose={closeNModal} />}
    </Modal>
  );
};

export default NotificationsCard;
