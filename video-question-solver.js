// 抓取视频题目并自动作答（优化版）
// 适用于原脚本可识别的 Vue2 页面；直接运行本文件即可，无需再运行探测脚本。
(function () {
    'use strict';

    // ================= 1. 可调整配置 =================
    const CONFIG = {
        submitDelay: 800,       // 展示题目后多久提交（毫秒）
        nextDelay: 1200,        // 提交后多久处理下一题（毫秒）
        finishDelay: 2000,      // 跳转视频结尾后多久通知完成（毫秒）
        autoFinishVideo: true,  // 全部题目完成后是否跳转视频结尾
        minFuzzyLength: 6       // 双向包含匹配所需的最短题干长度
    };

    // ================= 2. 题库 =================
    const questionBank = {
        "高校实验室按照性质可分为教学实验室和科研实验室": "A",
        "高校实验室的特点是多样性和专业性": "A",
        "隐患是指潜藏着或不易发现的危险。它是在某个条件、某个事物以及事件中所存在的不稳定因素": "A",
        "海因里系法则总结了一个安全原则，就是在一件重大事故的背后，必然有（ ）起轻度伤害事故，有（ ）起潜在的不安全状态": "B",
        "做实验的时候，不可以擅自脱岗，也不能随意叫出其他正在做实验的同学。不要一个人单独在实验室工作。呼喊声音范围之内，要确保有人可以听得到。危险性的实验，必须要有两人同时在场": "A",
        "管控的化学品必须按规定进行报备、购买、申领": "A",
        "去离子水常用于配制缓冲液、洗涤有特殊要求的实验器皿、清洁和维护精密需水设备等等": "A",
        "强酸、强碱等腐蚀性溶液直接倒入PP水槽会破坏下水管道，污染环境，应严格禁止": "A",
        "高校实验室的实验要素有": ["A", "B", "C", "D"],
        "实验室安全隐患的来源主要有（）和实验的环境条件等五要素": ["A", "B", "C", "D"],
        "实验室用水可分为": ["A", "B", "C", "D"],
        "关于实验室用水的基本安全，以下说法错误的有": "A",
        "强酸、强碱等腐蚀性溶液直接倒入PP水槽会破坏下水管道": "A",
        "实验时，应先检查线路连接是否正确": "A",
        "实验室严禁私自乱拉乱接电线电缆": "A",
        "实验室触电事故发生的原因有": ["A", "B", "C", "D"],
        "可以用湿的手或湿的物体接触电插头等": "B",
        "人体触电的方式常见的有": ["A", "B", "C", "D"],
        "两相触电时，人体处于线电压的作用下": "A",
        "感知电流是人能感觉到的": "B",
        "电流可分为直流电、交流电。交流电可分为工频电和高频电": "A",
        "根据事故统计发现：通过人体途径最危险的电流路径是从左手到胸部": "A",
        "一般使用的绝缘物有瓷": "A",
        "在潮湿和多尘的环境中": "B",
        "脱离低压电源的方法可用": "A",
        "触电者脱离高压带电设备首先要做的是": "A",
        "雷电是大气中一部分带电云层与另一部分带异种电荷的云层或与大地之间的迅猛放电过程": "A",
        "雷电具有电性质、机械性质、热性质等三方面的破坏作用,下列属于电性质破坏的是": "A",
        "对于处于室外的人，为防雷击，应当遵从以下原则": ["A", "B", "C", "D"],
        "身处室内时，远离可能遭雷击的物体是人身防雷的基本原则": "A",
        "建筑、设备防雷措施主要有": "D",
        "化学泡沫灭火器仅限用于扑救非极性溶剂引发的火灾": "A",
        "对于A、B、C类并存的混合火灾": ["A", "C"],
        "实验室火灾常见原因主要有": ["A", "B", "C", "D"],
        "根据室内火灾温度的变化特点": ["A", "B", "D"],
        "发生火灾时，热传播的途径有热传导、热对流、热辐射等": "B",
        "常用的灭火方法主要有": ["A", "B", "C", "D"],
        "二氧化碳灭火器灭火速度快、无腐蚀性、灭火后无污染物质": "A",
        "关于二氧化碳灭火器使用方法及注意事项错误的有": "B",
        "泡沫灭火器的喷出物在燃烧物表面可形成泡沫覆盖层": "A",
        "关于泡沫灭火器使用方法错误的有": "B",
        "以下关于灭火毯描述正确的有": ["A", "B", "C", "D"],
        "灭火毯按其所用材料可分为": "A",
        "对于火灾逃生自救，以下错误的描述是": "D",
        "身上着火时禁止直接向身上喷射灭火剂": "A",
        "扑救同时应立即报告火警": "A",
        "在灭火过程中，要本着": "A",
        "压力容器有多种分类方式，按承压方式分类": ["A", "B", "C", "D"],
        "下面不是压力容器的压力通常的指标的是": "D",
        "压力容器使用要注意的事项有": ["A", "B", "C", "D"],
        "压力容器检查的主要内容有": "A",
        "起重机械的特点包括": ["A", "B", "C"],
        "起重机械的类别有": ["A", "B", "C", "D"],
        "起重机械的主要零部件包括": "A",
        "起重机械选用钢丝扣时长度应适宜": "C",
        "常用的应急救援基本装备不包括": "D",
        "实验室应急预案又称应急计划": "A",
        "下面急救的实施原则不正确的是": "B",
        "如果现场有多名病患": "A",
        "对急性中毒的人员，要尽快运送至空气流通处": "A",
        "对于骨折或疑似骨折的病患者": "A",
        "病患的分类主要依据其": ["A", "C"],
        "生命四大体征是": "A",
        "关于体温的错误描述有": "D",
        "人体正常脉搏次数与心脏跳动次数相等": "A",
        "正常成年人平静呼吸时": "A",
        "在事故现场，对于伤患者的": ["A", "B", "C", "D"],
        "一氧化碳中毒皮肤呈": "B",
        "心搏骤停后的心肺复苏必须在现场立即进行": "B",
        "胸外心脏按压施救者两手上下平行重叠": "A",
        "人工呼吸频率一般为": "A",
        "评估心跳时，有能力的救助者": "C",
        "有下面情况（）之一者，可以停止心肺复苏": ["A", "B", "C", "D"],
        "AED是一种便携式": "A",
        "成人电极片将一片贴在患者裸露胸部的": "B",
        "我国根据皮肤烧伤的深浅将烧伤分为": "A",
        "特重烧伤是烧伤面积达": "D",
        "当衣服着火时，千万不可站立或奔跑呼叫": "A",
        "为防止感染，烧伤创面可用无菌纱布或者保鲜膜覆盖": "B",
        "实验室中的冻伤事故往往是操作": "B",
        "治疗冻伤的根本措施是使受伤机体部位迅速复温": "A",
        "触电后要时刻注意保温和观察": "A",
        "药物可以代替人工呼吸和胸外按压": "B",
        "实验室常见化学品中毒有": ["A", "B", "C"],
        "若是误食强碱中毒，可口服食醋、柠檬汁、1%醋酸等": "A",
        "烫伤的五步处理方法是冲、泡、脱、包、送": "A",
        "轻伤事故根据受伤的性质可分为": ["A", "C"],
        "开放性损伤的关键是止血，闭合性损伤的关键是清创": "B",
        "按出血来源，出血可分为": ["B", "C", "D"],
        "下面不是外出血的应急处理方法": "D",
        "较大的头皮裂伤": "A",
        "若木屑、尘粒等异物进入眼内": "D",
        "电气安全是实验室通用安全的重要方面": "A",
        "电气火灾一般是由于电气设备使用过程中产生的的电流热量": "A",
        "按产生电气危害的源头分类": "A",
        "按电气危害发生的特征分类": "A",
        "电气事故往往具有哪些特征": ["A", "B", "C", "D"],
        "电器事故发生时，毫无征兆": "A",
        "电气火灾和爆炸的原因是": ["A", "B", "C", "D"],
        "以下电气火灾和爆炸的防范措施描述不正确的是": "D",
        "实验室中常见照明灯具有白炽灯": "A",
        "严格按照环境场所的火灾危险性选用照明灯具": "A",
        "电热设备是将电能转换成热能的一种用电设备": "A",
        "电热设备附近不得堆放可燃物": "A",
        "电动机运行时，应监视电动机的电流": "A",
        "二氧化碳灭火器：能降温和隔绝空气": "A",
        "家用冰箱可用于存放化学试剂": "B",
        "安装空调器时，不要安装在可燃物上": "A",
        "灭火含油设备时": "B",
        "对于电气火灾，应坚持预防为主": "A",
        "电气危险是指以电气设备为动力的机械": "A",
        "振动危险是机械危险有害因素之一": "A",
        "大型机床的移动工作台": "A",
        "切削刀具的刀刃": "A",
        "工具或量具随手乱放": "B",
        "购买未经生产许可的": "B",
        "凡是进入实训室的学生及工作人员均要参加安全知识培训": "A",
        "车工实训的危险源主要来源于车床上锋利的刀刃": "A",
        "焊工不了解焊件内部是否安全时": "A",
        "施工作业时氧气瓶、乙炔瓶要与动火点保持不小于10米的距离": "A",
        "为确保车削加工的安全生产": "A",
        "车削加工操作者应穿紧身防护服": "B"
    };

    // ================= 3. 工具函数 =================
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    function normalizeText(value) {
        return String(value == null ? '' : value)
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/gi, ' ')
            .normalize('NFKC')
            .toLowerCase()
            .replace(/[\s，。？！；：、,.!?;:（）()【】\[\]{}《》<>“”"'‘’·—–-]/g, '');
    }

    function isTargetVm(vm) {
        return !!(
            vm &&
            vm.model &&
            vm.model.questionRelaList !== undefined &&
            typeof vm.submit === 'function'
        );
    }

    function findVmFromElement(element) {
        for (let el = element; el; el = el.parentElement) {
            let vm = el.__vue__;
            while (vm) {
                if (isTargetVm(vm)) return vm;
                vm = vm.$parent;
            }
        }
        return null;
    }

    function findTargetVm() {
        const preferredRoots = [
            document.querySelector('video'),
            document.querySelector('.ant-modal-body')
        ];

        for (const root of preferredRoots) {
            const vm = findVmFromElement(root);
            if (vm) return vm;
        }

        console.log('⏳ 常规位置未找到组件，正在扫描页面节点……');
        for (const el of document.querySelectorAll('*')) {
            // 全局回退只从自身 Vue 实例向上查找，避免每个节点重复遍历 DOM 祖先。
            let currentVm = el.__vue__;
            while (currentVm) {
                if (isTargetVm(currentVm)) return currentVm;
                currentVm = currentVm.$parent;
            }
        }
        return null;
    }

    const bankEntries = [];
    const exactAnswerMap = new Map();

    function addAnswer(stem, answer, silent = false) {
        const key = normalizeText(stem);
        if (!key) throw new Error('题干不能为空');
        if (typeof answer !== 'string' && !Array.isArray(answer)) {
            throw new Error('答案必须是选项字符串或选项数组');
        }

        const normalizedAnswer = Array.isArray(answer) ? answer.slice() : answer;
        const entry = { stem: String(stem), key, answer: normalizedAnswer };
        const oldIndex = bankEntries.findIndex(item => item.key === key);
        if (oldIndex >= 0) bankEntries.splice(oldIndex, 1);
        bankEntries.push(entry);
        exactAnswerMap.set(key, normalizedAnswer);

        if (!silent) console.log('✅ 已添加或更新答案：', stem, normalizedAnswer);
    }

    Object.entries(questionBank).forEach(([stem, answer]) => addAnswer(stem, answer, true));

    function findAnswer(stem) {
        const normalizedStem = normalizeText(stem);
        if (!normalizedStem) return null;

        // 规范化后的完整题干优先精确匹配。
        if (exactAnswerMap.has(normalizedStem)) {
            return exactAnswerMap.get(normalizedStem);
        }

        // 包含匹配不再取“第一个”，而是取“最长题干”，减少短题干误命中。
        let bestMatch = null;
        for (const entry of bankEntries) {
            if (Math.min(normalizedStem.length, entry.key.length) < CONFIG.minFuzzyLength) {
                continue;
            }
            const matched = normalizedStem.includes(entry.key) || entry.key.includes(normalizedStem);
            if (matched && (!bestMatch || entry.key.length > bestMatch.key.length)) {
                bestMatch = entry;
            }
        }
        return bestMatch ? bestMatch.answer : null;
    }

    // ================= 4. 初始化组件与控制器 =================
    if (window.videoQuestionSolver && typeof window.videoQuestionSolver.stop === 'function') {
        window.videoQuestionSolver.stop();
        console.log('🛑 已停止上一次运行的答题任务。');
    }

    const vm = findTargetVm();
    if (!vm) {
        console.error('❌ 未找到目标 Vue2 答题组件。请确认当前是视频播放页，且页面仍保留了 __vue__。');
        return;
    }

    const video = document.querySelector('video');
    window.vm = vm;
    window.videoPlayer = video;

    let stopped = false;
    let running = false;
    let finishRequested = false;
    const unmatched = [];
    const stats = { submitted: 0, failed: 0 };

    function renderQuestion(question) {
        const fields = ['stem', 'kind_dictText', 'isPic', 'optiona', 'optionb', 'optionc', 'optiond', 'kind'];
        fields.forEach(field => {
            vm.model[field] = question[field];
        });
        vm.questionId = question.id;
        vm.option = undefined;
        vm.selectedValues = [];
        if (video) video.pause();
        vm.showModal = true;
    }

    async function finishVideo() {
        if (finishRequested) return;
        finishRequested = true;

        console.log(`🎉 题目处理完毕，共提交 ${stats.submitted} 题。`);
        if (!CONFIG.autoFinishVideo) {
            stopped = true;
            console.log('ℹ️ autoFinishVideo 已关闭，不执行视频结尾跳转。');
            return;
        }

        if (video && Number.isFinite(video.duration) && video.duration > 0) {
            vm.currTime = video.duration;
            vm.timeStamp = video.duration;
            video.currentTime = Math.max(0, video.duration - 1);
            if (video.paused) {
                try {
                    await video.play();
                } catch (_) {
                    console.warn('⚠️ 浏览器阻止了自动播放，请手动点击播放。');
                }
            }
        } else {
            console.warn('⚠️ 未获取到有效视频时长，跳过结尾跳转。');
        }

        await delay(CONFIG.finishDelay);
        if (!stopped && typeof vm.videoEnded === 'function') {
            try {
                await Promise.resolve(vm.videoEnded());
                console.log('✅ 已调用视频完成回调。');
            } catch (error) {
                console.error('❌ 视频完成回调执行失败：', error);
            }
        }
        stopped = true;
    }

    async function processQuestions() {
        if (running) return;
        running = true;

        try {
            while (!stopped) {
                const list = vm.model && vm.model.questionRelaList;
                if (!Array.isArray(list)) {
                    throw new Error('questionRelaList 不是数组，页面组件结构可能已变化');
                }

                if (list.length === 0) {
                    await finishVideo();
                    break;
                }

                // 页面上已有弹窗时先等待，避免覆盖用户正在查看的题目。
                if (vm.showModal) {
                    await delay(500);
                    continue;
                }

                const question = list[0];
                const matchedAnswer = findAnswer(question.stem);
                renderQuestion(question);
                console.log(`📝 当前题目（共剩余 ${list.length} 题）：${question.stem}`);

                if (matchedAnswer == null) {
                    if (!unmatched.some(item => item.id === question.id && item.stem === question.stem)) {
                        unmatched.push({ id: question.id, stem: question.stem });
                    }
                    stopped = true;
                    console.warn('⚠️ 题库未匹配到此题，已暂停且未从队列删除，请手动作答。');
                    console.warn('补充答案后可执行：window.videoQuestionSolver.addAnswer("完整题干", "A"); window.videoQuestionSolver.start();');
                    break;
                }

                if (String(vm.model.kind) === '3') {
                    vm.selectedValues = Array.isArray(matchedAnswer) ? matchedAnswer.slice() : [matchedAnswer];
                } else {
                    vm.option = Array.isArray(matchedAnswer) ? matchedAnswer[0] : matchedAnswer;
                }

                await delay(CONFIG.submitDelay);
                if (stopped) break;

                // 提交失败时恢复题目，避免直接丢失。
                list.shift();
                try {
                    await Promise.resolve(vm.submit());
                    stats.submitted += 1;
                    console.log(`✅ 已提交，第 ${stats.submitted} 题。`);
                } catch (error) {
                    stats.failed += 1;
                    if (!list.includes(question)) list.unshift(question);
                    vm.showModal = false;
                    throw error;
                }

                await delay(CONFIG.nextDelay);
            }
        } catch (error) {
            stopped = true;
            console.error('❌ 自动答题已因异常停止：', error);
        } finally {
            running = false;
        }
    }

    window.videoQuestionSolver = {
        start() {
            if (running) {
                console.log('ℹ️ 答题任务正在运行。');
                return;
            }
            stopped = false;
            finishRequested = false;
            processQuestions();
        },
        stop() {
            stopped = true;
            console.log('🛑 已请求停止；正在等待的当前步骤结束后不再继续。');
        },
        addAnswer(stem, answer) {
            addAnswer(stem, answer);
        },
        getUnmatched() {
            return unmatched.slice();
        },
        getStats() {
            return { ...stats, remaining: (vm.model.questionRelaList || []).length };
        }
    };

    console.log(`✅ 已连接答题组件，题库共 ${bankEntries.length} 条，待处理 ${vm.model.questionRelaList.length} 题。`);
    console.log('控制命令：window.videoQuestionSolver.stop() / start() / getUnmatched() / getStats()');
    processQuestions();
})();
