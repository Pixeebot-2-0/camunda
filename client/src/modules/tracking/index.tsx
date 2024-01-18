/*
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. Licensed under a proprietary license.
 * See the License.txt file for more information. You may not use this file
 * except in compliance with the proprietary license.
 */

import {Mixpanel} from 'mixpanel-browser';
import {getStage} from './getStage';
import {CurrentUser} from 'modules/types';
import {TaskFilters} from 'modules/hooks/useTaskFilters';

const EVENT_PREFIX = 'tasklist:';
type Events =
  | {
      eventName:
        | 'task-unassigned'
        | 'task-assigned'
        | 'processes-consent-refused'
        | 'processes-consent-accepted'
        | 'processes-fetch-failed'
        | 'processes-empty-message-link-clicked'
        | 'process-start-clicked'
        | 'process-started'
        | 'process-start-failed'
        | 'process-task-toast-clicked'
        | 'public-start-form-opened'
        | 'public-start-form-loaded'
        | 'public-start-form-load-failed'
        | 'public-start-form-submitted'
        | 'public-start-form-submission-failed'
        | 'public-start-form-invalid-form-schema';
    }
  | {
      eventName: 'task-opened';
      by?: 'user';
      position?: number;
      filter?: TaskFilters['filter'];
      sorting?: TaskFilters['sortBy'];
    }
  | {
      eventName: 'task-completed';
      isCamundaForm: boolean;
      hasRemainingTasks: boolean;
      filter: TaskFilters['filter'];
    }
  | {
      eventName: 'tasks-filtered';
      filter: TaskFilters['filter'];
      sorting: TaskFilters['sortBy'];
    }
  | {
      eventName: 'navigation';
      link: 'header-logo' | 'header-tasks' | 'header-processes';
    }
  | {
      eventName: 'app-switcher-item-clicked';
      app: string;
    }
  | {
      eventName: 'info-bar';
      link: 'documentation' | 'academy' | 'feedback' | 'slack';
    }
  | {
      eventName: 'user-side-bar';
      link: 'cookies' | 'terms-conditions' | 'privacy-policy' | 'imprint';
    }
  | {
      eventName: 'processes-loaded';
      count: number;
      filter: string;
    }
  | {
      eventName: 'process-tasks-polling-ended';
      outcome:
        | 'single-task-found'
        | 'multiple-tasks-found'
        | 'no-tasks-found'
        | 'navigated-away';
    };

const STAGE_ENV = getStage(window.location.host);

function injectScript(src: string): Promise<void> {
  return new Promise((resolve) => {
    const scriptElement = document.createElement('script');

    scriptElement.src = src;

    document.head.appendChild(scriptElement);

    setTimeout(resolve, 1000);

    scriptElement.onload = () => {
      resolve();
    };
    scriptElement.onerror = () => {
      resolve();
    };
  });
}

class Tracking {
  #mixpanel: null | Mixpanel = null;
  #appCues: null | NonNullable<typeof window.Appcues> = null;

  #baseProperties = {
    organizationId: window.clientConfig?.organizationId,
    clusterId: window.clientConfig?.clusterId,
    stage: STAGE_ENV,
    version: import.meta.env.VITE_VERSION,
  } as const;

  #isTrackingSupported = () => {
    return (
      !import.meta.env.DEV &&
      ['prod', 'int', 'dev'].includes(STAGE_ENV) &&
      window.clientConfig?.organizationId
    );
  };

  track(events: Events) {
    if (!this.#isTrackingSupported() || !this.#isTrackingAllowed()) {
      return;
    }

    if (this.#mixpanel === null) {
      console.warn(
        'Could not track event because mixpanel was not properly loaded.',
      );
    }

    const {eventName, ...properties} = events;
    const prefixedEventName = `${EVENT_PREFIX}${eventName}`;

    try {
      this.#mixpanel?.track(prefixedEventName, properties);
      this.#appCues?.track(prefixedEventName, {
        ...this.#baseProperties,
        ...properties,
      });
    } catch (error) {
      console.error(`Can't track event: ${eventName}`, error);
    }
  }

  identifyUser = (user: CurrentUser) => {
    this.#mixpanel?.identify(user.userId);
    this.#appCues?.identify(user.userId, {
      orgId: this.#baseProperties.organizationId,
      salesPlanType: user.salesPlanType ?? '',
      roles: user.roles?.join('|'),
      clusters: this.#baseProperties.clusterId,
    });
  };

  trackPagination = () => {
    this.#appCues?.page();
  };

  #isTrackingAllowed = () => {
    return Boolean(window.Osano?.cm?.analytics);
  };

  #loadMixpanel = (): Promise<void> => {
    return import('mixpanel-browser').then(({default: mixpanel}) => {
      mixpanel.init(
        window.clientConfig?.mixpanelToken ??
          import.meta.env.VITE_MIXPANEL_TOKEN,
        {
          api_host:
            window.clientConfig?.mixpanelAPIHost ??
            import.meta.env.VITE_MIXPANEL_HOST,
          opt_out_tracking_by_default: true,
        },
      );
      mixpanel.register(this.#baseProperties);
      this.#mixpanel = mixpanel;
      window.mixpanel = mixpanel;
    });
  };

  #loadOsano = (): Promise<void> => {
    return new Promise((resolve) => {
      if (STAGE_ENV === 'dev') {
        return injectScript(import.meta.env.VITE_OSANO_DEV_ENV_URL).then(
          resolve,
        );
      }

      if (STAGE_ENV === 'int') {
        return injectScript(import.meta.env.VITE_OSANO_INT_ENV_URL).then(
          resolve,
        );
      }

      if (STAGE_ENV === 'prod') {
        return injectScript(import.meta.env.VITE_OSANO_PROD_ENV_URL).then(
          resolve,
        );
      }

      return resolve();
    });
  };

  #loadAppCues = (): Promise<void> => {
    return new Promise((resolve) => {
      return injectScript(import.meta.env.VITE_CUES_HOST).then(() => {
        if (window.Appcues) {
          this.#appCues = window.Appcues;
        }

        resolve();
      });
    });
  };

  loadAnalyticsToWillingUsers(): Promise<void[] | void> {
    if (!this.#isTrackingSupported()) {
      console.warn('Tracking is not supported for this environment');
      return Promise.resolve();
    }

    return this.#loadOsano().then(() =>
      Promise.all([this.#loadMixpanel(), this.#loadAppCues()]).then(() => {
        window.Osano?.cm?.addEventListener(
          'osano-cm-consent-saved',
          ({ANALYTICS}) => {
            if (ANALYTICS === 'ACCEPT') {
              this.#mixpanel?.opt_in_tracking();
            }
            if (ANALYTICS === 'DENY') {
              this.#mixpanel?.opt_out_tracking();
            }
          },
        );
      }),
    );
  }
}

const tracking = new Tracking();

export {tracking};
