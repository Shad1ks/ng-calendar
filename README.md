# ng-calendar

### Description

Calendar component for AngularJS.

### Demo

- [Plunker](http://plnkr.co/edit/gfJlmY?p=preview)

### Requirements

- [Moment.js](https://momentjs.com/)
- [AngularJS](http://angularjs.org/)

### Install

- **Manually**

Download latest release [here](http://github.com/Shad1ks/ng-calendar/releases/).

- **NPM**

```
npm install ss-ng-calendar
```

- **Bower**

```
bower install ss-ng-calendar
```

### Setup

```html
<link rel="stylesheet" href=".../src/ng-calendar.view.css">

<script type="text/javascript" src=".../moment.js"></script>
<script type="text/javascript" src=".../angular.js"></script>

<script type="text/javascript" src=".../src/ng-calendar.component.js"></script>
```

```javascript
angular.module("App", ["ngCalendar"]);
```

### Usage

```javascript
ctx.calendarOptions = {};

ctx.calendarValue = null;

ctx.onChooseDate = onChooseDate;

function onChooseDate(date) {
    ctx.calendarValue = date;
}
```

```html
<ng-calendar options="ctx.calendarOptions" on-choose-date="ctx.onChooseDate"></ng-calendar>
```

### Options

- **Week view (No time.)**<br>Use to switch to week view mode.

```javascript
ctx.calendarOptions = { IsWeek: true };
```

- **Week view (With time.)**<br>Use to add time to week view mode.

```javascript
ctx.calendarOptions = { IsWeek: true, IsWithTime: true };
```

> **WARNING**: Options described from now will be working just for the week view mode with time.

- **Available date range**<br>Use to hide times, not within this range.
  - Also, disables arrow to change a week, if there are no available times.

```javascript
ctx.calendarOptions = { IsWeek: true, IsWithTime: true, FromDate: moment(), ToDate: moment().add(1, "M") };

//If you need to set FromDate: moment(), just use IsFromNow: true.
```

- **Available time range**<br>Use to hide hours, not within this range.
  - Default is from 0 to 23.

```javascript
ctx.calendarOptions = { IsWeek: true, IsWithTime: true, FromHour: 7, ToHour: 19 };
```

- **Interval**<br>Use to generate hours with some interval.
  - Default is 1 hour.

```javascript
ctx.calendarOptions = { IsWeek: true, IsWithTime: true, HourInterval: 2, MinuteInterval: 30 };
```

### Additional

- **Events**<br>Use to highlight the date.
  - **WARNING**: Just for month view mode.

```javascript
ctx.calendarOptions = {};

ctx.calendarEvents = [moment(), "2022-07-12"];
```

```html
<ng-calendar options="ctx.calendarOptions" events="ctx.calendarEvents"></ng-calendar>
```

- **Get date range**<br>Use to get date range and watch changes after clicking on arrows.

```javascript
ctx.calendarOptions = {};

ctx.onChangeDate = onChangeDate;

function onChangeDate(dateRange) {
    //dateRange is an object with FromDate and ToDate properties as moment objects.
}
```

```html
<ng-calendar options="ctx.calendarOptions" on-change-date="ctx.onChangeDate"></ng-calendar>
```

- **Get chosen date**<br>Use to get chosen date after clicking on one.
  - Clicking on one date two times will clear it.

```javascript
ctx.calendarOptions = {};

ctx.onChooseDate = onChooseDate;

function onChooseDate(date) {
    //date is a chosen date as moment object or null.
}
```

```html
<ng-calendar options="ctx.calendarOptions" on-choose-date="ctx.onChooseDate"></ng-calendar>
```

- **Change view**<br>Use to change view after load.

```javascript
ctx.calendarOptions = {};

//After the calendar is initialized.

var isMonth = false; //To change to week view mode.

ctx.changeCalendarView(isMonth);
```

```html
<ng-calendar options="ctx.calendarOptions" set-view="ctx.changeCalendarView"></ng-calendar>
```

- **Refresh**<br>Use to reload options in case of change.

```javascript
ctx.calendarOptions = {};

//After the calendar is initialized.

ctx.calendarOptions = { IsWeek: true, IsWithTime: true, FromHour: 8, ToHour: 17 };

ctx.refreshCalendar();
```

```html
<ng-calendar options="ctx.calendarOptions" refresh="ctx.refreshCalendar"></ng-calendar>
```