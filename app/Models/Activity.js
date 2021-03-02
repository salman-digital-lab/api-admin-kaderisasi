"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const DATE_FORMAT = "YYYY-MM-DD";

class Activity extends Model {

  static get dates() {
    return super.dates.concat([
      "begin_date",
      "end_date",
      "register_begin_date",
      "register_end_date",
    ]);
  }

  static castDates(field, value) {
    if (
      field === "begin_date" ||
      field === "end_date" ||
      field === "register_begin_date" ||
      field === "register_end_date"
    ) {
      return value.format(DATE_FORMAT);
    }
    return super.formatDates(field, value);
  }

  static get updatedAtColumn() {
    return null;
  }

  static get hidden() {
    return ['is_deleted']
  }

  activityCategory() {
    return this.hasOne("App/Models/ActivityCategory", "category_id", "id");
  }
}

module.exports = Activity;
