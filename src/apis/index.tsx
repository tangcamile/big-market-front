// 请求地址 - Next.js 客户端必须使用 NEXT_PUBLIC_ 前缀
if (!process.env.NEXT_PUBLIC_API_HOST_URL) {
    throw new Error("NEXT_PUBLIC_API_HOST_URL 环境变量未配置，请检查 .env.local 或部署环境变量！");
}
const apiHostUrl = process.env.NEXT_PUBLIC_API_HOST_URL;

/**
 * 装配抽奖
 * @param activityId
 */
export const activityStrategyArmory = (activityId?: number) => {
    return fetch(`${apiHostUrl}/api/v1/raffle/activity/armory?activityId=${activityId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 查询抽奖奖品列表
 * @param userId 用户ID
 * @param activityId 活动ID
 */
export const queryRaffleAwardList = async (userId?: string, activityId?: number) => {
    // 使用 query 参数方式（之前测试是成功的）
    const url = `${apiHostUrl}/api/v1/raffle/strategy/query_raffle_award_list?userId=${userId}&activityId=${activityId}`;

    console.log('[queryRaffleAwardList] 发送请求 URL:', url);
    console.log('[queryRaffleAwardList] userId:', userId, 'activityId:', activityId);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('[queryRaffleAwardList] 响应状态:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[queryRaffleAwardList] 错误响应:', errorText);
        }

        return response;
    } catch (error) {
        console.error('[queryRaffleAwardList] 请求异常:', error);
        throw error;
    }
}

/**
 * 抽奖接口
 * @param userId 用户ID
 * @param activityId 活动ID
 */
export const draw = async (userId?: string, activityId?: number) => {
    // 后端强制要求 @RequestBody，必须发送 JSON body
    const requestBody = {
        userId: userId,
        activityId: activityId
    };

    console.log('[draw] 发送抽奖请求 body:', requestBody);
    console.log('[draw] userId:', userId, '(', typeof userId, ')');
    console.log('[draw] activityId:', activityId, '(', typeof activityId, ')');

    try {
        const response = await fetch(`${apiHostUrl}/api/v1/raffle/activity/draw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(requestBody)  // 发送 JSON body
        });

        console.log('[draw] 响应状态:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[draw] 错误响应:', errorText);
        }

        return response;
    } catch (error) {
        console.error('[draw] 请求异常:', error);
        throw error;
    }
}