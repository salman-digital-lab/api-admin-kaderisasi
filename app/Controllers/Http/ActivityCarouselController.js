'use strict';

const Helpers = use('Helpers')
const { validate } = use("Validator");
const ActivityCarousel = use("App/Models/ActivityCarousel")
const Activity = use("App/Models/Activity");
const { unlink } = use('fs').promises;

class ActivityCarouselController {

  async store({ request, response }) {

    const data = request.all();
    data.banner_image = request.file('banner_image');

    const rules = {
      activity_id: "required|number",
      banner_image: "required|file|file_ext:png,PNG,jpg,JPG,jpeg,JPEG|file_size:2mb|file_types:image",
      is_banner: "required_if:is_banner|boolean"
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

    const activity = await Activity.findBy({ id: data.activity_id, is_deleted: 0 });

    if (!activity) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Tidak ada data aktivitas yang ditemukan"
        });
    }

    const bannerImage = request.file('banner_image', {
      types: ['image'],
      size: '2mb'
    })

    await bannerImage.move(Helpers.publicPath('activity_pic'), {
      name: `${new Date().getTime()}.${bannerImage.subtype}`,
      overwrite: true
    })

    if (!bannerImage.moved()) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: bannerImage.error()
        });
    }

    const bannerImageName = bannerImage.fileName

    try {

      let is_banner_exist_check = false;

      if (data.is_banner) {
        if (data.is_banner == 1) {
          await ActivityCarousel
            .query()
            .where('activity_id', data.activity_id)
            .update({ is_banner: 0 });
        } else {
          is_banner_exist_check = true;
        }
      } else {
        is_banner_exist_check = true;
      }

      if (is_banner_exist_check) {
        const is_banner_exist = await ActivityCarousel.query()
          .where('activity_id', data.activity_id)
          .where('is_banner', 1)
          .fetch()

        if (is_banner_exist.rows.length === 0) {
          data.is_banner = 1;
        }
      }

      const activityCarousel = new ActivityCarousel();

      activityCarousel.activity_id = data.activity_id;
      activityCarousel.filename = bannerImageName;
      activityCarousel.is_banner = data.is_banner;
      await activityCarousel.save();

      const activity_carousel = await ActivityCarousel.findOrFail(activityCarousel.id);

      return response
        .status(201)
        .json({
          status: "SUCCESS",
          message: "Banner Image berhasil diunggah!",
          data: activity_carousel,
        });
    } catch (error) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: error
        });
    }
  }

  async show({ params, response }) {

    const { activity_id } = params;

    const rules = {
      activity_id: 'required|number'
    }

    const validation = await validate({ activity_id: activity_id }, rules);

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: validation.messages()
        });
    }

    const activity = await Activity.findBy({ id: activity_id, is_deleted: 0 });

    if (!activity) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: "Tidak ada data aktivitas yang ditemukan"
        });
    }

    try {
      const activity_carousels = await ActivityCarousel.query()
        .where('activity_id', activity_id)
        .fetch()

      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Banner Images berhasil dimuat!",
          data: activity_carousels,
        });
    } catch (error) {
      return response
        .status(500)
        .json({
          status: "FAILED",
          message: error
        });
    }
  }

  async destroy({ params, response }) {

    const { id } = params;

    const rules = {
      id: "required|number"
    };

    const validation = await validate({ id, id }, rules);

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: validation.messages()
        });
    }

    try {

      const activity_carousel = await ActivityCarousel.findBy('id', id);

      if (!activity_carousel) {
        return response
          .status(400)
          .json({
            status: "FAILED",
            message: "Tidak ada Banner Image yang ditemukan"
          });
      }

      if (activity_carousel.is_banner === 1) {
        const is_another_banner_exist = await ActivityCarousel.query()
          .where('activity_id', activity_carousel.activity_id)
          .where('id', '!=', activity_carousel.id)
          .first()

        if (is_another_banner_exist) {
          is_another_banner_exist.is_banner = 1;
          await is_another_banner_exist.save();
        }
      }

      // Catatan :
      // Jika file tidak ada, maka akan terjadi error

      const file = `./public/activity_pic/${activity_carousel.filename}`;
      await unlink(file);
      await activity_carousel.delete();

      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Banner Images berhasil dihapus!",
          data: activity_carousel,
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

  async updateIsBanner({ params, response }) {

    const { id } = params;

    const rules = {
      id: "required|number"
    };

    const validation = await validate({ id, id }, rules);

    if (validation.fails()) {
      return response
        .status(400)
        .json({
          status: "FAILED",
          message: validation.messages()
        });
    }

    try {

      const activity_carousel = await ActivityCarousel.findBy('id', id);

      if (!activity_carousel) {
        return response
          .status(400)
          .json({
            status: "FAILED",
            message: "Tidak ada Banner Image yang ditemukan"
          });
      }

      await ActivityCarousel
        .query()
        .where('activity_id', activity_carousel.activity_id)
        .where('is_banner', 1)
        .update({ is_banner: 0 });

      activity_carousel.is_banner = 1;
      await activity_carousel.save();

      return response
        .status(200)
        .json({
          status: "SUCCESS",
          message: "Banner Image berhasil ditetapkan!",
          data: activity_carousel,
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
}

module.exports = ActivityCarouselController
