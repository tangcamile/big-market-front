"use client"

import React, {useEffect, useRef, useState} from 'react'
// @ts-ignore
import {LuckyWheel} from '@lucky-canvas/react'

import {queryRaffleAwardList, draw} from '@/apis'
import {RaffleAwardVO} from "@/types/RaffleAwardVO";

// @ts-ignore
export function LuckyWheelPage() {
    const [prizes, setPrizes] = useState([{}])
    const myLucky = useRef<any>(null)

    const [blocks] = useState([
        {padding: '10px', background: '#869cfa', imgs: [{src: "https://bugstack.cn/images/system/blog-03.png"}]}
    ])

    const [buttons] = useState([
        {radius: '40%', background: '#617df2'},
        {radius: '35%', background: '#afc8ff'},
        {
            radius: '30%', background: '#869cfa',
            pointer: true,
            fonts: [{text: '开始', top: '-10px'}]
        }
    ])

    // 查询奖品列表
    const queryRaffleAwardListHandle = async () => {
        try {
            const queryParams = new URLSearchParams(window.location.search);
            const userIdParam = queryParams.get('userId');
            const activityIdParam = queryParams.get('activityId');

            // 参数校验
            if (!userIdParam || !activityIdParam) {
                window.alert("获取抽奖奖品列表失败 code:0001 info:请在URL中提供userId和activityId参数");
                return;
            }

            const userId = userIdParam;
            const activityId = Number(activityIdParam);

            if (isNaN(activityId)) {
                window.alert("获取抽奖奖品列表失败 code:0001 info:activityId必须是数字");
                return;
            }

            const result = await queryRaffleAwardList(userId, activityId);

            if (!result.ok) {
                window.alert(`获取抽奖奖品列表失败 HTTP ${result.status}: ${result.statusText}`);
                return;
            }

            const {code, info, data} = await result.json();
            if (code != "0000") {
                window.alert("获取抽奖奖品列表失败 code:" + code + " info:" + info)
                return;
            }

            // 创建一个新的奖品数组
            const prizes = data.map((award: RaffleAwardVO, index: number) => {
                const background = index % 2 === 0 ? '#e9e8fe' : '#b8c5f2';
                return {
                    background: background,
                    fonts: [{id: award.awardId, text: award.awardTitle, top: '15px'}]
                };
            });

            // 设置奖品数据
            setPrizes(prizes)
        } catch (error) {
            console.error("查询抽奖奖品列表异常:", error);
            window.alert("获取抽奖奖品列表失败: 网络错误或服务器无响应");
        }
    }

    // 调用随机抽奖
    const randomRaffleHandle = async () => {
        try {
            const queryParams = new URLSearchParams(window.location.search);
            const userIdParam = queryParams.get('userId');
            const activityIdParam = queryParams.get('activityId');

            // 参数校验
            if (!userIdParam || !activityIdParam) {
                window.alert("随机抽奖失败 code:0001 info:请在URL中提供userId和activityId参数");
                return;
            }

            const userId = userIdParam;
            const activityId = Number(activityIdParam);

            const result = await draw(userId, activityId);

            if (!result.ok) {
                window.alert(`随机抽奖失败 HTTP ${result.status}: ${result.statusText}`);
                return;
            }

            const responseData = await result.json();
            const code = responseData.code;
            const info = responseData.info;
            const data = responseData.data;
            if (code != "0000") {
                window.alert("随机抽奖失败 code:" + code + " info:" + info)
                return;
            }
            // 为了方便测试，mock 的接口直接返回 awardIndex 也就是奖品列表中第几个奖品。
            return data.awardIndex - 1;
        } catch (error) {
            console.error("随机抽奖异常:", error);
            window.alert("随机抽奖失败: 网络错误或服务器无响应");
        }
    }

    useEffect(() => {
        queryRaffleAwardListHandle();
    }, [])

    return <div>
        <LuckyWheel
            ref={myLucky}
            width="300px"
            height="300px"
            blocks={blocks}
            prizes={prizes}
            buttons={buttons}
            onStart={() => {
                // @ts-ignore
                myLucky.current.play()
                setTimeout(() => {
                    // 抽奖接口
                    randomRaffleHandle().then(prizeIndex => {
                            // @ts-ignore
                            myLucky.current.stop(prizeIndex);
                        }
                    );

                }, 2500)
            }}
            onEnd={
                // @ts-ignore
                prize => {
                    alert('恭喜你抽到【' + prize.fonts[0].text + '】奖品ID【' + prize.fonts[0].id + '】')
                }
            }
        />
    </div>
}