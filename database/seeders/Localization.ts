/* eslint-disable max-len */
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Localization from 'App/Models/Localization'

export default class extends BaseSeeder {
  public async run () {
    await Localization.updateOrCreateMany('key', [
      {
        'key': 'common.language',
        'en': 'Language',
        'ru': 'Язык',
      },
      {
        'key': 'common.true',
        'en': 'Yes',
        'ru': 'Да',
      },
      {
        'key': 'common.false',
        'en': 'No',
        'ru': 'Нет',
      },
      {
        'key': 'common.save',
        'en': 'Save',
        'ru': 'Сохранить',
      },
      {
        'key': 'common.submit',
        'en': 'Submit',
        'ru': 'Отправить',
      },
      {
        'key': 'common.filters',
        'en': 'Filters',
        'ru': 'Фильтры',
      },
      {
        'key': 'navigation.home',
        'en': 'Home page',
        'ru': 'Главная',
      },
      {
        'key': 'navigation.modelsCatalog',
        'en': 'Models catalog',
        'ru': 'Каталог моделей',
      },
      {
        'key': 'navigation.modelsAll',
        'en': 'All models',
        'ru': 'Все модели',
      },
      {
        'key': 'navigation.howto',
        'en': 'How to use models',
        'ru': 'Как использовать модели',
      },
      {
        'key': 'navigation[\'embed-models\']',
        'en': 'Embed models',
        'ru': 'Встраивание моделей',
      },
      {
        'key': 'navigation.tos',
        'en': 'Terms of service',
        'ru': 'Условия обслуживания',
      },
      {
        'key': 'navigation.application',
        'en': 'Application',
        'ru': 'Приложение',
      },
      {
        'key': 'navigation.dmca',
        'en': 'DMCA policy',
        'ru': 'Политика DMCA',
      },
      {
        'key': 'navigation.privacyPolicy',
        'en': 'Privacy policy',
        'ru': 'Политика конфиденциальности',
      },
      {
        'key': 'navigation.licensing',
        'en': 'Models licensing',
        'ru': 'Лицензирование моделей',
      },
      {
        'key': 'navigation.news',
        'en': 'News',
        'ru': 'Новости',
      },
      {
        'key': 'roles.basic',
        'en': 'Basic',
        'ru': 'Базовый',
      },
      {
        'key': 'roles.supporter',
        'en': 'Supporter',
        'ru': 'Подписчик',
      },
      {
        'key': 'roles.admin',
        'en': 'Admin',
        'ru': 'Администратор',
      },
      {
        'key': 'sorting[\'created_at:asc\']',
        'en': 'Date added (asc)',
        'ru': 'Дата создания (возр.)',
      },
      {
        'key': 'sorting[\'created_at:desc\']',
        'en': 'Date added (desc)',
        'ru': 'Дата создания (убыв.)',
      },
      {
        'key': 'sorting[\'title:asc\']',
        'en': 'Title (asc)',
        'ru': 'Название (возр.)',
      },
      {
        'key': 'sorting[\'title:desc\']',
        'en': 'Title (desc)',
        'ru': 'Название (убыв.)',
      },
      {
        'key': 'footer.blocks.catalog',
        'en': 'Catalog',
        'ru': 'Каталог',
      },
      {
        'key': 'footer.blocks.legal',
        'en': 'Legal',
        'ru': 'Справочная информация',
      },
      {
        'key': 'footer.blocks[\'open-source\']',
        'en': 'Open-Source',
        'ru': 'ПО с открытым исходным кодом',
      },
      {
        'key': 'footer.patrons.title',
        'en': 'Thanks to our Patrons',
        'ru': 'Спасибо нашим Патронам',
      },
      {
        'key': 'footer[\'top-supporters\'].title',
        'en': 'Also supported by:',
        'ru': 'Также спонсируется:',
      },
      {
        'key': 'navigation.favorites',
        'en': 'Favorites',
        'ru': 'Список желаемого',
      },
      {
        'key': 'navigation.user',
        'en': 'User settings',
        'ru': 'Настройки пользователя',
      },
      {
        'key': 'common[\'dark-theme\']',
        'en': 'Dark theme',
        'ru': 'Темная тема',
      },
      {
        'key': 'common[\'models-count\']',
        'en': '0 models | 1 model | {n} models',
        'ru': '0 моделей | {n} модель | {n} модели | {n} моделей',
      },
      {
        'key': 'common.readMore',
        'en': 'Read more',
        'ru': 'Читать далее',
      },
      {
        'key': 'blocks.lastUploadedModels.title',
        'en': 'Last uploaded models',
        'ru': 'Последние загруженные модели',
      },
      {
        'key': 'blocks.searchBox.placeholder',
        'en': 'Search...',
        'ru': 'Поиск...',
      },
      {
        'key': 'blocks.searchBox.link',
        'en': 'Show all results for "{query}"',
        'ru': 'Показать все результаты для "{query}"',
      },
      {
        'key': 'license.copyright',
        'en': 'Need permission from the copyright holders',
        'ru': 'Необходимо разрешение от правообладателей',
      },
      {
        'key': 'license.matureContent',
        'en': 'Mature content',
        'ru': 'Контент для взрослых',
      },
      {
        'key': 'license.donate',
        'en': 'Avaliable only for subscribers',
        'ru': 'Доступно только подписчикам',
      },
      {
        'key': 'meta.description',
        'en': 'Free 3d models for commercial use. 3ds Max, Maya, Blender, Cinema4D, Unity and Unreal Engine-ready',
        'ru': 'Бесплатные 3d модели для коммерческого использования. 3ds Max, Maya, Blender, Cinema4D, Unity and Unreal Engine-ready',
      },
      {
        'key': 'modals.apiKeyCreate.title',
        'en': 'Create new key',
        'ru': 'Создать новый ключ',
      },
      {
        'key': 'modals.apiKeySuccess.title',
        'en': 'API key',
        'ru': 'API ключ',
      },
      {
        'key': 'modals.apiKeySuccess.text',
        'en': 'Key created successful, your token:',
        'ru': 'Ключ успешно создан, ваш токен:',
      },
      {
        'key': 'modals.apiKeySuccess.note',
        'en': 'This token would be shown once',
        'ru': 'Данный токен будет виден только один раз',
      },
      {
        'key': 'specifications.id',
        'en': 'Product id',
        'ru': 'Артикул модели',
      },
      {
        'key': 'specifications.created_at',
        'en': 'Upload date',
        'ru': 'Дата загрузки',
      },
      {
        'key': 'specifications.polygons',
        'en': 'Polygons',
        'ru': 'Полигонов',
      },
      {
        'key': 'specifications.vertices',
        'en': 'Vertices',
        'ru': 'Вершин',
      },
      {
        'key': 'specifications.geometry',
        'en': 'Topology',
        'ru': 'Топология',
      },
      {
        'key': 'specifications.hair_system',
        'en': 'Hair system',
        'ru': 'Система волос',
      },
      {
        'key': 'specifications.blendshapes',
        'en': 'Morpher / blendshapes',
        'ru': 'Морфер / блендшейпы',
      },
      {
        'key': 'specifications.rig',
        'en': 'Skeleton rigging',
        'ru': 'Привязка к скелету',
      },
      {
        'key': 'specifications.textures',
        'en': 'Textures',
        'ru': 'Тип текстур',
      },
      {
        'key': 'specifications.uv',
        'en': 'Unwrap type',
        'ru': 'Тип развертки',
      },
      {
        'key': '[\'specification-locales\'][\'hair-system\'].standard',
        'en': 'Standard',
        'ru': 'Стандартная',
      },
      {
        'key': '[\'specification-locales\'][\'hair-system\'].ornatrix',
        'en': 'Ornatrix',
        'ru': 'Ornatrix',
      },
      {
        'key': '[\'specification-locales\'][\'hair-system\'].xgen',
        'en': 'XGen',
        'ru': 'XGen',
      },
      {
        'key': '[\'specification-locales\'][\'hair-system\'].hairfarm',
        'en': 'Hairfarm',
        'ru': 'Hairfarm',
      },
      {
        'key': '[\'specification-locales\'][\'hair-system\'].yeti',
        'en': 'Yeti',
        'ru': 'Yeti',
      },
      {
        'key': '[\'specification-locales\'].rig.bones',
        'en': 'Bones',
        'ru': 'На костях',
      },
      {
        'key': '[\'specification-locales\'].rig.biped',
        'en': 'Biped',
        'ru': 'Biped',
      },
      {
        'key': '[\'specification-locales\'].rig.autodesk_cat',
        'en': 'Autodesk CAT',
        'ru': 'Autodesk CAT',
      },
      {
        'key': '[\'specification-locales\'].textures.procedural',
        'en': 'Procedural',
        'ru': 'Процедурные',
      },
      {
        'key': '[\'specification-locales\'].textures.pbr',
        'en': 'PBR',
        'ru': 'PBR',
      },
      {
        'key': '[\'specification-locales\'].textures.npr',
        'en': 'NPR',
        'ru': 'NPR',
      },
      {
        'key': '[\'specification-locales\'].uv.generated',
        'en': 'Generated',
        'ru': 'Сгенерированная',
      },
      {
        'key': '[\'specification-locales\'].uv.unwrap_uvw',
        'en': 'Unwrap UVW',
        'ru': 'Unwrap UVW',
      },
      {
        'key': '[\'specification-locales\'].uv.udim',
        'en': 'UDIM-unwrap',
        'ru': 'UDIM-развертка',
      },
      {
        'key': '[\'specification-locales\'].uv.uvtile',
        'en': 'UVTile-unwrap',
        'ru': 'UVTile-развертка',
      },
      {
        'key': '[\'specification-locales\'].geometry.tris',
        'en': 'Triangles',
        'ru': 'Треугольники',
      },
      {
        'key': '[\'specification-locales\'].geometry.quads',
        'en': 'Quads',
        'ru': 'Квадраты',
      },
      {
        'key': '[\'specification-locales\'].geometry.ngons',
        'en': 'N-gons',
        'ru': 'N-угольники',
      },
      {
        'key': '[\'specification-locales\'].geometry.combined',
        'en': 'Combined',
        'ru': 'Смешанная',
      },
      {
        'key': 'models.information.tags',
        'en': 'Tags',
        'ru': 'Теги',
      },
      {
        'key': 'models.alerts.legal_notice.title',
        'en': 'Legal notice',
        'ru': 'Информация о правообладателях',
      },
      {
        'key': 'models.alerts.legal_notice.text',
        'en': 'The intellectual property depicted in this model, including the brand {brand}, is not affiliated with or endorsed by the original rights holders.',
        'ru': 'Интеллектуальная собственность, изображенная в этой модели, включая торговую марку {brand}, не связана с первоначальными правообладателями и не одобрена ими.',
      },
      {
        'key': 'models.alerts.mature_content.text',
        'en': 'Images of the model, description, as well as the model itself may contain content that is not suitable for persons under the age of 18.',
        'ru': 'Изображения модели, описание, а также сама модель может содержать контент, не подходящий лицам, не достигшим 18 лет.',
      },
      {
        'key': 'models.buttons.install',
        'en': 'Install via Meshhouse',
        'ru': 'Установить через Meshhouse',
      },
      {
        'key': 'models.buttons.share',
        'en': 'Share',
        'ru': 'Поделиться',
      },
      {
        'key': 'models.buttons.share_content.link',
        'en': 'Embed link',
        'ru': 'Встроить ссылку',
      },
      {
        'key': 'models.buttons.share_content.iframe',
        'en': 'Embed card',
        'ru': 'Встроить карточку',
      },
      {
        'key': 'models.buttons.textures',
        'en': 'Download textures',
        'ru': 'Скачать текстуры',
      },
      {
        'key': 'models.buttons.textures_title',
        'en': 'Textures:',
        'ru': 'Текстуры:',
      },
      {
        'key': 'models.buttons.model_title',
        'en': 'Models:',
        'ru': 'Модели:',
      },
      {
        'key': 'models.buttons.model',
        'en': 'Download model',
        'ru': 'Скачать модель',
      },
      {
        'key': 'application.jumbotron.title',
        'en': 'Handle your model library with ease',
        'ru': 'Управляйте вашей библиотекой моделей с легкостью',
      },
      {
        'key': 'application.jumbotron.text',
        'en': 'with our cross-platform open-sourced application.',
        'ru': 'с нашей программой с открытым исходным кодом.',
      },
      {
        'key': 'application.download.windows',
        'en': 'Download for Windows 7-11 x64 ({version})',
        'ru': 'Скачать для Windows 7-11 x64 ({version})',
      },
      {
        'key': 'application.download.mac',
        'en': 'Download for Intel MacOS 10.10 - 10.15 ({version})',
        'ru': 'Скачать для Intel MacOS 10.10 - 10.15 ({version})',
      },
      {
        'key': 'application.download.linux',
        'en': 'Download for Linux AppImage ({version})',
        'ru': 'Скачать для Linux AppImage ({version})',
      },
      {
        'key': 'application.integrations',
        'en': 'Available integrations',
        'ru': 'Доступные интеграции',
      },
      {
        'key': 'application.integrations__table.auth',
        'en': 'Authentication',
        'ru': 'Аутентификация',
      },
      {
        'key': 'application.integrations__table.filters',
        'en': 'Custom filters',
        'ru': 'Расширенные фильтры',
      },
      {
        'key': 'application.integrations__table.download',
        'en': 'Download models',
        'ru': 'Скачивание моделей',
      },
      {
        'key': 'application.integrations__table.install',
        'en': 'Custom installation',
        'ru': 'Расширенная установка моделей',
      },
      {
        'key': 'application.integrations__table.purchase',
        'en': 'Purchase models',
        'ru': 'Покупка моделей',
      },
      {
        'key': 'application.blocks[1].title',
        'en': 'All models in one place',
        'ru': 'Все модели в одном месте',
      },
      {
        'key': 'application.blocks[1].text',
        'en': 'Our completely free and open source application allows you to conveniently organize, sort and catalog your model library. The application currently supports common DCC file formats as well as 3DCoat and Substance Painter',
        'ru': 'Наше абсолютно бесплатное приложение с открытым исходным кодом позволяет удобно организовывать, сортировать и каталогизировать библиотеку моделей. На данный момент приложение поддерживает распространенные форматы файлов DCC, а также 3DCoat и Substance Painter',
      },
      {
        'key': 'application.blocks[1].note',
        'en': 'DCC is a digital content creation program. These include 3dsMax, Maya, Blender, Cinema4D, etc.',
        'ru': 'DCC - программа создания цифрового контента. В их число входят 3dsMax, Maya, Blender, Cinema4D и т.д',
      },
      {
        'key': 'application.blocks[2].title',
        'en': 'Unlimited catalogs and categories',
        'ru': 'Неограниченное число каталогов и категорий',
      },
      {
        'key': 'application.blocks[2].text',
        'en': 'Want to make a directory for every folder you have? No problem! Multiple directories are enough for you, but need to be more organized? Create a category in the catalog! Want a category in a category? This is also possible!',
        'ru': 'Хотите сделать каталог на каждую папку, что у вас есть? Не проблема! Вам хватает нескольких каталогов, но нужно точнее организовывать? Создайте в каталоге категорию! Хотите категорию в категории? Это тоже можно!',
      },
      {
        'key': 'application.blocks[2].note',
        'en': 'Although it is not recommended to make a separate directory per folder within the parent directory, it can be done.',
        'ru': 'Несмотря на то, что не рекомендуется делать отдельный каталог на папку внутри родительского каталога, это можно сделать.',
      },
      {
        'key': 'application.blocks[3].title',
        'en': 'Install any model',
        'ru': 'Устанавливайте любые модели',
      },
      {
        'key': 'application.blocks[3].text',
        'en': 'Thanks to integrations with third-party sites, you have the ability to install third-party models from the Internet. Before installing, you can view screenshots, read comments and general information about the model.*',
        'ru': 'Благодаря интеграциям со сторонними сайтами, у вас есть возможность установки сторонних моделей с интернета. Перед установкой вы можете посмотреть скриншоты, прочитать комментарии и общую информацию о модели.*',
      },
      {
        'key': 'application.blocks[3].note',
        'en': '* - may not be available for the selected integration',
        'ru': '* - может быть недоступно для выбранной интеграции',
      },
      {
        'key': 'blocks.ourFeatures.readytouse.title',
        'en': 'Ready to use models',
        'ru': 'Готовые к использованию модели',
      },
      {
        'key': 'blocks.ourFeatures.readytouse.text',
        'en': 'In order to use our models, you don\'t need to put in a lot of effort to clear unnecessary objects from the scene. Just download the model in the required format, download the textures (if necessary), and insert into the scene',
        'ru': 'Для того, чтобы использовать наши модели, не нужно прикладывать много усилий по очистке ненужных объектов из сцены. Просто скачайте модель в нужном формате, скачайте текстуры (если необходимо), и вставляйте в сцену',
      },
      {
        'key': 'blocks.ourFeatures.readytouse.note',
        'en': 'Some models should be adapted to your model, such as clothing',
        'ru': 'Некоторые модели могут требовать адаптации под вашу модель, например, одежда.',
      },
      {
        'key': 'blocks.ourFeatures.free.title',
        'en': 'Completely free',
        'ru': 'Полностью бесплатно',
      },
      {
        'key': 'blocks.ourFeatures.free.text',
        'en': 'All models distributed on our website are completely free. Including for commercial use (films, games, etc.), without royalties*',
        'ru': 'Все модели, распространяющиеся на нашем сайте, полностью бесплатны. В том числе, для коммерческого использования (фильмы, игры и т.д), без лицензионных отчислений*',
      },
      {
        'key': 'blocks.ourFeatures.free.note',
        'en': '*except mature content',
        'ru': '*кроме контента для взрослых',
      },
      {
        'key': 'blocks.ourFeatures.opensource.title',
        'en': 'Open source',
        'ru': 'Открытый исходный код',
      },
      {
        'key': 'blocks.ourFeatures.opensource.text',
        'en': 'All our source codes are available in our Github, also we provide public API to integrate in your workflow or application',
        'ru': 'Весь код наших разработок доступны в нашем Github, также мы предлагаем публичный API для интеграции в ваш рабочий процесс или приложение',
      },
      {
        'key': 'blocks.thematicBlock.title',
        'en': 'Thematic selections',
        'ru': 'Тематические подборки',
      },
      {
        'key': 'blocks.programsList.title',
        'en': 'Available extensions',
        'ru': 'Доступные форматы',
      },
      {
        'key': 'blocks.programsList.note',
        'en': 'Some models can be presented only in one of the presented formats - this is due to the fact that the models are laid out gradually, as well as the need to convert between formats.',
        'ru': 'Некоторые модели могут быть представлены только в одном из представленных форматов - это связано с тем, что модели выкладываются постепенно, а также необходимость конвертирования между форматами.',
      },
      {
        'key': 'blocks.programsList.max',
        'en': '3ds Max 2020 and newer',
        'ru': '3ds Max 2020 и новее',
      },
      {
        'key': 'blocks.programsList.maya',
        'en': 'Maya 2016 and newer',
        'ru': 'Maya 2016 и новее',
      },
      {
        'key': 'blocks.programsList.blender',
        'en': 'Blender 2.8 and newer',
        'ru': 'Blender 2.8 и новее',
      },
      {
        'key': 'blocks.programsList.cinema4d',
        'en': 'Cinema4D R20 and newer',
        'ru': 'Cinema4D R20 и новее',
      },
      {
        'key': 'blocks.programsList.unity',
        'en': 'Unity 2019.3 and newer',
        'ru': 'Unity 2019.3 и новее',
      },
      {
        'key': 'blocks.programsList.unreal',
        'en': 'Unreal Engine 4.20 and newer',
        'ru': 'Unreal Engine 4.20 и новее',
      },
      {
        'key': 'form.name',
        'en': 'Name',
        'ru': 'Имя',
      },
      {
        'key': 'form.email',
        'en': 'E-mail',
        'ru': 'E-mail',
      },
      {
        'key': 'form.password',
        'en': 'Password',
        'ru': 'Пароль',
      },
      {
        'key': 'form.passwordConfirm',
        'en': 'Repeat password',
        'ru': 'Повторите пароль',
      },
      {
        'key': 'form.agreed',
        'en': 'I agreed with Terms of Use',
        'ru': 'Я согласен с Условиями использования сайта',
      },
      {
        'key': 'form.registerTitle',
        'en': 'Registration',
        'ru': 'Регистрация',
      },
      {
        'key': 'form.loginTitle',
        'en': 'Enter to account',
        'ru': 'Войти в аккаунт',
      },
      {
        'key': 'form.login',
        'en': 'Login',
        'ru': 'Войти',
      },
      {
        'key': 'form.logout',
        'en': 'Logout',
        'ru': 'Выйти',
      },
      {
        'key': 'form.tokenName',
        'en': 'Token name',
        'ru': 'Название токена',
      },
      {
        'key': 'form.create',
        'en': 'Create',
        'ru': 'Создать',
      },
      {
        'key': 'form.delete',
        'en': 'Delete',
        'ru': 'Удалить',
      },
      {
        'key': 'form.apiKeys',
        'en': 'API keys',
        'ru': 'API ключи',
      },
      {
        'key': 'form.profile',
        'en': 'Profile',
        'ru': 'Профиль',
      },
      {
        'key': 'form.connectWith',
        'en': 'Connect with {n}',
        'ru': 'Подключиться через {n}',
      },
      {
        'key': 'form.thirdParty',
        'en': 'Third-party services',
        'ru': 'Сторонние сервисы',
      },
      {
        'key': 'form.actions.registered',
        'en': 'Already registered?',
        'ru': 'Уже есть аккаунт?',
      },
      {
        'key': 'form.actions.newUser',
        'en': 'Don\'t have an account? Register now',
        'ru': 'Еще нет аккаунта? Зарегистрироваться',
      },
      {
        'key': 'form.actions.forgot',
        'en': 'Forgot your password?',
        'ru': 'Забыли пароль?',
      },
      {
        'key': 'form.actions.remembered',
        'en': 'Recovered your password? Try to login',
        'ru': 'Вспомнили пароль? Попробуйте войти',
      },
    ])
  }
}
