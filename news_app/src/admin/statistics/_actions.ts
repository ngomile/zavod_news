import {
    fetchTags
} from '@/app/actions';

import type {
    TagViewsChartConfig
} from '@/admin/statistics/_types';

export const getTagViewsDataSet = async () => {
    const tagList = await fetchTags();

    const tagViewDataSet: TagViewsChartConfig[] = tagList.map(tag => {
        return {
            tag: tag.label,
            views: tag.views ?? 0,
        }
    });

    return tagViewDataSet;
}