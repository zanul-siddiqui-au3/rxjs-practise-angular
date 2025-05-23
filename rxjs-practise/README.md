# Notes
-- Rxjs is a libray to handle async task in javascript

# Promise vs Rxjs
  Promise returns single value - Observables can return streams of value
  Promise can't be cancelled   - Observables can be cancelled
  Promises are not lazy        - Observables are lazy it didn't emit data until subscribe

# Observable Streams 
    - User Input (Button Click Event)
    - Http Request
    - Array

# Observable Handle Events
   - Data
   - Error
   - Complete

# Rxjs Operator
   - FromEvent(domElementRef, eventName)
   - interval(timeOutInMs)
   - timer(delay, intervalTimeMs)
   - of() convert multiple values as an observable but it takes argument seperately of(1,2,3)
   - from() convert array, array of object, promises etc to an observable and emit data indvidually from([1,2,3])
   - toArray() it converts emitted data from an observable into an Array of emitted data when observable is completed
   - map() it's a pipable operator which helps to modify emitted data by an observable
   - pluck('object.key') it's a pipable operator helps to pick value from an object or even from nested object pluck ('child1',  'child2')
   - filter() it's pipable operator helps filter emitted data i.e filter((data)=> data.length > 2)
   - tap() it's a pipable operator which didn't modify/change emitted data it only uses for handling side effects like logging, debugging etc.
   -takeUntil() it's a pipable operator emits a value by the source observable until notifier emits a value
   -retry(howManyTimes, delayTimeMs | (err, retryCount)=> ) it's a pipable opreator which retry after subsequent intervals
   -scan((accum, current)=> newValue, startingValue) it's helps to modify stream of emitted data that allows to accumlate and transform emitted values over time
   -debounceTime(debounceTimeInMs) it'll emits notification after time has passed
   -distinctUntilChanged() it'll not emit new values until last emitted should be different from new one
   -new subject() it's a special type of operator which works as observable and observer at same time some. So, we can emit new values and listen to new emitted values
   -new BehaviourSubject(DefaultVlaue) it's same a subject but it requires default value while intializing
   - new ReplaySubject(lastEmittedValues) it's same as subject but it remember last emitted values that have been passed 
   - new AsyncSubject() it takes multiple emitted values but only return last value when subscription is completed
   - merge(obs1, obs2, obs3) combine multiple observables value in one in their emitted order it maintains it's sequence
   - concat(obs1,obs2,obs3) combine multiple observables value in one in the sequence it only add new values when previous observable is completed
   - mergeMap() It's flattening operator which takes value of maps value from source observable to an inner observable without preserving the order of emissions. It uses when sequence is not a matter when we need to make concurrent requests.
   - concatMap() It's also flattening operator which map values from source observable to an inner observable while maintaing it's sequence. It' uses when sequence is matter like upload multiple files one after another.
   - switchMap() It's a flattening operator which map source observable to an inner observable but only subscribes to last observable and cancelling remaining observable
   - exhaustMap() It's a flattening operator which map source observable to an inner observable but it ignores new ones while one is already running 
   - combineLatest(obs1 , obs2) it's combine data emitted by an observable in their sequence
   - obs1.pipe(withLatestFrom(obs2)) it's combine the data only when outer observable emit new data
   - forkJoin(obs1, obs2) it'll emit result only when both observable is completed it's behave same like Promise.all()
   - zip(obs1, obs2) it'll emit data when of both obserable emit new values and return emitted data as an Array