"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { validate, sanitizor } = use("Validator");
const Category = use("App/Models/ActivityCategory");
const Activity = use("App/Models/Activity");
const Helpers = use('Helpers')
// const { unlink } = use('fs')
const { unlink } = use('fs/promises')

/**
 * Resourceful controller for interacting with activities
 */
class ActivityController {
  /**
   * Show a list of all activities.
   * GET activities
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response }) {

    const data = request.all()

    try {

      const whereClause = {}

      if (data.category_id) {
        whereClause.category_id = data.category_id
      }

      if (data.minimum_members_id) {
        whereClause.minimum_role_id = data.minimum_members_id
      }

      if (data.date) {
        whereClause.begin_date = data.date
      }

      const search = (data.search) ? data.search : ""
      const page = (data.page) ? data.page : 1;

      const activities = await Activity.query()
        .where(whereClause)
        .where('name', 'LIKE', '%' + search + '%')
        .where('is_deleted', 0)
        .with("activityCategory")
        .paginate(page, 10)

      return response.json({
        message: "success",
        status: true,
        data: activities,
      });
    } catch (error) {
      return response.json({
        message: "error",
        status: false,
        error: error,
      });
    }
  }

  /**
   * Create/save a new activity.
   * POST activities
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {

    const data = request.all();

    if (data.name) {
      data.slug = sanitizor.slug(data.name);
    }

    let categories_id = "";

    if (data.category_id) {
      const categories = await Category.all();

      for (let index = 0; index < categories.toJSON().length; index++) {
        if (index === categories.toJSON().length - 1) {
          categories_id += categories.toJSON()[index].id;
        } else {
          categories_id += categories.toJSON()[index].id + ",";
        }
      }
    }

    const rules = {
      name: "required",
      slug: "required_if:name|unique:activities,slug",
      begin_date: "required|date",
      end_date: `required_if:begin_date|date|after:${data.begin_date}`,
      register_begin_date: "required|date",
      register_end_date: `required_if:register_begin_date|date|after:${data.register_begin_date}`,
      category_id: `required|number|in:${categories_id}`,
      minimum_role_id: "required_if:minimum_role_id|number",
      status: "required_if:status|in:OPENED,CLOSED",
      is_published: "required_if:is_published|in:0,1",
    };

    const validation = await validate(data, rules);

    if (validation.fails()) {
      return response.json({
        message: "error",
        status: false,
        error: validation.messages(),
      });
    } else {

      let bannerImageName = null

      if (request.file('banner_image')) {
        const bannerImage = request.file('banner_image', {
          types: ['image'],
          size: '2mb'
        })

        await bannerImage.move(Helpers.tmpPath('uploads'), {
          name: `${new Date().getTime()}.${bannerImage.subtype}`,
          overwrite: true
        })

        if (!bannerImage.moved()) {
          return response.json({
            message: "error",
            status: false,
            error: bannerImage.error(),
          });
        }

        bannerImageName = bannerImage.fileName
      }

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
      activity.banner_image = bannerImageName;
      activity.form = data.form;
      activity.is_published = data.is_published;

      await activity.save();

      let activities = await Activity.find(activity.id);
      activities.activityCategory = await activities
        .activityCategory()
        .fetch();

      return response.json({
        message: "success",
        status: true,
        data: activities,
      });

    }
  }

  /**
   * Display a single activity.
   * GET activities/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {

    try {

      const { id } = params;
      const activities = await Activity.query()
        .where({ id: id, is_deleted: 0 })
        .with("activityCategory")
        .fetch()

      if (activities) {

        return response.json({
          message: "success",
          status: true,
          data: activities,
        });
      } else {
        return response.json({
          message: "error",
          status: false,
          error: "Tidak ada data yang ditemukan",
        });
      }
    } catch (error) {
      return response.json({
        message: "error",
        status: false,
        error: error,
      });
    }
  }

  /**
   * Update activity details.
   * PUT or PATCH activities/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {

    const { id } = params;
    const activity = await Activity.findBy({ id: id, is_deleted: 0 });

    if (activity) {

      const data = request.all();

      if (data.name) {
        data.slug = sanitizor.slug(data.name);
      }

      let categories_id = "";

      if (data.category_id) {
        const categories = await Category.all();

        for (let index = 0; index < categories.toJSON().length; index++) {
          if (index === categories.toJSON().length - 1) {
            categories_id += categories.toJSON()[index].id;
          } else {
            categories_id += categories.toJSON()[index].id + ",";
          }
        }
      }

      const begin_date = (data.begin_date) ? data.begin_date : activity.begin_date
      const register_begin_date = (data.register_begin_date) ? data.register_begin_date : activity.register_begin_date

      const rules = {
        name: "required_if:name",
        slug: `required_if:name|unique:activities,slug,id,${activity.id}`,
        begin_date: "required_if:begin_date|date",
        end_date: `required_if:end_date|date|after:${begin_date}`,
        register_begin_date: "required_if:register_begin_date|date",
        register_end_date: `required_if:register_end_date|date|after:${register_begin_date}`,
        category_id: `required_if:category_id|number|in:${categories_id}`,
        minimum_role_id: "required_if:minimum_role_id|number",
        status: "required_if:status|in:OPENED,CLOSED",
        is_published: "required_if:is_published|in:0,1",
      };

      const validation = await validate(data, rules);

      if (validation.fails()) {
        return response.json({
          message: "error",
          status: false,
          error: validation.messages(),
        });
      } else {

        let bannerImageName = null

        if (request.file('banner_image')) {
          const bannerImage = request.file('banner_image', {
            types: ['image'],
            size: '2mb'
          })

          await bannerImage.move(Helpers.tmpPath('uploads'), {
            name: `${new Date().getTime()}.${bannerImage.subtype}`,
            overwrite: true
          })

          if (!bannerImage.moved()) {
            return response.json({
              message: "error",
              status: false,
              error: bannerImage.error(),
            });
          }

          if (activity.banner_image) {
            try {
              await unlink(`./tmp/uploads/${activity.banner_image}`)
            } catch (error) {
              return response.json({
                message: "error",
                status: false,
                error: error.message,
              });
            }
          }

          bannerImageName = bannerImage.fileName
        }

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
        activity.minimum_role_id = data.minimum_role_id;
        if (bannerImageName) {
          activity.banner_image = bannerImageName;
        }
        activity.form = data.form;
        activity.is_published = data.is_published;

        await activity.save();

        const activities = await Activity.query()
          .where({ id: activity.id, is_deleted: 0 })
          .with("activityCategory")
          .fetch()

        return response.json({
          message: "success",
          status: true,
          data: activities,
        });
      }
    } else {
      return response.json({
        message: "error",
        status: false,
        error: "Tidak ada data yang ditemukan",
      });
    }
  }

  /**
   * Delete a activity with id.
   * DELETE activities/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {

    const { id } = params
    const activity = await Activity.findBy({ id: id, is_deleted: 0 });

    if (activity) {
      try {

        activity.is_deleted = 1
        activity.save()

        const activities = await Activity.query()
          .where({ id: activity.id, is_deleted: 0 })
          .with("activityCategory")
          .fetch()

        return response.json({
          message: "success",
          status: true,
          data: activities,
        });
      } catch (error) {
        return response.json({
          message: "error",
          status: false,
          error: error.messages,
        });
      }
    } else {
      return response.json({
        message: "error",
        status: false,
        error: "Tidak ada data yang ditemukan",
      });
    }
  }
}

module.exports = ActivityController;
