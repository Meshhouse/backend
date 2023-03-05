/* eslint-disable max-len */
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Configuration from 'App/Models/Configuration'

export default class extends BaseSeeder {
  public async run () {
    await Configuration.fetchOrCreateMany('key', [
      {
        key: 'IMAGE_WATERMARK_OPACITY',
        group: 'image',
        title: 'Прозрачность водяного знака на изображении',
        description: 'Управляет прозрачностью водяного знака для темных и светлых изображений (усредненный цвет на сэмпле 64x64 пикселя). Для отключения водяного знака установите оба значения на 0. Значение по-умолчанию: 0.1, 0.15',
        type: 'object',
        value: {
          darker: 0.1,
          lighter: 0.15,
        },
      },
      {
        key: 'IMAGE_WATERMARK_ENABLED',
        group: 'image',
        title: 'Водяной знак на изображении',
        description: 'Включает водяной знак на изображении моделей. Доступные расположения: thumbnail - миниатюра в слайдере, preview - квадратный сниппет в категории, slide - картинка в слайдере, original - оригинальная картинка в большом слайдере (если доступна)',
        type: 'object',
        value: {
          thumbnail: false,
          preview: true,
          slide: true,
          original: true,
        },
      },
      {
        key: 'MAINTENANCE_MODE',
        group: 'service',
        title: 'Режим технического обслуживания',
        description: 'Включает режим технического обслуживания на сайте и по API (HTTP 503), отключая его для администраторов',
        type: 'boolean',
        value: false,
      },
      {
        key: 'BOOSTY_AUTH_TOKEN',
        group: 'boosty',
        title: 'Токен авторизации для Boosty',
        description: 'Задает токен авторизации для доступа по приватному API Boosty',
        type: 'string',
        value: '',
      },
      {
        key: 'BOOSTY_REFRESH_TOKEN',
        group: 'boosty',
        title: 'Токен обновления для Boosty',
        description: 'Задает токен обновления для доступа по приватному API Boosty',
        type: 'string',
        value: '',
      },
    ])
  }
}
