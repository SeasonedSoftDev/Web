import dynamic from 'next/dynamic';

export { default as LocalizationSelect } from 'components/custom/localization-select';
export { default as ProgressDisplay } from 'components/custom/progress-display';
export { default as Note } from 'components/custom/note';
export { default as HighlightedText } from 'components/custom/highlighted-text';

// export const Menu = dynamic(() => import('components/custom/menu'), {
//   ssr: false,
// });

export { default as Menu } from 'components/custom/menu';
export { default as MenuNoPortal } from 'components/custom/menu-no-portal';

export { default as Modal } from 'components/custom/modal';
export { default as Navigation } from 'components/custom/navigation';
export { default as Sidebar } from 'components/custom/sidebar';
export { default as CardWithText } from 'components/custom/card-with-text';
export { default as CardWithTextNew } from 'components/custom/card-with-text-new';
export { default as CardWithChart } from 'components/custom/card-with-chart';
export { default as CardWithChartBenefits } from 'components/custom/card-with-chart-benefits';
export { default as CardWithProgress } from 'components/custom/card-with-progress';
export { default as NotificationsCard } from 'components/custom/notifications-card';
export { default as CalendarCard } from 'components/custom/calendar-card';
export { default as Tabs } from 'components/custom/tabs';
export { default as Table } from 'components/custom/table';
export { default as IconWithText } from 'components/custom/icon-with-text';
export { default as Title } from 'components/custom/title';
export { default as Stepper } from 'components/custom/stepper';
export { default as Status } from 'components/custom/status';
export { default as Header } from 'components/custom/header';
export { default as Loader } from 'components/custom/loader';
export { default as CampaignsCard } from 'components/custom/campaigns-card';
export { default as CheckboxTable } from 'components/custom/checkbox-table';
export { default as NewCheckboxTable } from 'components/custom/new-checkbox-table';
export { default as Chat } from 'components/custom/chat';
export { default as Tooltip } from 'components/custom/tooltip';
export { default as CurrencyFeedback } from 'components/custom/currency-feedback';
