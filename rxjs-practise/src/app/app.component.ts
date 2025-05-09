import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2, OnInit } from '@angular/core';
import { from, fromEvent, interval, map, Observable, Observer, of, Subject, Subscription, take, takeUntil, timer, toArray } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('eventBtn', {static: true}) eventBtnRef!: ElementRef;
  @ViewChild('clearBtn', {static: true}) clearBtnRef!: ElementRef;

  @ViewChild('intervalList', {static: true}) intervalListRef!: ElementRef;
  @ViewChild('timerList', {static: true}) timerListRef!: ElementRef;
  listCounter = 0;
  intervalSub$!: Subscription;
  timerSub$!: Subscription;

  listCountArr : string[] = [];

  // of & from
  studentName$ !: Observable<string>;
  @ViewChild('ofList', {static: true}) ofListRef!: ElementRef;

  animalName$ !:Observable<string[]>;

  // Custom Observable
  flower$ !: Observable<string>;
  flowersArr: string[] = [];

  // take,takeLast,takeUntil
  takeInterval$: Observable<number[]> = interval(1000).pipe(take(5),toArray());
  stopInterval$: Subject<boolean> = new Subject();
  takeUntilInterval$: Observable<number[]> = interval(1000).pipe(takeUntil(this.stopInterval$),toArray());

  constructor(private readonly renderer: Renderer2){}

  ngAfterViewInit(): void {
    fromEvent(this.eventBtnRef.nativeElement, 'click')
      .subscribe(()=> {
        this.listCountArr.push('Event Triggerd');
      })

    fromEvent(this.clearBtnRef.nativeElement, 'click')
      .subscribe(
        (_data)=>{
          this.listCountArr = [];
        }
      )

      this.intervalSub$ = interval(1000).subscribe((_data)=>{
        this.listCounter++;
        const listItem = this.renderer.createElement('li')
        const listText = this.renderer.createText(`Value is ${this.listCounter}`);
        this.renderer.appendChild(listItem, listText);
        this.renderer.appendChild(this.intervalListRef.nativeElement, listItem);
        if(this.listCounter === 5){
          this.intervalSub$.unsubscribe();
        }
      });

      this.timerSub$ = timer(5000, 1000).subscribe((_data)=>{
        this.listCounter++;
        const listItem = this.renderer.createElement('li')
        const listText = this.renderer.createText(`Value is ${this.listCounter}`);
        this.renderer.appendChild(listItem, listText);
        this.renderer.appendChild(this.timerListRef.nativeElement, listItem);
        if(this.listCounter === 10){
          this.timerSub$.unsubscribe();
        }
      })
  };

  ngOnInit(): void {
    this.fromAndOf();
    this.createObservable()
  };

  fromAndOf(): void{
    this.studentName$ = of('sahil', 'zeenat', 'trigger');
    this.studentName$.subscribe((name)=>{
      const listItem = this.renderer.createElement('li')
      const listText = this.renderer.createText(`${name}`);
      this.renderer.appendChild(listItem, listText);
      this.renderer.appendChild(this.ofListRef.nativeElement, listItem)
    });
    this.animalName$ = from(['zebra', 'lion', 'donkey']).pipe(toArray());
  }

  createObservable(): void{
    let count = 0;
    this.flower$ = Observable.create((observer: Observer<string>)=>{
      setInterval(()=>{
        if(count === 4){
          observer.complete();
        }else{
          observer.next('rose ' + count);
          count++;
        }
      }, 2000)
    })
    this.flower$
    .pipe(map((data)=> data + ' hootaa'))
    .subscribe((data)=>{
      this.flowersArr.push(data);
    })
  }

  handleStopUntil(): void{
    this.stopInterval$.next(true)
  }
}
