import { Component, ElementRef, ViewChild, AfterViewInit, Renderer2, OnInit } from '@angular/core';
import { from, fromEvent, interval, Observable, of, Subscription, timer } from 'rxjs';


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

  animalName$ !: Observable<string>;

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
    this.fromAndOf()
  };

  fromAndOf(): void{
    this.studentName$ = of('sahil', 'zeenat', 'trigger');
    this.studentName$.subscribe((name)=>{
      const listItem = this.renderer.createElement('li')
      const listText = this.renderer.createText(`${name}`);
      this.renderer.appendChild(listItem, listText);
      this.renderer.appendChild(this.ofListRef.nativeElement, listItem)
    });
    this.animalName$ = from(['zebra', 'lion', 'donkey']);
    this.animalName$.subscribe((data)=>{
      console.log(data)
    })
  }
}
