angular
	.module("ngCalendar", [])
	.controller("ngCalendarController", function () {
		var ctx = this;

		ctx.viewEnum = {
			Month: 1,
			Week: 2
		};

		ctx.calendar = {
			Options: {},

			Defaults: {
				HourInterval: 1,
				MinuteInterval: 0,

				FromHour: 0,
				ToHour: 23
			}
		};

		ctx.$onInit = $onInit;

		function $onInit() {
			onInitOptions();

			setView(!ctx.calendar.Options.IsWeek);
		}

		function onInitOptions() {
			angular.extend(ctx.calendar.Options, ctx.calendar.Defaults);

			if (ctx.options) {
				angular.extend(ctx.calendar.Options, angular.copy(ctx.options));
			}

			if (ctx.calendar.Options.IsFromNow) {
				ctx.calendar.Options.FromDate = moment();
			}

			if (!ctx.calendar.Options.HourInterval || !ctx.calendar.Options.MinuteInterval ||
				(ctx.calendar.Options.HourInterval <= 0 && ctx.calendar.Options.MinuteInterval <= 0)) {
				ctx.calendar.Options.HourInterval = ctx.calendar.Defaults.HourInterval;
				ctx.calendar.Options.MinuteInterval = ctx.calendar.Defaults.MinuteInterval;
			}
		}

		ctx.refresh = refresh;

		function refresh() {
			onInitOptions();

			chooseDate();

			setView(isMonthView());
		}

		ctx.isMonthView = isMonthView;

		function isMonthView() {
			return ctx.calendar.View == ctx.viewEnum.Month;
		}

		ctx.isWeekView = isWeekView;

		function isWeekView() {
			return ctx.calendar.View == ctx.viewEnum.Week;
		}

		ctx.isPrevDisabled = isPrevDisabled;

		function isPrevDisabled() {
			if (!ctx.calendar.Data.Date || !ctx.calendar.Options.FromDate) {
				return false;
			}

			if (isMonthView()) {
				//TODO: Add disable condition for month view.

				return false;
			}

			if (isWeekView()) {
				var prevWeekDate = ctx.calendar.Data.Date.clone();

				return prevWeekDate < ctx.calendar.Options.FromDate;
			}

			return false;
		}

		ctx.isNextDisabled = isNextDisabled;

		function isNextDisabled() {
			if (!ctx.calendar.Data.Date || !ctx.calendar.Options.ToDate) {
				return false;
			}

			if (isMonthView()) {
				//TODO: Add disable condition for month view.

				return false;
			}

			if (isWeekView()) {
				var nextWeekDate = ctx.calendar.Data.Date.clone().add(1, "w");

				return nextWeekDate > ctx.calendar.Options.ToDate;
			}

			return false;
		}

		ctx.setView = setView;

		function setView(isMonth) {
			if (isMonth) {
				setMonth(ctx.calendar.ChosenDate);
			} else {
				setWeek(ctx.calendar.ChosenDate);
			}
		}

		function setWeek(date) {
			ctx.calendar.Data = {
				Columns: []
			};

			ctx.calendar.View = ctx.viewEnum.Week;

			date = moment(date).startOf("week");

			ctx.calendar.Data.Date = date.clone();

			for (var i = 0; i < 7; i++) {
				var column = {
					Date: date.clone(),

					DayName: date.format("ddd"),
					FormattedDate: date.format("DD/MM"),

					Rows: []
				};

				if (ctx.calendar.Options.IsWithTime) {
					var time = column.Date.clone().hour(ctx.calendar.Options.FromHour);

					for (;;) {
						if (time.date() != column.Date.date() || time.hour() > ctx.calendar.Options.ToHour ||
							(time.hour() == ctx.calendar.Options.ToHour && time.minute() > 0)) {
							break;
						}

						var isValid = true;

						if (ctx.calendar.Options.FromDate && time < ctx.calendar.Options.FromDate) {
							isValid = false;
						}

						if (ctx.calendar.Options.ToDate && time > ctx.calendar.Options.ToDate) {
							isValid = false;
						}

						if (isValid) {
							var row = {
								Date: time,

								FormattedDate: time.format("HH:mm")
							}

							column.Rows.push(row);
						}

						time = time.clone().add(ctx.calendar.Options.HourInterval, "h").add(ctx.calendar.Options.MinuteInterval, "m");
					}
				}

				ctx.calendar.Data.Columns.push(column);

				date.add(1, "d");
			}

			onChangeDate();
		}

		ctx.prevWeek = prevWeek;

		function prevWeek() {
			setWeek(ctx.calendar.Data.Date.subtract(1, "w"));
		}

		ctx.nextWeek = nextWeek;

		function nextWeek() {
			setWeek(ctx.calendar.Data.Date.add(1, "w"));
		}

		ctx.isSameDate = isSameDate;

		function isSameDate(date1, date2) {
			if (!date1 || !date2) {
				return false;
			}

			return date1.isSame(date2, "day");
		}

		ctx.isSameDateTime = isSameDateTime;

		function isSameDateTime(date1, date2) {
			if (!isSameDate(date1, date2)) {
				return false;
			}

			return date1.isSame(date2, "hour") && date1.isSame(date2, "minute");
		}

		ctx.chooseDate = chooseDate;

		function chooseDate(date) {
			if (!date || (ctx.calendar.ChosenDate &&
					((!ctx.calendar.Options.IsWithTime && isSameDate(ctx.calendar.ChosenDate, date)) || (ctx.calendar.Options.IsWithTime && isSameDateTime(ctx.calendar.ChosenDate, date))))) {
				ctx.calendar.ChosenDate = undefined;
			} else {
				ctx.calendar.ChosenDate = date.clone();
			}

			if (ctx.onChooseDate) {
				if (ctx.calendar.ChosenDate) {
					ctx.onChooseDate(ctx.calendar.ChosenDate.clone());
				} else {
					ctx.onChooseDate(null);
				}
			}
		}

		function setMonth(date) {
			ctx.calendar.Data = {
				Columns: moment.weekdaysShort(true),

				Rows: []
			};

			ctx.calendar.View = ctx.viewEnum.Month;

			date = moment(date).startOf("month");

			ctx.calendar.Data.Date = date.clone();

			ctx.calendar.Data.FormattedDate = ctx.calendar.Data.Date.format("MMMM YYYY");

			date = date.startOf("week");

			for (var i = 0; i < 5; i++) {
				var row = {
					Columns: []
				};

				for (var j = 0; j < 7; j++) {
					var column = {
						Date: date.clone(),

						FormattedDate: date.format("DD")
					};

					row.Columns.push(column);

					date.add(1, "d");
				}

				ctx.calendar.Data.Rows.push(row);
			}

			onChangeDate();
		}

		ctx.prevMonth = prevMonth;

		function prevMonth() {
			setMonth(ctx.calendar.Data.Date.subtract(1, "M"));
		}

		ctx.nextMonth = nextMonth;

		function nextMonth() {
			setMonth(ctx.calendar.Data.Date.add(1, "M"));
		}

		ctx.hasEvent = hasEvent;

		function hasEvent(date) {
			if (!date) {
				return false;
			}

			if (!ctx.events || !ctx.events.length) {
				return false;
			}

			return ctx.events.some(val => isSameDate(date, val));
		}

		function onChangeDate() {
			var model = {};

			if (isMonthView()) {
				var fromDate = ctx.calendar.Data.Rows[0].Columns[0];

				if (fromDate) {
					model.FromDate = fromDate.Date.clone();
				}

				if (model.FromDate) {
					var toDate = ctx.calendar.Data.Rows[ctx.calendar.Data.Rows.length - 1].Columns[ctx.calendar.Data.Rows[ctx.calendar.Data.Rows.length - 1].Columns.length - 1];

					if (toDate) {
						model.ToDate = toDate.Date.clone();
					}
				}
			}

			if (isWeekView()) {
				var fromDate = ctx.calendar.Data.Columns[0];

				if (fromDate) {
					model.FromDate = fromDate.Date.clone();
				}

				if (model.FromDate) {
					var toDate = ctx.calendar.Data.Columns[ctx.calendar.Data.Columns.length - 1];

					if (toDate) {
						model.ToDate = toDate.Date.clone();
					}
				}
			}

			if (ctx.onChangeDate) {
				ctx.onChangeDate(model);
			}
		}
	})
	.component("ngCalendar", {
		templateUrl: "./ng-calendar.view.html",
		controller: "ngCalendarController",
		controllerAs: "ctx",
		bindings: {
			options: "<",
			events: "<",

			onChangeDate: "<",
			onChooseDate: "<",

			setView: "=?",
			refresh: "=?"
		}
	});