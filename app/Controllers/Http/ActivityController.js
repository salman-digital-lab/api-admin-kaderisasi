"use strict";

const { validate, sanitizor } = use("Validator");
const Category = use("App/Models/ActivityCategory");
const ActivityFormTemplate = use("App/Models/ActivityFormTemplate");
const Activity = use("App/Models/Activity");
const MemberRole = use('App/Models/MemberRole');
const Helpers = use('Helpers')
const { unlink } = use('fs').promises

class ActivityController {

  async index({ request, response }) {

    const data = request.all()

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

      const search = (data.search) ? data.search : ""
      const page = (data.page) ? data.page : 1
      const perPage = (data.perPage) ? data.perPage : 10

      let activities = await Activity.query()
        .where(whereClause)
        .where('name', 'LIKE', '%' + search + '%')
        .where('is_deleted', 0)
        .with("activityCategory")
        .with("memberRole")
        .paginate(page, perPage)

      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Data Aktivitas berhasil dimuat!",
          data: activities,
        });
    } catch (error) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: error
        });
    }
  }

  async store({ request, response }) {

    const data = request.all();
    if (data.name) {
      data.slug = sanitizor.slug(data.name);
    }

    let categories_id = "";
    let form_id = "";
    let minimum_role_id = "";

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

    if (data.form_id) {
      const forms = await ActivityFormTemplate.all();

      for (let index = 0; index < forms.toJSON().length; index++) {
        if (index === forms.toJSON().length - 1) {
          form_id += forms.toJSON()[index].id;
        } else {
          form_id += forms.toJSON()[index].id + ",";
        }
      }
    }

    if (data.minimum_role_id) {

      const member_roles = await MemberRole.all();

      for (let index = 0; index < member_roles.toJSON().length; index++) {
        if (index === member_roles.toJSON().length - 1) {
          minimum_role_id += member_roles.toJSON()[index].id;
        } else {
          minimum_role_id += member_roles.toJSON()[index].id + ",";
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
      form_id: `required_if:form_id|number|in:${form_id}`,
      minimum_role_id: `required|number|in:${minimum_role_id}`,
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
    } else {

      let is_form_templates_used = false;

      // Logika untuk validasi bahwa form template sudah digunakan
      // Sementara ini tidak digunakan

      // if (data.form_id) {

      //   const form_templates_used_check = await ActivityFormTemplate.findBy({
      //     'id': data.form_id,
      //     'is_used': 1
      //   });

      //   if (form_templates_used_check) {
      //     is_form_templates_used = true;
      //   }
      // }

      if (is_form_templates_used) {
        return response
          .status(400)
          .json({
            status: "FAILED",
            message: "Form Template sudah digunakan"
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
            return response
              .status(400)
              .json({
                status: "FAILED",
                message: bannerImage.error()
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

        if (data.form_id) {
          const form_template = await ActivityFormTemplate.find(data.form_id);
          activity.form_data = form_template.data;
        }

        activity.is_published = data.is_published;

        await activity.save();

        if (data.form_id) {
          const form_templates = await ActivityFormTemplate.find(data.form_id);
          form_templates.is_used = 1;
          await form_templates.save();
        }

        let activities = await Activity.find(activity.id);
        activities.activityCategory = await activities
          .activityCategory()
          .fetch();

        return response
          .status(201)
          .json({
            status: "SUCCESS",
            message: "Data Aktivitas berhasil dibuat!",
            data: activities,
          });
      }
    }
  }

  async show({ params, response }) {

    const { id } = params;
    const activities = await Activity.query()
      .where({ id: id, is_deleted: 0 })
      .with("activityCategory")
      .with("memberRole")
      .fetch()

    try {
      if (activities.rows.length > 0) {
        return response
          .status(200)
          .json({
            status: "SUCCESS",
            message: "Data Aktivitas berhasil dimuat!",
            data: activities,
          });
      } else {
        return response
          .status(400)
          .json({
            status: "FAILED",
            message: "Tidak ada data yang ditemukan"
          });
      }
    } catch (error) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: error
        });
    }
  }

  async update({ params, request, response }) {

    const { id } = params;
    const activity = await Activity.findBy({ id: id, is_deleted: 0 });

    if (activity) {

      const data = request.all();

      if (data.name) {
        data.slug = sanitizor.slug(data.name);
      }

      let categories_id = "";
      let form_id = "";
      let minimum_role_id = "";

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

      if (data.form_id) {
        const forms = await ActivityFormTemplate.all();

        for (let index = 0; index < forms.toJSON().length; index++) {
          if (index === forms.toJSON().length - 1) {
            form_id += forms.toJSON()[index].id;
          } else {
            form_id += forms.toJSON()[index].id + ",";
          }
        }
      }

      if (data.minimum_role_id) {

        const member_roles = await MemberRole.all();

        for (let index = 0; index < member_roles.toJSON().length; index++) {
          if (index === member_roles.toJSON().length - 1) {
            minimum_role_id += member_roles.toJSON()[index].id;
          } else {
            minimum_role_id += member_roles.toJSON()[index].id + ",";
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
        form_id: `required_if:form_id|number|in:${form_id}`,
        minimum_role_id: `required_if:category_id|number|in:${minimum_role_id}`,
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
      } else {

        let is_form_templates_used = false;

        // Logika untuk validasi bahwa form template sudah digunakan
        // Sementara ini tidak digunakan

        // const old_form_id = activity.form_id;
        // let new_form_id = null;

        // if (data.form_id) {

        //   new_form_id = data.form_id;

        //   if (old_form_id != new_form_id) {
        //     const form_templates_used_check = await ActivityFormTemplate.findBy({
        //       'id': new_form_id,
        //       'is_used': 1
        //     });

        //     if (form_templates_used_check) {
        //       is_form_templates_used = true;
        //     }
        //   }
        // }

        if (is_form_templates_used) {
          return response
            .status(400)
            .json({
              status: "FAILED",
              message: "Form Template sudah digunakan"
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
              return response
                .status(400)
                .json({
                  status: "FAILED",
                  message: bannerImage.error()
                });
            }

            if (activity.banner_image) {
              try {
                await unlink(`./tmp/uploads/${activity.banner_image}`)
              } catch (error) {
                return response
                  .status(400)
                  .json({
                    status: "FAILED",
                    message: error.message
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

          if (data.minimum_role_id) {
            activity.minimum_role_id = data.minimum_role_id;
          }

          if (bannerImageName) {
            activity.banner_image = bannerImageName;
          }

          if (data.form_id) {
            const form_template = await ActivityFormTemplate.find(data.form_id);
            activity.form_data = form_template.data;
          }

          activity.is_published = data.is_published;

          await activity.save();

          // Fitur Pergantian status is_used
          // Sementara ini tidak digunakan

          // if (data.form_id) {
          //   if (old_form_id != new_form_id) {

          //     if (old_form_id != null) {
          //       const old_form_template = await ActivityFormTemplate.find(old_form_id);
          //       old_form_template.is_used = 0;
          //       await old_form_template.save();
          //     }

          //     const new_form_template = await ActivityFormTemplate.find(new_form_id);
          //     new_form_template.is_used = 1;
          //     await new_form_template.save();
          //   }
          // }

          if (data.form_id) {
            const form_templates = await ActivityFormTemplate.find(data.form_id);
            form_templates.is_used = 1;
            await form_templates.save();
          }

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
        }
      }
    } else {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Tidak ada data yang ditemukan"
        });
    }
  }

  async destroy({ params, response }) {

    const { id } = params
    const activity = await Activity.findBy({ id: id, is_deleted: 0 });

    if (activity) {
      try {

        activity.is_deleted = 1
        activity.save()

        if (activity.form_id != null) {
          const form_template = await ActivityFormTemplate.find(activity.form_id);
          form_template.is_used = 0;
          await form_template.save();
        }

        return response
          .status(200)
          .json({
            status: "SUCCESS",
            message: "Data Kategori Aktivitas berhasil dihapus!",
            data: activity,
          });
      } catch (error) {
        return response
          .status(400)
          .json({
            status: "FAILED",
            message: error.messages
          });
      }
    } else {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Tidak ada data yang ditemukan"
        });
    }
  }
}

module.exports = ActivityController;
