"use strict";

const { validate, sanitizor } = use("Validator");
const Category = use("App/Models/ActivityCategory");
const Activity = use("App/Models/Activity");
const MemberRole = use('App/Models/MemberRole');

class ActivityController {

  async index({ request, response }) {

    const data = request.all()
    data.search = sanitizor.escape(data.search)

    const rules = {
      category_id: 'number',
      minimum_roles_id: 'number',
      date: 'date',
      search: 'string',
      page: 'number',
      perPage: 'number',
    }

    const validation = await validate(data, rules);

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: validation.messages()
        });
    }

    try {
      const whereClause = {}
      whereClause.is_deleted = 0

      if (data.category_id) {
        whereClause.category_id = data.category_id
      }

      if (data.minimum_roles_id) {
        whereClause.minimum_role_id = data.minimum_roles_id
      }

      if (data.date) {
        whereClause.begin_date = data.date
      }

      const search = (data.search) ? sanitizor.escape(data.search) : ""
      const page = (data.page) ? data.page : 1
      const perPage = (data.perPage) ? data.perPage : 10

      let activities = await Activity.query()
        .where(whereClause)
        .where('name', 'LIKE', '%' + search + '%')
        .where('is_deleted', 0)
        .with("activityCategory")
        .with("minimumRole")
        .with("carousel")
        .paginate(page, perPage)

      let converted = activities.toJSON()
      let activityData = converted.data

      activityData.forEach(element => {
        delete element.form_data
      })
      
      activities.data = activityData

      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Aktivitas berhasil dimuat!",
          data: activities,
        });
    } catch (error) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: error.message
        });
    }
  }

  async store({ request, response }) {

    const data = request.all();
    if (data.name) {
      data.slug = sanitizor.slug(data.name);
    }

    const rules = {
      name: "required",
      slug: "required_if:name|unique:activities,slug",
      begin_date: "required|date",
      end_date: "required|date",
      register_begin_date: "required|date",
      register_end_date: "required|date",
      category_id: 'required|number',
      minimum_role_id: 'required|number',
      status: "required_if:status|in:OPENED,CLOSED",
      is_published: "required_if:is_published|in:0,1",
    };

    const validation = await validate(data, rules);

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: validation.messages()
        });
    }

    try {
      await Category.findByOrFail('id', data.category_id)
    } catch (error) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Category ID tidak valid!"
        });
    }

    try {
      await MemberRole.findByOrFail('id', data.minimum_role_id)
    } catch (error) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Member Role ID tidak valid!"
        });
    }

    try {

      const activity = new Activity();
      activity.name = data.name;
      activity.slug = data.slug;
      activity.begin_date = data.begin_date;
      activity.end_date = data.end_date;
      activity.register_begin_date = data.register_begin_date;
      activity.register_end_date = data.register_end_date;
      activity.category_id = data.category_id;
      activity.description = data.description;
      activity.status = data.status;
      activity.minimum_role_id = data.minimum_role_id;
      activity.is_published = data.is_published;
      activity.form_data = '[]';
      await activity.save();

      const activities = await Activity.query()
        .where({ id: activity.id })
        .with("activityCategory")
        .fetch()

      return response
        .status(201)
        .json({
          status: "SUCCESS",
          message: "Data Aktivitas berhasil dibuat!",
          data: activities,
        });
    } catch (error) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: error.message
        });
    }
  }

  async show({ params, response }) {

    const { id } = params;

    const rules = {
      id: 'number'
    }

    const validation = await validate({ id: id }, rules);

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: validation.messages()
        });
    }

    const activities = await Activity.query()
      .where({ id: id, is_deleted: 0 })
      .with("activityCategory")
      .with("minimumRole")
      .with("carousel")
      .fetch()

    try {
      if (activities.rows.length > 0) {

        var activityData = activities.toJSON()
        delete activityData[0].form_data

        return response
          .status(200)
          .json({
            status: "SUCCESS",
            message: "Data Aktivitas berhasil dimuat!",
            data: activityData,
          });
      }

      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Tidak ada data yang ditemukan"
        });
    } catch (error) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: error.message
        });
    }
  }

  async update({ params, request, response }) {

    const { id } = params;
    const activity = await Activity.findBy({ id: id, is_deleted: 0 });

    if (!activity) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Tidak ada data yang ditemukan"
        });
    }

    const data = request.all();

    if (data.name) {
      data.slug = sanitizor.slug(data.name);
    }

    const rules = {
      name: "required_if:name",
      slug: `required_if:name|unique:activities,slug,id,${activity.id}`,
      begin_date: "required_if:begin_date|date",
      end_date: "required_if:end_date|date",
      register_begin_date: "required_if:register_begin_date|date",
      register_end_date: "required_if:register_end_date|date",
      category_id: 'required_if:category_id|number',
      minimum_role_id: 'required_if:minimum_role_id|number',
      status: "required_if:status|in:OPENED,CLOSED",
      is_published: "required_if:is_published|in:0,1",
    };

    const validation = await validate(data, rules);

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: validation.messages()
        });
    }

    if (data.category_id) {
      try {
        await Category.findByOrFail('id', data.category_id)
      } catch (error) {
        return response
          .status(400)
          .json({
            status: "FAILED",
            message: "Category ID tidak valid!"
          });
      }
    }

    if (data.minimum_role_id) {
      try {
        await MemberRole.findByOrFail('id', data.minimum_role_id)
      } catch (error) {
        return response
          .status(400)
          .json({
            status: "FAILED",
            message: "Member Role ID tidak valid!"
          });
      }
    }

    try {

      activity.name = data.name;
      activity.slug = data.slug;
      activity.begin_date = data.begin_date;
      activity.end_date = data.end_date;
      activity.register_begin_date = data.register_begin_date;
      activity.register_end_date = data.register_end_date;

      if (data.category_id) {
        activity.category_id = data.category_id;
      }

      activity.description = data.description;
      activity.status = data.status;

      if (data.minimum_role_id) {
        activity.minimum_role_id = data.minimum_role_id;
      }

      activity.is_published = data.is_published;
      await activity.save();

      const activities = await Activity.query()
        .where({ id: activity.id, is_deleted: 0 })
        .with("activityCategory")
        .fetch()

      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Aktivitas berhasil diperbarui!",
          data: activities,
        });
    } catch (error) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: error.message
        });
    }
  }

  async destroy({ params, response }) {

    const { id } = params

    const rules = {
      id: 'number'
    }

    const validation = await validate({ id: id }, rules);

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: validation.messages()
        });
    }

    const activity = await Activity.findBy({ id: id, is_deleted: 0 });

    if (!activity) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Tidak ada data yang ditemukan"
        });
    }

    try {
      activity.is_deleted = 1
      activity.save()

      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Aktivitas berhasil dihapus!",
          data: activity,
        });
    } catch (error) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: error.messages
        });
    }
  }
}

module.exports = ActivityController;
