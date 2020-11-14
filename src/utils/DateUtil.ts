import {ValidatorUtils} from './ValidatorUtils';
import {now} from 'moment';

const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

export class DateUtil {

    // 获取当前时间
    public static getNow() {
        return Moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    }

    // 获取开始时间结束时间中间的日期信息
    public static getDays(startDate, endDate) {
        const range = moment.range(startDate, endDate);
        // @ts-ignore
        return Array.from(range.by('days')).map(m => m.format('YYYY-MM-DD'));
    }

    // 获取当前时间的年份
    public static getYear(date) {
        return moment(date).format('YYYY');
    }

    // 获取当前时间是一年中的第几天
    public static getDayOfYear(date) {
        return moment(date).dayOfYear();
    }

    // 获取一个月有几天
    public static getDaysInMonth(date) {
        return moment(date).daysInMonth();
    }

    // 获取一周开始时间
    public static getWeekStartDay(date) {
        return moment(date).startOf('week').format('YYYY-MM-DD');
    }

    // 获取一周开始时间
    public static getWeekEndDay(date) {
        return moment(date).endOf('week').format('YYYY-MM-DD');
    }

    // 获取一月开始时间
    public static getMonthStartDay(date) {
        return moment(date).startOf('month').format('YYYY-MM-DD');
    }

    // 获取一月结束时间
    public static getMonthEndDay(date) {
        return moment(date).endOf('month').format('YYYY-MM-DD');
    }

    // 获取开始时间和结束时间之间的天数
    public static getIntervalDays(startDate, endDate) {
        return moment(endDate).diff(moment(startDate), 'd');
    }

    // 从date开始，获取days之后的时间
    public static getDateAfterDays(date, days) {
        return moment(date).add(days, 'd').format('YYYY-MM-DD');
    }

    // 获取开始时间结束时间中间的周信息
    public static getWeeks(startDate, endDate) {
        const start = startDate;
        const end   = endDate;
        const weekOfday = moment(start).format('E');
        const endWeekDy = moment(end).format('E');
        const startdd   = moment(start).subtract(weekOfday, 'days').format('YYYY-MM-DD');
        const enddd = moment(end).subtract(endWeekDy, 'days').format('YYYY-MM-DD');

        const range = moment.range(startdd, enddd);
        // @ts-ignore
        return Array.from(range.by('weeks')).map(m => m.format('YYYY-MM-DD'));

    }

    // 时间格式化 YYYY-MM-DD
    public static parseDate(date) {
        return moment(date).format('YYYY-MM-DD');
    }

    // 时间格式化 YYYY-MM-DD
    public static parseTime(date: string) {
        const re = /^(?:[01]\d|2[0-3])(?::[0-5]\d){2}$/;
        if (re.test(date)) { return date; }
        return moment(date).format('HH:mm:ss');
    }

    // 时间格式化 YYYY-MM-DD HH:mm:ss
    public static parseDateTime(date: string) {
        const re = /^(?:[01]\d|2[0-3])(?::[0-5]\d){2}$/;
        if (re.test(date)) { return date; }
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    }

    // 时间格式化 YYYYMMDDHHmmss
    public static parseDateTime_YYYYMMDDHHmmss(date: string) {
        const re = /^(?:[01]\d|2[0-3])(?::[0-5]\d){2}$/;
        if (re.test(date)) { return date; }
        return moment(date).format('YYYYMMDDHHmmss');
    }

    // 时间格式化 YYYY-MM-DD
    public static getEndOfdate(date) {
        return moment(date).format('YYYY-MM-DD 23:59:59');
    }

    public static isAfterNow(date) {
        return !moment(date).isBefore(this.parseDate(now()));
    }

    // 获取开始时间结束时间中间的月信息以第一天开始
    public static getMonths(startDate, endDate) {
        const start = startDate;
        const end   = endDate;
        const startTime = moment(start).startOf('month');
        const endTime   = moment(end).startOf('month');
        const range     = moment.range(startTime, endTime);
        // @ts-ignore
        return Array.from(range.by('months')).map(m => m.format('YYYY-MM-DD'));
    }

    // 获取开始时间结束时间中间的月信息以最后一天结尾
    public static getMonthsEndDate(startDate, endDate) {
        const start = startDate;
        const end   = endDate;
        const startTime = moment(start).endOf('month');
        const endTime   = moment(end).endOf('month');
        const range     = moment.range(startTime, endTime);
        // @ts-ignore
        return Array.from(range.by('months')).map(m => moment(m).endOf('month').format('YYYY-MM-DD'));
    }


    // 获取每一天结果集
    public static daysList(result, startDate, endDate) {
        const days = this.getDays(startDate, endDate);
        const intervalArray = [];
        // 遍历时间数组 获取时间间隔
        for (const objectKey in result.valueOf()) {
            if (objectKey !== 'date') {
                continue;
            }

            for (const dateKey of result.date) {
                const index = days.indexOf(dateKey);
                if (index === -1) {
                    continue;
                }

                intervalArray.push(index);
            }
        }
        return this.getResult(result, days, intervalArray);

    }

    // 获取每一周结果集
    public static weeksList(result, startDate, endDate) {
        const days = this.getWeeks(startDate, endDate);
        const intervalArray = [];
        // 遍历时间数组 获取时间间隔
        for (const objectKey in result.valueOf()) {
            if (objectKey !== 'date') {
                continue;
            }
            for (let dateKey of result.date) {
                dateKey = this.getWeekStartDay(dateKey);
                const index = days.indexOf(dateKey);
                if (index === -1) {
                    continue;
                }
                intervalArray.push(index);
            }
        }
        return this.getResult(result, days, intervalArray);
    }

    // 获取每一月结果集
    public static monthsList(result, startDate, endDate) {
        const intervalArray = [];
        const days = this.getMonthsEndDate(startDate, endDate);
        // 遍历时间数组 获取时间间隔
        for (const objectKey in result.valueOf()) {
            if (objectKey !== 'date') {
                continue;
            }

            for (let dateKey of result.date) {
                dateKey = this.getMonthEndDay(dateKey);
                const index = days.indexOf(dateKey);

                if (index === -1) {
                    continue;
                }

                intervalArray.push(index);
            }
        }
        return this.getResult(result, days, intervalArray);
    }


    private static getResult(result, days, intervalArray) {
        // 将时间数组中最后一个的位置放入间隔中
        intervalArray.push(days.length);

        // 若起始不为0，则补0
        if (intervalArray[0] != 0) {
            intervalArray.splice(0, 0, 0);
            for (const objectKey in result.valueOf()) {
                if (objectKey !== 'date') {
                    result[objectKey].splice(0, 0, 0);
                }
            }
        }


        // 将对象中的其他数组中
        for (let index = 0; index < intervalArray.length - 1; index++) {
            const interval = intervalArray[index + 1] - intervalArray[index];
            if (interval <= 1 ) {
                continue;
            }

            for (let count = 1; count < interval; count++) {
                for (const objectKey in result.valueOf()) {
                    if (objectKey !== 'date') {
                        result[objectKey].splice(intervalArray[index] + count, 0, 0);
                    }
                }
            }

        }

        // 将数据为null的改为0
        for (const resultKey in result) {
            for (let resultKeyKey of result[resultKey]) {
                if (ValidatorUtils.isEmpty(resultKeyKey) || resultKeyKey === 'null') {
                    resultKeyKey = 0;
                }
            }
        }


        result.date = days;
        return result;
    }


    public static getEndDate(endDate) {
        if (endDate === undefined || endDate === '') {
            return this.parseDate(now());
        }
        return endDate;
    }

    public static getStartDate(startDate, days) {
        if (startDate === undefined || startDate === '') {
            return this.getDateAfterDays(now(), -days);
        }
        return startDate;
    }

    /**
     * 补全某时间段内数据
     * @param startDate 开始时间
     * @param endDate 结束时间
     * @param result 数据结果对象
     */
    public static completeIntervalData(startDate, endDate, result) {
        // 获取时间段内所有日期
        const targetDay = DateUtil.getDays(startDate, endDate);
        const object = this.getDataObject(result);
        const sourceDay = result.day ? result.day : [];
        // 遍历返回数据对象
        for (const key in result) {
            // key不存在或字段为day时，不执行
            if (!result.hasOwnProperty(key)) {
                continue;
            }
            // 若为日期，直接赋值
            if (key === 'day') {
                object[key] = targetDay;
                continue;
            }
            // 非日期时，补全数据
            object[key] = this.completeData(result[key], sourceDay, targetDay);
        }

        return object;
    }

    private static getDataObject(result) {
        const object = {};
        for (const key in result) {
            if (!result.hasOwnProperty(key)) {
                continue;
            }
            object[key] = [];
        }

        return object;
    }

    /**
     * 补全数据
     *
     * 将源数据按照目标日期补全，目标日期在源日期中存在时，根据index直接获取源数据存储，不存在时补0占位
     * @param sourceData 源数据
     * @param sourceDays 源日期
     * @param targetDays 目标日期
     */
    private static completeData(sourceData, sourceDays, targetDays) {
        // 保存数据的array;
        const targetData = [];
        // 遍历日期
        for (const index in targetDays) {
            if (!targetDays.hasOwnProperty(index)) {
                continue;
            }
            // 通过index获取对应日期
            const day = targetDays[index];
            // 检查当前日期在返回数据中是否存在, 存在则获取对应值，不存在补0，
            const index1 = sourceDays.indexOf(day);
            let value = 0;
            if (index1 > -1) {
                value = sourceData[index1];
            }
            targetData.push(value);
        }
        return targetData;
    }

}
