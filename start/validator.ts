import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('language', (value, _, options) => {
  const availableLanguages = ['en', 'ru']

  if (typeof value !== 'string') {
    throw new Error('"language" rule can only be used with a string schema type')
  }

  if (!availableLanguages.includes(value)) {
    options.errorReporter.report(
      options.pointer,
      'language',
      'selected language is invalid',
      options.arrayExpressionPointer
    )
  }
})
