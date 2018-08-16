/**
 * @author vishwadeep.kapoor 17/04/2018
 * @type to be used for all function used in app generic search
 */

/**
 * @param {*object} query
 * @return {*array}
 * @func getAppDashboardRepoQuery
 */

/* global mlDBController categoryIds:true*/
export const getAppDashboardRepoQuery = (query) => {
    let genQuery = {};
    if (query && query.userType === 'all') {
        console.log('get all query');    // return [] from here
        return [];
    } else if (query && query.userType === 'Others') {
        genQuery = { communityCode: 'SPS', userTypeName: { $nin: ['Accelerator', 'Incubator', 'Co-Working Space'] } };
        console.log('get other query');
    } else {
        genQuery = { communityCode: 'SPS', userTypeName: { $in: [query.userType] } };
        console.log('get id from name');
    }
    const queryPipeline = [
        { $match: genQuery },
        { $group: { _id: null, ids: { $addToSet: '$_id' } } }];
    const categoryIds = mlDBController.aggregate('MlUserTypes', queryPipeline);
    return categoryIds && categoryIds.length ? categoryIds[0].ids : [];
};

/**
 * @param {*object} chapterId
 * @param {*array} categoryFilterIds
 * @func {}
 * @return {*array}
 */
export const getSubChapterQuery = (chapterId, categoryFilterIds) => {
    if (categoryFilterIds && categoryFilterIds.length) {
        console.log('one filter array is', categoryFilterIds.length);
        return [
            { $match: { chapterId, isActive: true } },
            {
                $match: {
                    $or: [{ isDefaultSubChapter: true },
                    {
                        $and: [{ isDefaultSubChapter: false },
                        {
                            $or: [{ 'moolyaSubChapterAccess.externalUser.canView': true },
                            { 'moolyaSubChapterAccess.externalUser.canSearch': true }],
                        }, { userCategoryId: { $in: categoryFilterIds } }],
                    }],
                },
            },
        ];
    }
    console.log('two filter array is zero');
    return [{ $match: { chapterId, isActive: true } },
    {
        $match: {
            $or: [{ isDefaultSubChapter: true },
            {
                $and: [{ isDefaultSubChapter: false },
                {
                    $or: [{ 'moolyaSubChapterAccess.externalUser.canView': true },
                    { 'moolyaSubChapterAccess.externalUser.canSearch': true }],
                }],
            }],
        },
    }];
};
