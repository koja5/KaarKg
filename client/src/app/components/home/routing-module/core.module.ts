import { NgModule } from '@angular/core';
import { Observable, firstValueFrom, isObservable } from 'rxjs';

declare const Zone: any;

@NgModule({})
export class CoreModule {
  async waitFor<T>(prom: Promise<T> | Observable<T>): Promise<T> {
    if (isObservable(prom)) {
      prom = firstValueFrom(prom);
    }
    const macroTask = Zone.current.scheduleMacroTask(
      `WAITFOR-${Math.random()}`,
      () => {},
      {},
      () => {}
    );
    return prom.then((p: T) => {
      macroTask.invoke();
      return p;
    });
  }
}
