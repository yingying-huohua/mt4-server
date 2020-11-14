import {ValidatorUtils} from "./ValidatorUtils";
import {Constant} from "../config/Constant";

export class PageNoAndPageSizeUtils {

    public static getPageNo(pageNo) {
        if (ValidatorUtils.isEmpty(pageNo)) return 0;
        return pageNo;
    }

    public static getPageSize(pageSize) {
        if (ValidatorUtils.isEmpty(pageSize)) return  Constant.DEFAULT_PAGE_SIZE;
        return pageSize;
    }

    public static getCurrentPageNo(pageNo) {
        if (ValidatorUtils.isEmpty(pageNo) || pageNo <= 0) {
            return 0;
        }else if (pageNo >= 1 ){
            return pageNo - 1;
        }
    }
}
