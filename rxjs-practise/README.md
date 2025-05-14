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
   -debounceTime(debounceTimeInMs) it'll emits notification after time has passed value didn't changed
   -distinctUntilChanged() it'll not emit new values until last emitted should be different from new one
   