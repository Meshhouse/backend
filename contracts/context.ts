declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    xLanguage: string | null
    xMatureContent: boolean | null
    xAdminPanel: boolean
  }
}
