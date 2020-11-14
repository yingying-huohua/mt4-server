const log4js = require('log4js');

export class LogConfig {
    public static log() {
        log4js.configure({
            appenders: {
                mt4: {type: 'file', filename: '/home/webadmin/logs', pattern: 'yyyy-MM-dd.log', alwaysIncludePattern: true},
            },
            categories: {
                default: {appenders: ['mt4'], level: 'all'},
            },
        });
      return  log4js.getLogger('mt4');
    }
}
