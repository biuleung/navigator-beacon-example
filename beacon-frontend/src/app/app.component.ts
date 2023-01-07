import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { interval, take } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = ''
  consoleLogSubject = new Subject<{ type: string; value: any }>();
  logs: string[] = [];


  constructor(private http: HttpClient) {
    const that = this;
    let defaultLog = console.log.bind(console);
    let defaultError = console.error.bind(console);
    let defaultWarn = console.warn.bind(console);

    console.log = function () {
      defaultLog.apply(console, arguments as any);
      that.consoleLogSubject.next({
        type: 'log',
        value: Array.from(arguments),
      });
    };
    console.error = function () {
      defaultError.apply(console, arguments as any);
      that.consoleLogSubject.next({
        type: 'error',
        value: Array.from(arguments),
      });
    };
    console.warn = function () {
      defaultWarn.apply(console, arguments as any);
      that.consoleLogSubject.next({
        type: 'warn',
        value: Array.from(arguments),
      });
    };
  }

  ngOnInit() {
    this.subscribeConsolelog();
  }

  subscribeConsolelog(){
    this.consoleLogSubject.subscribe((log) => {
      let data = `${log.type}: ${JSON.stringify(log.value)}`;
      this.logs.push(data);
      this.sendBeacon(data.toString())
    });
  }

  sendBeacon(payload: string) {
    if (navigator.sendBeacon) {
      navigator.sendBeacon('http://localhost:3330', payload);
    }else{
      console.log("navigator.sendBeacon not working")
    }
  }

  onLogItClick(){
    interval(3000)
      .pipe(take(10))
      .subscribe((num) => {
        switch (num % 2) {
          case 0:
            console.log('log: ', {
              code: '',
              message: {
                msg: 'running',
                status: 'running',
              },
            });
            break;
          case 1:
            if (num % 3 === 0) {
              console.warn('warn: ', {
                code: 'warn_code',
                message: {
                  msg: 'warning message',
                  status: 'paused',
                },
              });
            } else {
              console.error('error: ', {
                code: 'error_code',
                message: {
                  msg: 'error message',
                  status: 'terminal',
                },
              });
            }
            break;
          default:
            break;
        }
      });
  }
}
