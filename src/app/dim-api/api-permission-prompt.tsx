import React from 'react';
import { showNotification } from 'app/notifications/notifications';
import { t } from 'app/i18next-t';
import NotificationButton from 'app/notifications/NotificationButton';
import { AppIcon, faCheck } from 'app/shell/icons';
import { SyncService } from 'app/storage/sync.service';
import styles from './api-permission-prompt.m.scss';
import { exportBackupData } from 'app/storage/export-data';

/** This asks the user if they want to use the API. */
export function promptForApiPermission() {
  let returnValue: (result: boolean) => void;
  const promise = new Promise<boolean>((resolve) => {
    returnValue = resolve;
  });

  const ok = async (e) => {
    e.preventDefault();

    // Force a backup of their data just in case
    const data = await SyncService.get();
    exportBackupData(data);
    returnValue(true);
  };

  const no = (e) => {
    e.preventDefault();
    returnValue(false);
  };

  showNotification({
    type: 'success',
    onClick: () => false,
    promise,
    duration: 0, // close immediately on click
    title: t('Storage.ApiPermissionPrompt.Title'),
    body: (
      <>
        <div>{t('Storage.ApiPermissionPrompt.Description')}</div>
        <div className={styles.buttons}>
          <NotificationButton onClick={ok}>
            <AppIcon icon={faCheck} /> {t('Storage.ApiPermissionPrompt.Yes')}
          </NotificationButton>
          <NotificationButton onClick={no}>
            {t('Storage.ApiPermissionPrompt.No')}
          </NotificationButton>
        </div>
      </>
    )
  });

  return promise;
}