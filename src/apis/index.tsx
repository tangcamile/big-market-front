// 请求地址
if (!process.env.API_HOST_URL) {
    throw new Error("API_HOST_URL 环境变量未配置，请检查 .env.local 或部署环境变量！");
}
const apiHostUrl = process.env.API_HOST_URL;

/**
 * 装配抽奖
 * @param strategyId
 */
export const strategyArmory = (strategyId?: number) => {
    return fetch(`${apiHostUrl}/api/v1/raffle/strategy_armory?strategyId=${strategyId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

/**
 * 查询抽奖奖品列表
 * @param strategyId 策略ID
 */
export const queryRaffleAwardList = async (strategyId: number) => {
    try {
        const response = await fetch(`${apiHostUrl}/api/v1/raffle/query_raffle_award_list?strategyId=${strategyId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                strategyId: strategyId
            })
        });
        return response;
    } catch (error) {
        console.error("queryRaffleAwardList 请求失败:", error);
        return new Response(JSON.stringify({
            code: "0001",
            info: "调用失败",
            data: []
        }), {headers: {'Content-Type': 'application/json'}});
    }
}

/**
 * 随机抽奖接口
 * @param strategyId 策略ID
 *
 * {
 * 	"code": "0000",
 * 	"info": "调用成功",
 * 	"data": {
 * 	    "awardIndex": 1, // awardIndex 获得的是列表中第几个奖品，方便测试使用
 * 		"awardId": 535,
 * 		"awardTitle": "一部手机"
 * 	}
 * }
 */
export const randomRaffle = async (strategyId: number) => {
    try {
        const response = await fetch(`${apiHostUrl}/api/v1/raffle/random_raffle?strategyId=${strategyId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                strategyId: strategyId
            })
        });
        return response;
    } catch (error) {
        console.error("randomRaffle 请求失败:", error);
        return new Response(JSON.stringify({
            code: "0001",
            info: "调用失败",
            data: []
        }), {headers: {'Content-Type': 'application/json'}});
    }
}