import { t } from 'i18next';
import { DimItem } from './item-types';

export interface BadgeInfo {
  showBadge: boolean;
  badgeClassNames: {
    [key: string]: boolean;
  };
  badgeCount: string;
  isCapped: boolean;
}

export default function getBadgeInfo(item: DimItem): BadgeInfo {
  if (!item.primStat && item.objectives) {
    return processBounty(item);
  } else if (item.maxStackSize > 1) {
    return processStackable(item);
  } else {
    return processItem(item);
  }
}

function processBounty(item: DimItem) {
  const showBountyPercentage = !item.complete && !item.hidePercentage;

  const result = {
    showBadge: showBountyPercentage,
    badgeClassNames: {},
    badgeCount: '',
    isCapped: false
  };

  if (showBountyPercentage) {
    result.badgeClassNames = { 'item-stat': true, 'item-bounty': true };
    result.badgeCount = `${Math.floor(100 * item.percentComplete)}%`;
  }

  return result;
}

function processStackable(item: DimItem) {
  const isCapped = item.amount === item.maxStackSize && item.uniqueStack;
  return {
    showBadge: true,
    badgeClassNames: {
      'item-stat': true,
      'item-stackable-max': item.amount === item.maxStackSize,
      'badge-capped': isCapped
    },
    badgeCount: isCapped ? t('Badge.Max') : item.amount.toString(),
    isCapped
  };
}

function processItem(item: DimItem) {
  const result = {
    showBadge: Boolean(item.primStat && item.primStat.value),
    badgeClassNames: {
      'item-equipment': true
    },
    badgeCount: '',
    isCapped: false
  };
  if (item.primStat && result.showBadge) {
    result.badgeClassNames['item-stat'] = true;
    result.badgeCount = item.primStat.value.toString();
  }
  return result;
}
