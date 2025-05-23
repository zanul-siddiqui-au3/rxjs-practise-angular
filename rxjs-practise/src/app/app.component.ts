import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2, OnInit } from '@angular/core';
import { concat, concatMap, debounce, debounceTime, distinct, distinctUntilChanged, from, fromEvent, interval, map, merge, mergeMap, Observable, Observer, of, pluck, ReplaySubject, retry, retryWhen, scan, Subject, Subscription, switchMap, take, takeUntil, timer, toArray } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  // retry, scan
  retryCount = 0;

  // debounceTime & distictUntilChanged
  @ViewChild('distinctInput', {static: true}) distinctInputRef!: ElementRef;
  searchingValue = '';

  // ReplaySubject
  list1Items: string[] = [];
  list2Items: string[] = [];
  listItemsReplay$: ReplaySubject<string> = new ReplaySubject<string>(4);

  // Concat & Merge
  techVideo$ = interval(1000).pipe(map((v, i)=> `Tech Video ${i+ 1}`), take(3));
  comdeyVideo$ = interval(2000).pipe(map((v, i)=> `Comdey Video ${i+ 1}`),take(4));
  roastVideo$ = interval(1500).pipe(map((v, i)=> `Roast Video ${i+ 1}`),take(3));
  @ViewChild('concatList') concatListRef !: ElementRef;
  @ViewChild('mergeList') mergeListRef !: ElementRef;

  // MergeMap
  mergeCount$ = interval(1000).pipe(take(2), mergeMap((_val)=> interval(2000).pipe(take(3),map((val, i)=> `Video ${val + 1} - ${i * (val + 1)}`))))
  @ViewChild('mergeMapList', {static: true}) mergeMapListRef!: ElementRef;

  // ConcatMap
  videoList$ = from(['Tech', 'Comedy', 'Horror']);
  concatList$ = this.videoList$.pipe(concatMap((val)=> interval(2000).pipe(take(3), map((data, index)=> `${val} Video - ${index + 1}`))))
  @ViewChild('concatMapList', {static: true}) concatMapListRef!: ElementRef;

  // SwitchMap
  @ViewChild('searchInputUser', {static: true}) searchInputUser !: ElementRef;
  searchedUser = []

  constructor(private readonly renderer: Renderer2, private readonly http: HttpClient){}

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
    this.createObservable();
    this.handleDistinct();
    this.listItemsReplay$.subscribe((data: string)=>{
      this.list1Items.push(data)
    });
    this.handleConcatAndMerge();
    this.handleMergeMap();
    this.handleConcatMap();
    this.handleSwitchMap();
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

  fetchDetails(): void{
    this.http
      .get('https://jsonplaceholder.typicode.com/posts')
      .pipe(
        retry({count: 4, delay: 2000}),
        scan((accu: any, curr: any)=>{
          return [...accu, curr.title];
        }, [])
      )
      .subscribe((data)=>{
        console.log(data)
      })
  }

  handleDistinct(): void{
    fromEvent<KeyboardEvent>(this.distinctInputRef.nativeElement, 'keyup')
    .pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
    .subscribe((data: KeyboardEvent)=>{
      console.log('happen')
      const input = data.target as HTMLInputElement;
      this.searchingValue = input.value;
    })
  }

  handleReplaySearch(value: string): void{
    this.listItemsReplay$.next(value);
  }

  handleSubList2(): void{
    this.listItemsReplay$.subscribe((data: string)=>{
      this.list2Items.push(data)
    })
  }

  handleConcatAndMerge(): void{
    concat(this.techVideo$, this.comdeyVideo$, this.roastVideo$).subscribe((video)=>{
      this.printList(this.concatListRef, video);
    });
    merge(this.techVideo$, this.comdeyVideo$, this.roastVideo$).subscribe((video)=>{
      this.printList(this.mergeListRef, video);
    });
  }

  handleMergeMap(): void{
    this.mergeCount$.subscribe((val)=>{
      this.printList(this.mergeMapListRef, val);
    })
  }

  handleConcatMap(): void{
    this.concatList$.subscribe((data)=>{
      this.printList(this.concatMapListRef, data);
    })
  }

  handleSwitchMap(): void{
    fromEvent(this.searchInputUser.nativeElement, 'keyup')
    .pipe(
      // debounceTime(500),
      distinctUntilChanged(),
      switchMap((data: any)=> this.http.get(`https://dummyjson.com/users/search`, {
        params: {
          q: data.target.value
        }
      })),
      pluck('users'),
      map((user: any)=> {
        return user.map((ele: any)=> ele.firstName)
      })
    )
    .subscribe((data: any)=>{
      this.searchedUser = data;
    })
  }

  printList(ulRef: ElementRef, data: string): void{
    const newLi = this.renderer.createElement('li');
    const text = this.renderer.createText(data);
    this.renderer.addClass(newLi, 'list-group-item');
    this.renderer.appendChild(newLi, text);
    this.renderer.appendChild(ulRef.nativeElement, newLi);
  }
}
