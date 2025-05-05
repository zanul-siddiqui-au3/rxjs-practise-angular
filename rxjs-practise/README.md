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
   - of() convert multiple values as an observable but it takes argument seperately
   - from() convert array, array of object, promises etc to an observable
