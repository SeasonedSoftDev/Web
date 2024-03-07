import React, { useState, useEffect, useCallback } from 'react';
import {
  NotificationsCardMain,
  NotificationsCardList,
  NotificationCard,
  NotificationTitle,
} from 'components/custom/notifications-card/styles';

import {
  Notification,
  NotificationSettings,
} from 'components/custom/notifications-card/elements';
import {
  TNotificationStatus,
  TNotificationsCardProps,
} from 'components/custom/notifications-card/types';
import { useAppContext } from 'context';
import { SettingsIcon } from 'components/svg';
import { useModal } from 'hooks';
import { NotificationIO } from 'api';
import { IGetAllNotifications } from 'api/notification/types';

export interface INotificationComponentBody {
  id: number;
  text: string;
  createdAt?: string;
  status: TNotificationStatus;
}

const NotificationsCard = ({ ...props }: TNotificationsCardProps) => {
  const { role } = useAppContext();

  const [nModal, openNModal, closeNModal] = useModal(false);

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
        if (response) {
          const formattedNotifications: INotificationComponentBody[] =
            response?.map((notification) => ({
              id: notification.id,
              status: notification.notificationUsers[0].seen
                ? 'seen'
                : 'unseen',
              text: notification.description,
              createdAt: notification.createdAt,
            }));

          const notificationIds: number[] = response.map(
            (notification: any) => notification.id
          );

          NotificationIO.markNotificationsAsSeen(notificationIds);

          setNotifications((prevState) => [
            ...formattedNotifications,
            ...prevState,
          ]);
        }
      }
    );

    // NotificationIO.socket.on('ClientStatusUnchanged', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('InfluencerNotVerified', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('InfluencerStatusUnchanged', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('InfluencerEmailUnverified', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('CampaignCreated', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('SurveyCreated', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('CampaignInfluencerAdded', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('CampaignInfluencerInvited', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('SurveyInfluencerInvited', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('CampaignInfluencerInviteAccepted', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('CampaignInfluencerInviteDeclined', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('SurveyInfluencerInviteAccepted', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('SurveyInfluencerInviteDeclined', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on(
    //   'CampaignInfluencerRemovedAfterApplication',
    //   () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   }
    // );

    // NotificationIO.socket.on('SurveyInfluencerRemovedAfterApplication', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on(
    //   'CampaignInfluencerWithdrawAfterApplication',
    //   () => {
    //     NotificationIO.findUserNotifications(() => {});
    //   }
    // );

    // NotificationIO.socket.on('SurveyInfluencerWithdrawAfterApplication', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('CampaignInfluencerLinkSubmitted', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('SurveyInfluencerAnswersSubmited', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('CampaignSubmissionApprovedOrDeclined', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('SurveySubmissionApprovedOrDeclined', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('CampaignStarted', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('SurveyStarted', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('SurveyEnded', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('CampaignEnded', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('CampaignMessageUnread', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('SurveyMessageUnread', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('CampaignAdminPinged', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('CampaignReportOrdered', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('PaymentApproved', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // NotificationIO.socket.on('ClientRegistered', (response: any) => {
    //   if (response) {
    //     const formattedNotification: INotificationComponentBody = {
    //       id: response.id,
    //       status: response.notificationUsers[0].seen ? 'seen' : 'unseen',
    //       text: response.description,
    //       createdAt: response.createdAt,
    //     };

    //     setNotifications((prevState) => {
    //       if (prevState.length > 0) {
    //         return [formattedNotification, ...prevState];
    //       }
    //       return [formattedNotification];
    //     });
    //   }
    // });

    // NotificationIO.socket.on(
    //   'InfluencerRegistered',
    //   handleIncomingNotification
    // );

    // NotificationIO.socket.on('InfluencerVerified', handleIncomingNotification);
    // NotificationIO.socket.on('InfluencerApproved', handleIncomingNotification);

    // NotificationIO.socket.on('ClientOrderCreated', (response: any) => {
    //   if (response) {
    //     const formattedNotification: INotificationComponentBody = {
    //       id: response.id,
    //       status: response.notificationUsers[0].seen ? 'seen' : 'unseen',
    //       text: response.description,
    //       createdAt: response.createdAt,
    //     };

    //     setNotifications((prevState) => {
    //       if (prevState.length > 0) {
    //         return [formattedNotification, ...prevState];
    //       }
    //       return [formattedNotification];
    //     });
    //   }
    // });

    // NotificationIO.socket.on('ClientNoFirstOrderInSetDays', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });
    // NotificationIO.socket.on('ClientEmailUnverified', () => {
    //   NotificationIO.findUserNotifications(() => {});
    // });

    // if (['INFLUENCER', 'CLIENT', 'AMBASSADOR'].includes(role)) {
    //   NotificationIO.socket.on('WelcomeRegisteredUser', (response: any) => {
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
    // }

    return () => {
      NotificationIO.disconnect();
    };
  }, []);

  return (
    <>
      {['ADMIN', 'SUPERADMIN'].includes(role) && (
        <NotificationCard>
          <NotificationTitle>
            Notifications
            {/* <SettingsIcon onClick={openNModal} />{' '} */}
          </NotificationTitle>
          <NotificationsCardList>
            {notifications
              ? notifications.map(({ id, ...x }) => (
                  <Notification key={id} {...x} />
                ))
              : undefined}
          </NotificationsCardList>
        </NotificationCard>
      )}
      {['INFLUENCER', 'CLIENT', 'AMBASSADOR'].includes(role) && (
        <NotificationsCardMain title="Notifications" {...props}>
          <NotificationsCardList>
            {notifications.map(({ id, ...x }) => (
              <Notification key={id} {...x} />
            ))}
          </NotificationsCardList>
        </NotificationsCardMain>
      )}
      {nModal && <NotificationSettings onClose={closeNModal} />}
    </>
  );
};

export default NotificationsCard;
