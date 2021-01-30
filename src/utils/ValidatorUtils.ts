export class ValidatorUtils {

    public static isEmpty(s) {
        return s === undefined || s === '' || s === null || s.length === 0;
    }


    public static isNotEmpty(s) {
        return !(s === undefined || s === '' || s === null || s.length === 0);
    }

    public static getNumber(s) {
        if (ValidatorUtils.isEmpty(s)) {
            return 0;
        }
        return s;
    }
}
